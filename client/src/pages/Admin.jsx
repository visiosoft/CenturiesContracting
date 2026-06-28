import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  FaUsers, FaStar, FaCheckCircle, FaPhoneAlt, FaChartLine,
  FaSearch, FaTrash, FaSync, FaSignOutAlt, FaFilter,
  FaArrowUp, FaArrowDown, FaMinus,
} from 'react-icons/fa';

const ADMIN_PASS = 'centuries2024';

const STATUS_COLORS = {
  new:       { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  contacted: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  qualified: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  converted: { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500'  },
  lost:      { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500'    },
};

const CHART_COLORS = ['#4F7A3A', '#6aaf42', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || STATUS_COLORS.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, trend, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-500 text-white',
    blue:    'bg-blue-500 text-white',
    yellow:  'bg-yellow-500 text-white',
    green:   'bg-green-500 text-white',
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="text-lg" />
        </div>
        {trend !== undefined && trend !== null && (
          <span className={`text-xs font-semibold flex items-center gap-1 ${parseFloat(trend) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {parseFloat(trend) > 0 ? <FaArrowUp className="text-[10px]" /> : parseFloat(trend) < 0 ? <FaArrowDown className="text-[10px]" /> : <FaMinus className="text-[10px]" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-3xl font-extrabold text-gray-900 mb-0.5">{value}</div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('cc-admin') === '1');
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');

  const [stats, setStats]     = useState(null);
  const [trends, setTrends]   = useState([]);
  const [byService, setByService] = useState([]);
  const [bySource, setBySource]   = useState([]);
  const [byStatus, setByStatus]   = useState([]);
  const [leads, setLeads]     = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [trendDays, setTrendDays] = useState(30);
  const [search, setSearch]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAll = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    try {
      const [s, t, svc, src, st, l] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get(`/api/admin/trends?days=${trendDays}`),
        axios.get('/api/admin/by-service'),
        axios.get('/api/admin/by-source'),
        axios.get('/api/admin/by-status'),
        axios.get(`/api/admin/leads?page=${pagination.page}&search=${search}&status=${filterStatus}`),
      ]);
      setStats(s.data);
      setTrends(t.data);
      setByService(svc.data);
      setBySource(src.data);
      setByStatus(st.data);
      setLeads(l.data.leads);
      setPagination(p => ({ ...p, pages: l.data.pages, total: l.data.total }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [authed, trendDays, pagination.page, search, filterStatus]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/admin/leads/${id}`, { status });
    setLeads(ls => ls.map(l => l._id === id ? { ...l, status } : l));
    setStats(null); // trigger refresh
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await axios.delete(`/api/admin/leads/${id}`);
    setLeads(ls => ls.filter(l => l._id !== id));
  };

  const login = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) { sessionStorage.setItem('cc-admin', '1'); setAuthed(true); }
    else setPassErr('Incorrect password.');
  };

  const logout = () => { sessionStorage.removeItem('cc-admin'); setAuthed(false); };

  // — Login gate —
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 C20 6, 9 11, 9 22 C9 30, 20 34, 20 34 C20 34, 31 30, 31 22 C31 11, 20 6, 20 6Z" /><path d="M20 34 L20 6" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-400">Centuries Contracting</p>
            </div>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter admin password" className="input-field" autoFocus />
              {passErr && <p className="text-red-500 text-xs mt-1">{passErr}</p>}
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Admin topbar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="font-bold text-gray-900 text-sm hidden sm:block">Admin Dashboard</span>
            <nav className="flex gap-1">
              {[['overview','Overview'], ['leads','Leads'], ['analytics','Analytics']].map(([id, label]) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === id ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:text-gray-800'}`}>
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAll} className="text-gray-400 hover:text-gray-700 transition-colors" title="Refresh">
              <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
              <FaSignOutAlt /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FaUsers}     label="Total Leads"      value={stats?.total ?? '—'}         sub={`${stats?.newLeads ?? 0} unactioned`} trend={stats?.monthGrowth} color="primary" />
              <StatCard icon={FaStar}      label="New This Month"   value={stats?.monthLeads ?? '—'}    sub={`vs ${stats?.lastMonthLeads ?? 0} last month`} trend={stats?.monthGrowth} color="blue" />
              <StatCard icon={FaPhoneAlt}  label="Contacted"        value={stats?.contacted ?? '—'}     sub="Awaiting follow-up" color="yellow" />
              <StatCard icon={FaCheckCircle} label="Converted"      value={stats?.converted ?? '—'}     sub={`${stats?.conversionRate ?? 0}% rate`} color="green" />
            </div>

            {/* Trend chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900">Lead Trend</h2>
                <div className="flex gap-1">
                  {[7, 14, 30, 90].map(d => (
                    <button key={d} onClick={() => setTrendDays(d)}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${trendDays === d ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trends} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={d => fmt(d)} tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={d => fmt(d)} formatter={v => [v, 'Leads']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="leads" stroke="#4F7A3A" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom row: service + source + status */}
            <div className="grid lg:grid-cols-3 gap-5">
              {/* By Service */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Leads by Service</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={byService} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {byService.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* By Source */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Leads by Source</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bySource} margin={{ left: -20, right: 4 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" name="Leads" radius={[0, 4, 4, 0]}>
                      {bySource.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* By Status */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Pipeline Status</h3>
                <div className="space-y-3">
                  {byStatus.map((s, i) => {
                    const total = byStatus.reduce((a, b) => a + b.value, 0);
                    const pct = total > 0 ? ((s.value / total) * 100).toFixed(0) : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700 capitalize">{s.name}</span>
                          <span className="text-gray-500">{s.value} · {pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent leads preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Leads</h3>
                <button onClick={() => setActiveTab('leads')} className="text-primary-500 text-sm hover:underline">View all →</button>
              </div>
              <LeadsTable leads={leads.slice(0, 5)} onStatusChange={updateStatus} onDelete={deleteLead} compact />
            </div>
          </>
        )}

        {/* ── LEADS TAB ── */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                  placeholder="Search by name, email or phone…" className="input-field pl-9" />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                  className="input-field pl-9 pr-8 appearance-none">
                  <option value="">All Statuses</option>
                  {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                </select>
              </div>
              <div className="text-sm text-gray-400 flex items-center whitespace-nowrap">
                {pagination.total} lead{pagination.total !== 1 ? 's' : ''}
              </div>
            </div>

            <LeadsTable leads={leads} onStatusChange={updateStatus} onDelete={deleteLead} />

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-1 mt-5">
                <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button key={i} onClick={() => setPagination(p => ({ ...p, page: i + 1 }))}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${pagination.page === i+1 ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                    {i + 1}
                  </button>
                ))}
                <button disabled={pagination.page === pagination.pages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next →</button>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Weekly bar chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-5">Daily Lead Volume (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={trends} margin={{ left: -20, right: 4, top: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={d => fmt(d)} tick={{ fontSize: 11 }} interval={4} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip labelFormatter={d => fmt(d)} formatter={v => [v, 'Leads']} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="leads" fill="#4F7A3A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Service breakdown table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Service Breakdown</h3>
                <div className="space-y-3">
                  {byService.map((s, i) => {
                    const total = byService.reduce((a, b) => a + b.value, 0);
                    const pct = total > 0 ? ((s.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-sm text-gray-700 flex-1 truncate">{s.name}</span>
                        <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                        <span className="text-xs text-gray-400 w-12 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Source + Conversion funnel */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Conversion Funnel</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Total Leads',  value: stats?.total,     color: '#4F7A3A' },
                    { label: 'Contacted',    value: stats?.contacted,  color: '#f59e0b' },
                    { label: 'Qualified',    value: byStatus.find(s => s.name === 'qualified')?.value || 0, color: '#8b5cf6' },
                    { label: 'Converted',    value: stats?.converted,  color: '#22c55e' },
                  ].map((row, i, arr) => {
                    const pct = arr[0].value > 0 ? ((row.value / arr[0].value) * 100).toFixed(0) : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{row.label}</span>
                          <span className="text-gray-500">{row.value ?? 0} · {pct}%</span>
                        </div>
                        <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                          <div className="h-full rounded-lg flex items-center justify-end pr-2 transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: row.color }}>
                            {pct >= 15 && <span className="text-white text-xs font-bold">{pct}%</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-2xl font-extrabold text-primary-600">{stats?.conversionRate ?? 0}%</p>
                  <p className="text-xs text-gray-400">Overall conversion rate</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeadsTable({ leads, onStatusChange, onDelete, compact }) {
  const [expanded, setExpanded] = useState(null);

  if (!leads.length) return (
    <div className="text-center py-12 text-gray-400">
      <FaUsers className="text-4xl mx-auto mb-3 opacity-30" />
      <p>No leads found.</p>
    </div>
  );

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="border-b border-gray-100">
            {['', 'Name', 'Contact', 'Service', 'Source', 'Status', 'Date', ''].map((h, i) => (
              <th key={i} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 px-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => {
            const isOpen = expanded === lead._id;
            const hasDetails = lead.budget || lead.timeline || lead.address || lead.company || lead.howHeard || lead.preferredContact || lead.message;
            return (
              <React.Fragment key={lead._id}>
              <tr className={`hover:bg-gray-50 transition-colors group border-b ${isOpen ? 'bg-primary-50/40 border-primary-100' : 'border-gray-50'}`}>
                  {/* Expand toggle */}
                  <td className="py-3 px-2 w-6">
                    {hasDetails && (
                      <button onClick={() => setExpanded(isOpen ? null : lead._id)}
                        className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-all ${isOpen ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                        {isOpen ? '−' : '+'}
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-gray-900 truncate max-w-[130px]">{lead.name}</p>
                    {lead.company && <p className="text-xs text-gray-400 truncate max-w-[130px]">{lead.company}</p>}
                  </td>
                  <td className="py-3 px-2">
                    <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline block truncate max-w-[160px]">{lead.email}</a>
                    {lead.phone && <a href={`tel:${lead.phone}`} className="text-gray-400 text-xs">{lead.phone}</a>}
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-gray-600 truncate max-w-[120px] block">{lead.service || '—'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{lead.source || '—'}</span>
                  </td>
                  <td className="py-3 px-2">
                    <select value={lead.status} onChange={e => onStatusChange(lead._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-400 bg-white">
                      {Object.keys(STATUS_COLORS).map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-2 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="py-3 px-2">
                    <button onClick={() => onDelete(lead._id)} className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <FaTrash className="text-xs" />
                    </button>
                  </td>
                </tr>

                {/* Expandable project details row */}
                {isOpen && (
                  <tr key={`${lead._id}-detail`} className="bg-primary-50/30 border-b border-primary-100">
                    <td colSpan={8} className="px-4 pb-4 pt-2">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        {[
                          { label: 'Budget',            value: lead.budget },
                          { label: 'Timeline',          value: lead.timeline },
                          { label: 'Project Location',  value: lead.address },
                          { label: 'How They Heard',    value: lead.howHeard },
                          { label: 'Preferred Contact', value: lead.preferredContact },
                          { label: 'Company',           value: lead.company },
                        ].filter(f => f.value).map(f => (
                          <div key={f.label} className="bg-white rounded-lg px-3 py-2 shadow-sm border border-primary-100">
                            <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                            <p className="text-sm font-medium text-gray-800">{f.value}</p>
                          </div>
                        ))}
                      </div>
                      {lead.message && (
                        <div className="bg-white rounded-lg px-3 py-2 shadow-sm border border-primary-100">
                          <p className="text-xs text-gray-400 mb-0.5">Message</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{lead.message}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
