import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { Seo } from '@/components/generals/seo'
import SketchBox from '@/components/sketch/sketch-box'

const ServerError: FC = (): ReactNode => (
    <>
        <Seo title='Skipped a beat' description='Something went wrong on the server.' />
        <main className='flex min-h-screen flex-col items-center justify-center px-6 text-center'>
            <svg viewBox='0 0 320 80' className='w-72 text-pink' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                <path d='M4 44 H70 l8 -6 8 6 H110 l6 6 8 -44 8 58 6 -14 H170 C180 44 190 40 200 44 H316' />
            </svg>
            <p className='mt-6 font-mono text-xs uppercase tracking-[0.22em] text-graphite-faint'>error 500</p>
            <h1 className='mt-3 font-display text-6xl leading-none sm:text-7xl'>
                Skipped <em className='italic'>a beat.</em>
            </h1>
            <p className='mt-4 max-w-md font-hand text-2xl text-graphite-soft'>the server had an arrhythmia. it usually recovers on its own.</p>
            <Link href='/' className='boil-hover relative mt-10 px-6 py-2.5 font-hand text-2xl text-graphite'>
                try the front page
                <SketchBox seed={12} width={2} />
            </Link>
        </main>
    </>
)

export default ServerError
