import { useState, useRef } from "react";
import { FileText, Image as ImageIcon, Video, Plus, Trash2, X, LogOut, ChevronDown, Users, Upload } from "lucide-react";

const COLORS = {
  navy: "#24365C",
  navyDark: "#182545",
  ink: "#1F2A44",
  mustard: "#C98A2C",
  mustardDark: "#A16E1E",
  sage: "#6E8B6E",
  paper: "#F6F5F1",
  card: "#FFFFFF",
  border: "#E2E0D8",
  borderStrong: "#CFCCBF",
  danger: "#B3462C",
  textMuted: "#6B6A63",
};

const PROFESSORA = { uid: "p1", nome: "Ana Ferreira", email: "ana.ferreira@colegiosaovicente.edu.br", papel: "professora" };

const ALUNOS = [
  { uid: "a1", nome: "Bruno Costa", email: "bruno.costa@colegiosaovicente.edu.br" },
  { uid: "a2", nome: "Carla Nunes", email: "carla.nunes@colegiosaovicente.edu.br" },
  { uid: "a3", nome: "Diego Ramos", email: "diego.ramos@colegiosaovicente.edu.br" },
  { uid: "a4", nome: "Elisa Prado", email: "elisa.prado@colegiosaovicente.edu.br" },
  { uid: "a5", nome: "Felipe Rocha", email: "felipe.rocha@colegiosaovicente.edu.br" },
  { uid: "a6", nome: "Giovana Melo", email: "giovana.melo@colegiosaovicente.edu.br" },
];

const TURMAS = [
  { id: "t1", nome: "9º Ano B - Ciências", alunos: ["a1", "a2", "a3", "a4"] },
  { id: "t2", nome: "8º Ano A - Artes", alunos: ["a3", "a5", "a6"] },
];

const TRABALHOS_INICIAIS = [
  { id: "w1", turmaId: "t1", titulo: "Maquete do sistema solar", tipo: "foto", autores: ["a1", "a2"], criadoEm: "12 ago", previewUrl: null },
  { id: "w2", turmaId: "t1", titulo: "Relatório de germinação do feijão", tipo: "pdf", autores: ["a3"], criadoEm: "18 ago", previewUrl: null },
  { id: "w2b", turmaId: "t1", titulo: "Apresentação sobre reciclagem", tipo: "video", autores: ["a1", "a4"], criadoEm: "22 ago", previewUrl: null },
  { id: "w3", turmaId: "t2", titulo: "Autorretrato em guache", tipo: "foto", autores: ["a5"], criadoEm: "20 ago", previewUrl: null },
];

const TIPO_ICON = { pdf: FileText, foto: ImageIcon, video: Video };
const TIPO_LABEL = { pdf: "PDF", foto: "foto", video: "vídeo" };

function detectarTipo(file) {
  if (file.type.startsWith("image/")) return "foto";
  if (file.type.startsWith("video/")) return "video";
  return "pdf";
}

function Avatar({ nome, size = 32, bg = COLORS.navy }) {
  const iniciais = nome.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 600, flexShrink: 0 }}>
      {iniciais}
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.paper }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl mb-4" style={{ width: 56, height: 56, background: COLORS.navy }}>
            <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>T</span>
          </div>
          <h1 style={{ color: COLORS.ink, fontSize: 22, fontWeight: 700 }}>Trabalhos da Turma</h1>
          <p style={{ color: COLORS.textMuted, fontSize: 14, marginTop: 4 }}>Entre com seu email institucional</p>
        </div>

        <div className="rounded-xl p-5" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <button
            onClick={() => onLogin(PROFESSORA)}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 mb-3 transition"
            style={{ border: `1px solid ${COLORS.borderStrong}`, background: "#fff" }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.1 0 19.5-8.2 19.5-19.5 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8c1.8-4.4 6-7.5 11.1-7.5 2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.5 29 4.5 24 4.5c-7.9 0-14.7 4.5-18 11.1z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.3 2.4-5.3 0-9.7-3.5-11.3-8.3l-6.5 5c3.2 6.5 10 11.3 17.9 11.3z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4.1 5.3l6.2 5.2C40.8 36 43.5 30.5 43.5 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
            <div className="text-left flex-1">
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{PROFESSORA.nome}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>professora · {PROFESSORA.email}</div>
            </div>
          </button>

          <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 0.4, margin: "16px 0 8px" }}>
            ou entrar como aluno (demo)
          </div>

          {ALUNOS.slice(0, 3).map((a) => (
            <button
              key={a.uid}
              onClick={() => onLogin({ ...a, papel: "aluno" })}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 mb-2 transition"
              style={{ border: `1px solid ${COLORS.border}`, background: "#fff" }}
            >
              <Avatar nome={a.nome} size={28} bg={COLORS.sage} />
              <div className="text-left flex-1">
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{a.nome}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{a.email}</div>
              </div>
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginTop: 16 }}>
          Acesso restrito a contas @colegiosaovicente.edu.br
        </p>
      </div>
    </div>
  );
}

function TopBar({ user, onLogout, turmaAtual, turmas, onTrocarTurma }) {
  const [aberto, setAberto] = useState(false);
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
                    <button
                      key={t.id}
                      onClick={() => { onTrocarTurma(t); setAberto(false); }}
                      className="w-full text-left px-3.5 py-2.5"
                      style={{ fontSize: 13.5, color: COLORS.ink, background: t.id === turmaAtual.id ? COLORS.paper : "transparent" }}
                    >
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

function AddTrabalhoModal({ turma, onClose, onSave }) {
  const [titulo, setTitulo] = useState("");
  const [file, setFile] = useState(null);
  const [autores, setAutores] = useState([]);
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);

  const alunosDaTurma = ALUNOS.filter((a) => turma.alunos.includes(a.uid));

  const toggleAutor = (uid) => {
    setAutores((prev) => (prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]));
  };

  const salvar = () => {
    if (!titulo.trim()) { setErro("Dê um título ao trabalho."); return; }
    if (!file) { setErro("Selecione um arquivo (PDF, foto ou vídeo)."); return; }
    if (autores.length === 0) { setErro("Selecione pelo menos um aluno autor."); return; }
    onSave({
      id: "w" + Date.now(),
      turmaId: turma.id,
      titulo: titulo.trim(),
      tipo: detectarTipo(file),
      autores,
      criadoEm: "agora",
      previewUrl: URL.createObjectURL(file),
    });
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
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Maquete do sistema solar"
              className="w-full rounded-lg px-3 py-2.5"
              style={{ border: `1px solid ${COLORS.borderStrong}`, fontSize: 14, color: COLORS.ink }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>Arquivo</label>
            <input ref={inputRef} type="file" accept=".pdf,image/*,video/*" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
            <button
              onClick={() => inputRef.current.click()}
              className="w-full rounded-lg px-3 py-3 flex items-center gap-2.5"
              style={{ border: `1.5px dashed ${COLORS.borderStrong}`, background: COLORS.paper }}
            >
              <Upload size={18} style={{ color: COLORS.navy, flexShrink: 0 }} />
              <span className="truncate" style={{ fontSize: 13.5, color: file ? COLORS.ink : COLORS.textMuted }}>
                {file ? file.name : "Escolher PDF, foto ou vídeo"}
              </span>
            </button>
          </div>

          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.ink, display: "block", marginBottom: 6 }}>Autores (um ou mais alunos)</label>
            <div className="flex flex-col gap-1.5">
              {alunosDaTurma.map((a) => {
                const marcado = autores.includes(a.uid);
                return (
                  <button
                    key={a.uid}
                    onClick={() => toggleAutor(a.uid)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left"
                    style={{ border: `1px solid ${marcado ? COLORS.navy : COLORS.border}`, background: marcado ? "#EEF1F6" : "#fff" }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${marcado ? COLORS.navy : COLORS.borderStrong}`, background: marcado ? COLORS.navy : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {marcado && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                    </div>
                    <Avatar nome={a.nome} size={24} bg={COLORS.sage} />
                    <span style={{ fontSize: 13.5, color: COLORS.ink }}>{a.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {erro && <div style={{ fontSize: 13, color: COLORS.danger }}>{erro}</div>}
        </div>

        <div className="px-5 py-4 flex gap-2.5" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          <button onClick={onClose} className="flex-1 rounded-lg py-2.5" style={{ border: `1px solid ${COLORS.borderStrong}`, fontSize: 14, fontWeight: 600, color: COLORS.ink }}>
            Cancelar
          </button>
          <button onClick={salvar} className="flex-1 rounded-lg py-2.5" style={{ background: COLORS.navy, fontSize: 14, fontWeight: 600, color: "#fff" }}>
            Publicar trabalho
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ trabalho, onClose }) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4" style={{ background: "rgba(20,20,18,0.55)" }}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
        <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <span className="truncate" style={{ fontSize: 15, fontWeight: 700, color: COLORS.ink }}>{trabalho.titulo}</span>
          <button onClick={onClose}><X size={20} style={{ color: COLORS.textMuted }} /></button>
        </div>
        <div className="flex items-center justify-center" style={{ background: COLORS.paper, minHeight: 260 }}>
          {trabalho.previewUrl && trabalho.tipo === "foto" && (
            <img src={trabalho.previewUrl} alt={trabalho.titulo} style={{ maxWidth: "100%", maxHeight: 360, objectFit: "contain" }} />
          )}
          {trabalho.previewUrl && trabalho.tipo === "video" && (
            <video src={trabalho.previewUrl} controls style={{ maxWidth: "100%", maxHeight: 360 }} />
          )}
          {(trabalho.tipo === "pdf" || !trabalho.previewUrl) && (
            <div className="flex flex-col items-center gap-2 py-10">
              <FileText size={40} style={{ color: COLORS.textMuted }} />
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>
                {trabalho.previewUrl ? "Pré-visualização de PDF" : "Arquivo de exemplo (sem preview no protótipo)"}
              </span>
            </div>
          )}
        </div>
        <div className="px-5 py-3.5" style={{ fontSize: 12.5, color: COLORS.textMuted }}>
          Enviado em {trabalho.criadoEm} · autores: {trabalho.autores.map((id) => ALUNOS.find((a) => a.uid === id)?.nome).join(", ")}
        </div>
      </div>
    </div>
  );
}

function TrabalhoCard({ trabalho, podeExcluir, onExcluir, onAbrir }) {
  const Icone = TIPO_ICON[trabalho.tipo];
  const autoresNomes = trabalho.autores.map((id) => ALUNOS.find((a) => a.uid === id)?.nome).filter(Boolean);
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
            {autoresNomes.join(", ")} · {TIPO_LABEL[trabalho.tipo]} · {trabalho.criadoEm}
          </div>
        </div>
      </button>
      {podeExcluir && (
        <button onClick={() => onExcluir(trabalho.id)} className="flex-shrink-0 rounded-lg p-2" style={{ color: COLORS.danger }}>
          <Trash2 size={17} />
        </button>
      )}
    </div>
  );
}

function ListaTrabalhos({ trabalhos, turma, user, onExcluir, onAbrir, onAdd }) {
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

      {trabalhos.length === 0 ? (
        <div className="rounded-xl py-14 flex flex-col items-center gap-2" style={{ border: `1px dashed ${COLORS.borderStrong}` }}>
          <FileText size={28} style={{ color: COLORS.textMuted }} />
          <p style={{ fontSize: 13.5, color: COLORS.textMuted }}>Nenhum trabalho publicado nesta turma ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {trabalhos.map((t) => (
            <TrabalhoCard
              key={t.id}
              trabalho={t}
              podeExcluir={user.papel === "professora"}
              onExcluir={onExcluir}
              onAbrir={onAbrir}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [trabalhos, setTrabalhos] = useState(TRABALHOS_INICIAIS);
  const [turmaAtualId, setTurmaAtualId] = useState(TURMAS[0].id);
  const [modalAberto, setModalAberto] = useState(false);
  const [trabalhoAberto, setTrabalhoAberto] = useState(null);

  if (!user) return <LoginScreen onLogin={setUser} />;

  const turmasDoUsuario = user.papel === "professora" ? TURMAS : TURMAS.filter((t) => t.alunos.includes(user.uid));
  const turmaAtual = turmasDoUsuario.find((t) => t.id === turmaAtualId) || turmasDoUsuario[0];
  const trabalhosDaTurma = trabalhos.filter((t) => t.turmaId === turmaAtual?.id);

  const excluirTrabalho = (id) => setTrabalhos((prev) => prev.filter((t) => t.id !== id));
  const adicionarTrabalho = (novo) => { setTrabalhos((prev) => [novo, ...prev]); setModalAberto(false); };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.paper }}>
      <TopBar
        user={user}
        onLogout={() => setUser(null)}
        turmaAtual={turmaAtual}
        turmas={turmasDoUsuario}
        onTrocarTurma={(t) => setTurmaAtualId(t.id)}
      />

      {user.papel === "aluno" && turmasDoUsuario.length > 1 && (
        <div className="max-w-3xl mx-auto px-4 pt-4 flex gap-2 overflow-x-auto">
          {turmasDoUsuario.map((t) => (
            <button
              key={t.id}
              onClick={() => setTurmaAtualId(t.id)}
              className="flex-shrink-0 rounded-full px-3.5 py-1.5"
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                background: t.id === turmaAtual.id ? COLORS.navy : "#fff",
                color: t.id === turmaAtual.id ? "#fff" : COLORS.ink,
                border: `1px solid ${t.id === turmaAtual.id ? COLORS.navy : COLORS.border}`,
              }}
            >
              {t.nome}
            </button>
          ))}
        </div>
      )}

      {turmaAtual && (
        <ListaTrabalhos
          trabalhos={trabalhosDaTurma}
          turma={turmaAtual}
          user={user}
          onExcluir={excluirTrabalho}
          onAbrir={setTrabalhoAberto}
          onAdd={() => setModalAberto(true)}
        />
      )}

      {modalAberto && (
        <AddTrabalhoModal turma={turmaAtual} onClose={() => setModalAberto(false)} onSave={adicionarTrabalho} />
      )}
      {trabalhoAberto && (
        <PreviewModal trabalho={trabalhoAberto} onClose={() => setTrabalhoAberto(null)} />
      )}
    </div>
  );
}
