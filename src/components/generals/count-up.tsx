import { compactNumber } from '@/lib/format'
import { useCountUp } from '@/hooks/use-interactions'

interface CountUpProps {
    value: number
    compact?: boolean
    suffix?: string
    className?: string
}

export const CountUp = ({ value, compact = false, suffix = '', className }: CountUpProps) => {
    const { ref, value: current } = useCountUp(value)

    return (
        <span ref={ref} className={className}>
            {compact ? compactNumber(current) : current.toLocaleString('en-US')}
            {suffix}
        </span>
    )
}
