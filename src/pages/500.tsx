import type { FC, ReactNode } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { RotateCcw } from 'lucide-react'

const ServerError: FC = (): ReactNode => {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center px-6'>
            <Head>
                <title>500 — Build failed | KNIGHT</title>
            </Head>

            <div className='glass-strong flex max-w-md flex-col items-center gap-4 rounded-[var(--radius-glass-xl)] p-10 text-center'>
                <span className='gx-chip gx-chip-warn font-mono'>500</span>
                <h1 className='font-display text-4xl font-extrabold tracking-tight text-ink'>The build hit an exception</h1>
                <p className='text-ink-secondary'>
                    Something threw on the server. Give it another run — it usually recovers.
                </p>
                <Link href='/' className='gx-btn gx-btn-primary mt-2'>
                    <RotateCcw className='size-4' />
                    Back home
                </Link>
            </div>
        </main>
    )
}

export default ServerError
