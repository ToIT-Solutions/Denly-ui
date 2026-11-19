import Link from 'next/link'

// Never show cached record fields when the current request has failed.
export default function DetailUnavailable({ error, href, label }: { error?: unknown; href: string; label: string }) {
    const status = (error as { response?: { status?: number } })?.response?.status
    const title = status === 403 ? 'Access denied' : status === 404 || !error ? 'Record not found' : 'Unable to load record'
    return (
        <div role="alert" className="pt-28 px-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-serif text-gray-900">{title}</h1>
            <p className="my-4 text-gray-600">This record is unavailable. It may not exist or you may not have access.</p>
            <Link className="text-[#876D4A] underline" href={href}>Back to {label}</Link>
        </div>
    )
}
