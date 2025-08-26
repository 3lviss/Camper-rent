function statusMessage(status, statusText = '') {
    if (status >= 500) return 'Server error'
    if (status >= 400) return 'Request error'
    if (status >= 300) return 'Unexpected redirect'
    return statusText || 'HTTP error'
}

function makeApiError(error) {
    const e = new Error(error.message)
    e.status = error.status

    return e
}

export function useApi({ 
    baseURL = '', 
    defaultHeaders = { Accept: 'application/json' }, 
    defaultCache = 'no-store', 
} = {}) {
  async function request(path, options = {}) {
    const url = baseURL + path
    const headers = { ...defaultHeaders, ...(options.headers || {}) }
    const cache = options.cache ?? defaultCache

    let res;
    try {
       res = await fetch(url, { ...options, headers, cache })
    } catch (e) {
        throw makeApiError({
            status: -1,
            message: e?.message,
        })
    }

    const ct = res.headers.get('content-type') || ''
    const isJson = ct.includes('application/json')

    const body = res.status === 204
        ? null
        : (isJson ? await res.json().catch(() => null) : await res.text().catch(() => ''))

    if (!res.ok) {
        throw makeApiError({
            status: res.status,
            message: statusMessage(res.status, res.statusText),
        })
    }
    return body
  }

  const get  = (path, options) => request(path, { ...options, method: 'GET' })

  return { request, get }
}
