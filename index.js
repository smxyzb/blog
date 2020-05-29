/* 一，用正则表达式来将字符串"I? love ?? the ?great ? ?wall in ?beijing"更改为："I love the Great Wall in Beijing"，主要是为了解决编码的问题导致的问题，规律：

1，乱码只有两种特殊字符分别是'?'和' ';

2，如果乱码的末尾是'?'则它的下一位字母肯定是大写；

二，不使用类似for，while循环控制语句和js本身自带方法（如：forEach）的情况下，实现将一个空数组[]赋值成[0,2,4,6,8,10,...,100]，范围0-100便可。

三，设计一个自由可灵活配置的时间调度器，有a,b,c,d...很多个需要被调度的方法（方法名称的命名可随意），调度有两种形式，一个是顺序调用（例如调度完a后才能调度b），一个是间隔某个时间进行循环调度。用一个统一的方法进行封装可以实现下列的例子：

1，可以为5秒后调用a,3秒后调用b，10秒后调用。c...z方法不执行（不执行的方法可以设计成不传递参数），那么在第14秒的时候开始重新从0秒循环，又变成第一秒后调用a,3秒后调用b，这样循环往复；


2，每间隔6秒调用一次a,每间隔4秒调用一次b，c...z方法不执行；

3，第一秒先执行a，3秒后执行b，但是c却是每间隔3秒执行一次，d是每间隔4秒执行一次，a和b是每4秒进行一次循环；

4，a不执行，b和c每间隔3秒执行一次，d不执行； 

前瞻：
exp1(?=exp2) 查找exp2前面的exp1
后顾：
(?<=exp2)exp1 查找exp2后面的exp1
负前瞻：
exp1(?!exp2) 查找后面不是exp2的exp1
负后顾：
(?<!=exp2)exp1 查找前面不是exp2的exp1

*/

var str = "I? love ?? the ?great ? ?wall in ?beijing"
str.replace(/\W+(?=\w+)/g, ' ').replace(/\w+/g, function (w) {
  return w.substring(0, 1).toUpperCase() + w.substring(1)
})

// let a = str.replace(/\W+(?=\w+)/g, ' ')
// console.log(a);
// let d = str.replace(/(?<=(\w+))\W+/g, ' ')
// console.log(d);

let arr = new Array(51).fill(0).map((item,index)=> index*2)
// console.log(arr);

setImmediate(() => {
  console.log('setImmediate1')
  setTimeout(() => {
    console.log('setTimeout1')
  }, 0);
})
setTimeout(() => {
  console.log('setTimeout2')
  setImmediate(() => {
    console.log('setImmediate2')
  })
}, 0);
//首先setImmediate和setTimeout执行顺序不固定
//所以setImmediate1和setTimeout2,打印顺序不定
//假设 setImmediate1先打印   有两种顺序
//1.执行顺序是 setImmediate1  setTimeout2  setTimeout1 setImmediate2
//2.执行顺序是 setImmediate1  setTimeout2  setImmediate2 setTimeout1
// 1.setImmediate1打印后把setTimeout1放进timer队列 然后执行setTimeout2 这时候把setImmediate2放进check队列中  打印setTimeout2 发现timer中还有setTimeout1 他就会把timer对列中的执行完 才会执行下一队列的代码
//然后打印setTimeout1, 切换对列到check  打印setImmediate2
//2. setImmediate1打印后把setTimeout1放进timer队列 然后执行setTimeout2 这时候把setImmediate2放进check队列中  打印setTimeout2 这个时候node执行过快setTimeout1还没有到时间，所以切换对列执行setImmediate2 然后是setTimeout1
//setTimeout第二个参数虽然是0，但是都有默认时间一般是4ms左右
