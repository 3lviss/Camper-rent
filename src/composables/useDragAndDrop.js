// src/composables/useDragAndDrop.js
import { useDragState } from './useDragState'
import { useDragGhost } from './useDragGhost'
import { useDesktopDrag } from './useDesktopDrag'
import { useTouchDrag } from './useTouchDrag'

// Drag and drop composable for schedule items
export function useDragAndDrop(options = {}) {
    const {
        canDrag = () => true,
        canDrop = (_item, targetDate) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return targetDate >= today
        },
        getStart = (item) => new Date(item.startDate),
        getEnd = (item) => new Date(item.endDate),
        makeDropResult = ({ targetDate, originalStart, originalEnd }) => {
            const duration = originalEnd - originalStart
            const newStart = new Date(targetDate)
            newStart.setHours(originalStart.getHours(), originalStart.getMinutes(), originalStart.getSeconds(), originalStart.getMilliseconds())
            const newEnd = new Date(newStart.getTime() + duration)
            
            return {
                newStartDate: newStart.toISOString(),
                newEndDate: newEnd.toISOString(),
            }
        },
        getZoneKey = (d) => {
            if (!d) return ''
            let date = d instanceof Date ? d : new Date(d)
            if (isNaN(date)) return ''
            const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            return day.toISOString()
        },
    } = options

    const dragState = useDragState()
    const ghostUtils = useDragGhost()
    
    const dragOptions = {
        canDrag,
        canDrop,
        getStart,
        getEnd,
        makeDropResult,
        getZoneKey
    }

    const desktopDrag = useDesktopDrag(dragState, dragOptions)
    const touchDrag = useTouchDrag(dragState, ghostUtils, dragOptions)

    const isZoneActive = (zoneDate) => {
        return dragState.overZoneKey.value === getZoneKey(zoneDate)
    }

    return {
        // State
        draggedItem: dragState.draggedItem,
        overZoneKey: dragState.overZoneKey,
        isTouchDragging: dragState.isTouchDragging,
        touchDragGhost: dragState.touchDragGhost,
        
        // UI helpers
        isZoneActive,
        
        // Desktop handlers
        ...desktopDrag,
        
        // Touch handlers
        onTouchStart: touchDrag.onTouchStart,
    }
}
