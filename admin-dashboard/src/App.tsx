import React, { useState } from 'react';

// Strict Dark Theme Colors
const COLORS = {
  primaryBg: '#000000',
  secondaryBg: '#222222',
  primaryAccent: '#1DCD9F',
  secondaryAccent: '#169976',
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textDisabled: '#777777',
  separator: '#383838',
  danger: '#FF4444',
  warning: '#FFB800',
};

interface Stats {
  total_users: number;
  total_events: number;
  total_registrations: number;
  total_organizations: number;
  pending_reports: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'verification' | 'colleges' | 'settings'>('overview');
  const [stats, setStats] = useState<Stats>({
    total_users: 1420,
    total_events: 85,
    total_registrations: 3410,
    total_organizations: 28,
    pending_reports: 3,
  });

  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      eventTitle: 'Spam Crypto Workshop',
      reporterName: 'Rahul Sharma',
      reason: 'Misleading / Commercial promotion',
      status: 'pending',
      date: '2026-10-10',
    },
    {
      id: 'rep-2',
      eventTitle: 'Late Night Unofficial Party',
      reporterName: 'Campus Dean Office',
      reason: 'Unauthorized campus venue usage',
      status: 'pending',
      date: '2026-10-09',
    },
    {
      id: 'rep-3',
      eventTitle: 'Duplicate Coding Hackathon',
      reporterName: 'Ananya Verma',
      reason: 'Duplicate listing',
      status: 'reviewed',
      date: '2026-10-08',
    },
  ]);

  const [verificationRequests, setVerificationRequests] = useState([
    {
      id: 'vr-1',
      orgName: 'AI & Robotics Innovation Club',
      college: 'National Institute of Technology',
      requestedBy: 'Aditya Sen',
      documents: 'Faculty endorsement letter submitted',
      status: 'pending',
    },
    {
      id: 'vr-2',
      orgName: 'Campus Debating Union',
      college: 'Apex University',
      requestedBy: 'Pooja Nair',
      documents: 'Student Council Constitution attached',
      status: 'pending',
    },
  ]);

  const [collegesList, setCollegesList] = useState([
    { id: '1', name: 'National Institute of Technology', location: 'Trichy, Tamil Nadu', activeEvents: 24 },
    { id: '2', name: 'Indian Institute of Science & Tech', location: 'Bengaluru, Karnataka', activeEvents: 31 },
    { id: '3', name: 'Delhi Technological University', location: 'New Delhi, Delhi', activeEvents: 18 },
  ]);

  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeLoc, setNewCollegeLoc] = useState('');

  const handleResolveReport = (id: string, action: 'dismiss' | 'remove') => {
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'action_taken' } : r))
    );
    setStats(prev => ({ ...prev, pending_reports: Math.max(0, prev.pending_reports - 1) }));
  };

  const handleReviewVerification = (id: string, status: 'approved' | 'rejected') => {
    setVerificationRequests(prev =>
      prev.map(v => (v.id === id ? { ...v, status } : v))
    );
  };

  const handleAddCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeName.trim()) return;
    setCollegesList(prev => [
      ...prev,
      { id: Date.now().toString(), name: newCollegeName.trim(), location: newCollegeLoc.trim() || 'Main Campus', activeEvents: 0 }
    ]);
    setNewCollegeName('');
    setNewCollegeLoc('');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.primaryBg, color: COLORS.textPrimary }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '260px',
        backgroundColor: COLORS.secondaryBg,
        borderRight: `1px solid ${COLORS.separator}`,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${COLORS.separator}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: COLORS.primaryAccent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#000000',
              fontSize: '18px',
            }}>
              C
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px' }}>Campus Events</div>
              <div style={{ fontSize: '11px', color: COLORS.primaryAccent, fontWeight: 600 }}>ADMIN CONSOLE</div>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { id: 'overview', label: 'Platform Overview', icon: '📊' },
            { id: 'reports', label: `Moderation & Reports (${stats.pending_reports})`, icon: '🛡️' },
            { id: 'verification', label: 'Org Verification', icon: '✅' },
            { id: 'colleges', label: 'Colleges & Campuses', icon: '🏫' },
            { id: 'settings', label: 'System Settings', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? COLORS.primaryAccent : 'transparent',
                color: activeTab === tab.id ? '#000000' : COLORS.textPrimary,
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '14px',
                textAlign: 'left',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* User Footer */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${COLORS.separator}`, fontSize: '12px', color: COLORS.textSecondary }}>
          <div>Logged in as <strong>Platform Admin</strong></div>
          <div style={{ color: COLORS.primaryAccent, marginTop: '2px' }}>Role: platform_admin</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Platform Analytics & Status</h1>
            <p style={{ color: COLORS.textSecondary, marginBottom: '28px' }}>
              Real-time metrics across registered students, campus events, and moderation queue.
            </p>

            {/* Stat Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              {[
                { label: 'Active Students', value: stats.total_users, change: '+12% this week', color: COLORS.primaryAccent },
                { label: 'Published Events', value: stats.total_events, change: '+8 new today', color: COLORS.secondaryAccent },
                { label: 'Total Registrations', value: stats.total_registrations, change: '94% capacity fill', color: COLORS.primaryAccent },
                { label: 'Campus Clubs', value: stats.total_organizations, change: '18 verified', color: COLORS.textPrimary },
                { label: 'Pending Reports', value: stats.pending_reports, change: 'Requires review', color: stats.pending_reports > 0 ? COLORS.danger : COLORS.primaryAccent },
              ].map(card => (
                <div
                  key={card.label}
                  style={{
                    backgroundColor: COLORS.secondaryBg,
                    padding: '20px',
                    borderRadius: '12px',
                    border: `1px solid ${COLORS.separator}`,
                  }}
                >
                  <div style={{ fontSize: '13px', color: COLORS.textSecondary }}>{card.label}</div>
                  <div style={{ fontSize: '32px', fontWeight: 700, color: card.color, margin: '8px 0' }}>{card.value}</div>
                  <div style={{ fontSize: '12px', color: COLORS.textDisabled }}>{card.change}</div>
                </div>
              ))}
            </div>

            {/* Recent Moderation Actions */}
            <div style={{ backgroundColor: COLORS.secondaryBg, borderRadius: '12px', border: `1px solid ${COLORS.separator}`, padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Urgent Items Requiring Administrator Attention</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: COLORS.primaryBg, borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Spam Crypto Workshop reported</div>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>Reported by 3 students for commercial promotion</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('reports')}
                    style={{ backgroundColor: COLORS.primaryAccent, border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 600 }}
                  >
                    Review Now
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: COLORS.primaryBg, borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>AI & Robotics Innovation Club verification request</div>
                    <div style={{ fontSize: '12px', color: COLORS.textSecondary }}>National Institute of Technology student body endorsement</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('verification')}
                    style={{ backgroundColor: COLORS.secondaryAccent, color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 600 }}
                  >
                    Inspect Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REPORTS & MODERATION */}
        {activeTab === 'reports' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Reported Events & Content Moderation</h1>
            <p style={{ color: COLORS.textSecondary, marginBottom: '28px' }}>
              Review community reports against event listings to prevent spam, fraud, or inappropriate postings.
            </p>

            <div style={{ backgroundColor: COLORS.secondaryBg, borderRadius: '12px', border: `1px solid ${COLORS.separator}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.separator}`, backgroundColor: '#181818' }}>
                    <th style={{ padding: '16px 20px' }}>Event Name</th>
                    <th style={{ padding: '16px 20px' }}>Reporter</th>
                    <th style={{ padding: '16px 20px' }}>Reason</th>
                    <th style={{ padding: '16px 20px' }}>Status</th>
                    <th style={{ padding: '16px 20px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${COLORS.separator}` }}>
                      <td style={{ padding: '16px 20px', fontWeight: 600 }}>{r.eventTitle}</td>
                      <td style={{ padding: '16px 20px', color: COLORS.textSecondary }}>{r.reporterName}</td>
                      <td style={{ padding: '16px 20px', color: COLORS.warning }}>{r.reason}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: r.status === 'pending' ? `${COLORS.warning}33` : `${COLORS.primaryAccent}33`,
                          color: r.status === 'pending' ? COLORS.warning : COLORS.primaryAccent,
                        }}>
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {r.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleResolveReport(r.id, 'remove')}
                              style={{ padding: '6px 12px', backgroundColor: COLORS.danger, color: '#FFF', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                            >
                              Remove Event
                            </button>
                            <button
                              onClick={() => handleResolveReport(r.id, 'dismiss')}
                              style={{ padding: '6px 12px', backgroundColor: 'transparent', color: COLORS.textSecondary, border: `1px solid ${COLORS.separator}`, borderRadius: '6px', fontSize: '12px' }}
                            >
                              Dismiss
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: COLORS.textDisabled, fontSize: '12px' }}>Resolved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VERIFICATION REQUESTS */}
        {activeTab === 'verification' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Organization Verification Requests</h1>
            <p style={{ color: COLORS.textSecondary, marginBottom: '28px' }}>
              Approve clubs and councils to publish verified campus listings and access organizer analytics.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {verificationRequests.map(v => (
                <div
                  key={v.id}
                  style={{
                    backgroundColor: COLORS.secondaryBg,
                    border: `1px solid ${COLORS.separator}`,
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{v.orgName}</div>
                    <div style={{ fontSize: '13px', color: COLORS.primaryAccent, marginTop: '2px' }}>{v.college}</div>
                    <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '6px' }}>
                      Requested by: <strong>{v.requestedBy}</strong> • Evidence: {v.documents}
                    </div>
                  </div>

                  <div>
                    {v.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleReviewVerification(v.id, 'approved')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: COLORS.primaryAccent,
                            color: '#000000',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 700,
                          }}
                        >
                          Approve Organization
                        </button>
                        <button
                          onClick={() => handleReviewVerification(v.id, 'rejected')}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            color: COLORS.danger,
                            border: `1px solid ${COLORS.danger}`,
                            borderRadius: '6px',
                            fontWeight: 600,
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        backgroundColor: v.status === 'approved' ? `${COLORS.primaryAccent}33` : `${COLORS.danger}33`,
                        color: v.status === 'approved' ? COLORS.primaryAccent : COLORS.danger,
                      }}>
                        {v.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: COLLEGES & CAMPUSES */}
        {activeTab === 'colleges' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Colleges & Multi-Campus Setup</h1>
            <p style={{ color: COLORS.textSecondary, marginBottom: '28px' }}>
              Scale your event network by adding new universities and colleges to the federation.
            </p>

            {/* Add College Form */}
            <form onSubmit={handleAddCollege} style={{
              backgroundColor: COLORS.secondaryBg,
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${COLORS.separator}`,
              marginBottom: '28px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-end',
            }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '6px' }}>College / University Name</label>
                <input
                  type="text"
                  placeholder="e.g. Indian Institute of Technology Bombay"
                  value={newCollegeName}
                  onChange={e => setNewCollegeName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    backgroundColor: COLORS.primaryBg,
                    border: `1px solid ${COLORS.separator}`,
                    color: '#FFF',
                  }}
                />
              </div>

              <div style={{ flex: 1.5 }}>
                <label style={{ display: 'block', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '6px' }}>City, State</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={newCollegeLoc}
                  onChange={e => setNewCollegeLoc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    backgroundColor: COLORS.primaryBg,
                    border: `1px solid ${COLORS.separator}`,
                    color: '#FFF',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: COLORS.primaryAccent,
                  color: '#000000',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  height: '42px',
                }}
              >
                Add Campus
              </button>
            </form>

            {/* Colleges Table */}
            <div style={{ backgroundColor: COLORS.secondaryBg, borderRadius: '12px', border: `1px solid ${COLORS.separator}`, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.separator}`, backgroundColor: '#181818' }}>
                    <th style={{ padding: '16px 20px' }}>College Name</th>
                    <th style={{ padding: '16px 20px' }}>Location</th>
                    <th style={{ padding: '16px 20px' }}>Active Events</th>
                    <th style={{ padding: '16px 20px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {collegesList.map(c => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.separator}` }}>
                      <td style={{ padding: '16px 20px', fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: '16px 20px', color: COLORS.textSecondary }}>{c.location}</td>
                      <td style={{ padding: '16px 20px', color: COLORS.primaryAccent, fontWeight: 700 }}>{c.activeEvents}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: `${COLORS.primaryAccent}33`, color: COLORS.primaryAccent }}>
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM SETTINGS */}
        {activeTab === 'settings' && (
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Security & API Environment</h1>
            <p style={{ color: COLORS.textSecondary, marginBottom: '28px' }}>
              Production configuration for Supabase PostgreSQL, JWT verification, and rate limiting.
            </p>

            <div style={{ backgroundColor: COLORS.secondaryBg, borderRadius: '12px', border: `1px solid ${COLORS.separator}`, padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 600 }}>Backend REST API Endpoint</div>
                <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '4px' }}>http://localhost:3000/api</div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 600 }}>Supabase Row Level Security (RLS)</div>
                <div style={{ fontSize: '13px', color: COLORS.primaryAccent, marginTop: '4px' }}>Enforced on profiles, events, and registrations</div>
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>CORS & Allowed Origins</div>
                <div style={{ fontSize: '13px', color: COLORS.textSecondary, marginTop: '4px' }}>http://localhost:8081, http://localhost:5173</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
