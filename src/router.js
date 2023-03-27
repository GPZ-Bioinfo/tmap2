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
          path: '/examples/dashboard',
          name: 'dashboard',
          component: () => import('./components/Dashboard.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: '/examples/Microbiome',
          name: 'Meta',
          component: () => import('./components/Microbiome.vue'),
          meta: { title: 'Microbiome Features' }
        },
        {
          path: '/examples/Groups1',
          name: 'Groups',
          component: () => import('./components/Groups1.vue'),
          meta: { title: 'Groups' }
        },
        // {
        //   path: '/examples/forcebased',
        //   name: 'forcebased',
        //   component: () => import('./components/ForceBased.vue'),
        //   meta: { title: 'Topological Models' }
        // },
        {
          path: '/examples/edit',
          name: 'edit',
          component: () => import('./components/ForceBased.vue'),
          meta: { title: 'Topological Models' }
        },
        {
          path: '/examples/create',
          name: 'create',
          component: () => import('./components/ForceBased.vue'),
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
