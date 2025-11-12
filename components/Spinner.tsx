// components/GradientSpinner.jsx
interface GradientSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Spinner({ size = 'md' }: GradientSpinnerProps) {
    const sizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    return (
        <div className={`${sizeClasses[size]} animate-spin mx-auto`}>
            <div
                className="w-full h-full rounded-full"
                style={{
                    background: `conic-gradient(
                        from 0deg,
                        #5A452D,
                        #6B5438,
                        #7C6343,
                        #876D4A,
                        #987D52,
                        #A98D5A,
                        #BA9D62,
                        #CBAD6A,
                        #5A452D
                    )`
                }}
            />
        </div>
    )
}



export function BlockSpinner({ size = 'md' }: GradientSpinnerProps) {
    const sizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12'
    }

    return (
        <div className={`${sizeClasses[size]} animate-spin rounded-full mx-auto`}
            style={{
                background: `
                     conic-gradient(
                         from 0deg,
                         #5A452D 0deg 45deg,
                         #6B5438 45deg 90deg,
                         #7C6343 90deg 135deg,
                         #876D4A 135deg 180deg,
                         #987D52 180deg 225deg,
                         #A98D5A 225deg 270deg,
                         #BA9D62 270deg 315deg,
                         #CBAD6A 315deg 360deg
                     )
                 `
            }}>
        </div>
    )
}