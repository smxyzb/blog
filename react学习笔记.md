#### 先留个问题，等react熟悉后再来作答：react 与 vue 有什么区别

#### react 中如何给一个列表渲染的每个列进行事件绑定  
	该问题来自阿里云的前端面试，当时对react 不熟悉，直接说在每个list 上绑定onclick 事件。然而事实上并不是这样。
	react 中已经对所有事件进行了事件委托处理，onClick 的方式并不是直接绑定到每一个dom上，而是进行事件委托，如下代码
	```
	const template = (props)=>{
		return(
		<ul class="common-list">
			props.list.map(item.index)=>{
				<li className="common-list-item" onClick={(index)=>this.handleClick(index))}>
					<div className="common-list-item_img">
						<img src="{item.image}">
					</div>
					<div className="common-list-item_desc">
						<div className="common-list-item_title">{item.title}</div>
						<div className="common-list-item_content">{item.content}</div>
					</div>
				</li>
			}
		</ul> 
		)
	}
	```
#### redux 的使用
	1.index.js 创建store 并订阅render 方法，store变化的时候回调用render
	```
		import { counter, addGUN, removeGUN} from "./reducer";
		const store = createStore(counter);
		function render() {
			ReactDom.render(<App store={store} addGUN={addGUN} removeGUN={removeGUN}></App>, document.getElementById("root"))
		}
		render();
		// 订阅render
		store.subscribe(render)
	```
	2. reducer 
		```
		const ADD_GUN = '加机关枪'
		const REMOVE_GUN = '减机关枪'
		// reducer
		export function counter(state = 0, action) {
			switch (action.type) {
				case ADD_GUN:
					return state + 1
				case REMOVE_GUN:
					return state - 1;
				default:
					return 10;
			}
		}
	```
	3. actions：在具需要使用的地方调用 store.dispatch(action)
		``` 
		//actions
		export function addGUN() {
			return { type: ADD_GUN }
		}

		export function removeGUN() {
			return { type: REMOVE_GUN }
		}
		```
	
#### antd 实现按需加载样式配置，未配置会出现budle 非常大加载缓慢
	1、在 dev.config.js 和prod.config.js 的 bable-loader 里面options 加入
		```  
		plugins: [
					['import', [{ libraryName: "antd-mobile", style: 'css' }]],
				],
		```
	2、配置package.json 
	```
		"babel": {
		"presets": [
		"react-app"
		],
		"plugins": [
			[
				"import",
				[
					{
						"libraryName": "antd-mobile",
						"style": "css"
					}
				]
			]
		]
	}
	```
#### react-redux 的使用
	1、Provider 组件在应用最外层，传入store即可，只用一次
	```
		ReactDom.render(
			(<Provider store={store}>
			<App />
			</Provider>), 
		document.getElementById("root"))
	```
	2、Connect 负责从外部获取组件需要的参数
	```
	// connect 将state 和action 都传入props
	const mapStateToProps  = (state)=>{
		return { num: state }
	}

	const actionCreators = { addGUN, removeGUN, addGunAsync }
	//connect 负责外部获取组件需要的参数
	App = connect(mapStateToProps, actionCreators)(App)
	```
	connect 完成后就不需要在dispatch 了，直接使用props获取即可
	```
		<!--以前 <Button type='primary' onClick={() => store.dispatch(addGUN())}>申请及其</Button> -->
		<Button type='primary' onClick={this.props.addGUN}>申请及其</Button>
	```

	3、connect 装饰器是使用
		1)安装：cnpm install --save-dev babel-plugin-transform-decorators-legacy
		2) package.json plugins 加入 transform-decorators-legacy
		3) 在组件生命之前使用@connect
		```
		@connect(
			mapStateToProps,
			actionCreators
		)
		//或者
		@connect(
			state => ({ num: state }),
			{ addGUN, removeGUN, addGunAsync }
		)
		```

#### react-router4
	基本组件：BrowserRouter  包裹整个应用
			Route 路由对应渲染的组件，可嵌套
			Link 跳转专用
			```
			function Two() {
				return <h2>二营</h2>
			}

			function Three() {
				return <h2>骑兵连</h2>
			}
			<BrowserRouter>
				<div>
					<ul>
						<li>
							<Link to='/'>一</Link>
						</li>
						<li>
							<Link to='/erying'>二</Link>
						</li>
						<li>
							<Link to='/three'>three</Link>
						</li>
					</ul>
					<Route path='/' exact component={App} ></Route>
					<Route path='/erying' exact component={Two} ></Route>
					<Route path='/qibinglian' exact component={Three} ></Route>
				</div>
			</BrowserRouter>
			```
			url参数，Route 组件参数可以用冒号标识参数
			Redirect 组件跳转
			Switch 只渲染一个子Route 组件



#### react 性能优化
1、将this 绑定放到 constructor 内
`	
constructor(props){
	super(props)
	this.handleClick.bind(this)
}
<!-- 这种每次render都会bind 一次，而在constructor 内就只会执行一次 -->
	<div onCLick={this.hadleClick.bind(this)}></div>
`

2、提前定义传递的变量，样式等。避免每次render 都新生成一个对象。
`	
	<div style={{color:'red'}}></div>
<!-- 推荐改为一下方式  -->
	const color = {color：red}
	<div style={color}></div>
`
避免传递多余的变量字段等，要什么传什么
`
<div title={...this.state}></div>
<!-- 应改为 -->
<div title={this.state.title}></div>
`

3、map 映射组件序添加key 字段

4、合理利用 shouldComponentUpdate 或者在新版本的创建组件时使用 PureComponent
`
<!-- 返回false 则不 render -->
shouldComponentUpdate(nextProps,nextState){
	if(nextProps.title===this.props.title){
		return false
	}
	return true
}

<!-- 如果组件只是根据传进来的值进行渲染，并没有内部的state ,使用PureComponent -->
class Demo extends React.PureComponent{

}

`
5、使用reselect 进行数据缓存
`
import { createSelector } from "reselect";

const numSelector = createSelector(
	state => state,
	//第二个参数是第一个的返回值
	state => ({ num: state * 2 })
)
`

#### dva 使用
1、数据流向
<img src='https://github.com/smxyzb/blog/blob/master/img/1205240-ff6493dbae42e16d.png'>