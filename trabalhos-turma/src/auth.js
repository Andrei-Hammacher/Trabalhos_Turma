import { supabase } from "./supabase";

const DOMINIO_PROFESSORA = "educar.rs.gov.br";
const DOMINIO_ALUNO = "estudante.rs.gov.br";

export function papelPorEmail(email) {
  const dominio = email.split("@")[1];
  if (dominio === DOMINIO_PROFESSORA) return "professora";
  if (dominio === DOMINIO_ALUNO) return "aluno";
  return null;
}

export async function entrarComGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function sair() {
  await supabase.auth.signOut();
}

// chame isso quando o app carregar, para pegar o usuário já logado
export async function usuarioAtual() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;

  const papel = papelPorEmail(data.user.email);
  if (!papel) {
    await sair();
    throw new Error("Use seu email institucional (@educar.rs.gov.br ou @estudante.rs.gov.br).");
  }
  return { uid: data.user.id, email: data.user.email, nome: data.user.user_metadata?.full_name, papel };
}