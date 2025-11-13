'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useGetClientsQuery,
  useCreateClientMutation,
} from '@/store/api/apiSlice';
import Modal from '@/components/ui/Modal';

type Client = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  website?: string;
};

type EmployeeForm = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  isPrimary?: boolean;
};

export default function ClientsPage() {
  const { data: clients = [], isLoading } = useGetClientsQuery();
  const [createClient, { isLoading: creating }] = useCreateClientMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientForm, setClientForm] = useState<Partial<Client>>({
    country: 'DE',
  });

  const [employee, setEmployee] = useState<EmployeeForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    isPrimary: true,
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!clientForm.name) {
      return setError('Bitte einen Kundennamen angeben.');
    }
    if (!employee.firstName || !employee.lastName) {
      return setError('Bitte mindestens einen Mitarbeiter (Vor- & Nachname) angeben.');
    }

    try {
      await createClient({
        name: clientForm.name,
        email: clientForm.email,
        phone: clientForm.phone,
        street: clientForm.street,
        postalCode: clientForm.postalCode,
        city: clientForm.city,
        country: clientForm.country,
        website: clientForm.website,
        employees: [
          {
            ...employee,
            isPrimary: employee.isPrimary ?? true,
          },
        ],
      }).unwrap();

      // Form zurücksetzen
      setClientForm({ country: 'DE' });
      setEmployee({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        isPrimary: true,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.data?.message ?? 'Kunde konnte nicht angelegt werden.');
    }
  };

  return (
    <main className="grid">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Kunden</h1>
      </div>
      <button
          className="icon-button"
          onClick={() => setIsModalOpen(true)}
          style={{ alignSelf: "flex-start", marginTop: "1rem" }}
        >
          Info anzeigen
        </button>

      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Details zu den Einnahmen"
      >

        {error && (
          <div
            className="card"
            style={{ borderColor: '#b94a4a', color: '#ffbdbd', marginBottom: 12 }}
          >
            {error}
          </div>
        )}

        <form className="grid" style={{ gap: 12 }} onSubmit={onSubmit}>
          <div className="row">
            <div style={{ flex: '2 1 260px' }}>
              <div className="label">Kundenname</div>
              <input
                className="input"
                value={clientForm.name ?? ''}
                onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                required
              />
            </div>
            <div style={{ flex: '2 1 260px' }}>
              <div className="label">Website</div>
              <input
                className="input"
                value={clientForm.website ?? ''}
                onChange={(e) => setClientForm({ ...clientForm, website: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="row">
            <div style={{ flex: '2 1 260px' }}>
              <div className="label">E-Mail</div>
              <input
                className="input"
                type="email"
                value={clientForm.email ?? ''}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
              />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <div className="label">Telefon</div>
              <input
                className="input"
                value={clientForm.phone ?? ''}
                onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div style={{ flex: '2 1 260px' }}>
              <div className="label">Straße & Nr.</div>
              <input
                className="input"
                value={clientForm.street ?? ''}
                onChange={(e) => setClientForm({ ...clientForm, street: e.target.value })}
              />
            </div>
            <div style={{ flex: '1 1 120px' }}>
              <div className="label">PLZ</div>
              <input
                className="input"
                value={clientForm.postalCode ?? ''}
                onChange={(e) =>
                  setClientForm({ ...clientForm, postalCode: e.target.value })
                }
              />
            </div>
            <div style={{ flex: '2 1 200px' }}>
              <div className="label">Ort</div>
              <input
                className="input"
                value={clientForm.city ?? ''}
                onChange={(e) => setClientForm({ ...clientForm, city: e.target.value })}
              />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <div className="label">Land</div>
              <input
                className="input"
                value={clientForm.country ?? ''}
                onChange={(e) => setClientForm({ ...clientForm, country: e.target.value })}
                placeholder="DE"
              />
            </div>
          </div>

          {/* Hauptansprechpartner */}
          <div className="card" style={{ marginTop: 8 }}>
            <h3>Hauptansprechpartner</h3>
            <div className="row">
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Vorname</div>
                <input
                  className="input"
                  value={employee.firstName ?? ''}
                  onChange={(e) =>
                    setEmployee({ ...employee, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Nachname</div>
                <input
                  className="input"
                  value={employee.lastName ?? ''}
                  onChange={(e) =>
                    setEmployee({ ...employee, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <div className="label">E-Mail</div>
                <input
                  className="input"
                  type="email"
                  value={employee.email ?? ''}
                  onChange={(e) =>
                    setEmployee({ ...employee, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="row">
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Telefon</div>
                <input
                  className="input"
                  value={employee.phone ?? ''}
                  onChange={(e) =>
                    setEmployee({ ...employee, phone: e.target.value })
                  }
                />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Abteilung</div>
                <input
                  className="input"
                  value={employee.department ?? ''}
                  onChange={(e) =>
                    setEmployee({ ...employee, department: e.target.value })
                  }
                  placeholder="z.B. Buchhaltung"
                />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <div className="label">Position</div>
                <input
                  className="input"
                  value={employee.position ?? ''}
                  onChange={(e) =>
                    setEmployee({ ...employee, position: e.target.value })
                  }
                  placeholder="z.B. Sachbearbeiter"
                />
              </div>
              <div style={{ flex: '0 0 140px', alignSelf: 'flex-end' }}>
                <label
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    fontSize: 12,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={!!employee.isPrimary}
                    onChange={(e) =>
                      setEmployee({ ...employee, isPrimary: e.target.checked })
                    }
                  />
                  Hauptansprechpartner
                </label>
              </div>
            </div>
          </div>

          <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="btn primary" disabled={creating}>
              {creating ? 'Anlegen…' : 'Kunde anlegen'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Kundenliste */}
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Bestehende Kunden</h2>
        {isLoading ? (
          <p>Lade Kunden…</p>
        ) : clients.length === 0 ? (
          <p>Noch keine Kunden angelegt.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Ort</th>
                <th>Website</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c: Client) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    {c.postalCode || c.city
                      ? `${c.postalCode ?? ''} ${c.city ?? ''}`.trim()
                      : '—'}
                  </td>
                  <td>
                    {c.website ? (
                      <a href={c.website} target="_blank" className="btn">
                        Website
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <Link href={`/clients/${c.id}`} className="btn">
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
  );
}
