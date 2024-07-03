import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MarkerAverageView from '../views/MarkerAverageView.vue'
import MarkerSendingDependencyView from '../views/MarkerSendingDependencyView.vue'
import MarkerTotalWeightView from '../views/MarkerTotalWeightView.vue'
import MarkerDistanceView from '../views/MarkerDistanceView.vue'
import MarkerRegionDependencyView from '../views/MarkerRegionDependencyView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/average',
      name: 'average',
      component: MarkerAverageView
    },
    {
      path: '/sending',
      name: 'sending',
      component: MarkerSendingDependencyView
    },
        {
      path: '/weight',
      name: 'weight',
      component: MarkerTotalWeightView
    },
        {
      path: '/distance',
      name: 'distance',
      component: MarkerDistanceView
    },
    {
      path: '/region',
      name: 'region',
      component: MarkerRegionDependencyView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
