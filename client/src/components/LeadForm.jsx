import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { apiUrl } from '../lib/api';

const services = [
  'Villa Fit-Out',
  'Apartment Fit-Out',
  'Office Fit-Out',
  'Commercial Fit-Out',
  'Interior Design & Build',
  'Renovation & Remodeling',
  'Joinery & Woodwork',
  'Flooring & Tiling',
  'Painting & Finishing',
  'Other',
];

export default function LeadForm({ compact = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(apiUrl('/api/leads'), { ...form, source: compact ? 'hero-form' : 'contact-form' });
      navigate('/thank-you');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-dark-800 border border-dark-600 p-6 sm:p-8 ${compact ? 'max-w-md w-full mx-auto' : 'w-full'}`}>
      <div className="h-px bg-gold-400 opacity-50 mb-6" />
      <h3 className="font-serif font-light text-2xl text-warm-300 tracking-wide mb-1">
        {compact ? 'Get Your Free Quote' : 'Send Us a Message'}
      </h3>
      <p className="text-warm-600 text-xs tracking-widest uppercase font-sans mb-6">
        {compact ? "We'll call you within 24 hours" : "We'd love to hear about your project"}
      </p>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 text-red-400 text-xs px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className={compact ? '' : 'grid sm:grid-cols-2 gap-4'}>
          <input
            name="name" value={form.name} onChange={onChange}
            placeholder="Your Name *" required
            className="input-field"
          />
          <input
            name="email" type="email" value={form.email} onChange={onChange}
            placeholder="Email Address *" required
            className="input-field"
          />
        </div>

        <div className={compact ? '' : 'grid sm:grid-cols-2 gap-4'}>
          <input
            name="phone" value={form.phone} onChange={onChange}
            placeholder="Phone Number"
            className="input-field"
          />
          <select
            name="service" value={form.service} onChange={onChange}
            className="input-field"
          >
            <option value="">Select a Service</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {!compact && (
          <textarea
            name="message" value={form.message} onChange={onChange}
            placeholder="Tell us about your project..."
            rows={4}
            className="input-field resize-none"
          />
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? <><FaSpinner className="animate-spin" /> Sending...</> : compact ? 'Request Free Quote →' : 'Send Message →'}
        </button>

        <p className="text-xs text-warm-600 text-center tracking-wider font-sans">
          No spam. We respect your privacy. 100% free consultation.
        </p>
      </form>
    </div>
  );
}
