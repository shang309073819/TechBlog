//易错点汇总：
//闭包
var arr = [];
(function() {
	var i = 0; //局部变量
	for (; i < 3; i++) {
		arr[i] = function() {
			return i;
		}
	}
})()

(function() {
	var i = 0;
	for (; i < 3; i++) {
		arr[i] = (function(x) {
			return function() {
				return x;
			}
		})(i);
	}
})()

console.log(arr[0]());
//闭包会使函数中的变量都保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页性能问题。


var setValue;
var getValue;
(function () {
	var n = 0;
	getValue = function(){
		return n;
	}	
	setValue = function(x){
		n = x;
	}
})()

setValue(5);
console.log(getValue());
//闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当做（object)使用，把闭包当作它的公有方法（Public Method)，把内部变量当作它的私有属性（Private value），这时一定要小心，不要随便改变父函数内部变量的值。


