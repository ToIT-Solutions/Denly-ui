// app/page.jsx
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/img/logo.png'
import preview from '@/public/img/preview.png'
import Footer from '@/components/Footer'

export default function Homepage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f8f6f2] to-[#f0ede6] overflow-hidden">

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-[#876D4A]/5 to-transparent rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <Image src={logo} alt="denly Logo" className="w-24 sm:w-28" priority />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-600 hover:text-[#876D4A] transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-[#876D4A] transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-[#876D4A] transition-colors">
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="border border-[#876D4A] text-[#876D4A] px-6 py-2 rounded-full hover:bg-[#876D4A] hover:text-white transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Nav Links (horizontal) */}
          <div className="flex justify-center space-x-4 md:hidden">
            <Link href="/features" className="text-gray-600 hover:text-[#876D4A] transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-[#876D4A] transition-colors">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-[#876D4A] transition-colors">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 lg:pt-16 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-6 leading-snug">
              Property Management for the{" "}
              <span className="text-[#876D4A] italic">Modern Landlord</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Streamline your rentals with tools that work the way you do.
              Track payments, manage properties, and connect with tenants—all in one place.
            </p>

            <Link
              href="/auth/signup"
              className="inline-block bg-[#876D4A] text-white px-8 py-4 rounded-full hover:bg-[#756045] transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Right Content */}
          <div className="relative ">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 transform rotate-0 lg:rotate-1 shadow-xl">
              <div className="rounded-lg h-56 sm:h-72 lg:h-80 w-full flex items-center justify-center">
                <Image src={preview} alt="dashboard preview" />
              </div>
            </div>

            <div className="hidden lg:block absolute -bottom-6 -left-6 bg-[#876D4A] rounded-2xl w-24 h-24 transform -rotate-12"></div>
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 mb-20">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 mb-6">
            Find Your Peace of Mind
          </h2>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 lg:p-12 shadow-sm">
            <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
              We built Denly because we know property management is more than just collecting rent—
              it's about your financial security and peace of mind.
              Stop worrying about missed payments, scattered records, and financial confusion.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center mb-8">
              {[
                { number: '95%', label: 'of landlords track finances manually' },
                { number: '3 hours', label: 'weekly spent on financial admin' },
                { number: '12%', label: 'late payments happen monthly' }
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-2xl font-serif text-[#876D4A] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
              <div>
                <h3 className="font-serif text-lg text-gray-800 mb-3">
                  Financial Clarity
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  See exactly where your money is going. Track rent payments,
                  expenses, and profits in real-time. Never wonder about your
                  cash flow again.
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg text-gray-800 mb-3">
                  Property Overview
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Manage all your properties from one dashboard. See occupancy and
                  payment status at a glance.
                </p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Denly gives you the confidence that comes from knowing your finances are organized,
              your properties are managed, and your time is spent growing your portfolio—not chasing paperwork.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200 p-6 sm:p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif text-gray-800 mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tools designed to simplify property management and save you time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Payment Tracking', desc: 'Monitor rent payments and automate reminders', icon: '💳' },
              { title: 'Property Management', desc: 'Organize all your properties and tenant details', icon: '🏠' },
              { title: 'Financial Reports', desc: 'Clear insights into your portfolio performance', icon: '📈' }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-[#876D4A] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-lg text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 text-center mb-20">
        <div className="bg-[#876D4A] rounded-3xl p-6 sm:p-8 lg:p-12 text-white">
          <h2 className="text-2xl sm:text-3xl font-serif mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Join landlords who are managing their properties more effectively.
          </p>

          <Link
            href="/auth/signup"
            className="inline-flex items-center space-x-3 bg-white text-[#876D4A] px-8 py-4 rounded-full hover:bg-gray-100 transition-colors"
          >
            <span>Create Your Account</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}