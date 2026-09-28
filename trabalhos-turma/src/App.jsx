import { useState, useEffect, useRef } from "react";
import { FileText, Image as ImageIcon, Video, Plus, Trash2, X, LogOut, ChevronDown, Users, Upload, Loader2 } from "lucide-react";
import { supabase } from "./supabase";
import { entrarComGoogle, sair, papelPorEmail } from "./auth";
import { publicarTrabalho, urlDoArquivo } from "./trabalhos";

const COLORS = {
  navy: "#24365C",
  ink: "#1F2A44",
  mustard: "#C98A2C",
  sage: "#6E8B6E",
  paper: "#F6F5F1",
  card: "#FFFFFF",
  border: "#E2E0D8",
  borderStrong: "#CFCCBF",
  danger: "#B3462C",
  textMuted: "#6B6A63",
};

const TIPO_ICON = { pdf: FileText, foto: ImageIcon, video: Video };
const TIPO_LABEL = { pdf: "PDF", foto: "foto", video: "vídeo" };

function detectarTipo(file) {
  if (file.type.startsWith("image/")) return "foto";
  if (file.type.startsWith("video/")) return "video";
  return "pdf";
}

function Avatar({ nome, size = 32, bg = COLORS.navy }) {
  const iniciais = (nome || "?").split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 600, flexShrink: 0 }}>
      {iniciais}
    </div>
  );
}

function TelaCarregando() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: COLORS.paper }}>
      <Loader2 size={28} className="animate-spin" style={{ color: COLORS.navy }} />
    </div>
  );
}

function LoginScreen({ onEntrar, erro, carregando }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.paper }}>
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center rounded-2xl mb-4" style={{ width: 56, height: 56, background: COLORS.navy }}>
          <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>T</span>
        </div>
        <h1 style={{ color: COLORS.ink, fontSize: 22, fontWeight: 700 }}>Trabalhos da Turma</h1>
        <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4, marginBottom: 24 }}>Entre com seu email institucional</p>

        <button
          onClick={onEntrar}
          disabled={carregando}
          className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-3 mx-auto"
          style={{ border: `1px solid ${COLORS.borderStrong}`, background: "#fff", maxWidth: 320, opacity: carregando ? 0.6 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.1 0 19.5-8.2 19.5-19.5 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8c1.8-4.4 6-7.5 11.1-7.5 2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5c-7.9 0-14.7 4.5-18 11.1z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.3 2.4-5.3 0-9.7-3.5-11.3-8.3l-6.5 5c3.2 6.5 10 11.3 17.9 11.3z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.2 5.2C40.8 36 43.5 30.5 43.5 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{carregando ? "Entrando..." : "Entrar com Google"}</span>
        </button>

        {erro && <p style={{ fontSize: 13, color: COLORS.danger, marginTop: 14 }}>{erro}</p>}

        <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 20 }}>
          Acesso restrito a contas @educar.rs.gov.br (professora) ou @estudante.rs.gov.br (aluno)
        </p>
      </div>
    </div>
  );
}

function TopBar({ user, onLogout, turmaAtual, turmas, onTrocarTurma }) {
  const [aberto, setAberto] = useState(false);
  if (!turmaAtual) {
    return (
      <div style={{ background: COLORS.navy }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>Trabalhos da Turma</span>
          <button onClick={onLogout}><LogOut size={18} style={{ color: "rgba(255,255,255,0.7)" }} /></button>
        </div>
      </div>
    );
  }
  return (
    <div className="sticky top-0 z-10" style={{ background: COLORS.navy }}>
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: "rgba(255,255,255,0.12)" }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>T</span>
          </div>
          {user.papel === "professora" ? (
            <div className="relative min-w-0">
              <button onClick={() => setAberto((v) => !v)} className="flex items-center gap-1.5 min-w-0" style={{ color: "#fff" }}>
                <span className="truncate" style={{ fontSize: 15, fontWeight: 600 }}>{turmaAtual.nome}</span>
                <ChevronDown size={16} style={{ opacity: 0.8, flexShrink: 0 }} />
              </button>
              {aberto && (
                <div className="absolute left-0 top-full mt-2 rounded-lg overflow-hidden" style={{ background: "#fff", border: `1px solid ${COLORS.border}`, minWidth: 220, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                  {turmas.map((t) => (
                    <button key={t.id} onClick={() => { onTrocarTurma(t); setAberto(false); }} className="w-full text-left px-3.5 py-2.5" style={{ fontSize: 13.5, color: COLORS.ink, background: t.id === turmaAtual.id ? COLORS.paper : "transparent" }}>
                      {t.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <span className="truncate" style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>Meus trabalhos</span>
          )}
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 flex-shrink-0">
          <Avatar nome={user.nome} size={28} bg={COLORS.mustard} />
          <LogOut size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
        </button>
      </div>
    </div>
  );
}

function AddTrabalhoModal({ turma, user, onClose, onPublicado }) {
  const [titulo, setTitulo] = useState("");
  const [file, setFile] = useState(null);
  const [autores, setAutores] = useState([]);
  const [alunosDaTurma, setAlunosDaTurma] = useState([]);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("turma_alunos")
        .select("aluno_id, usuarios(id, nome, email)")
        .eq("turma_id", turma.id)
        .order("nome", {ascending: true});
      if (!error) setAlunosDaTurma((data || []).map((d) => d.usuarios).filter(Boolean));
    }
    carregar();
  }, [turma.id]);

  const toggleAutor = (uid) => setAutores((prev) => (prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]));

  const salvar = async () => {
    if (!titulo.trim()) return setErro("Dê um título ao trabalho.");
    if (!file) return setErro("Selecione um arquivo (PDF, foto ou vídeo).");
    if (autores.length === 0) return setErro("Selecione pelo menos um aluno autor.");

    setEnviando(true);
    setErro("");
    try {
      await publicarTrabalho({ turmaId: turma.id, titulo: titulo.trim(), tipo: detectarTipo(file), autores, file, uid: user.uid });
      onPublicado();
    } catch (e) {
      setErro("Não foi possível publicar: " + e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(20,20,18,0.45)" }}>
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto" style={{ background: "#fff" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: COLORS.ink }}>Novo trabalho</h2>
          <button onClick={onClose}><X size={20} style={{ color: COLORS.textMuted }} /></button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>Título do trabalho</label>
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Maquete do sistema solar" className="w-full rounded-lg px-3 py-2.5" style={{ border: `1px solid ${COLORS.borderStrong}`, fontSize: 14, color: COLORS.ink }} />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>Arquivo</label>
            <input ref={inputRef} type="file" accept=".pdf,image/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
            <button onClick={() => inputRef.current.click()} className="w-full rounded-lg px-3 py-3 flex items-center gap-2.5" style={{ border: `1.5px dashed ${COLORS.borderStrong}`, background: COLORS.paper }}>
              <Upload size={18} style={{ color: COLORS.navy, flexShrink: 0 }} />
              <span className="truncate" style={{ fontSize: 13.5, color: file ? COLORS.ink : COLORS.textMuted }}>{file ? file.name : "Escolher PDF, foto ou vídeo"}</span>
            </button>
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>Autores (um ou mais alunos)</label>
            {alunosDaTurma.length === 0 ? (
              <p style={{ fontSize: 12.5, color: COLORS.textMuted }}>Carregando alunos da turma...</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {alunosDaTurma.map((a) => {
                  const marcado = autores.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => toggleAutor(a.id)} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left" style={{ border: `1px solid ${marcado ? COLORS.navy : COLORS.border}`, background: marcado ? "#EEF1F6" : "#fff" }}>
                      <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${marcado ? COLORS.navy : COLORS.borderStrong}`, background: marcado ? COLORS.navy : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {marcado && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                      </div>
                      <Avatar nome={a.nome} size={24} bg={COLORS.sage} />
                      <span style={{ fontSize: 13.5, color: COLORS.ink }}>{a.nome}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {erro && <div style={{ fontSize: 13, color: COLORS.danger }}>{erro}</div>}
        </div>

        <div className="px-5 py-4 flex gap-2.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <button onClick={onClose} disabled={enviando} className="flex-1 rounded-lg py-2.5" style={{ border: `1px solid ${COLORS.borderStrong}`, fontSize: 14, fontWeight: 600, color: COLORS.ink }}>Cancelar</button>
          <button onClick={salvar} disabled={enviando} className="flex-1 rounded-lg py-2.5" style={{ background: COLORS.navy, fontSize: 14, fontWeight: 600, color: "#fff", opacity: enviando ? 0.6 : 1 }}>
            {enviando ? "Publicando..." : "Publicar trabalho"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ trabalho, onClose }) {
  const [url, setUrl] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    urlDoArquivo(trabalho.arquivo_path).then(setUrl).catch((e) => setErro(e.message));
  }, [trabalho.arquivo_path]);

  const autoresNomes = (trabalho.trabalho_autores || []).map((ta) => ta.usuarios?.nome).filter(Boolean);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4" style={{ background: "rgba(20,20,18,0.55)" }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <span className="truncate" style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{trabalho.titulo}</span>
          <button onClick={onClose}><X size={20} style={{ color: COLORS.textMuted }} /></button>
        </div>
        <div className="flex items-center justify-center" style={{ background: COLORS.paper, minHeight: 280 }}>
          {erro && <p style={{ fontSize: 13, color: COLORS.danger, padding: 24 }}>{erro}</p>}
          {!erro && !url && <Loader2 size={24} className="animate-spin" style={{ color: COLORS.navy }} />}
          {url && trabalho.tipo === "foto" && <img src={url} alt={trabalho.titulo} style={{ maxWidth: "100%", maxHeight: 380, objectFit: "contain" }} />}
          {url && trabalho.tipo === "video" && <video src={url} controls style={{ maxWidth: "100%", maxHeight: 380 }} />}
          {url && trabalho.tipo === "pdf" && <iframe src={url} title={trabalho.titulo} style={{ width: "100%", height: 420, border: "none" }} />}
        </div>
        <div className="px-5 py-3.5" style={{ fontSize: 12.5, color: COLORS.textMuted }}>
          autores: {autoresNomes.join(", ") || "—"}
        </div>
      </div>
    </div>
  );
}

function TrabalhoCard({ trabalho, podeExcluir, onExcluir, onAbrir }) {
  const Icone = TIPO_ICON[trabalho.tipo];
  const autoresNomes = (trabalho.trabalho_autores || []).map((ta) => ta.usuarios?.nome).filter(Boolean);
  return (
    <div className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
      <button onClick={() => onAbrir(trabalho)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: "#EEF1F6" }}>
          <Icone size={19} style={{ color: COLORS.navy }} />
        </div>
        <div className="min-w-0">
          <div className="truncate" style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{trabalho.titulo}</div>
          <div className="truncate flex items-center gap-1" style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
            <Users size={12} />
            {autoresNomes.join(", ") || "sem autores"} · {TIPO_LABEL[trabalho.tipo]}
          </div>
        </div>
      </button>
      {podeExcluir && (
        <button onClick={() => onExcluir(trabalho)} className="flex-shrink-0 rounded-lg p-2" style={{ color: COLORS.danger }}>
          <Trash2 size={17} />
        </button>
      )}
    </div>
  );
}

function ListaTrabalhos({ trabalhos, turma, user, carregando, onExcluir, onAbrir, onAdd }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: COLORS.ink }}>{turma.nome}</h1>
          <p style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 2 }}>{trabalhos.length} trabalho{trabalhos.length !== 1 ? "s" : ""} publicado{trabalhos.length !== 1 ? "s" : ""}</p>
        </div>
        {user.papel === "professora" && (
          <button onClick={onAdd} className="flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 flex-shrink-0" style={{ background: COLORS.mustard, color: "#fff", fontSize: 13.5, fontWeight: 600 }}>
            <Plus size={16} /> Adicionar
          </button>
        )}
      </div>

      {carregando ? (
        <div className="flex justify-center py-14"><Loader2 size={22} className="animate-spin" style={{ color: COLORS.navy }} /></div>
      ) : trabalhos.length === 0 ? (
        <div className="rounded-xl py-14 flex flex-col items-center gap-2" style={{ border: `1px dashed ${COLORS.borderStrong}` }}>
          <FileText size={28} style={{ color: COLORS.textMuted }} />
          <p style={{ fontSize: 13.5, color: COLORS.textMuted }}>Nenhum trabalho publicado nesta turma ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {trabalhos.map((t) => (
            <TrabalhoCard key={t.id} trabalho={t} podeExcluir={user.papel === "professora"} onExcluir={onExcluir} onAbrir={onAbrir} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);
  const [entrando, setEntrando] = useState(false);
  const [erroLogin, setErroLogin] = useState("");

  const [turmas, setTurmas] = useState([]);
  const [turmaAtualId, setTurmaAtualId] = useState(null);
  const [trabalhos, setTrabalhos] = useState([]);
  const [carregandoTrabalhos, setCarregandoTrabalhos] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [trabalhoAberto, setTrabalhoAberto] = useState(null);

  const turmaAtual = turmas.find((t) => t.id === turmaAtualId) || null;

  // sessão + login
  useEffect(() => {
    async function iniciar() {
      const { data } = await supabase.auth.getSession();
      if (data.session) await carregarUsuario(data.session.user);
      setCarregandoAuth(false);
    }
    iniciar();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) carregarUsuario(session.user);
      else setUser(null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function carregarUsuario(authUser) {
    const papel = papelPorEmail(authUser.email);
    if (!papel) {
      setErroLogin("Use seu email institucional (@educar.rs.gov.br ou @estudante.rs.gov.br).");
      await sair();
      return;
    }
    const nome = authUser.user_metadata?.full_name || authUser.email;
    await supabase.from("usuarios").upsert({ id: authUser.id, nome, email: authUser.email, papel });
    setUser({ uid: authUser.id, nome, email: authUser.email, papel });
    setErroLogin("");
  }

  async function entrar() {
    setEntrando(true);
    setErroLogin("");
    try {
      await entrarComGoogle();
    } catch (e) {
      setErroLogin("Não foi possível entrar: " + e.message);
      setEntrando(false);
    }
  }

  // turmas do usuário
  useEffect(() => {
    if (!user) return;
    (async () => {
      let dados = [];
      if (user.papel === "professora") {
        const { data } = await supabase
          .from("turmas")  
          .select("*")  
          .eq("professora_id", user.uid)
          .order("nome", { ascending: true });
        dados = data || [];
      } else {
        const { data } = await supabase
          .from("turma_alunos")
          .select("turmas(*)")
          .eq("aluno_id", user.uid);
        dados = (data || []).map((d) => d.turmas).filter(Boolean);
      }
      setTurmas(dados);
      if (dados.length > 0) setTurmaAtualId(dados[0].id);
    })();
  }, [user]);

  // trabalhos da turma atual
  async function carregarTrabalhos(turmaId) {
    setCarregandoTrabalhos(true);
    const { data } = await supabase
      .from("trabalhos")
      .select("*, trabalho_autores(aluno_id, usuarios(nome))")
      .eq("turma_id", turmaId)
      .order("criado_em", { ascending: false });
    setTrabalhos(data || []);
    setCarregandoTrabalhos(false);
  }

  useEffect(() => {
    if (turmaAtualId) carregarTrabalhos(turmaAtualId);
  }, [turmaAtualId]);

  async function excluirTrabalho(trabalho) {
    await supabase.storage.from("trabalhos").remove([trabalho.arquivo_path]);
    await supabase.from("trabalhos").delete().eq("id", trabalho.id);
    carregarTrabalhos(turmaAtualId);
  }

  if (carregandoAuth) return <TelaCarregando />;
  if (!user) return <LoginScreen onEntrar={entrar} erro={erroLogin} carregando={entrando} />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.paper }}>
      <TopBar user={user} onLogout={sair} turmaAtual={turmaAtual} turmas={turmas} onTrocarTurma={(t) => setTurmaAtualId(t.id)} />

      {user.papel === "aluno" && turmas.length > 1 && (
        <div className="max-w-3xl mx-auto px-4 pt-4 flex gap-2 overflow-x-auto">
          {turmas.map((t) => (
            <button key={t.id} onClick={() => setTurmaAtualId(t.id)} className="flex-shrink-0 rounded-full px-3.5 py-1.5" style={{ fontSize: 12.5, fontWeight: 600, background: t.id === turmaAtualId ? COLORS.navy : "#fff", color: t.id === turmaAtualId ? "#fff" : COLORS.ink, border: `1px solid ${t.id === turmaAtualId ? COLORS.navy : COLORS.border}` }}>
              {t.nome}
            </button>
          ))}
        </div>
      )}

      {!turmaAtual ? (
        <div className="max-w-3xl mx-auto px-4 py-14 text-center" style={{ color: COLORS.textMuted, fontSize: 13.5 }}>
          {user.papel === "professora"
            ? "Nenhuma turma associada a você ainda. Peça para cadastrarem sua turma no banco de dados."
            : "Você ainda não está matriculado em nenhuma turma."}
        </div>
      ) : (
        <ListaTrabalhos
          trabalhos={trabalhos}
          turma={turmaAtual}
          user={user}
          carregando={carregandoTrabalhos}
          onExcluir={excluirTrabalho}
          onAbrir={setTrabalhoAberto}
          onAdd={() => setModalAberto(true)}
        />
      )}

      {modalAberto && (
        <AddTrabalhoModal
          turma={turmaAtual}
          user={user}
          onClose={() => setModalAberto(false)}
          onPublicado={() => { setModalAberto(false); carregarTrabalhos(turmaAtualId); }}
        />
      )}
      {trabalhoAberto && <PreviewModal trabalho={trabalhoAberto} onClose={() => setTrabalhoAberto(null)} />}
    </div>
  );
}