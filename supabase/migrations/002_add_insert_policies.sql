-- Políticas de INSERT para permitir crear workspaces y membresías

-- Permitir a usuarios autenticados crear workspaces
create policy "Authenticated users can create workspaces" on workspaces
  for insert with check (auth.uid() = owner);

-- Permitir a usuarios autenticados crear membresías (cuando son el usuario de la membresía)
create policy "Users can create their own memberships" on memberships
  for insert with check (auth.uid() = user_id);

-- Permitir a owners de workspace crear membresías para otros usuarios
create policy "Workspace owners can create memberships" on memberships
  for insert with check (
    exists (
      select 1 from workspaces w 
      where w.id = workspace_id and w.owner = auth.uid()
    )
  );

-- Permitir a miembros de workspace crear notas
create policy "Workspace members can create notes" on notes
  for insert with check (
    exists (
      select 1 from memberships m 
      where m.workspace_id = notes.workspace_id and m.user_id = auth.uid()
    )
  );

-- Permitir a usuarios crear note_shares para notas que pueden ver
create policy "Users can share notes they have access to" on note_shares
  for insert with check (
    exists (
      select 1 from notes n
      join memberships m on m.workspace_id = n.workspace_id
      where n.id = note_id and m.user_id = auth.uid()
    )
  );