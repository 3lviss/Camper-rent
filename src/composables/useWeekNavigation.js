import { ref, computed } from 'vue'

export function useWeekNavigation(selectedDate, onWeekChange) {
    const currentWeekStart = ref(new Date(selectedDate))

    const getWeekStart = (date) => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        return new Date(d.setDate(diff))
    }

    const previousWeek = () => {
        const nextDate = new Date(currentWeekStart.value)
        nextDate.setDate(nextDate.getDate() - 7)
        currentWeekStart.value = nextDate
        onWeekChange?.(new Date(currentWeekStart.value))
    }

    const nextWeek = () => {
        const nextDate = new Date(currentWeekStart.value)
        nextDate.setDate(nextDate.getDate() + 7)
        currentWeekStart.value = nextDate
        onWeekChange?.(new Date(currentWeekStart.value))
    }

    const goToToday = () => {
        const todayStart = getWeekStart(new Date())
        currentWeekStart.value = todayStart
        onWeekChange?.(new Date(currentWeekStart.value))
    }

    const isCurrentWeek = computed(() => {
        const todayStart = getWeekStart(new Date())
        return todayStart.toDateString() === currentWeekStart.value.toDateString()
    })

    const getISOWeek = (date) => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
        return weekNo
    }

    const weekNumber = computed(() => {
        const start = getWeekStart(currentWeekStart.value)
        return getISOWeek(start)
    })

    return {
        currentWeekStart,
        getWeekStart,
        previousWeek,
        nextWeek,
        goToToday,
        isCurrentWeek,
        weekNumber
    }
}
