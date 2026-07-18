import type { ContribData } from '@/types/github'

import { formatDate } from '@/lib/format'

const LEVEL_LABEL = ['No', 'a little', 'some', 'a lot of', 'heavy'] as const

interface HeatmapProps {
    data: ContribData | null
    loading: boolean
}

export const ContributionHeatmap = ({ data, loading }: HeatmapProps) => {
    return (
        <div className='gx-card p-5 sm:p-6'>
            <div className='mb-4 flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <h3 className='font-display text-lg font-bold text-ink'>Contribution rhythm</h3>
                    <p className='text-sm text-ink-secondary'>
                        {data && data.total > 0
                            ? `${data.total.toLocaleString('en-US')} contributions in the last year`
                            : 'Public commit activity, last 12 months'}
                    </p>
                </div>
                <span className='gx-chip font-mono text-[11px]'>
                    <span className='gx-live-dot' /> live
                </span>
            </div>

            {loading && !data ? (
                <div className='gx-skeleton h-28 w-full' />
            ) : data ? (
                <div className='no-scrollbar overflow-x-auto pb-1'>
                    <div className='flex min-w-max gap-[3px]'>
                        {data.weeks.map((week, wi) => (
                            <div key={wi} className='flex flex-col gap-[3px]'>
                                {week.map((day) => (
                                    <div
                                        key={day.date}
                                        className='gx-heat-cell'
                                        data-level={day.level}
                                        title={`${formatDate(day.date)} · ${LEVEL_LABEL[day.level]} activity`}
                                        style={{ width: '13px' }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className='py-6 text-center text-sm text-ink-tertiary'>
                    Live activity is catching its breath — check the full graph on GitHub.
                </p>
            )}

            <div className='mt-4 flex items-center justify-end gap-2 text-xs text-ink-tertiary'>
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((lvl) => (
                    <span key={lvl} className='gx-heat-cell' data-level={lvl} style={{ width: '13px' }} />
                ))}
                <span>More</span>
            </div>
        </div>
    )
}
