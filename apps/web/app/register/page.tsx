'use client';
import { useState } from 'react';
import { useRegisterMutation } from '@/store/api/apiSlice';
import { useDispatch } from 'react-redux';
import { setTokens } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', organizationName:'' });
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await register(form).unwrap();
    dispatch(setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user }));
    router.push('/dashboard');
  };

  return (
    <main style={{ maxWidth: 520, margin: '40px auto' }}>
      <h1>Registrieren</h1>
      <form className="grid" style={{ gap: 10 }} onSubmit={submit}>
        <label className="label">Name</label>
        <input className="input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />

        <label className="label">E-Mail</label>
        <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />

        <label className="label">Passwort</label>
        <input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />

        <label className="label">Firmenname (optional)</label>
        <input className="input" value={form.organizationName} onChange={e=>setForm({...form, organizationName:e.target.value})} placeholder="Musterfirma GmbH" />

        {error && <div className="card" style={{ borderColor:'#b94a4a', color:'#ffbdbd' }}>
          Registrierung fehlgeschlagen
        </div>}

        <button className="btn primary" disabled={isLoading}>{isLoading ? '...' : 'Account anlegen'}</button>
      </form>
      <p style={{ color:'#9aa4b2', marginTop: 12 }}>
        Bereits ein Konto? <a href="/login">Zum Login</a>
      </p>
    </main>
  );
}