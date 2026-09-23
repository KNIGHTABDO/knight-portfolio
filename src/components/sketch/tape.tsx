import { cn } from '@/lib/utils'

interface TapeProps {
    className?: string
    rotate?: number
}

/** A strip of translucent tape holding a card to the page. */
const Tape = ({ className, rotate = -4 }: TapeProps) => (
    <span aria-hidden='true' className={cn('tape z-20', className)} style={{ transform: `rotate(${rotate}deg)` }} />
)

export default Tape
