import Vue from 'vue'
import Router from 'vue-router'

const login = r => require.ensure([], () => r(require('@/pages/login')), 'login');
const index = r => require.ensure([], () => r(require('@/pages/index')), 'index');
const commodityList = r => require.ensure([], () => r(require('@/pages/commodityList')), 'commodityList');
const addMerchandise = r => require.ensure([], () => r(require('@/pages/addMerchandise')), 'addMerchandise');
const manage = r => require.ensure([], () => r(require('@/pages/manage')), 'manage');
const bannerList = r => require.ensure([], () => r(require('@/pages/bannerList')), 'bannerList');
const addBanner = r => require.ensure([], () => r(require('@/pages/addBanner')), 'addBanner')
const navigation = r => require.ensure([], () => r(require('@/pages/navigation')), 'navigation');
const order = r => require.ensure([], () => r(require('@/pages/order')), 'order')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path: '/manage',
      name: '',
      component: manage,
      children: [{
        path: '',
        component: index,
        meta: [],
      },
        {
          path: '/commodityList',
          component: commodityList,
          meta: ['商品管理', '商品列表'],
        },
        {
          path: '/addMerchandise',
          component: addMerchandise,
          meta: ['商品管理', '添加商品'],
        }, {
          path: '/bannerList',
          component: bannerList,
          meta: ['banner图管理','banner图列表'],
        },{
          path: '/addBanner',
          component: addBanner,
          meta: ['banner图管理','添加banner图'],
        },{
          path: '/navigation',
          component: navigation,
          meta: ['导航分类管理'],
        },{
          path: '/order',
          component: order,
          meta:  ['订单管理', '订单列表'],
        }]
    },
  ]
})
