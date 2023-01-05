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
          path: '/examples/Column',
          name: 'Column',
          component: () => import('./components/Column.vue'),
          meta: { title: 'Column Sets' }
        },
        {
          path: '/examples/Groups1',
          name: 'Groups',
          component: () => import('./components/Groups1.vue'),
          meta: { title: 'Groups' }
        },
        {
          path: '/examples/forcebasedI',
          name: 'forcebased',
          component: () => import('./components/ForceBasedLabelPlacementI.vue'),
          meta: { title: 'Topological Models' }
        },
        {
          path: '/examples/Comparisons1',
          name: 'Comparisons1',
          component: () => import('./components/Comparisons.vue'),
          meta: { title: 'Comparisons' }
        },
        {
          path: '/examples/Charts1',
          name: 'Comparisons1',
          component: () => import('./components/Charts.vue'),
          meta: { title: 'Charts' }
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
