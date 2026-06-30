import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaCheckCircle, FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { apiUrl } from '../lib/api';

const services = ['Villa Fit-Out', 'Apartment Fit-Out', 'Office Fit-Out', 'Commercial Fit-Out', 'Interior Design & Build', 'Renovation & Remodeling', 'Joinery & Woodwork', 'Flooring & Tiling', 'Painting & Finishing', 'Other'];
const budgets = ['Under AED 50,000', 'AED 50,000 – 150,000', 'AED 150,000 – 500,000', 'AED 500,000 – 1M', 'AED 1M+', 'Not sure yet'];
const timelines = ['ASAP', 'Within 3 months', '3–6 months', '6–12 months', 'Over 1 year', 'Just exploring'];
const steps = ['Your Info', 'Project Details', 'Review'];

export default function Quote() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', timeline: '', address: '', message: '', howHeard: '', preferredContact: 'phone' });

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const nextStep = (e) => { e.preventDefault(); setStep(s => Math.min(s + 1, 2)); };
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

  const labelCls = 'block text-xs tracking-widest uppercase text-warm-500 font-sans mb-2';

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 py-16 text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <span className="gold-line" />
          <span className="text-gold-400 text-xs tracking-[0.3em] uppercase font-sans">Free Consultation</span>
          <span className="gold-line" />
        </div>
        <h1 className="font-serif font-light text-4xl sm:text-5xl text-warm-300 tracking-wide">Get Your Free Quote</h1>
        <p className="text-warm-500 text-sm mt-3 max-w-xl mx-auto font-sans">Tell us about your project and we'll get back within 24 hours with a detailed estimate.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-14 grid lg:grid-cols-3 gap-10 items-start">
        {/* Sidebar */}
        <aside className="space-y-px bg-dark-700">
          <div className="bg-dark-900 p-6">
            <h3 className="font-serif font-light text-warm-300 tracking-wide mb-5">Why Choose Centuries?</h3>
            <ul className="space-y-3">
              {['Free, no-obligation estimate', 'Response within 24 hours', 'Licensed & fully insured in UAE', 'Quality workmanship guaranteed', 'Transparent pricing — no hidden fees', 'Dedicated project manager assigned'].map(item => (
                <li key={item} className="flex items-start gap-3 text-xs text-warm-500 font-sans">
                  <span className="w-1 h-1 bg-gold-400 flex-shrink-0 mt-1.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-dark-900 p-6 space-y-4">
            <h3 className="font-serif font-light text-warm-300 tracking-wide">Prefer to Talk?</h3>
            {[
              { icon: FaPhone,        label: 'Call us',   value: '0567601154',                   href: 'tel:+971567601154' },
              { icon: FaEnvelope,     label: 'Email us',  value: 'info@centuriescontracting.com', href: 'mailto:info@centuriescontracting.com' },
              { icon: FaClock,        label: 'Hours',     value: 'Mon–Sat, 8am–7pm',             href: null },
              { icon: FaMapMarkerAlt, label: 'Office',    value: 'Al Quoz, Dubai, UAE',          href: null },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 border border-dark-600 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-gold-400 text-xs" />
                </div>
                <div>
                  <p className="text-xs text-warm-600 font-sans">{item.label}</p>
                  {item.href ? <a href={item.href} className="text-xs font-sans text-warm-300 hover:text-gold-400 transition-colors">{item.value}</a>
                    : <p className="text-xs font-sans text-warm-300">{item.value}</p>}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-2 bg-dark-800 border border-dark-700 p-6 sm:p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 flex items-center justify-center text-xs font-sans flex-shrink-0 transition-colors ${i <= step ? 'bg-gold-400 text-dark-900' : 'border border-dark-600 text-warm-600'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs uppercase tracking-widest font-sans hidden sm:block ${i === step ? 'text-gold-400' : 'text-warm-600'}`}>{label}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-px mx-1 ${i < step ? 'bg-gold-400' : 'bg-dark-700'}`} />}
              </div>
            ))}
          </div>

          {error && <div className="mb-5 bg-red-900/30 border border-red-800 text-red-400 text-xs px-4 py-3 mb-5">{error}</div>}

          {step === 0 && (
            <form onSubmit={nextStep} className="space-y-5">
              <h2 className="font-serif font-light text-xl text-warm-300 tracking-wide mb-1">Your Contact Information</h2>
              <div className="h-px bg-gold-400 opacity-30 mb-5" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Full Name *</label><input name="name" value={form.name} onChange={onChange} required placeholder="Your name" className="input-field" /></div>
                <div><label className={labelCls}>Email *</label><input name="email" type="email" value={form.email} onChange={onChange} required placeholder="your@email.com" className="input-field" /></div>
                <div><label className={labelCls}>Phone *</label><input name="phone" value={form.phone} onChange={onChange} required placeholder="+971 ..." className="input-field" /></div>
                <div><label className={labelCls}>Company</label><input name="company" value={form.company} onChange={onChange} placeholder="Optional" className="input-field" /></div>
              </div>
              <div>
                <label className={labelCls}>Preferred Contact</label>
                <div className="flex gap-6">
                  {['phone', 'email', 'either'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-xs font-sans text-warm-400">
                      <input type="radio" name="preferredContact" value={opt} checked={form.preferredContact === opt} onChange={onChange} className="accent-gold-400" />
                      <span className="capitalize">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-primary w-full justify-center mt-2">Next: Project Details →</button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-5">
              <h2 className="font-serif font-light text-xl text-warm-300 tracking-wide mb-1">Project Details</h2>
              <div className="h-px bg-gold-400 opacity-30 mb-5" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Service *</label><select name="service" value={form.service} onChange={onChange} required className="input-field"><option value="">Select a service</option>{services.map(s => <option key={s}>{s}</option>)}</select></div>
                <div><label className={labelCls}>Budget</label><select name="budget" value={form.budget} onChange={onChange} className="input-field"><option value="">Select range</option>{budgets.map(b => <option key={b}>{b}</option>)}</select></div>
                <div><label className={labelCls}>Timeline</label><select name="timeline" value={form.timeline} onChange={onChange} className="input-field"><option value="">When to start?</option>{timelines.map(t => <option key={t}>{t}</option>)}</select></div>
                <div><label className={labelCls}>Location</label><input name="address" value={form.address} onChange={onChange} placeholder="Dubai, UAE" className="input-field" /></div>
              </div>
              <div><label className={labelCls}>Project Description</label><textarea name="message" value={form.message} onChange={onChange} rows={4} placeholder="Tell us about your project..." className="input-field resize-none" /></div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">← Back</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Next: Review →</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={onSubmit} className="space-y-5">
              <h2 className="font-serif font-light text-xl text-warm-300 tracking-wide mb-1">Review & Submit</h2>
              <div className="h-px bg-gold-400 opacity-30 mb-5" />
              <div><label className={labelCls}>How did you hear about us?</label>
                <select name="howHeard" value={form.howHeard} onChange={onChange} className="input-field">
                  <option value="">Select an option</option>
                  {['Google Search', 'Social Media', 'Friend / Family Referral', 'Past Client', 'Signage / Drive-by', 'Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="bg-dark-900 border border-dark-700 p-5 space-y-3">
                <h4 className="text-xs tracking-widest uppercase text-warm-500 font-sans mb-4">Summary</h4>
                {[['Name', form.name], ['Email', form.email], ['Phone', form.phone], ['Service', form.service], ['Budget', form.budget], ['Timeline', form.timeline]].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label} className="flex justify-between text-xs font-sans">
                    <span className="text-warm-600">{label}</span>
                    <span className="text-warm-300">{val}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-warm-600 font-sans">By submitting you agree to be contacted by our team. We respect your privacy.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">← Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? <><FaSpinner className="animate-spin" /> Submitting...</> : 'Submit Request →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
