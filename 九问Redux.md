#### 九问Redux

------

##### 状态树分治

    Q:redux提倡用一个对象存储整个应用的状态，而复杂应用的状态对象是很大的，这样会不会有性能问题？
    A:考虑状态树的分治，在设计action的处理函数(reducer)时，针对状态树的不同部分，将其对应的actions处理函数存储在不同的文件中，redux通过combineReducers对此提供了支持。
    Q:各个容器型组件都对整个应用状态对象进行操作，会不会引起混乱？
    A:redux在使用connect生成容器型组件时，接收一个函数(mapStateToProps)作为参数，该函数可以只返回整个状态树的部分状态。

##### 异步action

    Q:什么是Redux中间件？
    A:它可以用于在action被触发和action到达处理函数reducer之前，对action进行处理。
    Q:怎么使用Redux中间件？
    A:可以在创建store时，通过applyMiddleware函数提供redux的中间件：createStore(todosApp,applyMiddleware(someMiddleWare))
    Q:如何处理异步action?
    A:redux提供thunkMiddleware的中间件使得redux可以派发一个函数而不是一个普通action对象，可以使用dispach函数像派发普通action一样，派发异步函数，异步函数的返回值还可以是Promise，其返回值会透传过dispch函数。


```js
var fetchTodos = function () {
  return function (dispatch) {
    return fetch('/todos');
  }
};
dispach(fetchTodos).then(function (json) {
  //派发同步aciton，用于更新应用状态，初始化todo列表
  dispatch(initTodos(json.data || []));
}).catch(function (error) {
  //handle error
});
```

##### 同构渲染

    Q:为什么会有同构？
    A:纯前端渲染面临的两个大的问题：不可避免出现白屏，等待异步加载，体验变差；SEO优化问题，没有服务端渲染，蜘蛛抓取不到数据，无SEO可言。
    Q:React是如何Server Rendering的？
    A:React中提出了虚拟DOM的概念，虚拟DOM以对象树的形式保存在内存中，与真实DOM相映射，通过ReactDOM的Render方法，渲染到页面中，并维护DOM的创建、销毁、更新等过程，以最高的效率，得到相同的DOM结构。不同于ReactDOM.render将DOM结构渲染到页面，React中还提供了另外两个方法：ReactDOMServer.renderToString 和 ReactDOMServer.renderToStaticMarkup 。二者将虚拟DOM渲染为一段字符串，代表了一段完整的HTML结构。
    Q:什么是同构?
    A:在服务端和客户端中，使用完全一致的React组件，这样能够保证两个端中渲染出的DOM结构是完全一致的，而在这种情况下，客户端在渲染过程中，会判断已有的DOM结构是否和即将渲染出的结构相同，若相同，不重新渲染DOM结构，只是进行事件绑定。
    Q:理解Redux同构?
    A:关于Redux服务端渲染，参看官方文档。其中最重要的一点就是，在服务端和客户端保持store一致。store的初始状态在Server端生成，为了保持两个端中store的一致，官方示例中通过在页面插入脚本的方式，写入store初始值到window：

```js
//通过浏览器的window对象，我们将服务端的初始状态传递到了页面端。
window.__INITIAL_STATE__ =  <%-initialState%>;
var todosApp = combineReducers({filter: filter, todos: todos});
var store = createStore(todosApp, window.__INITIAL_STATE__, applyMiddleware(thunkMiddleware, reduxLogger()));
```
