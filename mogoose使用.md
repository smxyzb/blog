#### model的创建
	```
	const User = mongoose.model("user",new mongoose.Schema({
		username:{type:String,require:true},
		age:{
			type:Number,require:true
		}
		}))
	```
#### 插入数据 
	```
	User.create({
		name:'imooc',
		age:18
	},function (err,doc) {
		if(err) console.log(err)
		console.log(doc)
	})
	```  
#### 删除数据
	```
	User.remove({
		name:'imooc',
		age:18
	},function (err,doc) {
		if(err) console.log(err)
		console.log(doc)
	})  
	```
