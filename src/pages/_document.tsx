import type { FC, ReactNode } from 'react'

import {
    Html,
    Head,
    Main,
    NextScript
} from 'next/document'

/** Applies the stored theme before first paint to avoid a flash. */
const themeBoot = `(function(){try{var m=localStorage.getItem('knight-theme');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-theme',m);}}catch(e){}})();`

const Document: FC = (): ReactNode => {
    return (
        <Html lang='en'>
            <Head>
                <link rel='icon' href='/favicon.png' type='image/png' />
                <link rel='icon' href='/favicon.ico' sizes='any' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <meta name='theme-color' content='#0e1211' media='(prefers-color-scheme: dark)' />
                <meta name='theme-color' content='#f5f3ee' media='(prefers-color-scheme: light)' />
                <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
                <noscript>
                    {/* Content must never stay hidden when JS is unavailable */}
                    <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
                </noscript>
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

export default Document
