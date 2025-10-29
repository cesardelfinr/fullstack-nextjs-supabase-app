import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabaseAdmin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email requerido" }, { status: 400 });
  }
  // Buscar usuario en la vista pública user_emails
  const { data, error } = await supabaseAdmin
    .from("user_emails")
    .select("id, email")
    .eq("email", email)
    .limit(1)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: error?.message || "Usuario no encontrado" }, { status: 404 });
  }
  return NextResponse.json(data);
}
