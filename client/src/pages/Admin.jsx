import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { apiUrl } from '../lib/api';
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
  new: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  contacted: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  qualified: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  converted: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  lost: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
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
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    green: 'bg-green-500 text-white',
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

  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [byService, setByService] = useState([]);
  const [bySource, setBySource] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [trendDays, setTrendDays] = useState(30);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAll = useCallback(async () => {
    if (!authed) return;
    setLoading(true);
    try {
      const [s, t, svc, src, st, l] = await Promise.all([
        axios.get(apiUrl('/api/admin/stats')),
        axios.get(apiUrl(`/api/admin/trends?days=${trendDays}`)),
        axios.get(apiUrl('/api/admin/by-service')),
        axios.get(apiUrl('/api/admin/by-source')),
        axios.get(apiUrl('/api/admin/by-status')),
        axios.get(apiUrl(`/api/admin/leads?page=${pagination.page}&search=${search}&status=${filterStatus}`)),
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
    await axios.patch(apiUrl(`/api/admin/leads/${id}`), { status });
    setLeads(ls => ls.map(l => l._id === id ? { ...l, status } : l));
    setStats(null); // trigger refresh
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    await axios.delete(apiUrl(`/api/admin/leads/${id}`));
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
              {[['overview', 'Overview'], ['leads', 'Leads'], ['analytics', 'Analytics'], ['projects', 'Projects']].map(([id, label]) => (
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
              <StatCard icon={FaUsers} label="Total Leads" value={stats?.total ?? '—'} sub={`${stats?.newLeads ?? 0} unactioned`} trend={stats?.monthGrowth} color="primary" />
              <StatCard icon={FaStar} label="New This Month" value={stats?.monthLeads ?? '—'} sub={`vs ${stats?.lastMonthLeads ?? 0} last month`} trend={stats?.monthGrowth} color="blue" />
              <StatCard icon={FaPhoneAlt} label="Contacted" value={stats?.contacted ?? '—'} sub="Awaiting follow-up" color="yellow" />
              <StatCard icon={FaCheckCircle} label="Converted" value={stats?.converted ?? '—'} sub={`${stats?.conversionRate ?? 0}% rate`} color="green" />
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
                    <Pie data={byService} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
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
                  {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
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
                    className={`px-3 py-1.5 text-sm rounded-lg border ${pagination.page === i + 1 ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 hover:bg-gray-50'}`}>
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
                    { label: 'Total Leads', value: stats?.total, color: '#4F7A3A' },
                    { label: 'Contacted', value: stats?.contacted, color: '#f59e0b' },
                    { label: 'Qualified', value: byStatus.find(s => s.name === 'qualified')?.value || 0, color: '#8b5cf6' },
                    { label: 'Converted', value: stats?.converted, color: '#22c55e' },
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

        {/* ── PROJECTS TAB ── */}
        {activeTab === 'projects' && (
          <ProjectsManager />
        )}

      </div>
    </div>
  );
}

function ProjectsManager() {
  const ADMIN_KEY = 'centuries2024';
  const CATEGORIES = ['Villa', 'Apartment', 'Tower', 'Commercial', 'Landscape', 'Other'];

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Villa' });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [addingTo, setAddingTo] = useState(null); // project name for adding images
  const [addFiles, setAddFiles] = useState([]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/projects');
      const data = await r.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setUploading(true);
    setUploadProgress('Uploading...');
    const fd = new FormData();
    fd.append('name', form.name.trim());
    fd.append('category', form.category);
    Array.from(files).forEach(f => fd.append('images', f));
    try {
      const r = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'x-admin-key': ADMIN_KEY },
        body: fd,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setUploadProgress(`✅ Created "${form.name}" with ${data.files} files`);
      setForm({ name: '', category: 'Villa' });
      setFiles([]);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setUploadProgress(`❌ ${err.message}`);
    }
    setUploading(false);
  };

  const handleAddImages = async (e) => {
    e.preventDefault();
    if (!addingTo || !addFiles.length) return;
    setUploading(true);
    setUploadProgress('Uploading images...');
    const fd = new FormData();
    fd.append('name', addingTo);
    Array.from(addFiles).forEach(f => fd.append('images', f));
    try {
      const r = await fetch(`/api/admin/projects/${encodeURIComponent(addingTo)}/images`, {
        method: 'POST',
        headers: { 'x-admin-key': ADMIN_KEY },
        body: fd,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      setUploadProgress(`✅ Added ${data.files} images to "${addingTo}"`);
      setAddingTo(null);
      setAddFiles([]);
      fetchProjects();
    } catch (err) {
      setUploadProgress(`❌ ${err.message}`);
    }
    setUploading(false);
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Delete project "${name}" and all its images? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/projects/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': ADMIN_KEY },
      });
      fetchProjects();
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gallery Projects</h2>
          <p className="text-sm text-gray-400">{projects.length} projects · manage images shown in the gallery</p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setUploadProgress(''); }}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Project
        </button>
      </div>

      {/* Status message */}
      {uploadProgress && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${uploadProgress.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : uploadProgress.startsWith('❌') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {uploadProgress}
        </div>
      )}

      {/* Create project form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">New Project</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Palm Jumeirah Villa"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Images / Videos (optional — you can add later)</label>
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/quicktime"
              onChange={e => setFiles(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {files.length > 0 && <p className="text-xs text-gray-400 mt-1">{files.length} file(s) selected</p>}
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={uploading}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
              {uploading ? 'Uploading...' : 'Create Project'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add images to existing project */}
      {addingTo && (
        <form onSubmit={handleAddImages} className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">Add images to <span className="text-primary-600">"{addingTo}"</span></h3>
          <input
            type="file"
            multiple
            accept="image/*,video/mp4,video/quicktime"
            onChange={e => setAddFiles(e.target.files)}
            className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white file:text-primary-700 hover:file:bg-primary-50"
            required
          />
          {addFiles.length > 0 && <p className="text-xs text-gray-500">{addFiles.length} file(s) selected</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={uploading}
              className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            <button type="button" onClick={() => { setAddingTo(null); setAddFiles([]); }} className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Projects grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <p className="text-sm">No projects yet. Click "Add Project" to create one.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative h-44 bg-gray-100">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">{p.category}</span>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm truncate mb-0.5">{p.title}</h3>
                <p className="text-xs text-gray-400 mb-3">
                  {p.images?.length || 0} photos{p.videos?.length > 0 ? ` · ${p.videos.length} videos` : ''}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setAddingTo(p.title); setUploadProgress(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="flex-1 text-xs font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    + Add Images
                  </button>
                  <button
                    onClick={() => handleDelete(p.title)}
                    className="text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
                          { label: 'Budget', value: lead.budget },
                          { label: 'Timeline', value: lead.timeline },
                          { label: 'Project Location', value: lead.address },
                          { label: 'How They Heard', value: lead.howHeard },
                          { label: 'Preferred Contact', value: lead.preferredContact },
                          { label: 'Company', value: lead.company },
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
