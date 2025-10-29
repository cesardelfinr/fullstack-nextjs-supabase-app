-- Vista pública para exponer solo id y email de usuarios
create or replace view public.user_emails as
select id, email from auth.users;

grant select on public.user_emails to anon, authenticated, service_role;
