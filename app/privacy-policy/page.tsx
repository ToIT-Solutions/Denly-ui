// app/privacy/page.jsx
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/img/logo.png'
import Footer from '@/components/Footer'

export const metadata = {
    title: 'Privacy Policy - Denly',
}

export default function PrivacyPage() {
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

            {/* Privacy Content */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-3xl border border-gray-200 p-12 shadow-sm">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-serif text-gray-800 mb-4">Privacy Policy</h1>
                        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                        {/* Introduction */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">1. Introduction</h2>
                            <p className="mb-4">
                                At Denly, we are committed to protecting your privacy and the privacy of your tenants. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our property management software and services.
                            </p>
                            <p>
                                By using our Services, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access or use our Services.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-serif text-gray-800 mb-3">Personal Information</h3>
                            <p className="mb-4">We collect information that you voluntarily provide to us, including:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li>Account information (name, email, company details)</li>
                                <li>Property information (addresses, unit details, rental rates)</li>
                                <li>Tenant information (names, contact details, payment history)</li>
                                <li>Financial information (rent payments, expenses, bank details for payments)</li>
                                <li>Communication data (messages with tenants, support requests)</li>
                            </ul>

                            <h3 className="text-xl font-serif text-gray-800 mb-3">Automatically Collected Information</h3>
                            <p className="mb-4">When you use our Services, we automatically collect:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Device information (IP address, browser type, operating system)</li>
                                <li>Usage data (pages visited, features used, time spent)</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>

                        {/* How We Use Information */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">3. How We Use Your Information</h2>
                            <p className="mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Provide and maintain our Services</li>
                                <li>Process payments and manage billing</li>
                                <li>Send important notifications about your account</li>
                                <li>Improve and optimize our Services</li>
                                <li>Provide customer support</li>
                                <li>Detect and prevent fraud and security issues</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>

                        {/* Data Sharing */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">4. Data Sharing and Disclosure</h2>
                            <p className="mb-4">We do not sell your personal information. We may share your information with:</p>

                            <h3 className="text-xl font-serif text-gray-800 mb-3">Service Providers</h3>
                            <p className="mb-4">Trusted third parties who help us operate our Services, such as:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-6">
                                <li>Payment processors (Stripe, PayPal)</li>
                                <li>Cloud hosting providers (AWS, Google Cloud)</li>
                                <li>Customer support platforms</li>
                                <li>Analytics services</li>
                            </ul>

                            <h3 className="text-xl font-serif text-gray-800 mb-3">Legal Requirements</h3>
                            <p className="mb-4">We may disclose information when required by law or to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Comply with legal processes</li>
                                <li>Protect our rights and property</li>
                                <li>Prevent fraud or security issues</li>
                                <li>Protect the safety of our users</li>
                            </ul>
                        </div>

                        {/* Data Security */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">5. Data Security</h2>
                            <p className="mb-4">
                                We implement appropriate technical and organizational security measures to protect your information, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Encryption of data in transit and at rest</li>
                                <li>Regular security assessments and monitoring</li>
                                <li>Access controls and authentication</li>
                                <li>Secure data centers with physical security</li>
                            </ul>
                            <p className="mt-4">
                                While we take reasonable measures to protect your information, no method of transmission over the Internet or electronic storage is 100% secure.
                            </p>
                        </div>

                        {/* Your Rights */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">6. Your Data Rights</h2>
                            <p className="mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access and review your personal information</li>
                                <li>Correct inaccurate or incomplete data</li>
                                <li>Request deletion of your personal information</li>
                                <li>Export your data in a portable format</li>
                                <li>Object to or restrict certain processing</li>
                                <li>Withdraw consent where applicable</li>
                            </ul>
                            <p className="mt-4">
                                To exercise these rights, please contact us at privacy@denly.com.
                            </p>
                        </div>

                        {/* Data Retention */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">7. Data Retention</h2>
                            <p className="mb-4">
                                We retain your information for as long as necessary to provide our Services and fulfill the purposes described in this policy. We may also retain information to comply with legal obligations, resolve disputes, and enforce our agreements.
                            </p>
                            <p>
                                When you cancel your account, we will retain your data for a reasonable period to allow for data export, after which it will be securely deleted.
                            </p>
                        </div>

                        {/* International Transfers */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">8. International Data Transfers</h2>
                            <p>
                                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information when it is transferred internationally, including through standard contractual clauses and other approved mechanisms.
                            </p>
                        </div>

                        {/* Children's Privacy */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">9. Children's Privacy</h2>
                            <p>
                                Our Services are not intended for children under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                            </p>
                        </div>

                        {/* Changes to Policy */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">10. Changes to This Policy</h2>
                            <p className="mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and, if appropriate, through other notification methods.
                            </p>
                            <p>
                                Your continued use of our Services after any changes indicates your acceptance of the updated policy.
                            </p>
                        </div>

                        {/* Contact */}
                        <div>
                            <h2 className="text-2xl font-serif text-gray-800 mb-4">11. Contact Us</h2>
                            <p className="mb-4">
                                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">Email: privacy@denly.com</p>
                                <p className="text-gray-700">Address: 123 Property Management Lane, Suite 100, San Francisco, CA 94102</p>
                                <p className="text-gray-700">Data Protection Officer: dpo@denly.com</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-8 mt-8">
                            <p className="text-sm text-gray-600">
                                This Privacy Policy is designed to help you understand how we collect, use, and protect your information. We are committed to being transparent about our data practices and respecting your privacy.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}