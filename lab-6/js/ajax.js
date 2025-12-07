export class Ajax {

    #options = {
        baseUrl: "",
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 5000
    };

    constructor(options) {
        this.#options = this.#mergeOptions(options);
    }

    #mergeOptions (options = {}) {
        return {
            ...this.#options,
            ...options,
            headers: {
                ...this.#options.headers,
                ...(options.headers || {})
            }
        }
    }

    async request(method, url, body=null,  options={}) {
        const mergedOptions = this.#mergeOptions(options)
        const fullUrl = mergedOptions.baseUrl + url;

        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), mergedOptions.timeout)

        try {
            const res = await fetch(fullUrl, {
                method: method,
                headers: mergedOptions.headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            });
            clearTimeout(id)

            if (!res.ok) throw new Error(`Error ${res.status}`);

            if (res.status === 204) {
                return null;
            }
            const data = await res.json();
            return data;
        }
        catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw err;
        }
    }

    async get(url, options) {
        return this.request("GET", url, null, options)
    }

    async post(url, data, options) {
        return this.request("POST", url, data, options)
    }

    async put(url, data, options) {
        return this.request("PUT", url, data, options)
    }

    async delete(url, options) {
        return this.request("DELETE", url, null, options)
    }
}