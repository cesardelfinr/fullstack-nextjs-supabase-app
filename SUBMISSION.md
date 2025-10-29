# SUBMISSION.md

## Instrucciones de configuración

1. Clona el repositorio:
   ```sh
   git clone https://github.com/cesardelfinr/fullstack-nextjs-supabase-app.git
   cd fullstack-nextjs-supabase-app
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Instala Supabase CLI y Docker si no los tienes.
4. Inicia Supabase localmente:
   ```sh
   supabase start
   ```
5. Aplica las migraciones:
   ```sh
   supabase db reset
   ```
6. Crea un archivo `.env.local` con las variables necesarias (ver ejemplo en README).
7. Ejecuta la app:
   ```sh
   npm run dev
   ```

## Decisiones de arquitectura

- **Next.js** para frontend y API routes.
- **Supabase** para autenticación y base de datos.
- **RLS** y validaciones en API para seguridad.
- **Modelo multi-tenant**: workspaces, membresías y notas relacionadas.
- **Componentes reutilizables** y separación de lógica de negocio.

Ventajas:
- Seguridad centralizada y validaciones dobles.
- Escalabilidad y claridad en el modelo de datos.

Desventajas:
- Complejidad extra en manejo de membresías y permisos.

## Enfoque de seguridad

- Uso de Supabase Auth para autenticación.
- Políticas RLS en tablas sensibles.
- Validaciones en rutas API para evitar acceso indebido.
- Emails enmascarados al mostrar miembros.

## Desglose de tiempo

- Setup inicial y Supabase: 1h
- Autenticación y registro: 0.5h
- Workspaces y membresías: 1.5h
- CRUD de notas: 1h
- UI y validaciones: 1h
- Pruebas y ajustes: 0.5h
- Documentación y video: 0.5h

## Limitaciones conocidas

- No hay colaboración en tiempo real.
- No hay roles avanzados ni permisos granulares.
- Falta responsividad móvil completa.
- No hay tests automatizados.
- Mejorable la experiencia de usuario en errores y feedback.

---

