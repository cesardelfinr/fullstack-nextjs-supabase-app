"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface Workspace {
  id: string;
  name: string;
  owner: string;
  created_at: string;
}

export default function WorkspacePage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  // Limpiar campos solo cuando se abre el modal
  const handleOpenCreateForm = () => {
    setNewNoteTitle("");
    setNewNoteContent("");
    setShowCreateForm(true);
  };
  // Editor de texto rico (TinyMCE)
  // Usar textarea directamente para evitar parpadeos y problemas de hydration
  const [creating, setCreating] = useState(false);
  // Miembros
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  // Cargar miembros
  const fetchMembers = async () => {
    setLoadingMembers(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/memberships?workspaceId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      } else {
        setInviteError("Error al cargar miembros");
      }
    } catch {
      setInviteError("Error de conexión");
    } finally {
      setLoadingMembers(false);
    }
  };

  // Invitar/agregar miembro
  const inviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteError(null);
    try {
      // Buscar usuario por email
      const resUser = await fetch(`/api/find-user?email=${encodeURIComponent(inviteEmail)}`);
      if (!resUser.ok) {
        setInviteError("Usuario no encontrado");
        setInviting(false);
        return;
      }
      const user = await resUser.json();
      // Invitar
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: id, userId: user.id }),
      });
      if (res.ok) {
        setInviteEmail("");
        fetchMembers();
      } else {
        setInviteError("No se pudo invitar/agregar");
      }
    } catch {
      setInviteError("Error de conexión");
    } finally {
      setInviting(false);
    }
  };
  // Estado para modal de nota
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && id) {
      fetchWorkspace();
      fetchNotes();
    }
    // eslint-disable-next-line
  }, [user, id]);

  const fetchWorkspace = async () => {
    try {
      const res = await fetch(`/api/workspaces?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        const ws = data.find((w: Workspace) => w.id === id);
        setWorkspace(ws || null);
      } else {
        setError("No se pudo cargar el workspace");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/notes?workspaceId=${id}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else {
        setError("No se pudieron cargar las notas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="container py-5">
        <button className="btn btn-outline-secondary mb-3" onClick={() => router.push('/dashboard')}>
          ← Volver
        </button>
        <div className="alert alert-warning">Workspace no encontrado o no tienes acceso.</div>
      </div>
    );
  }

  // Crear nota
  const createNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newNoteTitle.trim()) return;
    setCreating(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: id,
          authorId: user.id,
          title: newNoteTitle.trim(),
          content: newNoteContent.trim(),
        }),
      });
      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        setShowCreateForm(false);
      } else {
        setError('Error al crear la nota');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  // Guardar cambios de nota
  const saveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote || !editTitle.trim()) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle.trim(), content: editContent.trim() }),
      });
      if (response.ok) {
        const updated = await response.json();
        setNotes(notes.map(n => n.id === updated.id ? updated : n));
        setSelectedNote(null);
      } else {
        setError('Error al guardar cambios');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar nota
  const deleteNote = async () => {
    if (!selectedNote) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/notes/${selectedNote.id}`, { method: 'DELETE' });
      if (response.ok) {
        setNotes(notes.filter(n => n.id !== selectedNote.id));
        setSelectedNote(null);
      } else {
        setError('Error al eliminar la nota');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4 gap-3">
        <button className="btn btn-outline-secondary" onClick={() => router.push('/dashboard')}>
          ← Volver
        </button>
        <h2 className="mb-0">{workspace.name}</h2>
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-outline-info" onClick={() => { setShowMembers(true); fetchMembers(); }}>
            Miembros
          </button>
          <button className="btn btn-primary" onClick={handleOpenCreateForm}>
            + Nueva Nota
          </button>
        </div>
      </div>
      {/* Modal de miembros */}
      {showMembers && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Miembros del Workspace</h5>
                <button type="button" className="btn-close" onClick={() => setShowMembers(false)}></button>
              </div>
              <div className="modal-body">
                {loadingMembers ? (
                  <div className="text-center py-3">
                    <span className="spinner-border"></span>
                  </div>
                ) : (
                  <ul className="list-group mb-3">
                    {members.length === 0 ? (
                      <li className="list-group-item text-muted">No hay miembros aún.</li>
                    ) : (
                      members.map((m, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{m.email}</span>
                          <span className="badge bg-secondary">{m.role}</span>
                        </li>
                      ))
                    )}
                  </ul>
                )}
                <form onSubmit={inviteMember} className="d-flex gap-2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email del usuario"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    required
                    disabled={inviting}
                  />
                  <button className="btn btn-success" type="submit" disabled={inviting || !inviteEmail}>
                    {inviting ? <span className="spinner-border spinner-border-sm"></span> : 'Invitar'}
                  </button>
                </form>
                {inviteError && <div className="alert alert-danger mt-2">{inviteError}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Modal para crear nota */}
      {showCreateForm && (
  <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nueva Nota</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateForm(false)}></button>
              </div>
              <form onSubmit={createNote}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newNoteTitle}
                      onChange={e => setNewNoteTitle(e.target.value)}
                      required
                      disabled={creating}
                      placeholder="Ej: Idea principal"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contenido</label>
                    <textarea
                      className="form-control"
                      style={{ minHeight: 150, fontFamily: 'inherit', fontSize: 15, resize: 'vertical' }}
                      value={newNoteContent}
                      onChange={e => setNewNoteContent(e.target.value)}
                      disabled={creating}
                      placeholder="Escribe tu nota aquí..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)} disabled={creating}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={creating || !newNoteTitle.trim()}>
                    {creating ? (<><span className="spinner-border spinner-border-sm me-2"></span>Creando...</>) : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        {notes.length === 0 ? (
          <div className="text-muted">No hay notas en este workspace.</div>
        ) : (
          notes.map(note => (
            <div key={note.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text text-truncate" style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                    {note.content
                      ? note.content.replace(/(https?:\/\/\S+)/g, (url) => `<a href='${url}' target='_blank' rel='noopener noreferrer'>${url}</a>`) // links
                      : "(Sin contenido)"}
                  </p>
                  <p className="card-text text-muted" style={{ fontSize: 12 }}>
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => {
                    setSelectedNote(note);
                    setEditTitle(note.title);
                    setEditContent(note.content || "");
                  }}>
                    Ver Nota
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de nota seleccionada */}
      {selectedNote && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Nota</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedNote(null)}></button>
              </div>
              <form onSubmit={saveNote}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                      disabled={saving || deleting}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contenido</label>
                    <textarea
                      className="form-control"
                      style={{ minHeight: 150, fontFamily: 'inherit', fontSize: 15, resize: 'vertical' }}
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      disabled={saving || deleting}
                      placeholder="Escribe tu nota aquí..."
                    />
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button type="button" className="btn btn-danger" onClick={deleteNote} disabled={saving || deleting}>
                    {deleting ? (<span className="spinner-border spinner-border-sm me-2"></span>) : null}
                    Eliminar
                  </button>
                  <div>
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setSelectedNote(null)} disabled={saving || deleting}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving || !editTitle.trim()}>
                      {saving ? (<span className="spinner-border spinner-border-sm me-2"></span>) : null}
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
