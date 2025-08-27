export function useTouchDrag(dragState, ghostUtils, options) {
    const TOUCH_DRAG_THRESHOLD = 15

    const onTouchStart = (event, item) => {
        if (!options.canDrag(item)) return
        
        const touch = event.touches[0]
        dragState.touchStartPos.value = { x: touch.clientX, y: touch.clientY }
        dragState.touchCurrentPos.value = { x: touch.clientX, y: touch.clientY }
        dragState.isTouchDragging.value = false
        dragState.draggedItem.value = item
        
        document.addEventListener('touchmove', onTouchMove, { passive: false })
        document.addEventListener('touchend', onTouchEnd, { passive: false })
        document.addEventListener('touchcancel', onTouchEnd, { passive: false })
        
        event.preventDefault()
    }

    const onTouchMove = (event) => {
        if (!dragState.draggedItem.value) return
        
        const touch = event.touches[0]
        dragState.touchCurrentPos.value = { x: touch.clientX, y: touch.clientY }
        
        const distance = Math.sqrt(
            Math.pow(touch.clientX - dragState.touchStartPos.value.x, 2) +
            Math.pow(touch.clientY - dragState.touchStartPos.value.y, 2)
        )
        
        if (dragState.draggedItem.value) {
            event.preventDefault()
        }
        
        if (distance > TOUCH_DRAG_THRESHOLD && !dragState.isTouchDragging.value) {
            startTouchDrag(touch)
        }
        
        if (dragState.isTouchDragging.value) {
            handleTouchDrag(touch)
        }
    }

    const startTouchDrag = (touch) => {
        dragState.isTouchDragging.value = true
        
        const draggedElement = document.querySelector('[data-touch-dragged="false"]')
        if (draggedElement) {
            draggedElement.classList.add('touch-dragging', 'scale-105', 'shadow-2xl', 'z-50', 'relative', 'transition-all', 'duration-100', 'ease-in-out')
            draggedElement.setAttribute('data-touch-dragged', 'true')
            
            dragState.touchDragGhost.value = ghostUtils.createGhostElement(draggedElement)
            ghostUtils.updateGhostPosition(dragState.touchDragGhost.value, touch.clientX, touch.clientY)
            
            if (navigator.vibrate) {
                navigator.vibrate(50)
            }
        }
    }

    const handleTouchDrag = (touch) => {
        ghostUtils.updateGhostPosition(dragState.touchDragGhost.value, touch.clientX, touch.clientY)
        
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY)
        const dropZone = elementUnderTouch?.closest('[data-drop-zone]')
        
        if (dropZone) {
            const zoneDate = dropZone.dataset.zoneDate
            if (zoneDate) {
                dragState.overZoneKey.value = options.getZoneKey(new Date(zoneDate))
            }
        }
    }

    const onTouchEnd = (event) => {
        document.removeEventListener('touchmove', onTouchMove)
        document.removeEventListener('touchend', onTouchEnd)
        document.removeEventListener('touchcancel', onTouchEnd)
        
        cleanupTouchDrag()
        
        if (!dragState.draggedItem.value || !dragState.isTouchDragging.value) {
            handleTouchClick(event)
            return
        }
        
        handleTouchDrop(event)
    }

    const cleanupTouchDrag = () => {
        const draggedElement = document.querySelector('[data-touch-dragged="true"]')
        if (draggedElement) {
            draggedElement.classList.remove('touch-dragging', 'scale-105', 'shadow-2xl', 'z-50', 'relative', 'transition-all', 'duration-100', 'ease-in-out')
            draggedElement.setAttribute('data-touch-dragged', 'false')
        }
        
        ghostUtils.removeGhostElement(dragState.touchDragGhost.value)
        dragState.touchDragGhost.value = null
    }

    const handleTouchClick = (event) => {
        dragState.resetDragState()
        
        const touch = event.changedTouches[0]
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY)
        const bookingElement = elementUnderTouch?.closest('.booking-item')
        
        if (bookingElement) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
            bookingElement.dispatchEvent(clickEvent)
        }
    }

    const handleTouchDrop = (event) => {
        const touch = event.changedTouches[0]
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY)
        const dropZone = elementUnderTouch?.closest('[data-drop-zone]')
        const zoneDate = dropZone?.dataset.zoneDate ? new Date(dropZone.dataset.zoneDate) : null
        
        const item = dragState.draggedItem.value
        dragState.resetDragState()
        
        if (!item || !zoneDate) return

        const originalStart = options.getStart(item)
        const originalEnd = options.getEnd(item)

        if (!options.canDrop(item, zoneDate, { originalStart, originalEnd })) {
            return
        }

        const result = options.makeDropResult({ 
            item, 
            targetDate: zoneDate, 
            originalStart, 
            originalEnd 
        })

        const customEvent = new CustomEvent('touch-drop', {
            detail: {
                item,
                bookingId: item.id ?? undefined,
                originalStartDate: originalStart.toISOString?.() ?? originalStart,
                originalEndDate: originalEnd.toISOString?.() ?? originalEnd,
                ...result,
            }
        })
        document.dispatchEvent(customEvent)
        
        if (navigator.vibrate) {
            navigator.vibrate([50, 50, 50])
        }
    }

    return {
        onTouchStart
    }
}
