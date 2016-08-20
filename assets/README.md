# 前端项目

> 基于 react redux antd webpack es6

## Build Setup

``` bash
# install webpack global
sudo npm install webpack -g

# install dependencies
npm install

# serve with hot reload at localhost:6080
npm run dev

# build for production with minification
npm run build

```
## 项目特点
- 前后端分离，前端dev-server反向代理请求
- 单页面应用，组件化，模块化

## 文件命名规范
- jax文件名首字母大写
- js文件名首字母小写

## 代码规范
- 尽量使用es6
- 项目中使用eslint结合webpack进行强制规范，编码过程中，可能会经常出现eslint相关的错误。


## React ES6+写法
```
class App extends React.Component{
    // 构造函数，一般不用写
    constructor(props){
        super(props);
    }
    // 初始化state,替代原getInitialState, 注意前面没有static
    state = {
        showMenu:false
    };
    // 替代原propTypes 属性,注意前面有static,属于静态方法.
    static propTypes = {
        autoPlay: React.PropTypes.bool.isRequired
    }
    // 默认defaultProps,替代原getDefaultProps方法, 注意前面有static
    static defaultProps = {
        loading:false
    };
    //事件的写法,这里要使用箭头函数,箭头函数不会改变this的指向,否这函数内,this指的就不是当前对象了,React.CreatClass方式React会自动绑定this,ES6写法不会.详见下一小节说明.
    handleClick = (e)=>{
        this.setState();//这里的this指的还是App
    };
    componentDidMount() {
        // do something yourself...
    }
}
```

## React ES6 事件绑定
老写法的官方原话:
Autobinding: When creating callbacks in JavaScript, you usually need to explicitly bind a method to its instance such that the value of this is correct. With React, every method is automatically bound to its component instance. React caches the bound method such that it's extremely CPU and memory efficient. It's also less typing!

新的ES6写法如果要实现this还指向当前对象,有三种写法:个人感觉箭头函数写法最优雅.
```
第一种:this._handleClick.bind(this)

_handleClick(e) {
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this._handleClick.bind(this)}>点击</h1>
        </div>
    );
}
第二种:this._handleClick = this._handleClick.bind(this)

constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this)
}
_handleClick(e) {
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this._handleClick}>点击</h1>
        </div>
    );
}
第三种:_handleClick = (e) => {}

_handleClick = (e) => {
    // 使用箭头函数(arrow function)
    console.log(this);
}
render() {
    return (
        <div>
            <h1 onClick={this._handleClick}>点击</h1>
        </div>
    );
}

```

## React context与props区别
[官网介绍context](https://facebook.github.io/react/docs/context.html)
- props，给直接子组件传递数据，如果多层，要一层一层显示的传递
- context， 给后代组件传递数据，子组件只要声明contextTypes，就可以获取组件树context中的数据,相当于整个组件树中的全局变量。
- 尽量不要使用context，会使组件结构变得复杂。

## 关于redux
项目分了很多层次，可以提高代码复用，actions可以被各个页面组件和reducers复用，services可以被actions复用

- 各个页面（组件）通过`const {actions} = this.props`获取actions对象，然后调用`actions.xxx()` 触发action；
- 各个页面（组件）要export出两个变量`LayoutComponent`和`mapStateToProps`；使用`src/utils/connectComponent.js`使组件与redux做链接时会用到；
- `mapStateToProps` 用于指定redux的state中哪部分数据用于当前组件，由于reducer的`combineReducers`方法包装之后，将各个reducer的state存放在对应的key中，key指的是combineReducers包装时指定的key，比如：
    
    ```
    // src/reducers/index.js
    export default combineReducers({
        home, // 这个home就是key，es6写法
        utils,
    });
    
    src/layout/home.js
    export function mapStateToProps(state) {
        return {
            ...state.home // 这个home指的就是 combineReducers中的key
        };
    }
    
    ```
- action负责准备数据，数据来源：
    - 调用action方法时传入的参数
    - action内部调用service异步请求获得的数据
    - storage中获取数据
    - 其他数据来源
- reducer为纯函数，负责处理数据，不会涉及异步，不要调用services中方法，获取action的数据之后，做进一步处理。
- store负责将数据以pros形式传递给component，以及通过中间件对数据统一处理。

### action：
- action 使用的是`redux-actions`模块构建的 `Flux Standard Action`
    ```
    createAction(type, payloadCreator = Identity, ?metaCreator)
    ```
- 各个action文件之间，不允许出现同名方法，`src/actions/index.js`中有检测。

### 回调处理
调用actions方法时，给actions方法传入一个回调参数，这个回调参数，最终是由 `createAction` 的 `metaCreator` 参数处理的，项目中做了封装

```
export const testAsync = createAction(
    types.TEXT_ASYNC_DEMO,
    async()=> {
        return await homeService.getMsg(); // 返回promise
    },
    (resolved, rejected)=> {
    	return {
    		resolved,
    		rejected,
    		sync: 'home'
    	}
    }
);

/* 解释

(resolved, rejected)=> {
    return {
        resolved,
        rejected,
        sync: 'home'
    }
}
就是 createAction 的第三个参数 metaCreator，是一个函数，这个函数返回的数据，最终存放在action的meta中。
返回数据 resolved 和 rejected 就是调用action方法时传入的回调函数，一个代表成功，一个代表失败，这两个数据最终会被 src/store/asyncActionCallbackMiddleware.js中间件使用
*/
```

### 异步写法
异步是使用`src/store/promiseMiddleware.js`中间件进行处理的
一本异步action其实是触发了两次reducer，第一次标记异步开始，reducer可以获取相应的标记，第二次异步完成，返回数据。具体可以参考`promiseMiddleware.js`源码

#### action异步写法
```
import {createAction} from 'redux-actions';
import * as types from '../constants/actionTypes';
import * as profileService from '../services/profile-service';

export const saveUserMessage = createAction(types.SAVE_USER_MESSAGE,
    async(userMessage) => await profileService.saveUserMessage(userMessage), // 返回一个promise实例
    (userMessage, resolved, rejected) => {
        return {
            resolved, // 执行异步action成功回调，使页面可以获取异步成功
            rejected, // 执行异步action失败回调，使页面可以处理异步失败
            autoTipError: '保存失败', // 系统自动提示错误， 默认 ‘未知系统错误’ 传递false，不使用系统提示
            autoTipSuccess: '个人信息修改成功', // 默认 false，不显示成功提示信息，
        };
    }
);
```

#### reducer 异步写法：
有两种写法，第一种有机会获取所有action的数据，第二种，只能获取自己type的action数据，个人觉得获取所有action数据没有用，反而状态受干扰。推荐第二种写法
```
import * as types from '../constants/actionTypes';

let initialState = {
    isSidebarCollapsed: false,
    fetching: false,
};

export default function (state = initialState, action) {
    const {payload, error, meta={}, type} = action;
    const {sequence = {}} = meta;
    const status = sequence.type === 'start';
    if (status || error) { // 出错，或者正在请求中，注意： 这种写法将捕获所有异步action，自己模块得status要在自己的case中写。
        return {
            ...state,
            fetching: status,
        };
    }
    switch (type) {
    case types.TOGGLE_SIDE_BAR: {
        const isSidebarCollapsed = !state.isSidebarCollapsed;
        return {
            ...state,
            isSidebarCollapsed,
        };
    }
    case types.GET_STATE_TO_STORAGE: {
        return {
            ...state,
            ...(payload.setting || initialState),
        };
    }
    default:
        return state;
    }
}

```
```
import {handleActions} from 'redux-actions';
import * as types from '../constants/actionTypes';

let initialState = {
    loading: false,
    orderState: '',
};

export default handleActions({
    [types.SAVE_USER_MESSAGE](state, action) {
        const {error, meta = {}} = action;
        const {sequence = {}} = meta;
        const loading = sequence.type === 'start';

        // loading 要反应到页面上， 
        // error由middleware处理，全局message提示，或者各个页面添加回调处理
        if (loading || error) {
            return {
                ...state,
                loading,
            };
        }

        return {
            ...state,
            orderState: 'success',
            loading,
        };
    },
}, initialState);

```

### redux中的异常处理
- 基于`flux-standard-action` 规范，异常action返回结构为：`{..., payload: error, error: true, ...}`
- `utilsMiddleware.js`会统一截获处理异常（无论异步还是同步）， 会根据 `meta.autoTipError`来确定是否全局提示处理异常信息
- `asyncActionCallbackMiddleware.js` 会调用actions的回调函数，给具体页面处理异常的机会


#### 异步异常
异步操作统一使用的是promise，异常捕获在`src/store/promiseMiddleware.js`中间件中，一旦异步操作出现异常，action将传递给相应的reducer`{..., payload: error, error: true, ...}`

#### 同步异常
如果`action`返回的`payload`是一个`Error`对象，`redux-actions`，将自动设置`action.error`为`true`
自己可以在action中，使用`try-catch`处理？？？

## 路由&菜单
做大型应用时，route比较多，写在一个routes.js文件中，一是routes.js会过于庞大，不好维护，二是团队协作时，很容易产生冲突。
因此每个模块的路由，写在自己的模块下(以routes.js命名)，无法在各个模块routes.js中定义的router，统一在`src/routes.js`中定义。所有的路由最终通过脚本规整到`src/allRoutes.js`文件下。

- 系统会根据url同步页面下状态：
    - 头部导航选中状态
    - 左侧菜单展开，选中状态
    - 页面头部信息：标题和面包屑导航等

- url需要有统一的约定，方便提取信息
```
初步定为：http[s]://www.xxxx.com/sys-path/menu-path
sys-path：对应头部导航，确定是哪个系统，确定左侧显示哪组菜单
menu-path：左侧菜单对应的path，同时跟路由有对应。menu-path可以多级，比如users/lists/...
```
- 后端所有http的get请求，没有被截获的都渲染`index.html`
```
node后端路由配置（routes.js）：
router.get('*', function (req, res, next) {
    // ajax请求 抛出404,其他请求直接render index.html 
    res.render('index.html');
});
```
- 前端所有没截获的path，都渲染Error404组件
```
// src/Router.jsx
pageRouts.push(
    {
        path: '*',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./layouts/error/Error404')));
            });
        },
    }
);
```
- 页面跳转使用`Link`组件，否则会跳出单页面应用
```
import {Link} from 'react-router'
<Link to="/xxxxx">XXXXX</Link>
```

### 前端路由结构规范
*特殊情况，不能按照规范实现，与各位leader商榷*

1. 多单词使用“_”链接，不要使用“-”，或其他特殊字符。
1. 根据菜单结构，定义url结构，RestFull 约定，具体看下面例子。

例如：
```
菜单结构：
系统 # system
    -用户管理 # user 
        -添加用户
        -用户列表

对应的菜单为  

列表页：
http:localhost:8080/users
详情页 12为id
http:localhost:8080/users/12
添加页
http:localhost:8080/users/new
修改页
http:localhost:8080/users/12/edit
```
菜单结构
```
门店  # store
    -订单 # order 一级
        -外卖订单 # take_out 二级
            -新订单 # new_order 可点击跳转页面
            -所有订单 # all_order 可点击跳转页面
```
对应的菜单为：
```
列表页
http:localhost:8080/store/order/take_out/new_orders
详情页
http:localhost:8080/store/order/take_out/new_orders/12
添加页
http:localhost:8080/store/order/take_out/new_orders/new
修改页
http:localhost:8080/store/order/take_out/new_orders/21/edit
```

#### 菜单数据来源：
左侧菜单数据由后台提供，会包含path，路由前端单独维护，通过path跟菜单（或者Link）关联。

*注:头部和左侧菜单也可以前端硬编码,根据项目具体需求,具体决定.*

#### 菜单数据结构：
采用扁平化结构，后台存储更具有通用性，前端会有转换函数，转为树状结构。如果后端提供的数据结构字段名无法对应，做一层数据转换，或者修改转换函数。

```javascript
[
    {
        key: 'system',
        parentKey: undefined,
        order: 1,
        icon: 'fa-th-list',
        text: '系统',
        path: undefined,
    },
    {
        key: 'shop', // 跟url有关
        parentKey: undefined,
        order: 1,
        icon: 'fa-th-list',
        text: '顶级菜单1',
        path: undefined, // 如果顶级菜单作为头部导航，这个path是点击之后的跳转。默认获取第一个带有path的子节点，如果获取不到，path='/'
    },
]
```

#### 地址栏与菜单自动关联
点击菜单时(或其他链接)，不需要绑定事件，直接通过Link走路由跳转，地址栏改变后，会触发监听事件，同步头部导航和左侧菜单状态

```
browserHistory.listen(function (data) {
//细节参见 具体代码 src/Routes.jsx
}}
```

## 按需加载
react-router改成如下写法就可以按需加载:

```
{
    path: '/system/mail/read', getComponent: (location, cb) => {
    require.ensure([], (require) => {
        cb(null, require('./mail/ReadMail'));
    })
}
```
按需加载的模块，就不要重复import，否则不会单独生成文件，按需加载会失效。

具体某个模块改动，只会影响到当前模块对应生成的文件和common.js不会影响其他生成的文件，可以提高文件的缓存利用率，加速首页加载．


## 页面头部设置
默认根据菜单状态自动设置头部
```
// src/Router.jsx 中代码片段
...
componentDidMount() {
    const {actions} = this.props;

    browserHistory.listen(() => {
        ...
        actions.autoSetPageHeaderStatus();
        ...
    });
}
...
```
各个页面可以自定义头部
```
componentWillMount() {
    const {actions} = this.props;
    actions.setPageHeaderStatus({
        hidden: true,
        title: '自定义title', // 缺省不显示
        breadcrumb:[ // 缺省不显示
            {
                icon: '',
                text: '',
                path: '',
            }
        ],
    });
}

```

## 页面过场动画
在`src/Router.jsx`中，为每个route添加了onEnter和onLeave方法（没找到统一方法，只能为每个route添加），通过action，为页面容器app-content设置entered和leaving两个class，通过class使用css3添加过场动画。

## 坑
- webpack配置，allChunks要设置为true，否则 webpack异步方式加载的组件 样式无法引入 坑！！！
    ```
    new ExtractTextPlugin('[name].css', {
        disable: false,
        allChunks: true // 不设置成true，webpack异步方式加载的组件 样式无法引入 坑！！！
    }),
    ```

- npm run unit 报错 ReferenceError: Can't find variable: webpackJsonp， 原因： unit单元测试，css 不能使用ExtractTextPlugin


## 文档链接
- [react](http://reactjs.cn/)
- [react-native](http://reactnative.cn/)
- [redux](http://cn.redux.js.org/)
- [redux-actions](https://github.com/acdlite/redux-actions)
- [redux-promise](https://github.com/acdlite/redux-promise)
- [redux-thunk](https://github.com/gaearon/redux-thunk)
- [react-router](https://github.com/reactjs/react-router)
- [nightwatchjs(端对端测试)](http://nightwatchjs.org/guide#usage)
- [mochajs(单元测试)](http://mochajs.org/)
- [react-test-utils](http://reactjs.cn/react/docs/test-utils.html)
- [karma-runner](http://karma-runner.github.io/0.13/config/configuration-file.html)
- [karma-webpack](ttps://github.com/webpack/karma-webpack)


## TODO
- [ ] webpack 打包速度优化，研究一下dll，关于配置 github上搜索 react webpack，看看其他项目webpack是怎么配置的，项目是如何组织的。
- [ ] 端对端测试环境搭建
- [ ] 端对端测试写法
- [x] 单元测试环境搭建。
- [ ] 单元测试写法。
- [ ] 编写一个脚本（手脚架），用来生成 type action service reducer jsx，每次新加功能都要手动创建，比较烦
