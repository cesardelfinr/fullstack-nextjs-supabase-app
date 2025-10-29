import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabaseAdmin";

// GET: Listar notas de un workspace
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId requerido" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("notes")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Crear una nueva nota
export async function POST(req: NextRequest) {
  const { workspaceId, authorId, title, content } = await req.json();
  if (!workspaceId || !authorId || !title) {
    return NextResponse.json({ error: "workspaceId, authorId y title requeridos" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("notes")
    .insert([{ workspace_id: workspaceId, author_id: authorId, title, content }])
    .select();
  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: error?.message || "No se pudo crear la nota" }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}
