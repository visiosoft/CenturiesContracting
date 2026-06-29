import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { apiUrl } from '../lib/api';

const services = [
  'General Contracting',
  'Commercial Construction',
  'Residential Remodeling',
  'Project Management',
  'Design & Build',
  'Renovation & Restoration',
  'Other',
];

const budgets = [
  'Under $50,000',
  '$50,000 – $150,000',
  '$150,000 – $500,000',
  '$500,000 – $1M',
  '$1M+',
  'Not sure yet',
];

const timelines = [
  'ASAP',
  'Within 3 months',
  '3–6 months',
  '6–12 months',
  'Over 1 year',
  'Just exploring',
];

const steps = ['Your Info', 'Project Details', 'Schedule'];

export default function Quote() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    service: '', budget: '', timeline: '', address: '',
    message: '', howHeard: '', preferredContact: 'phone',
  });

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const nextStep = (e) => {
    e.preventDefault();
    setStep(s => Math.min(s + 1, 2));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(apiUrl('/api/leads'), { ...form, source: 'quote-page' });
      navigate('/thank-you');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-primary-500 py-14 text-white text-center px-4">
        <span className="text-primary-200 font-semibold text-sm uppercase tracking-widest">Free Consultation</span>
        <h1 className="text-4xl sm:text-5xl font-bold mt-2 mb-3">Get Your Free Quote</h1>
        <p className="text-primary-100 text-lg max-w-xl mx-auto">
          Tell us about your project and we'll get back to you within 24 hours with a detailed estimate.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-3 gap-10 items-start">
        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Why Choose Centuries?</h3>
            <ul className="space-y-3">
              {[
                'Free, no-obligation estimate',
                'Response within 24 hours',
                'Licensed & fully insured',
                '10-year workmanship warranty',
                'Transparent pricing — no hidden fees',
                'Dedicated project manager assigned',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <FaCheckCircle className="text-primary-500 flex-shrink-0 mt-0.5" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Prefer to Talk?</h3>
            {[
              { icon: FaPhone, label: 'Call us', value: '(555) 123-4567', href: 'tel:+15551234567' },
              { icon: FaEnvelope, label: 'Email us', value: 'info@centuriescontracting.com', href: 'mailto:info@centuriescontracting.com' },
              { icon: FaClock, label: 'Hours', value: 'Mon–Fri, 8am–6pm', href: null },
              { icon: FaMapMarkerAlt, label: 'Office', value: 'Al Quoz, Dubai, UAE', href: null },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 text-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{item.label}</p>
                  {item.href
                    ? <a href={item.href} className="text-sm font-medium text-gray-800 hover:text-primary-500">{item.value}</a>
                    : <p className="text-sm font-medium text-gray-800">{item.value}</p>
                  }
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${i < step ? 'bg-primary-500 text-white' : i === step ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? <FaCheckCircle /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-primary-600' : 'text-gray-400'}`}>{label}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-primary-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          {/* Step 0: Contact Info */}
          {step === 0 && (
            <form onSubmit={nextStep} className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Contact Information</h2>
              <p className="text-gray-500 text-sm mb-5">So we know who to reach out to.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input name="name" value={form.name} onChange={onChange} required placeholder="John Smith" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={onChange} required placeholder="john@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input name="phone" value={form.phone} onChange={onChange} required placeholder="(555) 000-0000" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organization</label>
                  <input name="company" value={form.company} onChange={onChange} placeholder="Optional" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                <div className="flex gap-4">
                  {['phone', 'email', 'either'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="preferredContact" value={opt} checked={form.preferredContact === opt} onChange={onChange} className="accent-primary-500" />
                      <span className="text-sm text-gray-700 capitalize">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center mt-2">
                Next: Project Details →
              </button>
            </form>
          )}

          {/* Step 1: Project Details */}
          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Project Details</h2>
              <p className="text-gray-500 text-sm mb-5">Help us understand your project scope.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Needed *</label>
                  <select name="service" value={form.service} onChange={onChange} required className="input-field">
                    <option value="">Select a service</option>
                    {services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget</label>
                  <select name="budget" value={form.budget} onChange={onChange} className="input-field">
                    <option value="">Select budget range</option>
                    {budgets.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Timeline</label>
                  <select name="timeline" value={form.timeline} onChange={onChange} className="input-field">
                    <option value="">When do you need to start?</option>
                    {timelines.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Location</label>
                  <input name="address" value={form.address} onChange={onChange} placeholder="City, State" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                <textarea name="message" value={form.message} onChange={onChange} rows={4} placeholder="Tell us about your project — size, scope, any specific requirements..." className="input-field resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">
                  ← Back
                </button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  Next: Schedule →
                </button>
              </div>
            </form>
          )}

          {/* Step 2: How did you hear + submit */}
          {step === 2 && (
            <form onSubmit={onSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Almost Done!</h2>
              <p className="text-gray-500 text-sm mb-5">One last step and we'll be in touch shortly.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                <select name="howHeard" value={form.howHeard} onChange={onChange} className="input-field">
                  <option value="">Select an option</option>
                  {['Google Search', 'Social Media', 'Friend / Family Referral', 'Past Client', 'Yelp / HomeAdvisor', 'Signage / Drive-by', 'Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-2 text-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Quote Request Summary</h4>
                {[
                  ['Name', form.name],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ['Service', form.service],
                  ['Budget', form.budget],
                  ['Timeline', form.timeline],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800">{val}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400">
                By submitting you agree to be contacted by our team. We respect your privacy and never share your information.
              </p>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <><FaSpinner className="animate-spin" /> Submitting...</> : 'Submit Quote Request →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
