### let 、const 
1、不可重复声明 
    ```
    var a =10;
    let a =20; //Identifier 'a' has already been declared
    let a =30; //Identifier 'a' has already been declared
    const a =20; //Identifier 'a' has already been declared
    ```
2、无变量提升
3、块级作用域

```
var a = 10;
const a = 10;
{
    //首先,let ,const 无变量提升；其次这里面形成了一个作用域，与外面的相互不影响
    console.log(a); // a is not defined
    let a =20;
}
```
4、const 声明的数据不可改变,如果是引用类型的话，其内部的属性值可以更改
```
const a = {}
a = {}; //TypeError: Assignment to constant variable.
a.test = 'test'; 
console.log(a); //{ test: 'test' }

const a = [];
b[0] = 'test';
console.log(); // ['test']
```
 
#### 生成器genarator 和迭代器iterator
1、genarator 生产 iterator
```
function* read(params) {
    for (let i = 0; i < params.length; i++) {
        const element = params[i];
        yield params[i];
    }
}

let it = read(['js', 'node', 'java'])
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
```




