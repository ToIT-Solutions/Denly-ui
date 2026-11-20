type IntentPayload = { tenantId: string; amountPaid: string | number; paymentMethod?: string }
type PendingIntent = { key: string; fingerprint: string }
const recoveryFlag = 'paymentPending'

export const paymentIntentScope = (companyId: string, actorId: string) =>
    JSON.stringify(['rent-payment-intent-v1', companyId, actorId])

// Use the same currency representation as the backend without floating-point conversion.
export async function preparePaymentIntent(scope: string, data: IntentPayload): Promise<PendingIntent> {
    try {
        const [whole, cents = ''] = String(data.amountPaid).split('.')
        const amount = whole.replace(/^0+(?=\d)/, '') + '.' + cents.padEnd(2, '0')
        const encoded = new TextEncoder().encode(JSON.stringify(['rent-payment-v1', data.tenantId, amount, data.paymentMethod]))
        const digest = await crypto.subtle.digest('SHA-256', encoded)
        const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')

        // Read after hashing so two clicks in the same tab converge on the saved key.
        const stored = sessionStorage.getItem(scope)
        if (stored) {
            const intent: PendingIntent = JSON.parse(stored)
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(intent.key)) {
                throw new Error('Invalid saved payment key')
            }
            if (intent.fingerprint !== fingerprint) {
                throw new Error('Payment details differ from the pending payment')
            }
            return intent
        }
        const url = new URL(window.location.href)
        if (url.searchParams.has(recoveryFlag)) throw new Error('Original payment key is missing')
        const intent = { key: crypto.randomUUID(), fingerprint }
        sessionStorage.setItem(scope, JSON.stringify(intent))
        // Keep a non-sensitive marker through reload even if session storage is later lost.
        url.searchParams.set(recoveryFlag, '1')
        window.history.replaceState(window.history.state, '', url)
        return intent
    } catch {
        throw new Error('Unable to use a saved payment request. Retry with the original details or reconcile payment history before submitting.')
    }
}

export function clearPaymentIntent(scope: string, key: string) {
    try {
        const stored = sessionStorage.getItem(scope)
        if (stored && JSON.parse(stored).key === key) {
            sessionStorage.removeItem(scope)
            const url = new URL(window.location.href)
            url.searchParams.delete(recoveryFlag)
            window.history.replaceState(window.history.state, '', url)
        }
    } catch {
        // A confirmed receipt stays successful. If the record survives, a retry replays it.
    }
}
