interface User{
  admin:boolean
}

interface DB {
  filterUser(filter:(this:User)=> boolean):User[]
}


const db:DB = {
  filterUser:(filter:(this:User)=>boolean)=>{
    // console.log(filter());
    
    const arr = [{admin:false,},{admin:true}]
    return arr
  }
}

const admins = db.filterUser(function(this:User){
  console.log(this);
  return this.admin
})
console.log(admins);
