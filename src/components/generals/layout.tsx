import type { FC, ReactNode } from 'react'
import type { LayoutProps } from '@/types'

export const Layout: FC<LayoutProps> = ({ children }): ReactNode => {
    return (
        <div className='flex min-h-screen flex-col'>
            <main className='flex-1'>
                {children}
            </main>
        </div>
    )
}