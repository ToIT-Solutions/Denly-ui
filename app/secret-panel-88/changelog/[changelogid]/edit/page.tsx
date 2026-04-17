// secret-panel-88/changelog/[id]/edit/page.tsx
'use client'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

interface ChangelogFormData {
    version: string
    title: string
    changes: string
    type: string
    isPublished: boolean
}

export default function EditChangelogPage() {
    usePageTitle('Edit Changelog - Admin')
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [originalDate, setOriginalDate] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm<ChangelogFormData>({
        defaultValues: {
            version: '',
            title: '',
            changes: '',
            type: 'feature',
            isPublished: false
        }
    })

    const watchChanges = watch('changes')
    const watchType = watch('type')

    useEffect(() => {
        const fetchChangelog = async () => {
            setLoading(true)
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500))

                // Mock data for ID 34
                const mockData = {
                    id: 34,
                    version: '3.4.0',
                    date: '2024-01-20',
                    title: 'Major Performance Update',
                    changes: 'Improved loading times by 40%\nAdded caching layer for API responses\nOptimized database queries\nReduced bundle size by 25%\nFixed memory leaks in dashboard',
                    type: 'improvement',
                    isPublished: true
                }

                // Set form values
                setValue('version', mockData.version)
                setValue('title', mockData.title)
                setValue('changes', mockData.changes)
                setValue('type', mockData.type)
                setValue('isPublished', mockData.isPublished)
                setOriginalDate(mockData.date)

                //console.log('Data loaded:', mockData)
            } catch (error) {
                console.error('Error fetching changelog:', error)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchChangelog()
        }
    }, [params.id, setValue])

    const onSubmit = async (data: ChangelogFormData) => {
        //console.log('Submitting:', data)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            //console.log('Updated changelog:', data)

            // Redirect to view page
            router.push(`/secret-panel-88/changelog/${params.id}`)
        } catch (error) {
            console.error('Error updating changelog:', error)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading changelog entry #{params.id}...</p>
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
                    href={`/secret-panel-88/changelog/${params.id}`}
                    className="text-slate-400 hover:text-amber-700 transition-colors text-sm mb-2 inline-block"
                >
                    ← Back to Release
                </Link>
                <h1 className="text-2xl font-semibold text-white">Edit Release</h1>
                <p className="text-sm text-slate-400 mt-1">Update version information</p>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-6">
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
                            placeholder="e.g., 2.1.0"
                        />
                        {errors.version && (
                            <p className="text-xs text-red-500 mt-1">{errors.version.message}</p>
                        )}
                        {originalDate && (
                            <p className="text-xs text-slate-500 mt-1">Originally released: {originalDate}</p>
                        )}
                    </div>

                    {/* Release Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Release Type *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { value: 'feature', label: 'Feature', icon: '✨', color: 'green' },
                                { value: 'bugfix', label: 'Bug Fix', icon: '🐛', color: 'red' },
                                { value: 'improvement', label: 'Improvement', icon: '⚡', color: 'blue' },
                                { value: 'security', label: 'Security', icon: '🔒', color: 'yellow' }
                            ].map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setValue('type', type.value)}
                                    className={`p-3 rounded-lg border transition-all ${watchType === type.value
                                        ? `border-${type.color}-500 bg-${type.color}-900/20 text-${type.color}-400`
                                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
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
                            placeholder="e.g., Advanced Analytics Dashboard"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Changes */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Changes / Release Notes *
                        </label>
                        <textarea
                            rows={8}
                            {...register('changes', { required: 'Changes are required' })}
                            className={`w-full bg-slate-800 border rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 font-mono ${errors.changes ? 'border-red-500' : 'border-slate-700'
                                }`}
                            placeholder="Added new feature X&#10;Fixed bug in Y&#10;Improved performance of Z"
                        />
                        {errors.changes && (
                            <p className="text-xs text-red-500 mt-1">{errors.changes.message}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">Separate multiple changes with new lines</p>
                    </div>

                    {/* Preview Section */}
                    {watchChanges && (
                        <div className="bg-slate-800/50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-white mb-2">Preview</h3>
                            <div className="space-y-1">
                                {watchChanges.split('\n').map((change, index) => (
                                    change.trim() && (
                                        <div key={index} className="flex items-start space-x-2 text-sm">
                                            <span className="text-amber-700 mt-0.5">•</span>
                                            <span className="text-slate-300">{change}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

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
                            {watch('isPublished') ? 'Visible to users' : 'Saved as draft'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this changelog entry?')) {
                                    router.push('/secret-panel-88/changelog')
                                }
                            }}
                            className="px-4 py-2 bg-red-900/50 text-red-400 rounded-lg text-sm hover:bg-red-900/70 transition-colors"
                        >
                            Delete Release
                        </button>
                        <div className="flex space-x-3">
                            <Link
                                href={`/secret-panel-88/changelog/${params.id}`}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}