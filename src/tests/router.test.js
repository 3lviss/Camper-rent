import { describe, it, expect } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '@/router'
import { routes } from '@/router/routes'

function makeTestRouter() {
  return createAppRouter(createMemoryHistory())
}

describe('router config', () => {
    it('has Stations route', () => {
        const children = routes[0].children
        const stations = children.find(r => r.name === 'Stations')
        expect(stations).toBeTruthy()
        expect(stations.path).toBe('stations')
    })

    it('redirects / to /stations', async () => {
        const router = makeTestRouter()
        await router.push('/')
        await router.isReady()
        expect(router.currentRoute.value.fullPath).toBe('/stations')
    })

    it('redirects unknown routes to /stations', async () => {
        const router = makeTestRouter()
        await router.push('/bad-url')
        await router.isReady()
        expect(router.currentRoute.value.fullPath).toBe('/stations')
    })

    it('has BookingDetails route', () => {
        const children = routes[0].children
        const booking = children.find(r => r.name === 'BookingDetails')
        expect(booking).toBeTruthy()
        expect(booking.path).toBe('stations/:stationId/bookings/:bookingId')
    })

    it('navigate to BookingDetails with params', async () => {
        const router = makeTestRouter()
        await router.push({ name: 'BookingDetails', params: { stationId: '1', bookingId: '42' } })
        await router.isReady()
        expect(router.currentRoute.value.fullPath).toBe('/stations/1/bookings/42')
        expect(router.currentRoute.value.params).toEqual({ stationId: '1', bookingId: '42' })
    })
})

