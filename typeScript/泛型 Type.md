
# 泛型：Type | T
## 泛型函数和类型推断 :定义输入与输出类型一致
```
function firstEle<Type>(arr:Type[]):Type |undefined{
  return arr[0]
  // return 100 // 不能将类型“number”分配给类型“Type”
}

firstEle([1,2,3])
```
或者
```
function map<Input,Output>(arr:Input[],func:(arg:Input)=>Output):Output[] {
  return arr.map(func)
}
var s = map(['1','2','3'],(n)=>parseInt(n))
console.log(s);
```

## 泛型函数限制条件
```
function leng<Type extends {length:number}>(a:Type,b:Type) {
  if (a.length >=b.length) {
    return a
  } else {
    return b
  }
}
```
泛型参数 a,b 不一定有length 属性，此时可以使用extends 进行扩展限制,限制必须有某个属性

## 泛型函数的使用受限值
```
function leng<Type extends {length:number}>(a:Type,b:number):Type {
  if (a.length >=b) {
    return a
  } else {
    return {length:b} // 不能将类型“{ length: number; }”分配给类型“Type”。"{ length: number; }" 可赋给 "Type" 类型的约束，但可以使用约束 "{ length: number; }" 的其他子类型实例化 "Type"。ts(2322)
  }
}
const a = leng([1,2,3],3)
```

## 泛型函数指定类型参数
```
function combine<Type>(arr1:Type[],arr2:Type[]):Type[] {
  return arr1.concat(arr2)
}

const arr = combine([1,2,3],['string']) // 不能将类型“string”分配给类型“number”
const arr1 = combine<number|string>([1,2,3],['string'])
```
泛型函数会自动以第一个参数类型推断返回类型，所以第一次直接报错，第二次使用类型指定了传入类型

## 编写优秀通用函数准则
### 可能的情况下，使用类型参数本数本身，而不是对其进行约束;
### 总是尽可能减少地使用类型参数；
### 如果一个类型的参数只出现在一个地方，请重新考虑你是否真的需要它。

## 泛型对象类型：由使用者决定数据的类型，可以处理多次函数重载的场景
```
interface Box<Type> {
  contents:Type
}

let numberBox:Box<number> = {
  contents:1
}

let stringBox:Box<string> = {
  contents:'hello'
}

let booleanBox:Box<boolean> = {
  contents:true
}
```
或者
```
interface Box<Type> {
  contents:Type
}

interface Apple {

}

let a:Apple = []

type BoxA = Box<Apple>

let ab:BoxA = {
  contents:a
}
```
或者

```
type OrNull<Type> = Type | null
type OneOrNull<Type> = Type | Type[]
type OneOrManyOrNull<Type> = OrNull<OneOrNull<Type>>
type OneOrManyOrNullString = OneOrManyOrNull<string>
```

## 泛型类型 Type
```
function identity<Type> (arg:Type):Type{
  return arg
}

// let myIdentity:<Type>(arg:Type) => Type = identity 
let myIdentity:<Input>(arg:Input) => Input = identity 

interface IdentityType<Type>{
  (agr:Type):Type
}

const myIdentity1:IdentityType<string> = identity
```
适用于自动类型推断，可以推断出类型

## 通用类型的处理:类型约束
```
function identity<Type> (arg:Type):Type{
  console.log(arg.length); // 类型“Type”上不存在属性“length”
  return arg
}

// 改造
function identity<Type> (arg:Array<Type>):Type[]{
  console.log(arg.length);
  
  return arg
}
```
或者 
```
interface IdentityType{
  length:number
}

function identity<Type extends IdentityType> (arg:Type):Type{
  console.log(arg.length); 
  return arg
}
```

## 泛型类型约束中的类型参数
```
function getProperty<Type,Key extends keyof Type>(obj:Type,key:Key) {
  return obj[key]
}

let x = {a:1,b:2,c:3,d:4}
getProperty(x,'a')
getProperty(x,'m') // 类型“"m"”的参数不能赋给类型“"a" | "b" | "c" | "d"”的参数。
```

## 泛型中使用类类型
```
class BeeKeeper {
  hasMask: boolean = true
}

class Zookeeper {
  name: string = 'mike'
}
class Animal {
  legs: number=0
}
class Bee extends Animal {
  keeper:BeeKeeper = new BeeKeeper()
}
class Lion extends Animal {
  keeper:Zookeeper = new Zookeeper()
}

function createInstance<A extends Animal>(c:new() => A):A {
  return new c()
}

createInstance(Bee).keeper
createInstance(Lion).legs
```

## 索引类型
```
type Person = {
  name:string
  age:number,
  alive:boolean
}
type Age = Person['age']
type Name = Person['name']

let age:Age = 1
```

## 索引联合类型
```
interface Person {
  name:string
  age:number,
  alive:boolean
}
type age = Person['age'|'name']
type Pro = Person[keyof Person] // Person 里面的所有类型组成的联合类型

```

## 获取类型
```
const Myarr = [{name:'blob',age:10},{name:'tom',age:20},{name:'jack',age:30}]
type Person = typeof Myarr[number]
const p:Person = {
  name:'xiaoli',
  age:30,
  // alive:true // 并且“alive”不在类型“{ name: string; age: number; }”中
}

// 使用某个字段的类型
type Age = typeof Myarr[number]['age']
const age:Age = 100

// 使用类型的类型
type Key = 'age' 
type Age2 = Person[Key] 

```

## 条件类型
```

```