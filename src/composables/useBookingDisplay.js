export function useBookingDisplay() {
    const formatTime = (dateString) => {
        if (!dateString || typeof dateString !== 'string') return ''
        if (!dateString.includes('T')) return 'All day'

        const d = new Date(dateString)
        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')

        return `${hh}:${mm}`
    }

    const getBookingClass = (booking) => {
        const startDate = new Date(booking.startDate)
        const endDate = new Date(booking.endDate)
        const now = new Date()
      
        if (startDate > now) return 'bg-green-50 border-l-green-500'
        if (endDate < now) return 'bg-gray-100 border-l-gray-400 opacity-70'

        return 'bg-orange-50 border-l-orange-500'
    }

    const getEdgeClass = (booking, dayDate) => {
        const start = new Date(booking.startDate)
        const end = new Date(booking.endDate)
        const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

        if (sameDay(start, dayDate)) return 'border-l-green-600'
        if (sameDay(end, dayDate)) return 'border-l-orange-500'

        return ''
    }

    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    const isStartOnDay = (booking, dayDate) => sameDay(new Date(booking.startDate), dayDate)
    const isEndOnDay = (booking, dayDate) => sameDay(new Date(booking.endDate), dayDate)

    return {
        formatTime,
        getBookingClass,
        getEdgeClass,
        isStartOnDay,
        isEndOnDay
    }
}
