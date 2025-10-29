-- Tabla de workspaces
create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Tabla de membresías
create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  workspace_id uuid references workspaces(id) not null,
  role text default 'member',
  created_at timestamp with time zone default timezone('utc', now()),
  unique (user_id, workspace_id)
);

-- Tabla de notas
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) not null,
  author_id uuid references auth.users not null,
  title text not null,
  content text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Compartición de notas (opcional, para compartir con miembros específicos)
create table if not exists note_shares (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references notes(id) not null,
  user_id uuid references auth.users not null,
  shared_at timestamp with time zone default timezone('utc', now()),
  unique (note_id, user_id)
);

-- Habilitar RLS
alter table workspaces enable row level security;
alter table memberships enable row level security;
alter table notes enable row level security;
alter table note_shares enable row level security;

-- Políticas básicas de RLS (ejemplo, se pueden ajustar)
create policy "Workspace owner or member can access" on workspaces
  for select using (
    auth.uid() = owner or
    exists (select 1 from memberships m where m.workspace_id = id and m.user_id = auth.uid())
  );

create policy "Members can access their memberships" on memberships
  for select using (user_id = auth.uid());

create policy "Members can access notes in their workspace" on notes
  for select using (
    exists (select 1 from memberships m where m.workspace_id = notes.workspace_id and m.user_id = auth.uid())
  );

create policy "Note is shared with user" on note_shares
  for select using (user_id = auth.uid());
