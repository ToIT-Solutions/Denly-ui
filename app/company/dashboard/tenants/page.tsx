"use client"
import Navbar from '@/components/Navbar'
import { usePageTitle } from '@/hooks/usePageTitle'
import Link from 'next/link'

export default function TenantsPage() {
    usePageTitle("Tenants - Denly")
    const tenants = [
        { id: 1, name: 'John Smith', email: 'john@email.com', phone: '(555) 123-4567', property: 'Downtown Loft', rent: 2400, status: 'Current' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(555) 234-5678', property: 'Garden Villa', rent: 3200, status: 'Current' },
        { id: 3, name: 'Mike Chen', email: 'mike@email.com', phone: '(555) 345-6789', property: 'Riverside Apartment', rent: 2750, status: 'Current' },
        { id: 4, name: 'Emily Davis', email: 'emily@email.com', phone: '(555) 456-7890', property: 'Urban Suite', rent: 1800, status: 'Past' },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-serif text-gray-900 mb-2">Tenants</h1>
                            <p className="text-gray-600">Manage tenant information and communications</p>
                        </div>

                        <div className='space-x-2'>
                            <Link href="/company/dashboard/tenants/add">
                                <button
                                    type="submit"
                                    className="bg-[#876D4A] text-white px-6 py-2 rounded-2xl hover:bg-[#756045] disabled:bg-gray-400 transition-colors cursor-pointer text-sm"
                                >
                                    Add Tenant
                                </button>
                            </Link>

                            <input
                                type="text"
                                placeholder="Search tenants..."
                                className="px-4 py-2 border text-black outline-0 placeholder-gray-400 border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors w-64"
                            />
                        </div>
                    </div>

                    {/* Tenants Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left p-6 font-serif text-gray-900">Tenant</th>
                                    <th className="text-left p-6 font-serif text-gray-900">Contact</th>
                                    <th className="text-left p-6 font-serif text-gray-900">Property</th>
                                    <th className="text-left p-6 font-serif text-gray-900">Rent</th>
                                    <th className="text-left p-6 font-serif text-gray-900">Status</th>
                                    <th className="text-left p-6 font-serif text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenants.map((tenant) => (
                                    // <Link href="/company/dashboard/tenants/view">
                                    <tr key={tenant.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <td className="p-6">
                                            <div>
                                                <p className="font-medium text-gray-900">{tenant.name}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-gray-900">{tenant.email}</p>
                                            <p className="text-gray-600 text-sm">{tenant.phone}</p>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-gray-900">{tenant.property}</p>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-[#876D4A] font-medium">${tenant.rent}</p>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-sm ${tenant.status === 'Current'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {tenant.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex space-x-2">
                                                <button className="text-[#876D4A] hover:text-[#756045] transition-colors cursor-pointer text-sm">
                                                    Message
                                                </button>
                                                <Link href='/company/dashboard/tenants/edit'>
                                                    <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-sm">
                                                        Edit
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    // </Link>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}