// app/app/[companyId]/properties/[id]/page.jsx
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function SinglePropertyPage({ params }: { params: { id: string } }) {
    const property = {
        id: params.id,
        name: 'Downtown Loft',
        address: '123 Main Street, San Francisco, CA 94105',
        type: 'Apartment',
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        rent: 2400,
        status: 'Occupied',
        tenant: {
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1 (555) 123-4567',
            leaseStart: '2024-01-01',
            leaseEnd: '2024-12-31'
        },
        features: ['Parking', 'Laundry', 'Gym', 'Pool'],
        description: 'Beautiful modern loft in the heart of downtown with stunning city views and premium amenities.'
    }

    const paymentHistory = [
        { id: 1, date: '2024-01-15', amount: 2400, status: 'Paid', method: 'Bank Transfer' },
        { id: 2, date: '2023-12-15', amount: 2400, status: 'Paid', method: 'Bank Transfer' },
        { id: 3, date: '2023-11-15', amount: 2400, status: 'Paid', method: 'Credit Card' },
    ]

    const maintenanceRequests = [
        { id: 1, date: '2024-01-10', issue: 'Kitchen faucet leak', status: 'Completed', priority: 'Medium' },
        { id: 2, date: '2023-12-20', issue: 'HVAC maintenance', status: 'Scheduled', priority: 'Low' },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                        <div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                <Link href="/company/dashboard/properties" className="hover:text-[#876D4A] transition-colors">Properties</Link>
                                <span>›</span>
                                <span>{property.name}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">{property.name}</h1>
                            <p className="text-gray-600">{property.address}</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link href="/company/dashboard/properties/single/edit">
                                <button className="border border-[#876D4A] text-[#876D4A] px-4 py-2 rounded-2xl hover:bg-[#876D4A] hover:text-white transition-colors cursor-pointer text-sm">
                                    Edit Property
                                </button>
                            </Link>

                            <Link href="/company/dashboard/payments/new">
                                <button className="bg-[#876D4A] text-white px-4 py-2 rounded-2xl hover:bg-[#756045] transition-colors cursor-pointer text-sm">
                                    Record Payment
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Property Overview */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h2 className="font-serif text-xl text-gray-900 mb-6">Property Overview</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Type</p>
                                        <p className="font-medium text-gray-900">{property.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Bedrooms</p>
                                        <p className="font-medium text-gray-900">{property.bedrooms}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Bathrooms</p>
                                        <p className="font-medium text-gray-900">{property.bathrooms}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Square Feet</p>
                                        <p className="font-medium text-gray-900">{property.squareFeet.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm mb-2">Description</p>
                                    <p className="text-gray-900">{property.description}</p>
                                </div>
                                <div className="mt-6">
                                    <p className="text-gray-600 text-sm mb-2">Features</p>
                                    <div className="flex flex-wrap gap-2">
                                        {property.features.map((feature, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Current Tenant */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-serif text-xl text-gray-900">Current Tenant</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm ${property.status === 'Occupied'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {property.status}
                                    </span>
                                </div>
                                {property.tenant && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Tenant Name</p>
                                            <p className="font-medium text-gray-900">{property.tenant.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Email</p>
                                            <p className="font-medium text-gray-900">{property.tenant.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Phone</p>
                                            <p className="font-medium text-gray-900">{property.tenant.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">Lease Period</p>
                                            <p className="font-medium text-gray-900">{property.tenant.leaseStart} to {property.tenant.leaseEnd}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h3 className="font-serif text-lg text-gray-900 mb-4">Financial Overview</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-600 text-sm mb-1">Monthly Rent</p>
                                        <p className="text-2xl font-bold text-[#876D4A]">${property.rent.toLocaleString()}</p>
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

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h3 className="font-serif text-lg text-gray-900 mb-4">Recent Activity</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Last Payment</span>
                                        <span className="font-medium text-gray-900">2024-01-15</span>
                                    </div>
                                    {/* <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Maintenance</span>
                                        <span className="font-medium text-gray-900">2 open requests</span>
                                    </div> */}
                                    {/* <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Last Inspection</span>
                                        <span className="font-medium text-gray-900">2023-12-01</span>
                                    </div> */}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            {/* <div className="bg-white text-black rounded-2xl border border-gray-200 shadow-sm p-6">
                                <h3 className="font-serif text-lg text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer text-sm">
                                        Send Message to Tenant
                                    </button>
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer text-sm">
                                        Schedule Inspection
                                    </button>
                                    <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-[#876D4A] hover:bg-[#876D4A]/5 transition-colors cursor-pointer text-sm">
                                        Generate Lease Document
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}