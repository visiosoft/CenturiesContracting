import { FaHome, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-dark-900 px-4 pt-20">
      <div className="max-w-lg w-full text-center">
        <div className="border border-dark-700 bg-dark-800 p-12">
          <div className="h-px bg-gold-400 opacity-50 mb-10" />
          <div className="font-serif text-5xl font-light text-gold-400 mb-4">✓</div>
          <h1 className="font-serif font-light text-3xl text-warm-300 tracking-wide mb-3">Thank You</h1>
          <span className="gold-line mx-auto mb-6" />
          <p className="text-warm-500 text-sm font-sans leading-relaxed mb-2">Your message has been received.</p>
          <p className="text-warm-600 text-xs font-sans mb-10 leading-relaxed">
            A member of our team will be in touch within <strong className="text-warm-400">24 hours</strong> to discuss your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary justify-center">
              <FaHome className="text-xs" /> Back to Home
            </Link>
            <a href="tel:+971567601154" className="btn-outline justify-center">
              <FaPhone className="text-xs" /> Call Us Now
            </a>
          </div>
          <div className="h-px bg-gold-400 opacity-20 mt-10" />
        </div>
      </div>
    </section>
  );
}
