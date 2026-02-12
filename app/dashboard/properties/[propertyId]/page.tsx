"use client"
import Navbar from '@/components/Navbar'
import Spinner from '@/components/Spinner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFetchOneProperty } from '@/hooks/useProperty'
import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'

export default function SinglePropertyPage() {

    const params = useParams()
    const propertyId = params.propertyId as string

    if (!propertyId) {
        notFound()
    }

    const { data, isLoading, error } = useFetchOneProperty(propertyId)
    console.log(data)


    usePageTitle(`${data?.name} - Denly`)

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            {isLoading ?
                <Spinner />
                :

                <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                    <div className="max-w-6xl mx-auto">

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                            <div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                    <Link href="/dashboard/properties" className="hover:text-[#876D4A] transition-colors">Properties</Link>
                                    <span>›</span>
                                    <span>{data?.name}</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">{data?.name}</h1>
                                <p className="text-gray-600">{data?.address}</p>
                            </div>
                            <div className="flex space-x-3">
                                <Link href={`/dashboard/properties/${data?.id}/edit`}>
                                    <button className="border border-[#876D4A] text-[#876D4A] px-4 py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                        Edit Property
                                    </button>
                                </Link>

                                <Link href="/dashboard/payments/new">
                                    <button className="bg-[#876D4A] text-white px-4 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm">
                                        Record Payment
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            <div className="lg:col-span-2 space-y-8">

                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h2 className="font-serif text-xl text-gray-900 mb-6">Property Overview</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Type</p>
                                            <p className="font-medium text-gray-900">{data?.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Bedrooms</p>
                                            <p className="font-medium text-gray-900">{data?.bedrooms}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Bathrooms</p>
                                            <p className="font-medium text-gray-900">{data?.bathrooms}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Square Feet</p>
                                            <p className="font-medium text-gray-900">{data?.squareMeter}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm mb-2">Description</p>
                                        <p className="text-gray-900">{data?.description}</p>
                                    </div>
                                    <div className="mt-6">
                                        <p className="text-gray-600 text-sm mb-2">Features</p>
                                        <div className="flex flex-wrap gap-2">
                                            {data?.features.map((feature: any) => (
                                                <span key={data?.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="font-serif text-xl text-gray-900">Current Tenant</h2>
                                        <span className={`px-3 py-1 rounded-full text-sm ${data?.tenants?.length > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {data?.tenants?.length > 0 ? 'Occupied' : 'Vacant'}
                                        </span>
                                    </div>
                                    {data?.tenants.map((tenants: any) => (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-b pb-3">
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Tenant Name</p>
                                                <p className="font-medium text-gray-900">{tenants.firstName + ' ' + tenants.lastName}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Email</p>
                                                <p className="font-medium text-gray-900">{tenants.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Phone</p>
                                                <p className="font-medium text-gray-900">{tenants.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">Lease Period</p>
                                                <p className="font-medium text-gray-900">{new Date(tenants.leaseStart).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} to {new Date(tenants.leaseEnd).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="space-y-6">

                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-serif text-lg text-gray-900 mb-4">Financial Overview</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Monthly Rent</p>
                                            <p className="text-2xl font-bold text-[#876D4A]">${data?.monthlyRent}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Next Payment Due</p>
                                            <p className="font-medium text-gray-900">2024-02-01</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Payment History</p>
                                            <p className="font-medium text-gray-900">12 months on time</p>
                                        </div>
                                    </div>
                                </div>


                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="font-serif text-lg text-gray-900 mb-4">Recent Activity</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Last Payment</span>
                                            <span className="font-medium text-gray-900">2024-01-15</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}