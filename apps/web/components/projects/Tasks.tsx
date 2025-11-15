"use client";

import React, { useState } from "react";
import {
  useGetProjectTasksQuery,
  useCreateProjectTaskMutation,
  useUpdateProjectTaskMutation,
  useDeleteProjectTaskMutation,
  useAddTaskTimeEntryMutation,
} from "@/store/slices/taskApi";

const Tasks = (id: string) => {
  const projectId: string = id.id;
  const { data: tasks = [], isLoading: loadingTasks } =
    useGetProjectTasksQuery(projectId);

    console.log(tasks)
  const [createTask, { isLoading: creatingTask }] =
    useCreateProjectTaskMutation();
  const [updateTask, { isLoading: updatingTask }] =
    useUpdateProjectTaskMutation();
  const [deleteTask, { isLoading: deletingTask }] =
    useDeleteProjectTaskMutation();

  const [taskError, setTaskError] = useState<string | null>(null);

  const savingTask = creatingTask || updatingTask || deletingTask;

  const [timeFormByTask, setTimeFormByTask] = useState<
    Record<string, { hours: string; note: string }>
  >({});
  const [timeError, setTimeError] = useState<string | null>(null);

  const [addTimeEntry, { isLoading: addingTime }] =
    useAddTaskTimeEntryMutation();

  const [taskForm, setTaskForm] = useState({
    title: "",
    priority: "MEDIUM",
  });

  const openTimeForm = (taskId: string) => {
    setTimeError(null);
    setTimeFormByTask((prev) => ({
      ...prev,
      [taskId]: prev[taskId] ?? { hours: "", note: "" },
    }));
  };

  const handleTimeChange = (
    taskId: string,
    field: "hours" | "note",
    value: string
  ) => {
    setTimeFormByTask((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] ?? { hours: "", note: "" }),
        [field]: value,
      },
    }));
  };

  const submitTime = async (taskId: string) => {
    setTimeError(null);
    const form = timeFormByTask[taskId];
    if (!form || !form.hours) {
      setTimeError("Bitte Stunden angeben.");
      return;
    }

    const hours = Number(form.hours);
    if (Number.isNaN(hours) || hours <= 0) {
      setTimeError("Stunden müssen größer als 0 sein.");
      return;
    }

    try {
      await addTimeEntry({
        projectId: projectId,
        taskId,
        data: {
          date: new Date().toISOString(),
          hours,
          note: form.note || undefined,
        },
      }).unwrap();

      // Formular zurücksetzen
      setTimeFormByTask((prev) => ({
        ...prev,
        [taskId]: { hours: "", note: "" },
      }));
    } catch (err: any) {
      console.error(err);
      setTimeError("Zeiteintrag konnte nicht gespeichert werden.");
    }
  };

  const onCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError(null);

    if (!taskForm.title) {
      setTaskError("Titel ist erforderlich.");
      return;
    }

    try {
      await createTask({
        projectId: projectId,
        data: {
          title: taskForm.title,
          priority: taskForm.priority,
        },
      }).unwrap();
      setTaskForm({ title: "", priority: "MEDIUM" });
    } catch (err: any) {
      console.error(err);
      setTaskError("Task konnte nicht angelegt werden.");
    }
  };

  const toggleStatus = async (task: any) => {
    const nextStatus = task.status === "DONE" ? "TODO" : "DONE";
    try {
      await updateTask({
        projectId: projectId,
        taskId: task.id,
        data: { status: nextStatus },
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const removeTask = async (taskId: string) => {
    if (!confirm("Task wirklich löschen?")) return;
    try {
      await deleteTask({ projectId: projectId, taskId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h2>Tasks</h2>
        {savingTask && (
          <span style={{ fontSize: 12, color: "#9aa4b2" }}>Speichere...</span>
        )}
        {timeError && (
          <div
            className="card"
            style={{ borderColor: "#b94a4a", color: "#ffbdbd" }}
          >
            {timeError}
          </div>
        )}
      </div>

      {taskError && (
        <div
          className="card"
          style={{ borderColor: "#b94a4a", color: "#ffbdbd" }}
        >
          {taskError}
        </div>
      )}

      {loadingTasks ? (
        <p>Lade Tasks...</p>
      ) : tasks.length === 0 ? (
        <p>Noch keine Tasks angelegt.</p>
      ) : (
        <table className="table" style={{ marginBottom: 16 }}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Priorität</th>
              <th>Titel</th>
              <th>Zeit (Std.)</th>
              <th>Fällig</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t: any) => {
              const totalHours = (t.timeEntries ?? []).reduce(
                (sum: number, te: any) => sum + Number(te.hours ?? 0),
                0
              );
              const timeForm = timeFormByTask[t.id] ?? {
                hours: "",
                note: "",
              };
              return (
                <tr key={t.id}>
                  <td>
                    <button className="btn" onClick={() => toggleStatus(t)}>
                      {t.status === "DONE" ? "✅ DONE" : "⬜ TODO"}
                    </button>
                  </td>
                  <td>{t.priority}</td>
                  <td>{t.title}</td>
                  <td>{totalHours.toFixed(2)}</td>
                  <td>
                    <div className="grid" style={{ gap: 4 }}>
                      <div className="row" style={{ gap: 4 }}>
                        <button
                          className="btn"
                          onClick={() => openTimeForm(t.id)}
                        >
                          Zeit hinzufügen
                        </button>
                        <button
                          className="btn"
                          onClick={() => removeTask(t.id)}
                          disabled={savingTask || addingTime}
                        >
                          Löschen
                        </button>
                      </div>

                      {/* Inline-Time-Form */}
                      {timeFormByTask[t.id] && (
                        <div
                          className="card"
                          style={{ padding: 8, marginTop: 4 }}
                        >
                          <div className="row" style={{ gap: 8 }}>
                            <input
                              className="input"
                              style={{ maxWidth: 90 }}
                              type="number"
                              step="0.25"
                              placeholder="Std."
                              value={timeForm.hours}
                              onChange={(e) =>
                                handleTimeChange(t.id, "hours", e.target.value)
                              }
                            />
                            <input
                              className="input"
                              placeholder="Notiz (optional)"
                              value={timeForm.note}
                              onChange={(e) =>
                                handleTimeChange(t.id, "note", e.target.value)
                              }
                            />
                            <button
                              className="btn primary"
                              onClick={() => submitTime(t.id)}
                              disabled={addingTime}
                            >
                              {addingTime ? "Speichern…" : "OK"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="row">
                    {/* hier könntest du später ein Edit-Form einbauen */}
                    <button
                      className="btn"
                      onClick={() => removeTask(t.id)}
                      disabled={savingTask}
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Task anlegen */}
      <form className="grid" style={{ gap: 8 }} onSubmit={onCreateTask}>
        <h3>Neue Task anlegen</h3>
        <div className="row">
          <div style={{ flex: "3 1 260px" }}>
            <div className="label">Titel</div>
            <input
              className="input"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({ ...taskForm, title: e.target.value })
              }
              placeholder="z.B. API für Projekte erweitern"
              required
            />
          </div>
          <div style={{ flex: "1 1 160px" }}>
            <div className="label">Priorität</div>
            <select
              className="input"
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  priority: e.target.value,
                })
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn primary" disabled={creatingTask}>
            {creatingTask ? "Hinzufügen..." : "Task hinzufügen"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Tasks;
