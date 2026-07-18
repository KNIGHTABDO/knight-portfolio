export const CornerBrackets = ({ className = 'border-accent/40 group-hover:border-accent' }: { className?: string }) => {
    return (
        <>
            {/* Top Left */}
            <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-all duration-300 pointer-events-none ${className}`} />
            {/* Top Right */}
            <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r transition-all duration-300 pointer-events-none ${className}`} />
            {/* Bottom Left */}
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l transition-all duration-300 pointer-events-none ${className}`} />
            {/* Bottom Right */}
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-all duration-300 pointer-events-none ${className}`} />
        </>
    )
}
export default CornerBrackets
