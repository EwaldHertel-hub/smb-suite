'use client';

import { use, useState } from 'react';
import Protected from '@/components/Protected';
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
} from '@/store/slices/projectsApi';
import { useGetUsersQuery } from '@/store/slices/usersApi';
import { useGetClientsQuery } from '@/store/slices/clientsApi';
import Link from 'next/link';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useGetProjectsQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const [createProject, { isLoading: creating }] = useCreateProjectMutation();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    clientId: '',
    userId: '',
    billingType: 'TIME_AND_MATERIAL',
    hourlyRate: '',
    budgetHours: '',
    repoUrl: '',
    techStack: 'Next.js, NestJS, PostgreSQL',
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name) {
      setErrorMsg('Projektname ist erforderlich.');
      return;
    }

    try {
      await createProject({
        name: form.name,
        clientId: form.clientId || undefined,
        userId: form.userId || undefined,
        billingType: form.billingType,
        hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
        budgetHours: form.budgetHours ? Number(form.budgetHours) : undefined,
        repoUrl: form.repoUrl || undefined,
        techStack: form.techStack || undefined,
      }).unwrap();

      setForm({
        name: '',
        clientId: '',
        userId: '',
        billingType: 'TIME_AND_MATERIAL',
        hourlyRate: '',
        budgetHours: '',
        repoUrl: '',
        techStack: 'Next.js, NestJS, PostgreSQL',
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Projekt konnte nicht angelegt werden.');
    }
  };

  return (
    <Protected>
      <main className="grid">
        <h1>Projekte</h1>

        {errorMsg && (
          <div className="card" style={{ borderColor: '#b94a4a', color: '#ffbdbd' }}>
            {errorMsg}
          </div>
        )}

        {/* Anlage */}
        <div className="card">
          <h2>Neues Projekt anlegen</h2>
          <form className="grid" style={{ gap: 12 }} onSubmit={onSubmit}>
            <div className="row">
              <div style={{ flex: '2 1 260px' }}>
                <div className="label">Projektname</div>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="z.B. Hertel Webagentur Website Relaunch"
                  required
                />
              </div>
              <div style={{ flex: '2 1 260px' }}>
                <div className="label">Kunde</div>
                <select
                  className="input"
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                >
                  <option value="">– kein Kunde –</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ flex: '2 1 260px' }}>
                <div className="label">Mitarbeiter</div>
                <select
                  className="input"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                >
                  <option value="">– kein Mitarbeiter –</option>
                  {users.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Abrechnungsmodell</div>
                <select
                  className="input"
                  value={form.billingType}
                  onChange={(e) =>
                    setForm({ ...form, billingType: e.target.value })
                  }
                >
                  <option value="TIME_AND_MATERIAL">Stundenbasis</option>
                  <option value="FIXED_PRICE">Festpreis</option>
                  <option value="RETAINER">Retainer</option>
                </select>
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Stundensatz (€)</div>
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={form.hourlyRate}
                  onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                  placeholder="z.B. 90"
                />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Budget (Stunden)</div>
                <input
                  className="input"
                  type="number"
                  step="0.1"
                  value={form.budgetHours}
                  onChange={(e) => setForm({ ...form, budgetHours: e.target.value })}
                  placeholder="z.B. 80"
                />
              </div>
            </div>

            <div className="row">
              <div style={{ flex: '2 1 260px' }}>
                <div className="label">Repository URL</div>
                <input
                  className="input"
                  value={form.repoUrl}
                  onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
                  placeholder="z.B. https://github.com/dein-user/dein-projekt"
                />
              </div>
            </div>

            <div className="row">
              <div style={{ flex: '2 1 260px' }}>
                <div className="label">Tech-Stack</div>
                <input
                  className="input"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                />
              </div>
            </div>

            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <button className="btn primary" disabled={creating}>
                {creating ? 'Anlegen...' : 'Projekt anlegen'}
              </button>
            </div>
          </form>
        </div>

        {/* Liste */}
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Projektliste</h2>
          {isLoading ? (
            <p>Lade Projekte...</p>
          ) : projects.length === 0 ? (
            <p>Noch keine Projekte angelegt.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Kunde</th>
                  <th>Abrechnung</th>
                  <th>Repo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.client?.name ?? '—'}</td>
                    <td>{p.billingType}</td>
                    <td>
                      {p.repoUrl ? (
                        <a href={p.repoUrl} target="_blank" className="btn">
                          Repo
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}`} className="btn">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </Protected>
  );
}
