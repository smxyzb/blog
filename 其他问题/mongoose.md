#### mongoose 数据库管理
mongodb设置管理用户和密码：
show dbs
在mongodb新版本里并没有admin数据库，但是并不妨碍第2步操作。
use admin 进入admin数据库
创建管理员账户
db.createUser({ user: "useradmin", pwd: "adminpassword", roles: [{ role: "userAdminAnyDatabase", db: "admin" }] })
mongodb中的用户是基于身份role的，该管理员账户的 role是 userAdminAnyDatabase。 ‘userAdmin’代表用户管理身份，’AnyDatabase’ 代表可以管理任何数据库。
验证第3步用户添加是否成功
db.auth("useradmin", "adminpassword") 如果返回1，则表示成功。
exit退出系统
db.auth()方法理解为 用户的验证功能
修改配置
sudo vi /etc/mongod.conf
找到#security: 取消注释，修改为：
security:
authorization: enabled #注意缩进，缩进参照配置文件其他配置。缩进错误可能第6步重启不成功。
重启mongodb sudo service mongod restart
进入mongodb,用第3步的 管理员账户登录，用该账户创建其他数据库管理员账号
use admin
db.auth("useradmin", "adminpassword")
新建你需要管理的mongodb 数据的账号密码。

use yourdatabase
db.createUser({ user: "youruser", pwd: "yourpassword", roles: [{ role: "dbOwner", db: "yourdatabase" }] })
rote:dbOwner 代表数据库所有者角色，拥有最高该数据库最高权限。比如新建索引等

新建数据库读写账户

use yourdatabase
db.createUser({ user: "youruser2", pwd: "yourpassword2", roles: [{ role: "readWrite", db: "yourdatabase" }] })
该用户用于该数据的读写，只拥有读写权限。

现在数据的用户名和密码就建好了。
可以使用：mongodb://youruser2:yourpassword2@localhost/yourdatabase来链接

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