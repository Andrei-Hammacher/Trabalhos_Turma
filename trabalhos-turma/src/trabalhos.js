import { supabase } from "./supabase";

export async function publicarTrabalho({ turmaId, titulo, tipo, autores, file, uid }) {
  // Limpa o nome do arquivo (remove acentos, cedilhas e troca espaços por _)
  const nomeSeguro = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-zA-Z0-9.-]/g, "_"); // Substitui espaços e símbolos por _

  // Usa o nome seguro para criar o caminho no Supabase
  const caminho = `${turmaId}/${Date.now()}-${nomeSeguro}`;

  const { error: erroUpload } = await supabase.storage.from("trabalhos").upload(caminho, file);
  if (erroUpload) throw erroUpload;

  const { data: trabalho, error: erroInsert } = await supabase
    .from("trabalhos")
    .insert({ turma_id: turmaId, titulo, tipo, arquivo_path: caminho, criado_por: uid })
    .select()
    .single();
  if (erroInsert) throw erroInsert;

  await supabase.from("trabalho_autores").insert(
    autores.map((alunoId) => ({ trabalho_id: trabalho.id, aluno_id: alunoId }))
  );
}

// para exibir/baixar um arquivo (o bucket é privado, então precisa de uma URL assinada e temporária)
export async function urlDoArquivo(caminho) {
  const { data, error } = await supabase.storage.from("trabalhos").createSignedUrl(caminho, 3600); // expira em 1h
  if (error) throw error;
  return data.signedUrl;
}