// DELETE: Borrar un workspace (y en cascada sus notas y membresías)
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const userId = searchParams.get("userId");
  if (!workspaceId || !userId) return NextResponse.json({ error: "workspaceId y userId requeridos" }, { status: 400 });

  // Solo el owner puede borrar el workspace
  const { data: ws, error: wsError } = await supabaseAdmin
    .from("workspaces")
    .select("owner")
    .eq("id", workspaceId)
    .single();
  if (wsError || !ws) return NextResponse.json({ error: wsError?.message || "Workspace no encontrado" }, { status: 404 });
  if (ws.owner !== userId) return NextResponse.json({ error: "Solo el owner puede borrar el workspace" }, { status: 403 });

  // Borrar notas
  await supabaseAdmin.from("notes").delete().eq("workspace_id", workspaceId);
  // Borrar membresías
  await supabaseAdmin.from("memberships").delete().eq("workspace_id", workspaceId);
  // Borrar workspace
  const { error: delError } = await supabaseAdmin.from("workspaces").delete().eq("id", workspaceId);
  if (delError) return NextResponse.json({ error: delError.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabaseAdmin";

// GET: Listar workspaces del usuario
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId requerido" }, { status: 400 });

  // Obtener los IDs de workspaces donde el usuario es miembro
  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("memberships")
    .select("workspace_id")
    .eq("user_id", userId);

  if (membershipsError) return NextResponse.json({ error: membershipsError.message }, { status: 500 });
  const workspaceIds = memberships?.map((m: any) => m.workspace_id) || [];

  if (workspaceIds.length === 0) return NextResponse.json([]);

  // Traer los datos de los workspaces
  const { data, error } = await supabaseAdmin
    .from("workspaces")
    .select("*")
    .in("id", workspaceIds);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Crear un nuevo workspace
export async function POST(req: NextRequest) {
  const { name, userId } = await req.json();
  if (!name || !userId) return NextResponse.json({ error: "name y userId requeridos" }, { status: 400 });

  // Crear workspace
  const { data: wsArr, error: wsError } = await supabaseAdmin
    .from("workspaces")
    .insert([{ name, owner: userId }])
    .select();

  if (wsError || !wsArr || wsArr.length === 0) {
    return NextResponse.json({ error: wsError?.message || "No se pudo crear el workspace" }, { status: 500 });
  }
  const ws = wsArr[0];

  // Crear membresía de owner
  const { error: memberError } = await supabaseAdmin
    .from("memberships")
    .insert([{ user_id: userId, workspace_id: ws.id, role: "owner" }]);

  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json(ws);
}
