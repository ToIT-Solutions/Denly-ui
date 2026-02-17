"use client"
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchAllProperties } from '@/hooks/useProperty'
import Link from 'next/link'
import { useState, useMemo } from 'react'

export default function PropertiesPage() {
    usePageTitle('Properties - Denly')
    // const properties = [
    //     { id: 1, name: 'Downtown Loft', address: '123 Main St, City', rent: 2400, status: 'Occupied', tenant: 'John Smith', image: '/property-1.jpg' },
    //     { id: 2, name: 'Garden Villa', address: '456 Oak Ave, Town', rent: 3200, status: 'Occupied', tenant: 'Sarah Johnson', image: '/property-2.jpg' },
    //     { id: 3, name: 'Urban Suite', address: '789 Pine Rd, Metro', rent: 1800, status: 'Vacant', tenant: '', image: '/property-3.jpg' },
    //     { id: 4, name: 'Riverside Apartment', address: '101 River Dr, Valley', rent: 2750, status: 'Occupied', tenant: 'Mike Chen', image: '/property-4.jpg' },
    //     { id: 5, name: 'Mountain View Condo', address: '202 Hilltop Blvd, Heights', rent: 2200, status: 'Occupied', tenant: 'Lisa Wang', image: '/property-5.jpg' },
    //     { id: 6, name: 'City Center Studio', address: '303 Urban Ln, Downtown', rent: 1500, status: 'Vacant', tenant: '', image: '/property-6.jpg' },
    // ]

    const { data, isLoading, error } = useFetchAllProperties()
    console.log(data)
    console.log(error)


    const [searchQuery, setSearchQuery] = useState('')

    const filteredProperties = useMemo(() => {
        if (!data) return []
        if (!searchQuery.trim()) return data

        const query = searchQuery.toLowerCase().trim()
        return data.filter((property: any) => {
            const searchableFields = [
                property.name,
                property.address,
                property.monthlyRent?.toString(),
                property.tenants?.firstName,
                property.tenants?.lastName,
                property.tenants?.length > 1 ? `${property.tenants?.length} tenants` : '',
                property.type
            ]
            return searchableFields.some(field =>
                field?.toString().toLowerCase().includes(query)
            )
        })
    }, [data, searchQuery])

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Properties</h1>
                            <p className="text-gray-600">Manage your property portfolio</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Search properties"
                                className="border text-black placeholder-gray-400 outline-0 border-gray-300 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm w-full sm:w-80"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {/* <select className="border border-gray-300 text-black outline-0 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm">
                                <option>All Status</option>
                                <option>Occupied</option>
                                <option>Vacant</option>
                                <option>Maintenance</option>
                            </select> */}
                        </div>
                    </div>

                    {isLoading ?
                        <Spinner />
                        :
                        <div>
                            {/* Property Stats */}
                            {data?.length > 0 ?
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                                    {[
                                        { title: 'Total Properties', value: data?.length || '0', subtitle: 'Portfolio size' },
                                        { title: 'Occupied', value: data?.filter((p: any) => p.tenants?.length > 0).length || '0', subtitle: `${Math.round((data?.filter((p: any) => p.tenants?.length > 0).length / data?.length) * 100) || 0}% occupancy` },
                                        { title: 'Vacant', value: data?.filter((p: any) => p.tenants?.length === 0).length || '0', subtitle: 'Ready to rent' },
                                        // { title: 'Monthly Revenue', value: `$${data?.reduce((acc: number, p: any) => acc + p.monthlyRent, 0) || 0}`, subtitle: 'Projected', trend: '+12%' }
                                    ].map((stat, index) => (
                                        <div key={index} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                            <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                            <div className="flex items-baseline space-x-2 mb-1">
                                                <span className="text-xl sm:text-2xl font-serif text-gray-900">{stat.value}</span>
                                            </div>
                                            <p className="text-gray-500 text-xs">{stat.subtitle}</p>
                                        </div>
                                    ))}
                                </div>
                                : null}

                            {/* Search Results Info */}
                            {searchQuery && (
                                <div className="mb-4 text-sm text-gray-600">
                                    Found {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} matching "{searchQuery}"
                                </div>
                            )}

                            {/* Properties Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProperties.map((property: any) => (
                                    <div key={property.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                                        {/* Property Image */}
                                        <div className="h-48 bg-linear-to-br from-[#876D4A] to-[#9D7F55] rounded-t-2xl flex items-center justify-center text-white">
                                            <div className="text-center">
                                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                                                    🏠
                                                </div>
                                                <p className="text-white/80 text-sm">Property Image</p>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-6">
                                            {/* Property Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-serif text-lg sm:text-xl text-gray-900 mb-1 group-hover:text-[#876D4A] transition-colors">
                                                        {property.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">{property.address}</p>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${property.tenants?.length > 0
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {property.tenants?.length > 0 ? 'Occupied' : 'Vacant'}
                                                </span>
                                            </div>

                                            {/* Property Details */}
                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Monthly Rent</span>
                                                    <span className="text-[#876D4A] font-medium">${property.monthlyRent}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">{property.tenants?.length > 1 ? 'Current Tenants' : 'Current Tenant'}</span>
                                                    <span className="text-gray-900 text-sm">
                                                        {property.tenants?.length > 1 ?
                                                            property.tenants?.length + ' tenants' :
                                                            property.tenants?.length === 1 ?
                                                                property.tenants[0].firstName + ' ' + property.tenants[0].lastName :
                                                                property.tenants?.length === 0 ?
                                                                    'No tenant' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 text-sm">Property Type</span>
                                                    <span className="text-gray-900 text-sm">Residential</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex space-x-3 pt-4 border-t border-gray-100">
                                                <Link
                                                    href={`/dashboard/properties/${property.id}`}
                                                    className="flex-1 bg-[#876D4A] text-white py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm text-center"
                                                >
                                                    View Details
                                                </Link>

                                                {/* <Link href="/dashboard/properties/single/edit"> */}
                                                <Link
                                                    href="/dashboard/properties/single/edit"
                                                    className="flex-1 border border-[#876D4A] text-[#876D4A] py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm text-center">
                                                    Edit
                                                </Link>
                                                {/* </Link> */}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No Results State (for when search returns nothing) */}
                            {filteredProperties.length === 0 && data?.length > 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        🔍
                                    </div>
                                    <h3 className="font-serif text-lg text-gray-900 mb-2">No properties found</h3>
                                    <p className="text-gray-600 mb-6">No properties match your search criteria</p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}

                            {/* Empty State (for when no properties) */}
                            {data?.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        🏠
                                    </div>
                                    <h3 className="font-serif text-lg text-gray-900 mb-2">No properties yet</h3>
                                    <p className="text-gray-600 mb-6">Get started by adding your first property</p>
                                    <Link href={'/dashboard/properties/add'}>
                                        <button className="bg-[#876D4A] text-white px-6 py-3 rounded-lg hover:bg-[#756045] transition-colors cursor-pointer">
                                            Add Your First Property
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}