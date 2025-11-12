import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logoWhite from '@/public/img/logoWhite.png'

export default function Footer() {
    return (
        <footer className="relative z-10 bg-[#1A1714] py-12 text-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <Image src={logoWhite} alt='denly Logo' className='w-29' />

                            {/* <div className="w-8 h-8 bg-[#876D4A] rounded-full"></div> */}
                            {/* <span className="text-xl font-serif italic text-white">denly</span> */}
                        </div>
                        <p className="text-gray-300 text-sm">Simple, effective property management.</p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/features" className="text-gray-300 hover:text-[#876D4A] transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="text-gray-300 hover:text-[#876D4A] transition-colors">Pricing</Link></li>
                            <li><Link href="/integrations" className="text-gray-300 hover:text-[#876D4A] transition-colors">Integrations</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/blog" className="text-gray-300 hover:text-[#876D4A] transition-colors">Blog</Link></li>
                            <li><Link href="/help" className="text-gray-300 hover:text-[#876D4A] transition-colors">Help Center</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-[#876D4A] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-gray-300 hover:text-[#876D4A] transition-colors">About</Link></li>
                            <li><Link href="/careers" className="text-gray-300 hover:text-[#876D4A] transition-colors">Careers</Link></li>
                            <li><Link href="/privacy-policy" className="text-gray-300 hover:text-[#876D4A] transition-colors">Privacy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-700 mt-8 pt-8 flex items-center justify-between">
                    <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Denly. All rights reserved.</p>
                    <div className="flex items-center space-x-6">
                        <Link href="/terms" className="text-gray-400 hover:text-[#876D4A] transition-colors text-sm">Terms</Link>
                        <Link href="/privacy-policy" className="text-gray-400 hover:text-[#876D4A] transition-colors text-sm">Privacy</Link>
                        <Link href="/cookies" className="text-gray-400 hover:text-[#876D4A] transition-colors text-sm">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
