import { ref } from 'vue'

export function useDragState() {
    const draggedItem = ref(null)
    const overZoneKey = ref(null)
    const isTouchDragging = ref(false)
    const touchStartPos = ref({ x: 0, y: 0 })
    const touchCurrentPos = ref({ x: 0, y: 0 })
    const touchDragGhost = ref(null)

    const resetDragState = () => {
        draggedItem.value = null
        overZoneKey.value = null
        isTouchDragging.value = false
        touchStartPos.value = { x: 0, y: 0 }
        touchCurrentPos.value = { x: 0, y: 0 }
        touchDragGhost.value = null
    }

    return {
        // State
        draggedItem,
        overZoneKey,
        isTouchDragging,
        touchStartPos,
        touchCurrentPos,
        touchDragGhost,
        // Actions
        resetDragState
    }
}
