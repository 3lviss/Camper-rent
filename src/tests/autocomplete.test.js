import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Autocomplete from '@/components/Autocomplete.vue'
import { nextTick } from 'vue'

describe('Autocomplete (controlled)', () => {
    // Use fake timers to control debounce timing
    beforeEach(() => {
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.useRealTimers()
    })

    function makeWrapper(extraProps = {}) {
        return mount(Autocomplete, {
            props: {
                modelValue: '',
                suggestions: [],
                loading: false,
                debounceMs: 50,
                minQueryLength: 1,
                ...extraProps,
            },
            global: {
                stubs: {
                    Spinner: { template: '<div class="spinner"/>' },
                },
            },
        })
    }

    it('emits search after debounce when query length ≥ minQueryLength', async () => {
        const wrapper = makeWrapper()
        const input = wrapper.get('input')
        await input.setValue('Pa')
        vi.advanceTimersByTime(60)
        await nextTick()

        const emits = wrapper.emitted('search') || []
        expect(emits.length).toBeGreaterThanOrEqual(1)
        expect(emits[emits.length - 1][0]).toEqual({ query: 'Pa' })
    })

    it('resets on clear and emits empty search', async () => {
        const wrapper = makeWrapper()
        const input = wrapper.get('input')

        await input.setValue('Par')
        vi.advanceTimersByTime(60)
        await input.setValue('')
        
        // Empty search is emitted immediately
        const emits = wrapper.emitted('search') || []
        const last = emits[emits.length - 1][0]
        expect(last).toEqual({ query: '', results: [] })
    })

    it('shows loading block when loading=true and dropdown is open', async () => {
        const wrapper = makeWrapper({ loading: true })
        const input = wrapper.get('input')
        await input.trigger('focus')
        await input.setValue('Pa')
        expect(wrapper.text()).toContain('Searching…')
    })

    it('shows "No results found" after a real search with no results', async () => {
        const wrapper = makeWrapper({ suggestions: [] })
        const input = wrapper.get('input')
        await input.setValue('Par')         // ≥ minQueryLength
        vi.advanceTimersByTime(60)          // debounce elapsed
        await nextTick()

        expect(wrapper.text()).toContain('No results found')
    })
})
