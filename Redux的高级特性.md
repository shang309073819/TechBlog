#### Redux高级特性

------

##### 状态树分治

    Q:redux提倡用一个对象存储整个应用的状态，而复杂应用的状态对象是很大的，这样会不会有性能问题？
    A:考虑状态树的分治，在设计action的处理函数(reducer)时，针对状态树的不同部分，将其对应的actions处理函数存储在不同的文件中，redux通过combineReducers对此提供了支持。
    Q:各个容器型组件都对整个应用状态对象进行操作，会不会引起混乱？
    A:redux在使用connect生成容器型组件时，接收一个函数(mapStateToProps)作为参数，该函数可以只返回整个状态树的部分状态。

##### 异步action

    Q:什么是Redux中间件？
    A:它可以用于在action被触发和action到达处理函数reducer之前，对action进行处理。
    Q:怎么Redue中间件？
    A:可以在创建store时，通过applyMiddleware函数提供redux的中间件：createStore(todosApp,applyMiddleware(someMiddleWare))





redux官方提供了thunkMiddleware的中间件，用于处理异步action，它使得redux可以派发一个函数而不是一个普通action对象，在该函数中我们可以进行异步网络请求：

var fetchTodos = function () {
    return function (dispatch) {
        return fetch('/todos');
    }
}
我们可以使用dispach函数像派发普通action一样，派发异步函数，异步函数的返回值还可以是Promise，其返回值会透传过dispch函数。

dispach(fetchTodos)
  .then(function(json){
      //handle response
  })
  .catch(function(error){
      //handle error
  });
通过网络加载数据，并在数据到达时更新应用状态是一种比较常见的应用场景，对于这种场景，一种最优雅的方案：

1. 派发异步函数，用于进行网络请求
2. 在网络请求完成时，派发同步action用于更新应用状态
   可以用如下代码表示：

var fetchTodos = function () {
    return function (dispatch) {
        return fetch('/todos')
            .then(function (json) {
                //派发同步aciton，用于更新应用状态，初始化todo列表
                dispatch(initTodos(json.data || []));
            }).catch(function () {
                //派发同步action，用于更新应用状态，设置加载失败标志
                dispatch(failLoadedTodos());
            });
    }
}
(3) 同构渲染

前后端同构，应用首屏由后端直出是近年来比较流行的性能优化方案，redux对此也有完善的支持。基本流程是：

1. 服务端初始化state
2. 将服务端state传递到应用的页面端
3. 页面端用服务端传递的状态初始化应用state
   在遵从这个基本流程的情况下，服务端和页面端的使用方法开发方法基本一致，如下是服务端代码：

 store.dispatch(todoActions.loadInitTodos()).then(function () {
        var contentHtml = React.renderToString(
            <Provider store={store}>
                {function () {
                    return <TodoApp />;
                }}
            </Provider>
        );
        var initialState = JSON.stringify(store.getState());
        res.render('index.ejs', {contentHtml: contentHtml, initialState: initialState});
    }).catch(function(error){
        res.json({errMsg: 'internal error'})
    });
上述服务端代码通过派发初始化异步函数更新应用状态，该异步函数返回一个Promise，Promise对象会透传过dispach函数。在Promise处理完成后，我们得到应用的最新状态。最后我们将由React输出的HTML字符串contentHtml和初始化应用状态initialState，传递到模板文件index.ejs中，模板文件如下：

<html>
  <head>
    <title>Redux TodoMVC</title>
  </head>
  <body>
    <div class="todoapp" id="root"><%-contentHtml%></div>
  </body>
  <script>
    window.__INITIAL_STATE__ =  <%-initialState%>;
  </script>
</html>
通过浏览器的window对象，我们将服务端的初始状态传递到了页面端。

var todosApp = combineReducers({filter: filter, todos: todos});
var store = createStore(  todosApp,
                          window.__INITIAL_STATE__,
                          applyMiddleware(thunkMiddleware, reduxLogger())
                        );
