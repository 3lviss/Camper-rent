export const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Layout.vue'),
    children: [
      { path: '', redirect: { name: 'Stations' } },
      {
        path: 'stations',
        name: 'Stations',
        component: () => import('@pages/Stations.vue'),
      },
      {
        path: 'stations/:stationId/bookings/:bookingId',
        name: 'BookingDetails',
        component: () => import('@pages/BookingDetails.vue'),
        props: true,
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/stations' },
]
