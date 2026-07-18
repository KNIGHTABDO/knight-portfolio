import '@/styles/globals.css'

import type { FC, ReactNode } from 'react'
import type { AppProps } from 'next/app'

import { Bricolage_Grotesque, Geist, JetBrains_Mono } from 'next/font/google'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/hooks/use-theme'

const display = Bricolage_Grotesque({
    variable: '--font-display',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap'
})

const body = Geist({
    variable: '--font-body',
    subsets: ['latin'],
    display: 'swap'
})

const mono = JetBrains_Mono({
    variable: '--font-mono-code',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap'
})

const App: FC<AppProps> = ({ Component, pageProps }): ReactNode => {
    return (
        <ThemeProvider>
            <div className={cn(display.variable, body.variable, mono.variable, 'font-sans antialiased')}>
                <Component {...pageProps} />
            </div>
        </ThemeProvider>
    )
}

export default App
