import type { FC, ReactNode } from 'react'
import type { LogoProps } from '@/types'

export const Logo: FC<LogoProps> = ({
    width = 64,
    height = 63,
    className
}): ReactNode => {
    return (
        <img
            src='/logo.webp'
            alt='Modulify'
            width={width}
            height={height}
            className={className}
        />
    )
}