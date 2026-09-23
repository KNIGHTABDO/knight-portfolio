import '@/styles/globals.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import {
    Aref_Ruqaa,
    Caveat,
    Instrument_Serif,
    JetBrains_Mono,
    Newsreader
} from 'next/font/google'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/hooks/use-theme'

const display = Instrument_Serif({
    variable: '--font-instrument',
    subsets: ['latin'],
    weight: '400',
    style: ['normal', 'italic'],
    display: 'swap'
})

const serif = Newsreader({
    variable: '--font-newsreader',
    subsets: ['latin'],
    style: ['normal', 'italic'],
    display: 'swap'
})

const hand = Caveat({
    variable: '--font-caveat',
    subsets: ['latin'],
    display: 'swap'
})

const mono = JetBrains_Mono({
    variable: '--font-jetbrains',
    subsets: ['latin'],
    weight: ['400', '500'],
    display: 'swap'
})

const arabic = Aref_Ruqaa({
    variable: '--font-ruqaa',
    subsets: ['arabic'],
    weight: ['400', '700'],
    display: 'swap'
})

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <ThemeProvider>
            <div className={cn(display.variable, serif.variable, hand.variable, mono.variable, arabic.variable, 'font-serif')}>
                <Component {...pageProps} />
            </div>
        </ThemeProvider>
    )
}

export default App
