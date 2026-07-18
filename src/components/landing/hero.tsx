import type { FC, ReactNode } from 'react'

import { Logo } from '@/components/landing/logo'
import { brand } from '@/constants/brand'

export const Hero: FC = (): ReactNode => {
    return (
        <div className='relative z-10 flex flex-col items-center gap-6'>
            <Logo width={56} height={55} />

            <div className='flex flex-col items-center gap-3'>
                <h1 className='text-4xl font-bold text-foreground tracking-tight'>
                    {brand.name}{' '}
                    <span className='text-[#FC8C04]'>Site</span>
                </h1>

                <p className='text-muted-foreground text-sm font-medium'>
                    {brand.tagline}
                </p>
            </div>
        </div>
    )
}