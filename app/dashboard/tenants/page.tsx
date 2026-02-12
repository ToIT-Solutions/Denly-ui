"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllTenants } from '@/hooks/useTenant'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'

export default function TenantsPage() {
    usePageTitle("Tenants - Denly")

    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')

    const { data, isLoading, error } = useFetchAllTenants()
    console.log(data)

    const filteredTenants = useMemo(() => {
        if (!data) return []
        if (!searchQuery.trim()) return data

        const query = searchQuery.toLowerCase().trim()
        return data.filter((tenant: any) => {
            const searchableFields = [
                tenant.firstName,
                tenant.lastName,
                `${tenant.firstName} ${tenant.lastName}`,
                tenant.email,
                tenant.phone,
                tenant.property?.name,
                tenant.status,
                tenant.actualRent?.toString()
            ]
            return searchableFields.some(field =>
                field?.toString().toLowerCase().includes(query)
            )
        })
    }, [data, searchQuery])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
                <Navbar />
                <div className="pt-24 px-8 py-6">
                    <div className="max-w-6xl mx-auto flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-[#876D4A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading tenants...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Tenants</h1>
                            <p className="text-gray-600">Manage tenant information</p>
                            {data && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Total: {data.length} {data.length === 1 ? 'tenant' : 'tenants'}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/dashboard/tenants/add">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-[#876D4A] text-white px-6 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm"
                                >
                                    Add Tenant
                                </button>
                            </Link>

                            <input
                                type="text"
                                placeholder="Search tenants"
                                className="px-4 border text-black outline-0 placeholder-gray-400 border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors w-full sm:w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Search Results Info */}
                    {searchQuery && (
                        <div className="mb-4 text-sm text-gray-600">
                            Found {filteredTenants.length} {filteredTenants.length === 1 ? 'tenant' : 'tenants'} matching "{searchQuery}"
                        </div>
                    )}

                    {/* Tenants Table */}
                    {filteredTenants.length > 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="text-left p-6 font-serif text-gray-900">Tenant</th>
                                            <th className="text-left p-6 font-serif text-gray-900">Contact</th>
                                            <th className="text-left p-6 font-serif text-gray-900">Property</th>
                                            <th className="text-left p-6 font-serif text-gray-900">Rent</th>
                                            <th className="text-left p-6 font-serif text-gray-900">Status</th>
                                            {/* <th className="text-left p-6 font-serif text-gray-900">Actions</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTenants.map((tenant: any) => (
                                            <tr
                                                key={tenant.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                                onClick={() => router.push(`/dashboard/tenants/${tenant.id}`)}
                                            >
                                                <td className="p-6">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{tenant.firstName + ' ' + tenant.lastName}</p>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-gray-900">{tenant.email}</p>
                                                    <p className="text-gray-600 text-sm">{tenant.phone}</p>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-gray-900">{tenant.property?.name || '—'}</p>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-[#876D4A] font-medium">${tenant.actualRent}</p>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${tenant.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : tenant.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {tenant.status}
                                                    </span>
                                                </td>
                                                {/* <td className="p-6">
                                                    <div className="flex space-x-2">
                                                        <button className="text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-sm">
                                                            Message
                                                        </button>
                                                        <Link href='/dashboard/tenants/edit'>
                                                            <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm">
                                                                Edit
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* No Results State */
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                            {data?.length === 0 ? (
                                <>
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        👤
                                    </div>
                                    <h3 className="font-serif text-lg text-gray-900 mb-2">No tenants yet</h3>
                                    <p className="text-gray-600 mb-6">Get started by adding your first tenant</p>
                                    <Link href="/dashboard/tenants/add">
                                        <button className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer">
                                            Add Your First Tenant
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        🔍
                                    </div>
                                    <h3 className="font-serif text-lg text-gray-900 mb-2">No tenants found</h3>
                                    <p className="text-gray-600 mb-6">No tenants match your search criteria</p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer"
                                    >
                                        Clear Search
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}