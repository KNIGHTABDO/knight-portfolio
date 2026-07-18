export interface NavItem {
    id: string
    label: string
}

export const NAV_ITEMS: Array<NavItem> = [
    { id: 'about', label: 'About' },
    { id: 'stats', label: 'Stats' },
    { id: 'work', label: 'Work' },
    { id: 'arsenal', label: 'Arsenal' },
    { id: 'activity', label: 'Activity' },
    { id: 'connect', label: 'Connect' }
]

export const NAV_IDS = NAV_ITEMS.map((item) => item.id)
