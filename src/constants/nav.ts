export interface NavItem {
    id: string
    label: string
    chapter: string
    plain: string
}

export const NAV_ITEMS: Array<NavItem> = [
    { id: 'about', label: 'The Two Oaths', chapter: 'II. Oath', plain: 'About' },
    { id: 'stats', label: 'The Pulse Chronicle', chapter: 'III. Stats', plain: 'Stats' },
    { id: 'work', label: 'The Relic Chamber', chapter: 'IV. Relics', plain: 'Featured' },
    { id: 'arsenal', label: 'The Living Canopy', chapter: 'V. Canopy', plain: 'Arsenal' },
    { id: 'activity', label: 'The Deeds Scroll', chapter: 'VI. Deeds', plain: 'Activity' },
    { id: 'connect', label: 'The Summoning Gate', chapter: 'VII. Summon', plain: 'Connect' }
]

export const NAV_IDS = NAV_ITEMS.map((item) => item.id)
