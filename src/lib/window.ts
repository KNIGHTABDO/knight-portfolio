export const getOrigin = (): string => {
    if (typeof window === 'undefined') return ''
    return window.location.origin
}