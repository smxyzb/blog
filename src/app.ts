type Fish = {swim:()=>void,name:'fish'}
type Bird = {fly:()=>void,name:'bird'}

function isFish(pet:Fish|Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

isFish({swim:()=>{},name:'fish'})