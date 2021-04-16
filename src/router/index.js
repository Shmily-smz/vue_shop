import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('../components/login.vue')
const Home = () =>
    import ('../views/Home/home.vue')
const Welcome = () =>
    import ('../views/Home/welcome.vue')
const Rights = () =>
    import ('../views/Home/power/Rights.vue')
const Users = () =>
    import ('../views/Home/user/users.vue')
const Roles = () =>
    import ('../views/Home/power/Roles.vue')
const Cate = () =>
    import ('../views/Home/goods/Cate.vue')
const Params = () =>
    import ('../views/Home/goods/Params.vue')
const goods = () =>
    import ("../views/Home/goods/goods.vue")
const add = () =>
    import ("../views/Home/goods/goodslist/add.vue")
const order = () =>
    import ("../views/Home/order/Order.vue")
const report = () =>
    import ("../views/Home/report/Report.vue")
Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
            { path: '/goods', component: goods },
            { path: '/add', component: add },
            { path: '/orders', component: order },
            { path: '/reports', component: report }
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 代表从哪个路径跳转而来
    //next 是一个函数，表示放行
    //next()表示放行 next(/login)表示强制跳转
    if (to.path === '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr)
        next('/login')
    next()

})
export default router