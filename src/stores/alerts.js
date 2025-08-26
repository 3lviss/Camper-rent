import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alerts', {
    state: () => ({
        current: null,      // { id, type, status, message }
        _timer: null,
    }),
    actions: {
        show({ type = 'error', status = -1, message = 'Something went wrong', timeout = 5000 }) {
            const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : Date.now().toString(36)

            this.current = { id, type, status, message }

            if (this._timer) clearTimeout(this._timer)
            if (timeout) this._timer = setTimeout(() => this.dismiss(), timeout)

            return id
        },
    dismiss() {
        if (this._timer) clearTimeout(this._timer)
        this._timer = null
        this.current = null
    },
  },
})