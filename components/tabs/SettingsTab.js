import { useState, useEffect, useMemo } from 'react'
import { Spinner, TierTag, ScoreRing, CopyBtn, Modal, EmptyState, CATEGORIES, STAGES, parseEmails, callAI } from '../shared'
import { PageHeader } from './helpers'
function SettingsTab() {
  const [status, setStatus] = useState(null)
  const [testing, setTesting] = useState(false)

  const testKeys = async () => {
    setTesting(true); setStatus(null)
    try {
      const res = await fetch('/api/test-keys')
      const data = await res.json()
      setStatus(data)
    } catch (e) {
      setStatus({ error: e.message })
    }
    setTesting(false)
  }

  const StatusBadge = ({ s }) => {
    if (!s) return null
    const map = {
      working:      { color: '#7a9e49', bg: 'rgba(122,158,73,0.12)', label: '✓ Working' },
      error:        { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',  label: '✗ Error' },
      missing:      { color: '#6b7280', bg: 'rgba(107,114,128,0.12)',label: '— Not set' },
    }
    const { color, bg, label } = map[s.status] || map.error
    return <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: bg, color }}>{label}</span>
  }

  return (
    <div>
      <PageHeader title="Settings & Debug" sub="Test your API keys and diagnose AI issues" />

      <div className="card card-p" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>API Key Status</div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>Click to test whether your Gemini and Google Places keys are working correctly.</div>
          </div>
          <button onClick={testKeys} disabled={testing} className="btn btn-primary">{testing ? <Spinner size={14} /> : '🔍 Test Keys'}</button>
        </div>
        {status && (
          <div className="fade-up">
            {status.error && <div style={{ color: '#ef4444', fontSize: 13, padding: '10px', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>Error: {status.error}</div>}
            {status.gemini && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Gemini AI (for emails, research, SMS, proposals)</div>
                  {status.gemini.model && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Using model: {status.gemini.model}</div>}
                  {status.gemini.error && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>{status.gemini.error}</div>}
                </div>
                <StatusBadge s={status.gemini} />
              </div>
            )}
            {status.places && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Google Places (for lead searching)</div>
                  {status.places.error && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>{status.places.error}{status.places.details ? ` — ${status.places.details}` : ''}</div>}
                </div>
                <StatusBadge s={status.places} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card card-p" style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>If AI isn't working</div>
        {[
          { n: '1', t: 'Check your Gemini key', d: 'Go to aistudio.google.com/apikey — make sure the key exists and hasn\'t been deleted. Generate a new one if needed.' },
          { n: '2', t: 'Add it to Vercel', d: 'Go to your Vercel project → Settings → Environment Variables. The key name must be exactly: GEMINI_API_KEY' },
          { n: '3', t: 'Redeploy after adding', d: 'Vercel requires a redeploy after adding environment variables. Go to Deployments → click the three dots → Redeploy.' },
          { n: '4', t: 'Check the key has no spaces', d: 'When pasting your key into Vercel, make sure there are no leading or trailing spaces.' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(109,138,64,0.15)', color: 'var(--olive)', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
            <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{s.t}</div><div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{s.d}</div></div>
          </div>
        ))}
        <div style={{ marginTop: 8 }}>
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', marginRight: 8 }}>Get Gemini Key →</a>
          <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Open Vercel →</a>
        </div>
      </div>

      <div className="card card-p">
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Your environment</div>
        {[
          { l: 'App version', v: 'Robertson Marketing CRM v2' },
          { l: 'AI models tried', v: 'gemini-2.0-flash → gemini-1.5-flash-latest → gemini-1.5-flash' },
          { l: 'Data storage', v: 'Browser localStorage (stays in this browser)' },
          { l: 'Hosting', v: 'Vercel (free tier)' },
        ].map(r => (
          <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
            <span style={{ color: 'var(--text3)' }}>{r.l}</span>
            <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export { SettingsTab }
