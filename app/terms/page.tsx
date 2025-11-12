// app/terms/page.jsx
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/img/logo.png'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Terms of Service - Denly',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f6f2] to-[#f0ede6]">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-linear-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-linear-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

            {/* Navigation */}
            <nav className="relative z-10 max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href="/">
                            <Image src={logo} alt='Denly Logo' className='w-29 cursor-pointer' />
                        </Link>
                    </div>
                    <div className="flex items-center space-x-8">
                        <Link href="/features" className="text-gray-600 hover:text-[#876D4A] transition-colors">Features</Link>
                        <Link href="/pricing" className="text-gray-600 hover:text-[#876D4A] transition-colors">Pricing</Link>
                        <Link href="/auth/login" className="text-gray-600 hover:text-[#876D4A] transition-colors">Login</Link>
                        <Link href="/auth/signup" className="border border-[#876D4A] text-[#876D4A] px-6 py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Terms Content */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-serif text-gray-800 mb-4">Terms of Service</h1>
                        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                        {/* Introduction */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">1. Agreement to Terms</h2>
                            <p className="mb-4">
                                Welcome to Denly. These Terms of Service ("Terms") govern your access to and use of our property management software and services ("Services"). By accessing or using our Services, you agree to be bound by these Terms.
                            </p>
                            <p>
                                If you are using our Services on behalf of an organization, you are agreeing to these Terms for that organization and promising that you have the authority to bind that organization to these Terms.
                            </p>
                        </div>

                        {/* Services */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">2. Our Services</h2>
                            <p className="mb-4">
                                Denly provides property management software that helps landlords and property managers track payments, manage properties, communicate with tenants, and generate financial reports.
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Property and tenant management tools</li>
                                <li>Payment tracking and processing</li>
                                <li>Financial reporting and analytics</li>
                                <li>Document storage and management</li>
                                <li>Communication features</li>
                            </ul>
                        </div>

                        {/* Accounts */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">3. User Accounts</h2>
                            <p className="mb-4">
                                You must create an account to access our Services. You are responsible for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Providing accurate and complete information</li>
                                <li>Maintaining the security of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Promptly notifying us of any unauthorized access</li>
                            </ul>
                        </div>

                        {/* Payments */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">4. Payments and Billing</h2>
                            <p className="mb-4">
                                Our Services are offered under various subscription plans. By subscribing, you agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Pay all applicable fees for your chosen plan</li>
                                <li>Provide valid payment information</li>
                                <li>Authorize us to charge your payment method</li>
                                <li>Understand that fees are non-refundable except as required by law</li>
                            </ul>
                        </div>

                        {/* Data Privacy */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">5. Data and Privacy</h2>
                            <p className="mb-4">
                                We take data privacy seriously. Our collection and use of personal information is governed by our Privacy Policy. You agree that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You have the right to share any data you provide to us</li>
                                <li>You will comply with applicable privacy laws</li>
                                <li>You will obtain necessary consents from tenants and other parties</li>
                            </ul>
                        </div>

                        {/* Intellectual Property */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">6. Intellectual Property</h2>
                            <p className="mb-4">
                                The Denly software, website, and all content are protected by intellectual property laws. We grant you a limited license to use our Services for your property management needs.
                            </p>
                            <p>
                                You retain all rights to the data you upload to our Services. We do not claim ownership of your property or tenant information.
                            </p>
                        </div>

                        {/* Termination */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">7. Termination</h2>
                            <p className="mb-4">
                                You may cancel your account at any time. We reserve the right to suspend or terminate your access to our Services if you violate these Terms.
                            </p>
                            <p>
                                Upon termination, you may lose access to your data. We recommend exporting your information before canceling your account.
                            </p>
                        </div>

                        {/* Disclaimer */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">8. Disclaimer of Warranties</h2>
                            <p className="mb-4">
                                Our Services are provided "as is" without warranties of any kind. While we strive to provide accurate and reliable services, we do not guarantee that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>The Services will be uninterrupted or error-free</li>
                                <li>The results obtained from using our Services will be accurate or reliable</li>
                                <li>The Services will meet your specific requirements</li>
                            </ul>
                        </div>

                        {/* Limitation of Liability */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">9. Limitation of Liability</h2>
                            <p>
                                To the fullest extent permitted by law, Denly shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">10. Contact Information</h2>
                            <p className="mb-4">
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">Email: legal@denly.com</p>
                                <p className="text-gray-700">Address: 123 Property Management Lane, Suite 100, San Francisco, CA 94102</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-8 mt-8">
                            <p className="text-sm text-gray-600">
                                By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}