import { useParticipants, useTouchpoints, useUpsertTouchpoint, type Participant } from "@/lib/api";
import { MensagensAccordion } from "@/components/MensagensAccordion";
import { PendenciasList } from "@/components/PendenciasList";

const TPS = ["D-60", "D-45", "D-30", "D-21", "D-14", "D-7", "D-3"];
const TP_NAMES: Record<string, string> = {
  "D-60": "Kickoff",
  "D-45": "Aquecimento",
  "D-30": "Logística",
  "D-21": "Dicas",
  "D-14": "Confirm.",
  "D-7": "Vídeos",
  "D-3": "Pré-emb.",
};

export function PreViagemPage({ sub }: { sub: string }) {
  if (sub === "pipeline") return <TouchpointGrid />;
  if (sub === "parts") return <PartsCompactList />;
  if (sub === "mensagens")
    return (
      <MensagensAccordion
        etapa="preop"
        intro="Mensagens em ordem cronológica (D-60 → D-3). D-60 e D-3 são obrigatórios e síncronos."
      />
    );
  if (sub === "pendencias") return <PendenciasList fase="preop" title="Pendências — fase pré-viagem" />;
  return <PreDash />;
}

function PreDash() {
  return (
    <div className="main">
      <div className="metrics">
        <Metric icon="ti-calendar" label="Janela total" value="~60" sub="dias antes do embarque" />
        <Metric icon="ti-video" label="Síncronos obrigatórios" value="2" sub="Kickoff D-60 + pré-embarque D-3" />
        <Metric icon="ti-message-dots" label="Async recomendados" value="5" sub="quinzenais e semanais" />
        <Metric icon="ti-user-check" label="Responsável" value="Caetano" sub="+ Zé Ricardo / Lit" />
      </div>
      <div className="nota-critica">
        <strong><i className="ti ti-alert-triangle" /> Ponto crítico:</strong> Engajamento de grupo WhatsApp sem dono claro tende a morrer após a segunda semana.
      </div>
      <div className="section-label" style={{ marginTop: 0 }}>Cadência de touchpoints (D-60 → D-3)</div>
      <div className="timeline-track">
        {[
          ["D-60", "Obrigatório · síncrono", "Kickoff oficial", "Boas-vindas, José Ricardo, recomendações + conteúdo de IA", "ti-video", "Live", true],
          ["D-45", "Recomendado · async", "Aquecimento inicial", "Visão das 3 cidades, proposta de valor, o que esperar", "ti-video", "Vídeo curto", false],
          ["D-30", "Recomendado · async", "Logística da saída", "Terminal BTG, upgrade Emirates, case da edição anterior", "ti-brand-whatsapp", "WhatsApp", false],
          ["D-21", "Recomendado · async", "Dicas práticas", "Apps (VPN, WeChat), câmbio, etiqueta de negócios", "ti-file-text", "Guia PDF", false],
          ["D-14", "Recomendado · async", "Confirmação logística", "Voos, documentos, seguro viagem (obrigatório)", "ti-checklist", "Checklist", false],
          ["D-7", "Recomendado · async", "Preparo vídeos", "Dinâmica do videomaker, uso de imagem", "ti-brand-whatsapp", "WhatsApp", false],
          ["D-3", "Obrigatório · síncrono", "Pré-embarque", "Checklist final, ponto de encontro, contato de emergência", "ti-video", "Live", true],
        ].map((tp: any, i) => (
          <div key={i} className={`tp-card ${tp[6] ? "tp-obrigatorio" : "tp-opcional"}`}>
            <div className="tp-day">{tp[0]}</div>
            <div className="tp-tipo">{tp[1]}</div>
            <div className="tp-nome">{tp[2]}</div>
            <div className="tp-desc">{tp[3]}</div>
            <span className="tp-formato"><i className={`ti ${tp[4]}`} style={{ fontSize: 11 }} /> {tp[5]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ icon, label, value, sub }: any) {
  return (
    <div className="metric-card">
      <div className="metric-label"><i className={`ti ${icon}`} />{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}

function TouchpointGrid() {
  const { data: parts = [] } = useParticipants();
  const { data: tps = [] } = useTouchpoints();
  const upsert = useUpsertTouchpoint();

  const getStatus = (pid: string, code: string) => tps.find((t) => t.participant_id === pid && t.touchpoint_code === code)?.status ?? "nao_iniciado";

  const cycle = (cur: string) =>
    cur === "nao_iniciado" ? "pendente" : cur === "pendente" ? "realizado" : "nao_iniciado";

  const statusGeral = (p: Participant) => {
    const total = TPS.length;
    const realizados = TPS.filter((c) => getStatus(p.id, c) === "realizado").length;
    if (realizados === 0) return { label: "Não iniciado", cls: "badge-neutral" };
    if (realizados === total) return { label: "Concluído", cls: "badge-ok" };
    return { label: "Em andamento", cls: "badge-warn" };
  };

  return (
    <div className="main">
      <div className="section-label" style={{ marginTop: 0 }}>Pipeline de engajamento pré-viagem — por participante</div>
      <div className="nota-estrategica">
        <strong>Como ler:</strong> cada linha é um participante; cada coluna é um touchpoint. Clique nas células para alternar entre <strong>cinza</strong> (não iniciado), <strong>âmbar</strong> (pendente) e <strong>verde</strong> (realizado).
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Participante</th>
              {TPS.map((c) => (
                <th key={c} style={{ textAlign: "center" }}>
                  {c}
                  <br />
                  <span style={{ fontWeight: 400, color: "var(--text3)" }}>{TP_NAMES[c]}</span>
                </th>
              ))}
              <th>Status geral</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--text3)", padding: 16 }}>Sem participantes confirmados ainda.</td></tr>
            )}
            {parts.map((p) => {
              const sg = statusGeral(p);
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.nome}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{[p.empresa, p.cidade].filter(Boolean).join(" · ")}</div>
                  </td>
                  {TPS.map((code) => {
                    const st = getStatus(p.id, code);
                    return (
                      <td key={code} style={{ textAlign: "center" }}>
                        <span
                          className={`check-dot ${st === "realizado" ? "done" : st === "pendente" ? "pend" : ""}`}
                          onClick={() =>
                            upsert.mutate({ participant_id: p.id, touchpoint_code: code, status: cycle(st) })
                          }
                          title={st}
                        >
                          {st === "realizado" ? <i className="ti ti-check" style={{ fontSize: 10 }} /> : st === "pendente" ? "—" : "·"}
                        </span>
                      </td>
                    );
                  })}
                  <td><span className={`badge ${sg.cls}`}>{sg.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
        <Legend cls="done" label="Realizado" />
        <Legend cls="pend" label="Pendente / atrasado" />
        <Legend cls="" label="Ainda não chegou" />
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text2)" }}>
      <span className={`check-dot ${cls}`} style={{ width: 16, height: 16, fontSize: 9 }}>
        {cls === "done" ? <i className="ti ti-check" style={{ fontSize: 9 }} /> : cls === "pend" ? "—" : "·"}
      </span>
      {label}
    </div>
  );
}

function PartsCompactList() {
  const { data: parts = [] } = useParticipants();
  return (
    <div className="main">
      <div className="section-label" style={{ marginTop: 0 }}>
        Participantes confirmados — dados relevantes para o pré-operacional
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th><th>Empresa</th><th>Cidade</th><th>Restrições</th><th>Seguro</th><th>Voo</th><th>Uso de imagem</th><th>WhatsApp</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--text3)", padding: 16 }}>Sem participantes cadastrados ainda.</td></tr>
            )}
            {parts.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.empresa ?? "—"}</td>
                <td>{p.cidade ?? "—"}</td>
                <td><span className="badge badge-neutral">{p.restricoes_alimentares || "Nenhuma"}</span></td>
                <td><span className={`badge ${p.seguro_status === "contratado" ? "badge-ok" : "badge-warn"}`}>{p.seguro_status}</span></td>
                <td><span className={`badge ${p.voo_ida_status === "confirmado" ? "badge-ok" : "badge-warn"}`}>{p.voo_ida_status}</span></td>
                <td><span className={`badge ${p.uso_imagem_status === "assinado" ? "badge-ok" : "badge-warn"}`}>{p.uso_imagem_status}</span></td>
                <td style={{ fontSize: 11, color: "var(--text3)" }}>{p.telefone ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="nota-estrategica" style={{ marginTop: 4 }}>
        <strong>Atenção:</strong> a coluna "Uso de imagem" deve estar assinada antes do D-7.
      </div>
    </div>
  );
}
