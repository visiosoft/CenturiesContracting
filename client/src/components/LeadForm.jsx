import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const services = [
  'General Contracting',
  'Commercial Construction',
  'Residential Remodeling',
  'Project Management',
  'Design & Build',
  'Renovation',
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
      await axios.post('/api/leads', { ...form, source: compact ? 'hero-form' : 'contact-form' });
      navigate('/thank-you');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-6 sm:p-8 ${compact ? 'max-w-md w-full mx-auto' : 'w-full'}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {compact ? 'Get Your Free Quote' : 'Send Us a Message'}
      </h3>
      <p className="text-gray-500 text-sm mb-5">
        {compact ? 'Fill in the form and we\'ll call you within 24 hours.' : 'We\'d love to hear about your project.'}
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
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
            className="input-field text-gray-700"
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

        <p className="text-xs text-gray-400 text-center">
          No spam. We respect your privacy. 100% free consultation.
        </p>
      </form>
    </div>
  );
}
