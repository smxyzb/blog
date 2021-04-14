# 踩坑： className(替换 class) 、htmlFor(替换 label 标签的 for 属性)

# react 中如何给一个列表渲染的每个列进行事件绑定

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

# react 中的响应式设计思想和事件绑定

## 数据传递，方法传递

    通过 props 传递 ，传递方法时注意bind(this) 绑定父组件的this

## 参数的校验

PropTypes ： 当传参可以使用多种参数类型的时候，可以使用 PropTypes.oneOfTypes([array])

## ref

```
<input ref='{(input) => {this.input = input}}'>
```

## 部分 JSX 语法

# html ：dangerouslySetInnerHTML 设置 innerHTML ;

# for ：htmlFor 主要用于 label 标签

# 新版 setState

```
handle(){ const value = e.target.value setState(()=>({value:value})) ; }
handle(){ const value = e.target.value setState((prevState)=>({...prevState.list,newItem})) ; }

setState({},callBackFunction);
```

## props state render 函数的关系

### 当组件的 state 或者 props 发生改变时，render 函数就会被重新运行

### 当父组件的 render 函数被运行时，他的子组件的 render 都将被重新运行

### react 中的虚拟 DOM

diff 算法，同层比对

## react 生命周期函数：在某个时刻组件会自动调用执行的函数

### initialization: constructor setup props and state

### mounting 组件挂载的时候

-   componentWillMount :在组件即将被挂载到页面的时刻自动执行 ；

-   componentDidMount :在组件被挂载到页面后的时刻，建议将 ajax 请求放在这里面；

### updating 组件更新的时候

-   componentWillReceiveProps : 两个条件：a、一个组件要从父组件接受参数，第一次存在于父组件中，不会执行； b、组件之前已经存在与父组件中，才会被执行

-   shouldComponentUpdate(nextProps,nextState) : 返回布尔值 nextProps 为接下来要变成的 props ，可以使用它跟当前组件的 props 对比确定是否更新组件，提升性能

-   componentWillUpdate ：在 shouldComponentUpdate 之后执行，如果 shouldComponentUpdate 返回 true 才会执行，否则不会执行

-   render：

-   componentDidUpdate：在组件更新完成后执行

### Unmounting

-   componentWillUnmount: 子组件将要从父组件移除的时候会被执行

## react 的 CSS 过度动画

```
// 过渡
.show {
    opacity: 1;
    transition: all 1s ease-in;
}
// 动画 配合 @keyframs
    animate{
        animation: hideani 2s ease-in forwards;
    }

    // react-transition-group CSSTransition
```

## redux 的使用

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

# react 哪些可以触发 render

# react 是如何处理异步的

## 组件分类

## UI 组件 ，只负责 UI 渲染的组件

## 无状态组件：当一个组件只有一个 render 的时候，完全可以使用无状态组件来替代它，一个函数接收一个参数，返回一个组件

# redux-thunk 中间件的使用

## antd 实现按需加载样式配置，未配置会出现 budle 非常大加载缓慢

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

## redux 的使用

createStore,  
store.dispatch,  
store.getState,  
store.subscribe

reducer ：是一个纯函数，给定固定的输入，就一定会有固定的输出，而且不会有任何副作用

1、store 是唯一的  
2、只有 store 才能改变自己的数据

## react-redux 的使用

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

## react-router4

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

## react 性能优化

1、将 this 绑定放到 constructor 内 ` constructor(props){ super(props) this.handleClick.bind(this) }

<!-- 这种每次render都会bind 一次，而在constructor 内就只会执行一次 -->

    <div onCLick={this.hadleClick.bind(this)}></div>

`

2、提前定义传递的变量，样式等。避免每次 render 都新生成一个对象。 ` <div style={{color:'red'}}></div>

<!-- 推荐改为一下方式  -->

    const color = {color：red}
    <div style={color}></div>

`避免传递多余的变量字段等，要什么传什么`

<div title={...this.state}></div>
<!-- 应改为 -->
<div title={this.state.title}></div>
`

3、map 映射组件序添加 key 字段

4、合理利用 shouldComponentUpdate 或者在新版本的创建组件时使用 PureComponent `

<!-- 返回false 则不 render -->

shouldComponentUpdate(nextProps,nextState){ if(nextProps.title===this.props.title){ return false } return true }

<!-- 如果组件只是根据传进来的值进行渲染，并没有内部的state ,使用PureComponent -->

class Demo extends React.PureComponent{

}

`5、使用reselect 进行数据缓存` import { createSelector } from "reselect";

const numSelector = createSelector( state => state, //第二个参数是第一个的返回值 state => ({ num: state \* 2 }) ) `

## 单向数据流

## dva 使用

1、数据流向 <img src='https://github.com/smxyzb/blog/blob/master/img/1205240-ff6493dbae42e16d.png'>

## ref ：其实就是 ReactDOM.render()返回的组件实例，渲染 dom 元素时，返回是具体的 dom 节点

## ref 可以挂载到组件上也可以是 dom 元素上

## ref 属性可以设置为一个回调函数

```
<ul ref={ul=>this.ul = ul}>
```

## 生命周期

## componentsWillReciveProps: 与 Vue 的 activated 类似

1、组件第一次存在于 dom 中是不会只想的 2、已经存在 dom 中才会被执行

## shouldComponentUpdate(nextProps,nextState) ：提升应用性能

```
shouldComponentUpdate(nextProps,nextState){
  if(nextProps.content !== nextState.content){
    return true
  }
  return false
}
```

## 函数式编程

## 代码清晰：每个函数代表一个功能,功能单一

## 更容易实现前端的自动化测试

## 纯函数：如果函数的调用参数相同，则永远返回相同的结果。它不依赖于程序执行期间函数外部任何状态或数据的变化，必须只依赖于其输入参数
