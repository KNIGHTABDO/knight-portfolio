import type { FC, ReactNode } from 'react'

import Link from 'next/link'

import { Seo } from '@/components/generals/seo'
import SketchBox from '@/components/sketch/sketch-box'

const NotFound: FC = (): ReactNode => (
    <>
        <Seo title='Empty square' description='This page moved like a knight.' />
        <main className='flex min-h-screen flex-col items-center justify-center px-6 text-center'>
            <div className='squared relative grid size-44 place-items-center'>
                <img src='/knight/look.webp' alt='The pencil knight, looking around' width={100} height={146} className='h-36 w-auto' />
            </div>
            <p className='mt-8 font-mono text-xs uppercase tracking-[0.22em] text-graphite-faint'>error 404 · empty square</p>
            <h1 className='mt-3 font-display text-6xl leading-none sm:text-7xl'>
                The knight <em className='italic'>moved.</em>
            </h1>
            <p className='mt-4 max-w-md font-hand text-2xl text-graphite-soft'>two forward, one to the side, and this page wasn&apos;t there any more.</p>
            <Link href='/' className='boil-hover relative mt-10 px-6 py-2.5 font-hand text-2xl text-graphite'>
                back to the board
                <SketchBox seed={9} width={2} />
            </Link>
        </main>
    </>
)

export default NotFound
