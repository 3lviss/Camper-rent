export function useDragGhost() {
    const createGhostElement = (element) => {
        const ghost = element.cloneNode(true)
        const rect = element.getBoundingClientRect()
        
        ghost.classList.add('touch-drag-ghost')
        ghost.style.top = rect.top + 'px'
        ghost.style.left = rect.left + 'px'
        ghost.style.width = rect.width + 'px'
        ghost.style.height = rect.height + 'px'
        
        document.body.appendChild(ghost)
        return ghost
    }

    const updateGhostPosition = (ghost, touchX, touchY) => {
        if (!ghost) return
        
        const ghostWidth = ghost.offsetWidth
        const ghostHeight = ghost.offsetHeight
        
        ghost.style.left = (touchX - ghostWidth / 2) + 'px'
        ghost.style.top = (touchY - ghostHeight / 2) + 'px'
        ghost.style.transform = 'scale(1.05)'
    }

    const removeGhostElement = (ghost) => {
        if (ghost && ghost.parentNode) {
            ghost.parentNode.removeChild(ghost)
        }
    }

    return {
        createGhostElement,
        updateGhostPosition,
        removeGhostElement
    }
}
