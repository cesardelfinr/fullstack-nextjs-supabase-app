import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/services/supabaseAdmin";

// GET: Listar miembros de un workspace
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId requerido" }, { status: 400 });
  }
  // 1. Traer los miembros (user_id, role)
  const { data: members, error: membersError } = await supabaseAdmin
    .from("memberships")
    .select("user_id, role")
    .eq("workspace_id", workspaceId);
  if (membersError) return NextResponse.json({ error: membersError.message }, { status: 500 });

  if (!members || members.length === 0) return NextResponse.json([]);

  // 2. Traer los emails de los usuarios desde la vista pública
  const userIds = members.map(m => m.user_id);
  const { data: users, error: usersError } = await supabaseAdmin
    .from("user_emails")
    .select("id, email")
    .in("id", userIds);
  if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 });

  // 3. Mapear user_id a email y enmascarar el correo
  const userMap = Object.fromEntries(users.map((u: any) => [u.id, u.email]));
  function maskEmail(email: string) {
    if (!email || !email.includes("@")) return email;
    const [user, domain] = email.split("@");
    // Mantener el usuario, ocultar el dominio (excepto el TLD)
    const tldMatch = domain.match(/\.[^\.]+$/);
    const tld = tldMatch ? tldMatch[0] : "";
    const domainMasked = ".".repeat(domain.length - tld.length) + tld;
    return `${user}@${domainMasked}`;
  }
  const result = members.map(m => ({
    role: m.role,
    email: userMap[m.user_id] ? maskEmail(userMap[m.user_id]) : maskEmail(m.user_id)
  }));
  return NextResponse.json(result);
}

// POST: Invitar/agregar usuario a un workspace
export async function POST(req: NextRequest) {
  const { workspaceId, userId, role } = await req.json();
  if (!workspaceId || !userId) {
    return NextResponse.json({ error: "workspaceId y userId requeridos" }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("memberships")
    .insert([{ workspace_id: workspaceId, user_id: userId, role: role || "member" }])
    .select();
  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: error?.message || "No se pudo agregar el miembro" }, { status: 500 });
  }
  return NextResponse.json(data[0]);
}
