import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
      meta: { title: '' }
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('./views/Home.vue'),
      meta: { title: 'Home' }
    },
    {
      path: '/examples',
      name: 'examples',
      component: () => import('./views/Examples.vue'),
      meta: { title: 'Examples' },
      children: [
        {
          path: '/examples/introduction',
          name: 'introduction',
          component: () => import('./components/Introduction.vue'),
          meta: { title: 'Introduction' }
        },
        {
          path: '/examples/forcebasedI',
          name: 'forcebased',
          component: () => import('./components/ForceBasedLabelPlacementI.vue'),
          meta: { title: 'Force1' }
        }
      ]
    }
  ]
})

// router guard
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title + ' | ' + 'Tmap' : 'Tmap'
  next()
})

export default router
