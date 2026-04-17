// secret-panel-88/changelog/[id]/page.tsx
'use client'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'
import { useFetchOneChangelog } from '@/hooks/admin/useAdminChangelog'
import { formatDate } from '@/lib/dateFormatter'
import { AdminSpinner } from '@/components/Spinner'



export default function ViewChangelogPage() {
    usePageTitle('View Changelog - Admin')
    const router = useRouter()
    const params = useParams()
    const changelogId = params.changelogid as string
    //console.log(changelogId)


    const getTypeColor = (type: string) => {
        switch (type) {
            case 'feature': return 'bg-green-900/50 text-green-400'
            case 'bugfix': return 'bg-red-900/50 text-red-400'
            case 'improvement': return 'bg-blue-900/50 text-blue-400'
            case 'security': return 'bg-yellow-900/50 text-yellow-400'
            default: return 'bg-slate-800 text-slate-400'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'feature': return '✨'
            case 'bugfix': return '🐛'
            case 'improvement': return '⚡'
            case 'security': return '🔒'
            default: return '📝'
        }
    }

    // Markdown components configuration
    const markdownComponents: Components = {
        h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold text-white mt-6 mb-3 border-b border-slate-700 pb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-medium text-white mt-4 mb-2">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>,
        li: ({ children }) => <li className="text-slate-300 text-sm">{children}</li>,
        p: ({ children }) => <p className="text-slate-300 text-sm mb-3">{children}</p>,
        code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
                return <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 text-xs">{children}</code>
            }
            return <code className="block bg-slate-900 p-3 rounded-lg text-amber-400 text-xs overflow-x-auto">{children}</code>
        },
        pre: ({ children }) => <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto">{children}</pre>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-700 pl-4 italic text-slate-400">{children}</blockquote>,
        a: ({ children, href }) => <a href={href} className="text-amber-500 hover:text-amber-400 underline">{children}</a>,
        table: ({ children }) => (
            <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-slate-700">
                    {children}
                </table>
            </div>
        ),
        th: ({ children }) => <th className="border border-slate-700 px-3 py-2 text-left text-white">{children}</th>,
        td: ({ children }) => <td className="border border-slate-700 px-3 py-2 text-slate-300">{children}</td>,
    }

    const { data: changelog, isLoading } = useFetchOneChangelog(changelogId)
    // //console.log(changelog)

    return (
        // <></>

        <div className="min-h-screen bg-slate-950 p-6">
            {/* Header */}
            {isLoading ? <AdminSpinner />
                :
                <div>
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Link
                                    href="/secret-panel-88/changelog"
                                    className="text-slate-400 hover:text-amber-700 transition-colors text-sm mb-2 inline-block"
                                >
                                    ← Back to Changelog
                                </Link>
                                <h1 className="text-2xl font-semibold text-white">Changelog Details</h1>
                                <p className="text-sm text-slate-400 mt-1">View version release information</p>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={`/secret-panel-88/changelog/${changelog?.id}/edit`}
                                    className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-900 transition-colors"
                                >
                                    Edit Release
                                </Link>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this changelog entry?')) {
                                            router.push('/secret-panel-88/changelog')
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg text-sm font-medium hover:bg-red-900/70 transition-colors"
                                >
                                    Delete Release
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Changelog Content */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                            {/* Header Section */}
                            <div className="p-6 border-b border-slate-800">
                                <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(changelog?.releaseType)}`}>
                                    <span>{getTypeIcon(changelog?.releaseType)}</span>
                                    <span>{changelog?.releaseType.charAt(0).toUpperCase() + changelog?.releaseType.slice(1)}</span>
                                </span>
                                {/* <span className="text-sm text-slate-500">{changelog.createdAt}</span> */}
                                <div className="mt-2">
                                    {changelog?.isPublished ? (
                                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs bg-green-900/50 text-green-400">
                                            <span>●</span>
                                            <span>Published</span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs bg-yellow-900/50 text-yellow-400">
                                            <span>●</span>
                                            <span>Draft</span>
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl font-bold text-white mb-2 mt-4">
                                    v{changelog?.version}: {changelog?.title}
                                </h1>

                                <div className="flex items-center space-x-4 text-sm text-slate-400">
                                    <div className="flex items-center space-x-1">
                                        <span>📦</span>
                                        <span>Version {changelog?.version}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span>🆔</span>
                                        <span>ID: #{changelog?.id}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Changes Section with Markdown */}
                            <div className="p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Release Notes:-</h2>
                                <div className="bg-slate-800/50 rounded-lg p-4 prose prose-invert max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {changelog?.content}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Meta Information */}
                            <div className="p-6 border-t border-slate-800 bg-slate-800/30">
                                <h3 className="text-sm font-medium text-white mb-3">Additional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-400">Release Date:</span>
                                        <p className="text-white mt-1">{formatDate(changelog?.createdAt, 'long')}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Updated:</span>
                                        <p className="text-white mt-1">{formatDate(changelog?.updatedAt, 'long')}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Release Type:</span>
                                        <p className="text-white mt-1 capitalize">{changelog?.releaseType}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Version Code:</span>
                                        <p className="text-white mt-1 font-mono">v{changelog?.version}</p>
                                    </div>
                                    {/* <div>
                                <span className="text-slate-400">Entry ID:</span>
                                <p className="text-white mt-1">#{changelog?.id}</p>
                            </div> */}
                                    {/* <div>
                                <span className="text-slate-400">Status:</span>
                                <p className="text-white mt-1 capitalize">{changelog?.isPublished ? 'Published' : 'Draft'}</p>
                            </div> */}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t border-slate-800 flex justify-between">
                                <Link
                                    href="/secret-panel-88/changelog"
                                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                                >
                                    ← Back to List
                                </Link>
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/secret-panel-88/changelog/${changelog?.id}/edit`}
                                        className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm hover:bg-amber-900 transition-colors"
                                    >
                                        Edit Release
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}