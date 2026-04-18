import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue'),
    },
    {
      path: '/story',
      name: 'story',
      component: () => import('../views/StoryView.vue'),
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: () => import('../views/ReservationView.vue'),
    },
    {
      path: '/reservation/success',
      name: 'reservation-success',
      component: () => import('../views/ReservationSuccessView.vue'),
    },
  ],
})

export default router
