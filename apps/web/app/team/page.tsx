"use client";

import { useState } from "react";
import Protected from "@/components/Protected";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/store/slices/usersApi";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  department?: string;
  position?: string;
  isActive: boolean;
};

export default function TeamPage() {
  const { data: users = [], isLoading: userLoading } = useGetUsersQuery();
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER" as "OWNER" | "ADMIN" | "MEMBER",
    department: "",
    position: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<UserRow>>({});

  const saving = creating || updating || deleting;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name || !form.email || !form.password) {
      setErrorMsg("Name, E-Mail und Passwort sind erforderlich.");
      return;
    }

    try {
      await createUser({
        email: form.email,
        name: form.name,
        password: form.password,
        role: form.role,
        department: form.department || undefined,
        position: form.position || undefined,
      }).unwrap();

      setForm({
        name: "",
        email: "",
        password: "",
        role: "MEMBER",
        department: "",
        position: "",
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.data?.message ?? "Mitarbeiter konnte nicht angelegt werden."
      );
    }
  };

  const startEdit = (u: UserRow) => {
    setEditingId(u.id);
    setEditRow(u);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRow({});
  };

  const saveEdit = async (id: string) => {
    setErrorMsg(null);
    try {
      await updateUser({
        id,
        data: {
          name: editRow.name,
          role: editRow.role,
          department: editRow.department,
          position: editRow.position,
          isActive: editRow.isActive,
        },
      }).unwrap();
      setEditingId(null);
      setEditRow({});
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Mitarbeiter konnte nicht aktualisiert werden.");
    }
  };

  const removeUser = async (id: string) => {
    if (!confirm("Mitarbeiter wirklich deaktivieren?")) return;
    setErrorMsg(null);
    try {
      await deleteUser({ id }).unwrap();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Mitarbeiter konnte nicht deaktiviert werden.");
    }
  };

  return (
    <Protected>
      <main className="grid">
        <h1>Team & Mitarbeiter</h1>

        {errorMsg && (
          <div
            className="card"
            style={{ borderColor: "#b94a4a", color: "#ffbdbd" }}
          >
            {errorMsg}
          </div>
        )}

        {/* Anlage-Formular */}
        <div className="card">
          <h2>Neuen Mitarbeiter anlegen</h2>
          <form className="grid" style={{ gap: 12 }} onSubmit={handleCreate}>
            <div className="row">
              <div style={{ flex: "2 1 260px" }}>
                <div className="label">Name</div>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div style={{ flex: "2 1 260px" }}>
                <div className="label">E-Mail</div>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div style={{ flex: "2 1 260px" }}>
                <div className="label">Passwort</div>
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  placeholder="Initialpasswort"
                />
              </div>
              <div style={{ flex: "1 1 160px" }}>
                <div className="label">Rolle</div>
                <select
                  className="input"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as "OWNER" | "ADMIN" | "MEMBER",
                    })
                  }
                >
                  <option value="MEMBER">Mitarbeiter</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Inhaber</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div style={{ flex: "1 1 160px" }}>
                <div className="label">Abteilung</div>
                <input
                  className="input"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  placeholder="z.B. Buchhaltung"
                />
              </div>
              <div style={{ flex: "1 1 160px" }}>
                <div className="label">Position</div>
                <input
                  className="input"
                  value={form.position}
                  onChange={(e) =>
                    setForm({ ...form, position: e.target.value })
                  }
                  placeholder="z.B. Sachbearbeiter"
                />
              </div>
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn primary" disabled={creating}>
                {creating ? "Anlegen..." : "Mitarbeiter anlegen"}
              </button>
            </div>
          </form>
        </div>

        {/* Team-Liste */}
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Teamübersicht</h2>
          {userLoading ? (
            <p>Lade Team...</p>
          ) : users.length === 0 ? (
            <p>Noch keine weiteren Mitarbeiter angelegt.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>E-Mail</th>
                  <th>Rolle</th>
                  <th>Abteilung</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: UserRow) => {
                  const isEditing = editingId === u.id;
                  const row = isEditing ? editRow : u;

                  return (
                    <tr key={u.id}>
                      <td>
                        {isEditing ? (
                          <input
                            className="input"
                            value={row.name ?? ""}
                            onChange={(e) =>
                              setEditRow({ ...row, name: e.target.value })
                            }
                          />
                        ) : (
                          u.name
                        )}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        {isEditing ? (
                          <select
                            className="input"
                            value={row.role ?? "MEMBER"}
                            onChange={(e) =>
                              setEditRow({
                                ...row,
                                role: e.target.value as UserRow["role"],
                              })
                            }
                          >
                            <option value="MEMBER">Mitarbeiter</option>
                            <option value="ADMIN">Admin</option>
                            <option value="OWNER">Inhaber</option>
                          </select>
                        ) : (
                          u.role
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input"
                            value={row.department ?? ""}
                            onChange={(e) =>
                              setEditRow({ ...row, department: e.target.value })
                            }
                          />
                        ) : (
                          (u.department ?? "—")
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input"
                            value={row.position ?? ""}
                            onChange={(e) =>
                              setEditRow({ ...row, position: e.target.value })
                            }
                          />
                        ) : (
                          (u.position ?? "—")
                        )}
                      </td>
                      <td>{u.isActive ? "Aktiv" : "Inaktiv"}</td>
                      <td className="row">
                        {isEditing ? (
                          <>
                            <button
                              className="btn primary"
                              onClick={() => saveEdit(u.id)}
                              disabled={saving}
                            >
                              Speichern
                            </button>
                            <button
                              className="btn"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Abbrechen
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn"
                              onClick={() => startEdit(u)}
                              disabled={saving}
                            >
                              Bearbeiten
                            </button>
                            {u.isActive && (
                              <button
                                className="btn"
                                onClick={() => removeUser(u.id)}
                                disabled={saving}
                              >
                                Deaktivieren
                              </button>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </Protected>
  );
}
