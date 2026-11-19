// Sum API Decimal values as integer cents before converting at the display boundary.
export type Money = string | number

export const moneyCents = (value: Money): bigint => {
    const match = String(value).match(/^(-?)(\d+)(?:\.(\d{1,2}))?$/)
    if (!match) throw new Error('Invalid monetary value')
    const cents = BigInt(match[2]) * BigInt(100) + BigInt((match[3] || '').padEnd(2, '0'))
    return match[1] ? -cents : cents
}

export const sumMoney = (values: Money[]): number => {
    const cents = values.reduce((sum, value) => sum + moneyCents(value), BigInt(0))
    if (cents > BigInt(Number.MAX_SAFE_INTEGER) || cents < BigInt(Number.MIN_SAFE_INTEGER)) {
        throw new Error('Monetary total exceeds display range')
    }
    return Number(cents) / 100
}

export const formatMoney = (value: Money): string => {
    const cents = moneyCents(value)
    const absolute = cents < BigInt(0) ? -cents : cents
    return `${cents < BigInt(0) ? '-' : ''}${(absolute / BigInt(100)).toLocaleString('en-US')}.${String(absolute % BigInt(100)).padStart(2, '0')}`
}
