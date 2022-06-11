## keyof 类型操作符

```
type Obj = {
 [k:string]:unknown
}
type P = keyof Obj
const a:P = 2
const b:P = 'x'
const c:P = true // 不能将类型“boolean”分配给类型“string | number”。

```

## typeof 类型操作符
```
let s = 'string'
let a:typeof s = '100'
```
### ReturnType: 必须传入一个函数的返回值类型,返回值类型是 T 的类型
```
type Fn = (x:unknown)=>boolean
type K = ReturnType<Fn>
function f() {
  return {
    a:1,
    b:'100'
  }
}
type P = ReturnType<typeof f> // 这里就是 f 的返回值的类型
let obj:P = {
  a:1,
  b:'0'
}
```

## 条件类型：解决函数重载多次的问题
```
interface Name {
  name:string
}
interface Age {
  age:number
}

type NameOrAge<T extends number | string> = T extends number ? Age : Name

function createLabel<T extends number |string>(nameOrAge:T):NameOrAge<T> {
  throw new Error("");  
}

let a = createLabel('Bob') // type a = Name
let b = createLabel(20) // type b = Age
let c = createLabel(Math.random() > 0.5?'Bob':30) // type c = Name | Age

```

### 条件类型约束
```
// type MesageOf<T> = T['message'] // 类型“"message"”无法用于索引类型“T”
type MessageOf<T extends {message:unknown}> = T['message']
interface Email {
  message:string
}
type EmailMessage = MessageOf<Email>
```

#### MessageOf 我们可以升级一下,让他能接收更宽松的类型赋值
```
type MessageOf<T> = T extends {message:unknown} ? T['message'] : never

```

#### 更多例子
```
type Flattern<T> = T extends any[] ? T[number] : T
type Str = Flattern<string[]> //type Str = string
type Num = Flattern<number[]> // type Num = number
```

### 条件类型推理 infer

#### 我们定义一个类型函数，通过类型函数返回类型
```
type GetReturnType<T> = T extends (...args:never)=> infer Return ? Return :never

type Num = GetReturnType<()=>number> // type Num = number
let num:Num = 10

type Str = GetReturnType<()=> string> // type Str = string
let str:Str = '333'

type Never = GetReturnType<string>
let never:Never = '222' as never
```

#### 分布式条件类型
```
type ToArrary<T> = T extends any ? T[] : never

type StrArray = ToArrary<string>
const arr:StrArray = ['222']

type NumArray = ToArrary<number>
const numArr:NumArray = [100]
```