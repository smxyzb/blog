/**
 * @description
 * @author zhangbi
 * @param {number} a
 * @param {number} b
 * @return {*} 
 */
function sum(a: number, b: number): number {
  return a + b
}

sum(100, 200)

function add(callback:(a:string,b:number)=>void){
  callback('sss',22)
}

add(function(a:string,n:number){

})
const type:'success'|'fail'|'danger' = 'success'

function add1(value:mixed){
  if(typeof value === 'number'){
    value*=1
  }
  if(typeof value === 'string'){
    value.substring(0,2)
  }
}
function adds(value:any){
  value*=1
  value.substring(0,2)
}
