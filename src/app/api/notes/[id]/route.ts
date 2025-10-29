import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabaseAdmin";

// PUT: Actualizar una nota

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  const { id } = params;
  const { title, content } = await req.json();
  if (!title) {
    return NextResponse.json({ error: "title requerido" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("notes")
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();
  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: error?.message || "No se pudo actualizar la nota" }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}

// DELETE: Eliminar una nota

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  const { id } = params;
  const { error } = await supabaseAdmin
    .from("notes")
    .delete()
    .eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
