export function useDesktopDrag(dragState, options) {
    const { canDrag, getZoneKey } = options

    const onDragStart = (event, item) => {
        if (!canDrag(item)) {
            event.preventDefault()
            return
        }
        
        dragState.draggedItem.value = item
        event.dataTransfer?.setData('text/plain', String(item?.id ?? ''))
        event.dataTransfer && (event.dataTransfer.effectAllowed = 'move')
    }

    const onDragEnd = () => {
        dragState.draggedItem.value = null
        dragState.overZoneKey.value = null
    }

    const onDragOver = (event, zoneDate) => {
        event.preventDefault()
        event.dataTransfer && (event.dataTransfer.dropEffect = 'move')
        dragState.overZoneKey.value = getZoneKey(zoneDate)
    }

    const onDragLeave = (event, zoneEl) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            dragState.overZoneKey.value = null
        }
    }

    const onDrop = (event, zoneDate, emitPayload) => {
        event.preventDefault()
        const item = dragState.draggedItem.value
        dragState.draggedItem.value = null
        dragState.overZoneKey.value = null
        
        if (!item) return

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

        emitPayload?.({
            item,
            bookingId: item.id ?? undefined,
            originalStartDate: originalStart.toISOString?.() ?? originalStart,
            originalEndDate: originalEnd.toISOString?.() ?? originalEnd,
            ...result,
        })
    }

    return {
        onDragStart,
        onDragEnd,
        onDragOver,
        onDragLeave,
        onDrop
    }
}
