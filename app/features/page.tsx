// app/(marketing)/features/page.jsx
import Footer from '@/components/Footer'
import Link from 'next/link'
import logo from '@/public/img/logo.png'
import Image from 'next/image'

export const metadata = {
    title: 'Features - Denly | Property Management Software',
    description: 'Stop using spreadsheets and sticky notes. Denly helps you track payments, manage tenants, and keep everything organized in one place.',
}

export default function FeaturesPage() {
    const features = [
        {
            category: '💰 Simplify Rent Collection',
            headline: 'Get paid on time, every time',
            description: 'Stop chasing payments and start knowing exactly when money hits your account.',
            painPoints: [
                'Manually tracking who has paid',
                'Late payments messing up your cash flow',
                'Spreadsheets that never quite work'
            ],
            items: [
                {
                    title: 'Clear Payment Tracking',
                    description: 'See at a glance which tenants have paid and who is overdue.',
                    benefit: 'Know your cash position in seconds',
                    icon: '⚡'
                },
                {
                    title: 'Late Payment Alerts',
                    description: 'Get notified automatically when rent is overdue. No more checking manually.',
                    benefit: 'Stop chasing tenants',
                    icon: '🔔'
                },
                {
                    title: 'Lease Renewal Reminders',
                    description: 'Get reminded before leases end so you can plan renewals or find new tenants.',
                    benefit: 'Never miss a lease end date',
                    icon: '📅'
                }
            ]
        },
        {
            category: '🏢 Better Tenant Management',
            headline: 'Keep your properties full with organized records',
            description: 'Good tenants are easier to keep when you have all their information in one place.',
            painPoints: [
                'Losing lease agreements and documents',
                'Forgetting when leases end',
                'No central place for tenant info'
            ],
            items: [
                {
                    title: 'Document Storage',
                    description: 'Store leases, IDs, and agreements securely. Access from anywhere.',
                    benefit: 'Stop digging through email',
                    icon: '📁'
                },
                {
                    title: 'Tenant Status Tracking',
                    description: 'Track active, pending, or past tenants. Know who is in each property.',
                    benefit: 'Stay organized as you grow',
                    icon: '👥'
                },
                {
                    title: 'Custom Due Dates',
                    description: 'Set your rent due date. Everything adapts to how you work.',
                    benefit: 'Software that fits your business',
                    icon: '⚙️'
                }
            ]
        },
        {
            category: '👥 Manage Your Team',
            headline: 'Give access without giving away control',
            description: 'Whether you have a partner, accountant, or maintenance team.',
            painPoints: [
                'Worried about giving out passwords',
                'Team members seeing too much',
                'No audit trail of who did what'
            ],
            items: [
                {
                    title: 'Role-Based Access',
                    description: 'Control what each team member can see and do. Give them only what they need.',
                    benefit: 'Hire help without security risks',
                    icon: '🔐'
                },
                {
                    title: 'Invite Team Members',
                    description: 'Send invites and manage who has access to your company.',
                    benefit: 'Onboard in minutes',
                    icon: '👋'
                },
                {
                    title: 'Activity Logs',
                    description: 'Every important action is logged. See who did what and when.',
                    benefit: 'Full transparency',
                    icon: '📝'
                }
            ]
        },
        {
            category: '📊 Payment History & Reports',
            headline: 'Everything logged automatically',
            description: 'Rental income and payment history - all in one dashboard.',
            painPoints: [
                'Scrambling for records at tax time',
                'Not knowing who paid when',
                'Mixing personal and property finances'
            ],
            items: [
                {
                    title: 'Rental Income Overview',
                    description: 'See expected vs received payments across all properties.',
                    benefit: 'Spot problems early',
                    icon: '📈'
                },
                {
                    title: 'Payment History',
                    description: 'Every payment recorded. Filter by tenant, property, or date range.',
                    benefit: 'Tax season just got easier',
                    icon: '💳'
                },
                {
                    title: 'Financial Reports',
                    description: 'Generate clear reports showing rental income and payment history.',
                    benefit: 'Know your numbers',
                    icon: '📋'
                }
            ]
        },
        {
            category: '✨ Simple & Reliable',
            headline: 'Software that works the way you expect',
            description: 'No training required. No complicated workflows.',
            painPoints: [
                'Clunky outdated software',
                'Wasting time on complicated features',
                'Feeling frustrated every time you log in'
            ],
            items: [
                {
                    title: 'Works on Any Device',
                    description: 'Use Denly on your computer, tablet, or phone.',
                    benefit: 'Manage from anywhere',
                    icon: '📱'
                },
                {
                    title: 'Clean & Intuitive',
                    description: 'If you can send an email, you can use Denly.',
                    benefit: 'Start in minutes',
                    icon: '🎨'
                },
                {
                    title: 'Real Support',
                    description: 'Email support with real responses.',
                    benefit: 'Problems get solved',
                    icon: '💬'
                }
            ]
        }
    ]

    // Compact comparison table - just 6 key rows
    const comparisonRows = [
        { feature: 'Payment Tracking', denly: 'Automatic with alerts', other: 'Manual entry' },
        { feature: 'Lease Reminders', denly: 'Automatic notifications', other: 'You remember or you don\'t' },
        { feature: 'Late Payment Alerts', denly: 'Get notified automatically', other: 'You have to check' },
        { feature: 'Team Access', denly: 'Control what each person sees', other: 'Shared passwords' },
        { feature: 'Document Storage', denly: 'Centralized & secure', other: 'Lost in email' },
        { feature: 'Mobile Access', denly: 'Full functionality', other: 'Can\'t check on the go' }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6] relative">

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-6xl pt-5 mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex items-center justify-between flex-wrap">
                    <Link href="/" className="shrink-0">
                        <Image src={logo} alt="Denly Logo" className="w-24 sm:w-28" />
                    </Link>

                    <div className="flex space-x-4 sm:space-x-6 lg:space-x-8 items-center sm:mt-0">
                        <Link href="/features" className="text-[#876D4A] hover:text-[#876D4A] transition-colors text-sm sm:text-base font-medium">Features</Link>
                        <Link href="/pricing" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm sm:text-base">Pricing</Link>
                        <Link href="/auth/signup" className="border border-[#876D4A] text-[#876D4A] px-3 sm:px-6 py-1.5 sm:py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors text-sm sm:text-base font-medium">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-12 text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-3 sm:mb-4">Features</h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Everything you need to manage your properties, tenants, and payments in one place.
                </p>
            </section>

            {/* Simple Pain Point Banner */}
            <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-3 sm:p-4 text-center">
                    <p className="text-sm text-gray-500">
                        <span className="line-through decoration-red-400 mr-2">Spreadsheets</span>
                        <span className="line-through decoration-red-400 mr-2">Sticky notes</span>
                        <span className="line-through decoration-red-400">Email chaos</span>
                        <span className="text-green-600 ml-2 font-medium">→ Denly keeps it simple</span>
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                <div className="space-y-12 sm:space-y-16">
                    {features.map((category, categoryIndex) => (
                        <div key={categoryIndex} className="scroll-mt-20">
                            {/* Pain Points - clean and simple */}
                            <div className="mb-4 text-center text-sm text-gray-400">
                                {category.painPoints.map((pain, idx) => (
                                    <span key={idx} className="mx-2">← {pain}</span>
                                ))}
                            </div>

                            {/* Feature Card */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-center mb-6 sm:mb-8">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-gray-800 mb-2">{category.headline}</h2>
                                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">{category.description}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                                    {category.items.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="text-center group">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#876D4A] rounded-xl mx-auto mb-3 flex items-center justify-center text-xl sm:text-2xl group-hover:scale-105 transition-transform">
                                                {feature.icon}
                                            </div>
                                            <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{feature.title}</h3>
                                            <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{feature.description}</p>
                                            <div className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                                                ✓ {feature.benefit}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Compact Comparison Table */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 mb-2">Denly vs. Spreadsheets</h2>
                    <p className="text-sm text-gray-600">There's really no comparison</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {comparisonRows.map((row, idx) => (
                        <div key={idx} className={`grid grid-cols-3 ${idx !== comparisonRows.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="p-3 sm:p-4 text-gray-700 text-sm">{row.feature}</div>
                            <div className="p-3 sm:p-4 text-[#876D4A] font-medium text-sm bg-[#876D4A]/5">✓ {row.denly}</div>
                            <div className="p-3 sm:p-4 text-gray-400 text-sm">{row.other}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Small Trust Signals */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-xs text-gray-600">14-day free trial</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-xs text-gray-600">No credit card required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-xs text-gray-600">Month-to-month</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-xs text-gray-600">Real human support</span>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-20">
                <div className="bg-[#876D4A] rounded-2xl p-6 sm:p-8 text-white">
                    <h2 className="text-xl sm:text-2xl font-serif mb-2">Ready to get organized?</h2>
                    <p className="text-white/90 mb-4 sm:mb-5 text-sm">
                        Try Denly free for 14 days. No credit card required.
                    </p>
                    <Link href="/auth/signup" className="inline-block bg-white text-[#876D4A] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 transition-colors font-medium text-sm">
                        Start Free Trial →
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}