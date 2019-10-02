import Vue from 'vue'
import Router from 'vue-router'
import Blog from './views/Blog.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'blog',
      component: Blog
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: () => import('./views/Post.vue')
    }
  ]
})
