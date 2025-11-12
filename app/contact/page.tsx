// app/(marketing)/contact/page.jsx
"use client"
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/img/logo.png'
import Footer from '@/components/Footer'

export default function ContactPage() {
    const contactMethods = [
        {
            icon: '💬',
            title: 'Chat Support',
            description: 'Get instant answers from our AI assistant',
            action: 'Start Chat',
            link: '#chat',
            available: '24/7',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: '📧',
            title: 'Email',
            description: 'Send us an email for detailed inquiries',
            action: 'hello@denly.com',
            link: 'mailto:hello@denly.com',
            available: '24-hour response',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: '📞',
            title: 'Schedule Call',
            description: 'Book a demo or consultation call',
            action: 'Book Now',
            link: 'https://calendly.com/denly/demo',
            available: 'Mon-Fri, 9AM-6PM EST',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: '🐦',
            title: 'Twitter/X',
            description: 'Quick questions and updates',
            action: '@denlyapp',
            link: 'https://twitter.com/denlyapp',
            available: 'Fast responses',
            color: 'from-black to-gray-800'
        }
    ]

    const faqs = [
        {
            question: "How do I get started with the free trial?",
            answer: "Just click 'Start Free Trial' on any page - no credit card required. You'll get full access to all features for 7 days."
        },
        {
            question: "What happens after my trial ends?",
            answer: "You can choose any paid plan that fits your needs. Your data is preserved when you upgrade."
        },
        {
            question: "Can I manage multiple properties?",
            answer: "Yes! Our plans scale from 3 properties (trial) up to unlimited properties for enterprise customers."
        },
        {
            question: "Do you offer discounts for multiple users?",
            answer: "Absolutely! Contact us for team pricing and custom enterprise solutions."
        }
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <Image src={logo} alt='denly Logo' className='w-24 sm:w-29' />
                    </Link>
                    <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
                        <Link href="/features" className="hidden sm:block text-gray-600 hover:text-[#876D4A] transition-colors text-sm">Features</Link>
                        <Link href="/pricing" className="text-gray-600 hover:text-[#876D4A] transition-colors text-sm">Pricing</Link>
                        {/* <Link href="/contact" className="text-[#876D4A] transition-colors text-sm">Contact</Link> */}
                        <Link href="/auth/login" className="hidden sm:block text-gray-600 hover:text-[#876D4A] transition-colors text-sm">Login</Link>
                        <Link href="/auth/signup" className="border border-[#876D4A] text-[#876D4A] px-4 py-2 sm:px-6 sm:py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors text-sm">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 text-center">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-4">Get in Touch</h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                    Choose the fastest way to get help. We're here to make property management easier for you.
                </p>
            </section>

            {/* Contact Methods */}
            <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contactMethods.map((method, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className={`w-12 h-12 bg-linear-to-br ${method.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                                    {method.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{method.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                                    <div className="flex items-center justify-between">
                                        <a
                                            href={method.link}
                                            className="text-[#876D4A] hover:text-[#756045] font-medium text-sm"
                                        >
                                            {method.action}
                                        </a>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {method.available}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-16">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600">Quick answers to common questions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-600 text-sm">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 mb-16 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <h2 className="text-2xl font-serif text-gray-800 mb-4">Ready to Simplify Property Management?</h2>
                    <p className="text-gray-600 mb-6">Start your free 7-day trial today. No credit card required.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/signup"
                            className="bg-[#876D4A] text-white px-8 py-3 rounded-full hover:bg-[#756045] transition-colors font-medium"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="/pricing"
                            className="border border-[#876D4A] text-[#876D4A] px-8 py-3 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors font-medium"
                        >
                            View Plans
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}