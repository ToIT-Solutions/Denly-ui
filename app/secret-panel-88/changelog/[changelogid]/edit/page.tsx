// secret-panel-88/changelog/[id]/edit/page.tsx
'use client'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useFetchOneChangelog, useUpdateChangelog, useDeleteChangelog } from '@/hooks/admin/useAdminChangelog'
import { AdminSpinner } from '@/components/Spinner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

interface ChangelogFormData {
    version: string
    title: string
    content: string
    releaseType: string
    isPublished: boolean
}

const markdownComponents: Components = {
    h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold text-white mt-6 mb-3 border-b border-gray-200 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium text-white mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-md font-medium text-white mt-3 mb-2">{children}</h4>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>,
    li: ({ children }) => <li className="text-slate-400 text-sm">{children}</li>,
    p: ({ children }) => <p className="text-slate-400 text-sm mb-3 leading-relaxed">{children}</p>,
    code: ({ children, className }) => {
        const isInline = !className
        if (isInline) {
            return <code className="bg-gray-100 px-1 py-0.5 rounded text-amber-700 text-xs">{children}</code>
        }
        return <code className="block bg-gray-100 p-3 rounded-lg text-amber-700 text-xs overflow-x-auto">{children}</code>
    },
    pre: ({ children }) => <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">{children}</pre>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-700 pl-4 italic text-gray-500">{children}</blockquote>,
    a: ({ children, href }) => <a href={href} className="text-amber-700 hover:text-amber-800 underline">{children}</a>,
    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
    table: ({ children }) => (
        <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-gray-200">
                {children}
            </table>
        </div>
    ),
    th: ({ children }) => <th className="border border-gray-200 px-3 py-2 text-left text-slate-300 bg-gray-50">{children}</th>,
    td: ({ children }) => <td className="border border-gray-200 px-3 py-2 text-white">{children}</td>,
}

function getTypeColor(type: string): string {
    switch (type?.toLowerCase()) {
        case 'feature': return 'bg-green-100 text-green-800'
        case 'bugfix': return 'bg-red-100 text-red-800'
        case 'improvement': return 'bg-blue-100 text-blue-800'
        case 'security': return 'bg-yellow-100 text-yellow-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

function getTypeIcon(type: string): string {
    switch (type?.toLowerCase()) {
        case 'feature': return '✨'
        case 'bugfix': return '🐛'
        case 'improvement': return '⚡'
        case 'security': return '🔒'
        default: return '📝'
    }
}

function getTypeText(type: string): string {
    switch (type?.toLowerCase()) {
        case 'feature': return 'New Feature'
        case 'bugfix': return 'Bug Fix'
        case 'improvement': return 'Improvement'
        case 'security': return 'Security'
        default: return 'Update'
    }
}

export default function EditChangelogPage() {
    usePageTitle('Edit Changelog - Admin')
    const params = useParams()
    const router = useRouter()
    const changelogId = params.changelogid as string
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

    const { data: changelog, isLoading, error } = useFetchOneChangelog(changelogId)
    const { mutate: deleteChangelog, isPending: isDeleting } = useDeleteChangelog(changelogId)
    const { mutate: updateChangelog, isPending: isUpdating } = useUpdateChangelog()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<ChangelogFormData>({
        defaultValues: {
            version: '',
            title: '',
            content: '',
            releaseType: 'feature',
            isPublished: false
        }
    })

    const watchContent = watch('content')
    const watchReleaseType = watch('releaseType')
    const watchVersion = watch('version')
    const watchTitle = watch('title')
    const watchIsPublished = watch('isPublished')

    // Populate form when data is loaded
    useEffect(() => {
        if (changelog) {
            setValue('version', changelog.version)
            setValue('title', changelog.title)
            setValue('content', changelog.content)
            setValue('releaseType', changelog.releaseType)
            setValue('isPublished', changelog.isPublished)
        }
    }, [changelog, setValue])

    const onSubmit = async (data: ChangelogFormData) => {
        try {
            await updateChangelog({
                id: changelogId,
                data: { ...data }
            })
            router.push(`/secret-panel-88/changelog/${changelogId}`)
        } catch (error) {
            console.error('Error updating changelog:', error)
        }
    }

    const onDelete = () => {
        deleteChangelog()
    }

    if (error || !changelog) {
        return (
            <div className="min-h-screen bg-slate-950 p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-400 text-6xl mb-4">⚠️</div>
                        <p className="text-slate-400">Failed to load changelog entry</p>
                        <Link
                            href="/secret-panel-88/changelog"
                            className="mt-4 inline-block text-amber-700 hover:text-amber-600"
                        >
                            ← Back to Changelog
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href={`/secret-panel-88/changelog/${changelogId}`}
                    className="text-slate-400 hover:text-amber-700 transition-colors text-sm mb-2 inline-block"
                >
                    ← Back to Release
                </Link>
                <h1 className="text-2xl font-semibold text-white">Edit Release</h1>
                <p className="text-sm text-slate-400 mt-1">Update version information</p>
            </div>

            {/* Form */}
            {isLoading ?
                <AdminSpinner />
                :
                <div className="max-w-6xl mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Two Column Layout for Form and Preview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Form Fields */}
                            <div className="space-y-6">
                                <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
                                    {/* Version */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Version Number *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('version', {
                                                required: 'Version is required',
                                                pattern: {
                                                    value: /^\d+\.\d+\.\d+$/,
                                                    message: 'Version must be in format: 1.2.3'
                                                }
                                            })}
                                            className={`w-full bg-slate-800 border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 ${errors.version ? 'border-red-500' : 'border-slate-700'
                                                }`}
                                            placeholder="e.g., 1.0.0"
                                        />
                                        {errors.version && (
                                            <p className="text-xs text-red-500 mt-1">{errors.version.message}</p>
                                        )}
                                        <p className="text-xs text-slate-500 mt-1">
                                            Created: {new Date(changelog.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Release Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Release Type *
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { value: 'feature', label: 'Feature', icon: '✨', color: 'green' },
                                                { value: 'bugfix', label: 'Bug Fix', icon: '🐛', color: 'red' },
                                                { value: 'improvement', label: 'Improvement', icon: '⚡', color: 'blue' },
                                                { value: 'security', label: 'Security', icon: '🔒', color: 'yellow' }
                                            ].map((type) => (
                                                <button
                                                    key={type.value}
                                                    type="button"
                                                    onClick={() => setValue('releaseType', type.value)}
                                                    className={`p-3 rounded-lg border transition-all cursor-pointer ${watchReleaseType === type.value
                                                        ? `border-${type.color}-500 bg-${type.color}-900/20 text-${type.color}-400`
                                                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-200'
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{type.icon}</div>
                                                    <div className="text-sm font-medium">{type.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Release Title *
                                        </label>
                                        <input
                                            type="text"
                                            {...register('title', { required: 'Title is required' })}
                                            className={`w-full bg-slate-800 border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 ${errors.title ? 'border-red-500' : 'border-slate-700'
                                                }`}
                                            placeholder="e.g., Initial Release"
                                        />
                                        {errors.title && (
                                            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                                        )}
                                    </div>

                                    {/* Published Status */}
                                    <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                                        <input
                                            type="checkbox"
                                            id="isPublished"
                                            {...register('isPublished')}
                                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-700 focus:ring-amber-700 focus:ring-1"
                                        />
                                        <label htmlFor="isPublished" className="text-sm text-slate-300 cursor-pointer">
                                            Published
                                        </label>
                                        <p className="text-xs text-slate-500 ml-auto">
                                            {watchIsPublished ? 'Visible to users' : 'Saved as draft'}
                                        </p>
                                    </div>

                                    {/* Last Updated Info */}
                                    <div className="text-xs text-slate-500 text-right">
                                        Last updated: {new Date(changelog.updatedAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Content Editor with Preview Tabs */}
                            <div className="bg-slate-900 col-span-2 rounded-lg border border-slate-800 overflow-hidden">
                                {/* Tab Bar */}
                                <div className="flex border-b border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('edit')}
                                        className={`flex-1 px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${activeTab === 'edit'
                                            ? 'bg-slate-800 text-amber-700 border-b-2 border-amber-700'
                                            : 'text-slate-400 hover:text-slate-300'
                                            }`}
                                    >
                                        ✏️ Edit Content
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('preview')}
                                        className={`flex-1 px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${activeTab === 'preview'
                                            ? 'bg-slate-800 text-amber-700 border-b-2 border-amber-700'
                                            : 'text-slate-400 hover:text-slate-300'
                                            }`}
                                    >
                                        👁️ Preview
                                    </button>
                                </div>

                                {/* Edit Tab */}
                                {activeTab === 'edit' && (
                                    <div className="p-6">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Release Notes (Markdown) *
                                        </label>
                                        <textarea
                                            rows={30}
                                            {...register('content', { required: 'Release notes are required' })}
                                            className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 font-mono ${errors.content ? 'border-red-500' : 'border-slate-700'
                                                }`}
                                            placeholder={`### 🚀 Major Feature

## Features
- Added new dashboard
- Improved performance

## Bug Fixes
- Fixed login issue
- Resolved payment bug`}
                                        />
                                        {errors.content && (
                                            <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
                                        )}
                                        <p className="text-xs text-slate-500 mt-2">
                                            Supports Markdown formatting (headers, lists, code blocks, tables, etc.)
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                                            <span className="px-2 py-1 bg-slate-800 rounded">**bold**</span>
                                            <span className="px-2 py-1 bg-slate-800 rounded">*italic*</span>
                                            <span className="px-2 py-1 bg-slate-800 rounded"># Header</span>
                                            <span className="px-2 py-1 bg-slate-800 rounded">- list item</span>
                                            <span className="px-2 py-1 bg-slate-800 rounded">[link](url)</span>
                                            <span className="px-2 py-1 bg-slate-800 rounded">`code`</span>
                                        </div>
                                    </div>
                                )}

                                {/* Preview Tab */}
                                {activeTab === 'preview' && (
                                    <div className="p-6 text-white">
                                        <div className="mb-4 pb-3 border-b border-slate-700 ">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(watchReleaseType)}`}>
                                                    <span>{getTypeIcon(watchReleaseType)}</span>
                                                    <span>{getTypeText(watchReleaseType)}</span>
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">
                                                    <span>●</span>
                                                    <span>{watchIsPublished ? 'Published' : 'Draft'}</span>
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-serif font-bold text-white">
                                                v{watchVersion || '0.0.0'}: {watchTitle || 'Untitled'}
                                            </h2>
                                        </div>
                                        {watchContent ? (
                                            <div className="bg-slate-800 text-white rounded-lg p-6 max-h-[600px] overflow-y-auto">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={markdownComponents}
                                                >
                                                    {watchContent}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-800/50 rounded-lg p-12 text-center">
                                                <p className="text-slate-400 text-sm">No content to preview. Start writing in the Edit tab!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {isUpdating || isDeleting ?
                            <AdminSpinner />
                            :
                            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={onDelete}
                                    className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg text-sm hover:bg-red-900/70 transition-colors cursor-pointer"
                                >
                                    Delete Release
                                </button>
                                <div className="flex space-x-3">
                                    <Link
                                        href={`/secret-panel-88/changelog/${changelogId}`}
                                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        }
                    </form>
                </div>
            }
        </div>
    )
}