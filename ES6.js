/**
为什么需要块级作用域？
ES5只有全局作用域和函数作用域，没有块级作用域。这样带来很多不合理的场景。
1.内层变量可能会覆盖外层变量。
 **/
var time = new Date();
function a() {
	console.log(time);
	if (false) {
		//块级作用域
		var time = "Hello World!";
	}
}
a(); //undefined;

/**
2.用来计数的循环变量泄露成全局变量。
*/
var string = "Hello World";
for (var i = 0; i < string.length; i++) {
	console.log(string[i]);
}
console.log(i); //11。没有释放内存。

/**
ES6的块级作用域：
Let实际上为javaScript新增了块级作用域。
*/
function fun(){
	let num = 100;
	if(true){
		let num = 200;
	}
	console.log(num);
}
fun();//100
/**
因为有了块级作用域，有了立即执行函数。{}
*/

/**
const 也用来声明变量，但是声明的常量。
一旦声明，常量的变量不能改变。
const 也是块级作用域。
*/


