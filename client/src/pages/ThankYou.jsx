import { FaCheckCircle, FaHome, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function ThankYou() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="max-w-lg w-full text-center bg-white rounded-2xl shadow-xl p-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-4xl text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>
        <p className="text-gray-500 text-lg mb-2">Your message has been received.</p>
        <p className="text-gray-400 mb-8">
          A member of our team will be in touch within <strong>24 hours</strong> to discuss your project. In the meantime, feel free to call us directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary justify-center">
            <FaHome /> Back to Home
          </Link>
          <a href="tel:+15551234567" className="btn-outline justify-center">
            <FaPhone className="text-sm" /> Call Us Now
          </a>
        </div>
      </div>
    </section>
  );
}
