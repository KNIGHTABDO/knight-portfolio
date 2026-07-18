import type { FC, ReactNode } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const NotFound: FC = (): ReactNode => {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center px-6'>
            <Head>
                <title>404 — Lost in the arsenal | KNIGHT</title>
            </Head>

            <div className='glass-strong flex max-w-md flex-col items-center gap-4 rounded-[var(--radius-glass-xl)] p-10 text-center'>
                <span className='gx-chip gx-chip-accent font-mono'>404</span>
                <h1 className='font-display text-5xl font-extrabold tracking-tight text-ink'>Lost in the arsenal</h1>
                <p className='text-ink-secondary'>
                    This page shipped to another branch. Let&apos;s get you back to the main build.
                </p>
                <Link href='/' className='gx-btn gx-btn-primary mt-2'>
                    <ArrowLeft className='size-4' />
                    Back home
                </Link>
            </div>
        </main>
    )
}

export default NotFound
