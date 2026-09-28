'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Languages, LockKeyhole, Mail, Palette, Phone, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { DEFAULT_LANGUAGE, getLocale, t } from '../lib/i18n';
import { DEFAULT_THEME, getSafeTheme, THEMES } from '../lib/themes';

const copy = (lang, key) => t(lang, key);

export default function AuthPage({ mode = 'login' }) {
  const router = useRouter();
  const isRegister = mode === 'register';
  const [lang, setLang] = useState(DEFAULT_LANGUAGE);
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });

  useEffect(() => {
    try {
      const storedLang = getLocale(localStorage.getItem('smart-language') ? JSON.parse(localStorage.getItem('smart-language')) : DEFAULT_LANGUAGE);
      const storedTheme = getSafeTheme(localStorage.getItem('smart-theme') ? JSON.parse(localStorage.getItem('smart-theme')) : DEFAULT_THEME);
      setLang(storedLang); setTheme(storedTheme);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = getSafeTheme(theme);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('smart-language', JSON.stringify(lang));
      localStorage.setItem('smart-theme', JSON.stringify(theme));
    } catch {}
  }, [lang, theme]);

  const update = (key, value) => setForm((x) => ({ ...x, [key]: value }));
  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.email.trim() || !form.password.trim() || (isRegister && !form.name.trim())) {
      setError(copy(lang, 'Please complete all required fields.')); return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    const user = {
      name: form.name || form.email.split('@')[0] || 'Smart Operator',
      email: form.email.trim(), mobile: form.mobile.trim(), password: form.password,
      created: Date.now()
    };
    try { localStorage.setItem('smart-user', JSON.stringify(user)); } catch {}
    router.push('/');
  };

  return <main className="auth-page">
    <div className="auth-background" aria-hidden="true"><div/><div/><div/></div>
    <header className="auth-topbar">
      <button className="auth-brand" onClick={() => router.push('/')}><span className="brand-mark"><Sparkles size={18}/></span><span><b>SMART SOLUTION</b><small>MSR Technologies</small></span></button>
      <div className="auth-top-actions">
        <label className="auth-control"><Languages size={15}/><select value={lang} onChange={(e) => setLang(e.target.value)}><option value="bn">বাংলা</option><option value="en">English</option></select></label>
        <label className="auth-control"><Palette size={15}/><select value={theme} onChange={(e) => setTheme(getSafeTheme(e.target.value))}>{Object.values(THEMES).map((x) => <option key={x.key} value={x.key}>{copy(lang, x.name)}</option>)}</select></label>
      </div>
    </header>

    <section className="auth-layout">
      <div className="auth-pitch">
        <span className="eyebrow"><ShieldCheck size={14}/> {copy(lang, 'Secure local workspace')}</span>
        <h1>{isRegister ? copy(lang, 'Create your Smart Solution account.') : copy(lang, 'Welcome back to Smart Solution.')}</h1>
        <p>{copy(lang, 'Use your account to personalize the digital-center workspace while keeping your operational data in this browser.')}</p>
        <div className="auth-benefits">
          {[copy(lang, 'Personal workspace settings'), copy(lang, 'Saved theme and language'), copy(lang, 'Local-first operator profile')].map((x) => <div key={x}><CheckCircle2 size={17}/><span>{x}</span></div>)}
        </div>
      </div>

      <form className="auth-card" onSubmit={submit}>
        <div className="auth-card-icon"><LockKeyhole size={21}/></div>
        <div className="auth-card-heading"><h2>{isRegister ? copy(lang, 'Create account') : copy(lang, 'Sign in')}</h2><p>{isRegister ? copy(lang, 'Register a new operator profile.') : copy(lang, 'Sign in to continue to your workspace.')}</p></div>
        {error && <div className="auth-error">{error}</div>}
        <div className="auth-fields">
          {isRegister && <label className="field"><span>{copy(lang, 'Full name')}</span><div className="auth-input"><UserRound size={16}/><input value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name"/></div></label>}
          <label className="field"><span>{copy(lang, 'Email')}</span><div className="auth-input"><Mail size={16}/><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email"/></div></label>
          {isRegister && <label className="field"><span>{copy(lang, 'Mobile')}</span><div className="auth-input"><Phone size={16}/><input value={form.mobile} onChange={(e) => update('mobile', e.target.value)} autoComplete="tel"/></div></label>}
          <label className="field"><span>{copy(lang, 'Password')}</span><div className="auth-input"><LockKeyhole size={16}/><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} autoComplete={isRegister ? 'new-password' : 'current-password'}/><button type="button" onClick={() => setShowPassword((x) => !x)} aria-label={copy(lang, 'Show password')}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>
        </div>
        <button className="primary-btn auth-submit" disabled={loading}>{loading ? copy(lang, 'Signing in…') : isRegister ? <>{copy(lang, 'Create account')} <ArrowRight size={16}/></> : <>{copy(lang, 'Sign in')} <ArrowRight size={16}/></>}</button>
        <div className="auth-switch">{isRegister ? copy(lang, 'Already have an account?') : copy(lang, 'New here?')} <button type="button" className="link" onClick={() => router.push(isRegister ? '/login' : '/register')}>{isRegister ? copy(lang, 'Sign in') : copy(lang, 'Create account')}</button></div>
      </form>
    </section>

    <footer className="app-footer auth-footer"><span>© {new Date().getFullYear()} Smart Solution</span><span>{copy(lang, 'Development by')} <strong>MSR Technologies</strong></span></footer>
  </main>;
}
