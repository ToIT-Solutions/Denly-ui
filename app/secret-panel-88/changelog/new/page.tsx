// secret-panel-88/changelog/create/page.tsx
'use client'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'
import { useCreateChangelog } from '@/hooks/admin/useAdminChangelog'
import { AdminSpinner } from '@/components/Spinner'

interface ChangelogFormData {
    version: string
    title: string
    content: string
    releaseType: string
    isPublished: boolean
}

export default function CreateChangelogPage() {
    usePageTitle('Create Changelog - Admin')
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm<ChangelogFormData>({
        defaultValues: {
            version: '',
            title: '',
            content: `## Added
- New feature 1
- New feature 2

## Changed
- Improved performance
- Updated UI components

## Fixed
- Bug fix 1
- Bug fix 2

## Removed
- Deprecated feature`,
            releaseType: 'feature',
            isPublished: false
        }
    })

    const watchChanges = watch('content')
    const watchType = watch('releaseType')

    const { mutate, isPending } = useCreateChangelog()

    const onSubmit = async (data: ChangelogFormData) => {
        //console.log('Creating:', data)
        mutate(data)
    }

    // Helper buttons to insert markdown
    const insertMarkdown = (syntax: string, placeholder: string) => {
        const textarea = textareaRef.current
        if (textarea) {
            const start = textarea.selectionStart
            const end = textarea.selectionEnd
            const text = watchChanges
            const selectedText = text.substring(start, end)
            const newText = text.substring(0, start) + syntax.replace(placeholder, selectedText || placeholder) + text.substring(end)
            setValue('content', newText)

            // Set focus back to textarea after state update
            setTimeout(() => {
                textarea.focus()
                const newCursorPos = start + syntax.length
                textarea.setSelectionRange(newCursorPos, newCursorPos)
            }, 10)
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

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/secret-panel-88/changelog"
                    className="text-slate-400 hover:text-amber-700 transition-colors text-sm mb-2 inline-block"
                >
                    ← Back to Changelog
                </Link>
                <h1 className="text-2xl font-semibold text-white">Create New Release</h1>
                <p className="text-sm text-slate-400 mt-1">Add a new version update with GitHub-style release notes</p>
            </div>

            {/* Form */}
            <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
                    {/* Version and Type Row */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
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
                                    message: 'Version must be in format: 1.2.3 (e.g., 2.1.0)'
                                }
                            })}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 ${errors.version ? 'border-red-500' : 'border-slate-700'
                                }`}
                            placeholder="e.g., 2.1.0"
                        />
                        {errors.version && (
                            <p className="text-xs text-red-500 mt-1">{errors.version.message}</p>
                        )}
                    </div>

                    {/* Release Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Release Type *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {[
                                { value: 'feature', label: 'Feature', icon: '✨' },
                                { value: 'bugfix', label: 'Bug Fix', icon: '🐛' },
                                { value: 'improvement', label: 'Improvement', icon: '⚡' },
                                { value: 'security', label: 'Security', icon: '🔒' }
                            ].map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setValue('releaseType', type.value)}
                                    className={`p-2 rounded-lg border transition-all cursor-pointer text-sm ${watchType === type.value
                                        ? 'border-amber-700 bg-amber-700/20 text-amber-400'
                                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-white'
                                        }`}
                                >
                                    <span className="mr-1">{type.icon}</span>
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* </div> */}

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
                            placeholder="e.g., Advanced Analytics Dashboard"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Markdown Toolbar */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Release Notes *
                        </label>

                        {/* Tabs */}
                        <div className="flex space-x-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setActiveTab('write')}
                                className={`px-3 py-1 text-sm rounded transition-colors cursor-pointer ${activeTab === 'write'
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Write
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('preview')}
                                className={`px-3 py-1 text-sm rounded transition-colors cursor-pointer ${activeTab === 'preview'
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Preview
                            </button>
                        </div>

                        {/* Toolbar - only show in write mode */}
                        {activeTab === 'write' && (
                            <div className="flex flex-wrap gap-2 mb-3 p-2 bg-slate-800 rounded-lg border border-slate-700">
                                <button type="button" onClick={() => insertMarkdown('# ', 'Heading')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">H1</button>
                                <button type="button" onClick={() => insertMarkdown('## ', 'Heading')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">H2</button>
                                <button type="button" onClick={() => insertMarkdown('### ', 'Heading')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">H3</button>
                                <div className="w-px h-6 bg-slate-600"></div>
                                <button type="button" onClick={() => insertMarkdown('**bold**', 'bold')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Bold</button>
                                <button type="button" onClick={() => insertMarkdown('*italic*', 'italic')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Italic</button>
                                <button type="button" onClick={() => insertMarkdown('`code`', 'code')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Code</button>
                                <div className="w-px h-6 bg-slate-600"></div>
                                <button type="button" onClick={() => insertMarkdown('- ', 'item')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Bullet</button>
                                <button type="button" onClick={() => insertMarkdown('1. ', 'item')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Numbered</button>
                                <button type="button" onClick={() => insertMarkdown('- [ ] ', 'task')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Task</button>
                                <div className="w-px h-6 bg-slate-600"></div>
                                <button type="button" onClick={() => insertMarkdown('```\ncode block\n```', 'code block')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Code Block</button>
                                <button type="button" onClick={() => insertMarkdown('> ', 'quote')} className="px-2 py-1 text-xs bg-slate-700 rounded hover:bg-slate-600 cursor-pointer">Quote</button>
                            </div>
                        )}

                        {/* Editor / Preview */}
                        {activeTab === 'write' ? (
                            <textarea
                                ref={textareaRef}
                                value={watchChanges}
                                onChange={(e) => setValue('content', e.target.value)}
                                rows={25}
                                className={`w-full bg-slate-800 border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 font-mono ${errors.content ? 'border-red-500' : 'border-slate-700'
                                    }`}
                                placeholder={`## Added
- New feature 1
- New feature 2

## Changed
- Improved performance
- Updated UI

## Fixed
- Bug fix 1
- Bug fix 2`}
                            />
                        ) : (
                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 min-h-[300px] prose prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={markdownComponents}
                                >
                                    {watchChanges || '*No content to preview*'}
                                </ReactMarkdown>
                            </div>
                        )}

                        {errors.content && (
                            <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                            Supports GitHub Flavored Markdown. Use the toolbar above for formatting.
                        </p>
                    </div>

                    {/* Published Status */}
                    <div className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                        <input
                            type="checkbox"
                            id="isPublished"
                            {...register('isPublished')}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-700 focus:ring-amber-700 focus:ring-1 cursor-pointer"
                        />
                        <label htmlFor="isPublished" className="text-sm text-slate-300 cursor-pointer">
                            Publish immediately
                        </label>
                        <p className="text-xs text-slate-500 ml-auto">
                            {watch('isPublished') ? 'Will be visible to users' : 'Will be saved as draft'}
                        </p>
                    </div>

                    {/* Actions */}
                    {isPending ? (
                        <AdminSpinner />
                    ) : (
                        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                            <Link
                                href="/secret-panel-88/changelog"
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="px-4 py-2 cursor-pointer bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Release
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}