import { createRouter, createWebHistory } from 'vue-router'
import Stations from '@pages/Stations.vue'
import BookingDetails from '@pages/BookingDetails.vue'

const routes = [
  {
    path: '/',
    redirect: '/stations'
  },
  {
    path: '/stations',
    name: 'Stations',
    component: Stations
  },
  {
    path: '/stations/:stationId/bookings/:bookingId',
    name: 'BookingDetails',
    component: BookingDetails,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/stations'
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router