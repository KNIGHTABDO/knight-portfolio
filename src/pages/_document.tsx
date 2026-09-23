import type { FC, ReactNode } from 'react'

import {
    Head,
    Html,
    Main,
    NextScript
} from 'next/document'

/** Chooses paper or night before first paint: stored choice, else the system. */
const themeBoot = `(function(){try{var m=localStorage.getItem('knight-theme');if(m!=='paper'&&m!=='night'){m=window.matchMedia('(prefers-color-scheme: dark)').matches?'night':'paper'}if(m==='night')document.documentElement.setAttribute('data-theme','night')}catch(e){}})();`

const Document: FC = (): ReactNode => {
    return (
        <Html lang='en'>
            <Head>
                <link rel='icon' href='/favicon.ico' sizes='any' />
                <link rel='icon' href='/favicon.png' type='image/png' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <meta name='theme-color' content='#f4efe4' />
                <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
                <noscript>
                    <style>{'.reveal{opacity:1 !important;transform:none !important}.draw-on path{stroke-dashoffset:0 !important}'}</style>
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
