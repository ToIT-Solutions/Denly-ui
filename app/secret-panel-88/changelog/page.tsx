// app/admin/changelog/page.jsx
'use client'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useState } from 'react'

export default function ChangelogPage() {
    usePageTitle('Changelog - Admin')

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        version: '',
        date: '',
        title: '',
        changes: '',
        type: 'feature' // feature, bugfix, improvement, security
    })

    // Mock changelog data - replace with API calls
    const [changelogs, setChangelogs] = useState([
        {
            id: 1,
            version: '2.1.0',
            date: '2024-01-15',
            title: 'Advanced Analytics Dashboard',
            changes: 'Added real-time analytics dashboard with property performance metrics\nImproved payment processing speed\nFixed mobile responsiveness issues',
            type: 'feature'
        },
        {
            id: 2,
            version: '2.0.5',
            date: '2024-01-10',
            title: 'Bug Fixes & Performance',
            changes: 'Fixed login issues on Safari\nImproved dashboard load times\nResolved payment gateway timeout errors',
            type: 'bugfix'
        },
        {
            id: 3,
            version: '2.0.0',
            date: '2024-01-01',
            title: 'Major Release - Tenant Management',
            changes: 'Complete tenant management system\nAutomated rent collection\nDocument storage for leases\nMobile app beta release',
            type: 'feature'
        }
    ])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingId) {
            // Update existing changelog
            setChangelogs(changelogs.map(log =>
                log.id === editingId ? { ...formData, id: editingId } : log
            ))
            setEditingId(null)
        } else {
            // Add new changelog
            const newChangelog = {
                ...formData,
                id: Date.now(),
                date: new Date().toISOString().split('T')[0]
            }
            setChangelogs([newChangelog, ...changelogs])
        }
        setShowForm(false)
        setFormData({ version: '', date: '', title: '', changes: '', type: 'feature' })
    }

    const handleEdit = (changelog: any) => {
        setFormData(changelog)
        setEditingId(changelog.id)
        setShowForm(true)
    }

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this changelog entry?')) {
            setChangelogs(changelogs.filter(log => log.id !== id))
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'feature': return 'bg-green-900/50 text-green-400'
            case 'bugfix': return 'bg-red-900/50 text-red-400'
            case 'improvement': return 'bg-blue-900/50 text-blue-400'
            case 'security': return 'bg-yellow-900/50 text-yellow-400'
            default: return 'bg-slate-800 text-slate-400'
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Changelog Manager</h1>
                    <p className="text-sm text-slate-400 mt-1">Track and manage version updates</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null)
                        setFormData({ version: '', date: '', title: '', changes: '', type: 'feature' })
                        setShowForm(!showForm)
                    }}
                    className="bg-amber-700 hover:bg-amber-950 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {showForm ? 'Cancel' : '+ New Release'}
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
                    <h2 className="text-lg font-medium text-white mb-4">
                        {editingId ? 'Edit Release' : 'Create New Release'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Version *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.version}
                                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                    placeholder="e.g., 2.1.0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Type *
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                >
                                    <option value="feature">✨ Feature</option>
                                    <option value="bugfix">🐛 Bug Fix</option>
                                    <option value="improvement">⚡ Improvement</option>
                                    <option value="security">🔒 Security</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A]"
                                placeholder="Brief title for this release"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Changes *
                            </label>
                            <textarea
                                required
                                rows={6}
                                value={formData.changes}
                                onChange={(e) => setFormData({ ...formData, changes: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#876D4A] font-mono"
                                placeholder="List the changes (one per line)..."
                            />
                            <p className="text-xs text-slate-500 mt-1">Separate multiple changes with new lines</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#876D4A] text-white rounded-lg text-sm hover:bg-[#756045] transition-colors"
                            >
                                {editingId ? 'Update Release' : 'Publish Release'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Changelogs List */}
            <div className="space-y-4">
                {changelogs.map((changelog) => (
                    <div key={changelog.id} className="bg-slate-900 rounded-lg border border-slate-800 p-6 hover:border-slate-700 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getTypeColor(changelog.type)}`}>
                                    {changelog.type.charAt(0).toUpperCase() + changelog.type.slice(1)}
                                </span>
                                <span className="text-lg font-semibold text-white">v{changelog.version}</span>
                                <span className="text-sm text-slate-500">{changelog.date}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(changelog)}
                                    className="text-slate-400 hover:text-[#876D4A] transition-colors text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(changelog.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <h3 className="text-base font-medium text-white mb-2">{changelog.title}</h3>
                        <div className="text-sm text-slate-400 whitespace-pre-wrap">
                            {changelog.changes}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}