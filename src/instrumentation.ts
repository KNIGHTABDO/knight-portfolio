export const register = async () => {
    if (process.env.NEXT_RUNTIME !== 'nodejs') return

    const moduleName = 'node:http'
    const http = await import(moduleName)
    const proto = http.ServerResponse.prototype as any

    const normalizeCookie = (cookie: string) => {
        let next = cookie.replace(/;\s*SameSite\s*=\s*(Lax|Strict)/gi, '')

        if (!/;\s*SameSite\s*=/i.test(next)) next += '; SameSite=None'
        if (!/;\s*Secure(\s*;|\s*$)/i.test(next)) next += '; Secure'

        return next
    }

    const normalize = (value: unknown): unknown => {
        if (Array.isArray(value)) return value.map(item => typeof item === 'string' ? normalizeCookie(item) : item)
        if (typeof value === 'string') return normalizeCookie(value)

        return value
    }

    const isSetCookie = (name: unknown) => typeof name === 'string' && name.toLowerCase() === 'set-cookie'

    const originalSetHeader = proto.setHeader

    proto.setHeader = function (name: string, value: unknown) {
        if (isSetCookie(name)) value = normalize(value)

        return originalSetHeader.call(this, name, value)
    }

    if (typeof proto.appendHeader === 'function') {
        const originalAppendHeader = proto.appendHeader

        proto.appendHeader = function (name: string, value: unknown) {
            if (isSetCookie(name)) value = normalize(value)

            return originalAppendHeader.call(this, name, value)
        }
    }

    if (typeof proto.writeHead === 'function') {
        const originalWriteHead = proto.writeHead

        proto.writeHead = function (...args: any[]) {
            const headers = args[args.length - 1]

            if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
                for (const key of Object.keys(headers)) {
                    if (key.toLowerCase() === 'set-cookie') headers[key] = normalize(headers[key])
                }
            }

            return originalWriteHead.apply(this, args as any)
        }
    }
}
