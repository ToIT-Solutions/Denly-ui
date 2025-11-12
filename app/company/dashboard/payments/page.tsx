// app/app/[companyId]/payments/page.jsx
import Navbar from '@/components/Navbar'

export default function PaymentsPage() {
    const payments = [
        { id: 1, tenant: 'John Smith', property: 'Downtown Loft', amount: 2400, date: '2024-01-15', status: 'Paid', method: 'Bank Transfer' },
        { id: 2, tenant: 'Sarah Johnson', property: 'Garden Villa', amount: 3200, date: '2024-01-14', status: 'Paid', method: 'Credit Card' },
        { id: 3, tenant: 'Mike Chen', property: 'Riverside Apartment', amount: 2750, date: '2024-01-10', status: 'Overdue', method: 'Bank Transfer' },
        { id: 4, tenant: 'Emily Davis', property: 'Urban Suite', amount: 1800, date: '2024-01-05', status: 'Paid', method: 'Cash' },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2">Payments</h1>
                            <p className="text-gray-600">Track and manage rental payments</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* <select className="border border-gray-300 text-black outline-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm">
                                <option>All Status</option>
                                <option>Paid</option>
                                <option>Pending</option>
                                <option>Overdue</option>
                            </select> */}
                            <input
                                type="month"
                                className="border border-gray-300 text-black outline-0 placeholder-gray-400 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#876D4A] focus:border-[#876D4A] transition-colors text-sm"
                            />
                        </div>
                    </div>

                    {/* Payment Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {[
                            { title: 'Total Received', value: '$9,150', subtitle: 'This month' },
                            { title: 'Pending', value: '$2,750', subtitle: '1 payment' },
                            { title: 'Overdue', value: '$0', subtitle: 'All caught up' },
                            { title: 'Collection Rate', value: '92%', subtitle: 'This month' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                <div className="text-xl sm:text-2xl font-serif text-gray-900 mb-1">{stat.value}</div>
                                <p className="text-gray-500 text-xs">{stat.subtitle}</p>
                            </div>
                        ))}
                    </div>

                    {/* Payments List */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <h2 className="font-serif text-lg sm:text-xl text-gray-900">Recent Payments</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {payments.map((payment) => (
                                <div key={payment.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#876D4A] rounded-lg flex items-center justify-center text-white text-sm sm:text-base">
                                                💰
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm sm:text-base">{payment.tenant}</p>
                                                <p className="text-gray-600 text-xs sm:text-sm">{payment.property} • {payment.method}</p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-[#876D4A] font-medium text-lg sm:text-lg">${payment.amount}</p>
                                            <div className="flex items-center space-x-2 sm:justify-end mt-1">
                                                <p className="text-gray-600 text-xs sm:text-sm">{payment.date}</p>
                                                <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : payment.status === 'Overdue'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}