import { GITHUB } from '@/constants/github'

const Footer = () => (
    <footer className='mx-auto mt-24 max-w-6xl px-5 pb-12 sm:px-8'>
        <div className='h-px bg-rule-strong' />
        <div className='mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between'>
            <div className='flex items-end gap-3'>
                <img src='/knight/blink.webp' alt='' width={34} height={50} className='h-12 w-auto' />
                <div>
                    <p className='font-display text-2xl leading-none'>knight</p>
                    <p className='mt-1 font-hand text-lg text-graphite-faint'>drawn by hand (well, by code) in Casablanca · {new Date().getFullYear()}</p>
                </div>
            </div>
            <p className='max-w-sm text-sm leading-6 text-graphite-faint'>
                The film up top is 192 pencil drawings made with the{' '}
                <a className='underline decoration-dotted underline-offset-4 hover:text-graphite' href='https://github.com/alesha-pro/tools/tree/main/skills/hand-drawn-canvas-animation' target='_blank' rel='noreferrer'>
                    hand-drawn-canvas-animation
                </a>{' '}
                skill. This site is{' '}
                <a className='underline decoration-dotted underline-offset-4 hover:text-graphite' href={`${GITHUB.profileUrl}/knight-portfolio`} target='_blank' rel='noreferrer'>
                    open source
                </a>
                , like everything else here.
            </p>
            <a href='#top' className='group flex items-end gap-2 font-hand text-xl text-graphite-soft hover:text-graphite'>
                back to the top
                <img src='/knight/crouch.webp' alt='' width={24} height={35} className='h-9 w-auto transition-transform duration-200 group-hover:-translate-y-2' />
            </a>
        </div>
    </footer>
)

export default Footer
