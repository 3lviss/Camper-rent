import { defineStore } from 'pinia'

export const useStationsStore = defineStore('stations', {
    state: () => ({
        selectedStationId: null,
        selectedWeekStartISO: null, // (ISO date of Monday)
        bookings: {}, // { stationId: [bookings] }
        stations: {}, // { stationId: stationData }
        loading: false,
        error: null
    }),
    actions: {
        setSelectedStationId(stationId) {
            this.selectedStationId = stationId
        },
        setSelectedWeekStart(date) {
            if (!(date instanceof Date)) {
                this.selectedWeekStartISO = null
                return
            }

            const d = new Date(date)
            d.setHours(0, 0, 0, 0)
            this.selectedWeekStartISO = d.toISOString()
        },
        
        setBookings(stationId, bookings) {
            this.bookings[stationId] = bookings
        },

        getBookings(stationId) {
            return this.bookings[stationId] || []
        },

        setStation(stationId, stationData) {
            this.stations[stationId] = stationData
        },

        getStation(stationId) {
            return this.stations[stationId] || null
        },
        
        getStationName(stationId) {
            const station = this.stations[stationId]
            return station?.name || 'Unknown Station'
        },
        
        // Reschedule booking
        async rescheduleBooking(stationId, bookingId, newStartDate, newEndDate) {
            this.loading = true
            this.error = null
            
            try {
                // API call
                console.log('API Call - Reschedule Booking')
                
                // Update local state
                const stationBookings = this.bookings[stationId] || []
                const bookingIndex = stationBookings.findIndex(b => b.id === bookingId)
                
                if (bookingIndex !== -1) {
                    stationBookings[bookingIndex] = {
                        ...stationBookings[bookingIndex],
                        startDate: newStartDate,
                        endDate: newEndDate,
                        updatedAt: new Date().toISOString()
                    }
                    
                    this.bookings[stationId] = [...stationBookings]
                    console.log('Booking rescheduled successfully:', stationBookings[bookingIndex])
                }
                
                return { success: true }
            } catch (error) {
                this.error = error.message
                console.error('Failed to reschedule booking:', error)
                return { success: false, error: error.message }
            } finally {
                this.loading = false
            }
        }
    }
})