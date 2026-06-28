import { FaArrowRight, FaPhone } from 'react-icons/fa';

export default function CTA() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-16 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=60')] bg-cover bg-center opacity-10" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Build Something <span className="text-primary-400">Extraordinary?</span>
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          Get your free, no-obligation estimate today. Our team is standing by to discuss your project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => scrollTo('#contact')} className="btn-primary bg-primary-500 hover:bg-primary-400 px-8 py-4 text-base">
            Get Free Estimate <FaArrowRight />
          </button>
          <a href="tel:+15551234567" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-base">
            <FaPhone className="text-sm" /> Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
