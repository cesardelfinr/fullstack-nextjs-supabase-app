"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Workspace {
  id: string;
  name: string;
  owner: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [creating, setCreating] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Cargar workspaces del usuario
  useEffect(() => {
    if (user) {
      fetchWorkspaces();
    }
  }, [user]);

  const fetchWorkspaces = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/workspaces?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
      } else {
        setError('Error al cargar workspaces');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newWorkspaceName.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newWorkspaceName.trim(),
          userId: user.id,
        }),
      });

      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspaces([...workspaces, newWorkspace]);
        setNewWorkspaceName('');
        setShowCreateForm(false);
      } else {
        setError('Error al crear workspace');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
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

  if (!user) {
    return null; // El useEffect ya redirige
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <h1 className="navbar-brand h4 mb-0">📋 Workspace Manager</h1>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">
              👋 Hola, {user.email}
            </span>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={handleSignOut}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Actions */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Mis Workspaces</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            + Nuevo Workspace
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Nuevo Workspace</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateForm(false)}
                  ></button>
                </div>
                <form onSubmit={createWorkspace}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre del Workspace</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newWorkspaceName}
                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                        placeholder="Ej: Proyecto Personal"
                        required
                        disabled={creating}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowCreateForm(false)}
                      disabled={creating}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={creating || !newWorkspaceName.trim()}
                    >
                      {creating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creando...
                        </>
                      ) : (
                        'Crear'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Workspaces Grid */}
        {workspaces.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <i className="bi bi-folder2-open" style={{ fontSize: '4rem', color: '#dee2e6' }}></i>
            </div>
            <h4 className="text-muted">No tienes workspaces aún</h4>
            <p className="text-muted">Crea tu primer workspace para comenzar a organizar tus notas</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              Crear mi primer workspace
            </button>
          </div>
        ) : (
          <div className="row">
            {workspaces.map((workspace) => (
              <div key={workspace.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{workspace.name}</h5>
                    <p className="card-text text-muted">
                      Creado el {new Date(workspace.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => router.push(`/workspace/${workspace.id}`)}
                    >
                      Abrir Workspace
                    </button>
                    {/* Solo el owner puede borrar */}
                    {user && workspace.owner === user.id && (
                      <button
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={() => setWorkspaceToDelete(workspace)}
                        title="Borrar workspace"
                      >
                        <span role="img" aria-label="borrar">🗑️</span>
                      </button>
                    )}
      {/* Modal de confirmación de borrado */}
      {workspaceToDelete && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Borrar Workspace</h5>
                <button type="button" className="btn-close" onClick={() => setWorkspaceToDelete(null)}></button>
              </div>
              <div className="modal-body">
                <p>¿Seguro que deseas borrar el workspace <b>{workspaceToDelete.name}</b>? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setWorkspaceToDelete(null)} disabled={deleting}>Cancelar</button>
                <button
                  className="btn btn-danger"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    const res = await fetch(`/api/workspaces?workspaceId=${workspaceToDelete.id}&userId=${user.id}`, { method: 'DELETE' });
                    setDeleting(false);
                    if (res.ok) {
                      setWorkspaces(workspaces.filter(w => w.id !== workspaceToDelete.id));
                      setWorkspaceToDelete(null);
                    } else {
                      const err = await res.json();
                      setError(err.error || 'Error al borrar workspace');
                    }
                  }}
                >
                  {deleting ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Borrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}