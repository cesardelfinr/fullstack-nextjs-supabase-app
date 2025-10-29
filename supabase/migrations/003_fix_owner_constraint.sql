-- Hacer que el campo owner sea opcional para desarrollo
ALTER TABLE workspaces ALTER COLUMN owner DROP NOT NULL;

-- También podemos insertar un usuario de prueba directamente
INSERT INTO auth.users (id, email, created_at, updated_at) 
VALUES ('00e6e71a-07a7-4e91-9d53-8889f7f6a9cc', 'test@example.com', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;