"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  
  const router = useRouter();
  const { user } = useAuth();

  // Redirigir al dashboard si ya está autenticado (usar useEffect para evitar error de React)
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("¡Bienvenido!");
        router.push('/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Revisa tu correo para confirmar el registro.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ maxWidth: 400, width: '100%' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            
            <button
              className="btn btn-primary w-100 mb-3"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {isLogin ? 'Iniciando...' : 'Registrando...'}
                </>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Registrarse'
              )}
            </button>
          </form>
          
          <div className="text-center">
            <button
              className="btn btn-link text-decoration-none"
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
          
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              <small>{error}</small>
            </div>
          )}
          {success && (
            <div className="alert alert-success mt-3" role="alert">
              <small>{success}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
