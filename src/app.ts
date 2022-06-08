type Obj = {
 [k:string]:unknown
}

type P = keyof Obj

const a:P = 2
const b:P = 'x'
const c:P = true // 不能将类型“boolean”分配给类型“string | number”。