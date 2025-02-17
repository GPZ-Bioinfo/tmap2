import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

let graphName = JSON.parse(localStorage.getItem('graphName'))
const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: '/',
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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue'),
      meta: { title: 'Dashboard' }
    },
    {
      path: `/project_id=${graphName}`,
      name: 'examples',
      component: () => import('./views/Examples.vue'),
      meta: { title: 'Examples' },
      children: [
        {
          path: `/project_id=${graphName}/Features`,
          name: 'ranking',
          component: () => import('./components/Features.vue'),
          meta: { title: 'Features' }
        },
        {
          path: `/project_id=${graphName}/Groups1`,
          name: 'Groups',
          component: () => import('./components/Groups1.vue'),
          meta: { title: 'Groups' }
        },
        {
          path: `/project_id=${graphName}/ForceBased`,
          name: 'ForceBased',
          component: () => import('./components/ForceBased.vue'),
          meta: { title: 'Topological Models' }
        },
        {
          path: `/project_id=${graphName}/Comparisons1`,
          name: 'Comparisons1',
          component: () => import('./components/Comparisons.vue'),
          meta: { title: 'Comparisons' }
        },
        {
          path: `/project_id=${graphName}/Charts1`,
          name: 'Charts1',
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
  const isLogin = JSON.parse(localStorage.getItem('users'))
  if (to.name === 'home') {
    if (isLogin) {
      this.$router.push('/dashboard')
    } else {
      next()
    }
  } else {
    if (isLogin) {
      if (isLogin.token === 't2t123xafwfw2233') {
        next()
      } else {
        next({
          path: '/home'
        })
      }
    } else {
      next({
        path: '/home'
      })
    }
  }
})

export default router
