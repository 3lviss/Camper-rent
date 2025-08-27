import { computed } from 'vue'

export function useWeekData(stationBookings, currentWeekStart, getWeekStart) {
    const bookedWeekStarts = computed(() => {
        const starts = new Set()
        for (const b of stationBookings.value) {
            if (b.startDate) starts.add(getWeekStart(new Date(b.startDate)).toDateString())
            if (b.endDate) starts.add(getWeekStart(new Date(b.endDate)).toDateString())
        }

        return Array.from(starts)
            .map(s => new Date(s))
            .sort((a, b) => a.getTime() - b.getTime())
    })

    const hasPreviousBookedWeek = computed(() => {
        const curr = getWeekStart(currentWeekStart.value).getTime()
        return bookedWeekStarts.value.some(d => d.getTime() < curr)
    })

    const hasNextBookedWeek = computed(() => {
        const curr = getWeekStart(currentWeekStart.value).getTime()
        return bookedWeekStarts.value.some(d => d.getTime() > curr)
    })

    const jumpToPreviousBookedWeek = () => {
        const curr = getWeekStart(currentWeekStart.value).getTime()
        const candidates = bookedWeekStarts.value.filter(d => d.getTime() < curr)

        if (candidates.length === 0) return

        const target = candidates[candidates.length - 1]
        return new Date(target)
    }

    const jumpToNextBookedWeek = () => {
        const curr = getWeekStart(currentWeekStart.value).getTime()
        const target = bookedWeekStarts.value.find(d => d.getTime() > curr)

        if (!target) return null

        return new Date(target)
    }

    const weekDays = computed(() => {
        const weekStart = getWeekStart(currentWeekStart.value)
        const days = []

        const isSameDay = (a, b) => {
            return (
                a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate()
            )
        }

        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart)
            date.setDate(weekStart.getDate() + i)

            const dayBookings = stationBookings.value.filter(booking => {
                const start = new Date(booking.startDate)
                const end = new Date(booking.endDate)
                return isSameDay(start, date) || isSameDay(end, date)
            })

            days.push({
                date: date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate(),
                isToday: date.toDateString() === new Date().toDateString(),
                bookings: dayBookings
            })
        }

        return days
    })

    const monthDisplayText = computed(() => {
        const start = weekDays.value[0].date
        const end = weekDays.value[6].date
      
        if (start.getMonth() === end.getMonth()) {
            return `${start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
        } else {
            return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
        }
    })

    return {
        bookedWeekStarts,
        hasPreviousBookedWeek,
        hasNextBookedWeek,
        jumpToPreviousBookedWeek,
        jumpToNextBookedWeek,
        weekDays,
        monthDisplayText
    }
}
