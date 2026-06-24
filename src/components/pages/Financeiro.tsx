import { useEffect, useState } from "react";
import { fmtBRL, useFinanceiroConfig, useParticipants, useUpdateFinanceiroConfig, type FinanceiroConfig } from "@/lib/api";

const CUSTO_FIELDS: { key: keyof FinanceiroConfig; max: keyof FinanceiroConfig; label: string; sub: string }[] = [
  { key: "custo_parceiro_min", max: "custo_parceiro_max", label: "Parceiro local (Zé Ricardo / Lit)", sub: "Fee fixo + % por participante" },
  { key: "custo_hoteis_min", max: "custo_hoteis_max", label: "Hotéis 5★ (25 pax × 9 noites)", sub: "Pequim, Xangai, Hangzhou" },
  { key: "custo_transporte_min", max: "custo_transporte_max", label: "Transporte interno (voos + trem-bala)", sub: "Pequim → Xangai → Hangzhou" },
  { key: "custo_jantares_min", max: "custo_jantares_max", label: "Jantares Michelin (3 ocasiões × 25 pax)", sub: "Incluído na proposta" },
  { key: "custo_videomaker_min", max: "custo_videomaker_max", label: "Videomaker + produção", sub: "~225 vídeos de 1 min" },
  { key: "custo_interpretes_min", max: "custo_interpretes_max", label: "Intérpretes + operações locais", sub: "Tradução simultânea em visitas" },
];

export function FinanceiroPage() {
  const { data: fin } = useFinanceiroConfig();
  const { data: participants = [] } = useParticipants();
  const update = useUpdateFinanceiroConfig();

  if (!fin) return <div className="main">Carregando…</div>;

  const tierStd = Number(fin.tier_standard);
  const tierPrem = Number(fin.tier_premium);
  const meta = fin.meta_vagas;
  const minV = fin.min_vagas;

  const confirmed = participants.filter((p) => p.pagamento_status === "confirmado");
  const recebido = confirmed.reduce((s, p) => s + Number(p.valor_pago || 0), 0);

  const custoMin = CUSTO_FIELDS.reduce((s, c) => s + Number(fin[c.key] || 0), 0);
  const custoMax = CUSTO_FIELDS.reduce((s, c) => s + Number(fin[c.max] || 0), 0);
  const custoMid = (custoMin + custoMax) / 2;

  const ticketMedio = (tierStd + tierPrem) / 2;
  const projecaoMax = meta * ticketMedio;
  const receitaMin = minV * tierStd;
  const margem = ((projecaoMax - custoMid) / projecaoMax) * 100;

  return (
    <div className="main">
      <div className="metrics" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        <Metric icon="ti-chart-line" label="Projeção máxima de receita" value={fmtBRL(projecaoMax)} sub={`${meta} vagas × ${fmtBRL(ticketMedio)} médio`} cls="metric-ok" />
        <Metric icon="ti-cash" label="Receita mínima viável" value={fmtBRL(receitaMin)} sub={`${minV} vagas × ${fmtBRL(tierStd)}`} />
        <Metric icon="ti-trending-down" label="Custo estimado total" value={fmtBRL(custoMid)} sub={`câmbio adotado R$ ${fin.cambio.toFixed(2).replace(".", ",")}`} cls="metric-warn" />
        <Metric icon="ti-chart-line" label="Margem bruta estimada" value={`~${margem.toFixed(0)}%`} sub="cenário meta / ticket médio" cls="metric-ok" />
        <Metric icon="ti-check" label="Recebido até agora" value={fmtBRL(recebido)} sub={`${confirmed.length} pagamento(s) confirmado(s)`} cls="metric-ok" />
      </div>

      <div className="nota-estrategica">
        <strong><i className="ti ti-info-circle" /> Nota:</strong> Os valores abaixo são editáveis. Os cenários de resultado são recalculados em tempo real.
      </div>

      <div className="section-label" style={{ marginTop: 0 }}>Configuração geral</div>
      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          <FinField label="Câmbio (R$/USD)" value={fin.cambio} onSave={(v) => update.mutate({ cambio: v })} step="0.01" />
          <FinField label="Tier Standard (R$)" value={fin.tier_standard} onSave={(v) => update.mutate({ tier_standard: v })} />
          <FinField label="Tier Premium (R$)" value={fin.tier_premium} onSave={(v) => update.mutate({ tier_premium: v })} />
          <FinField label="Vagas mínimas" value={fin.min_vagas} onSave={(v) => update.mutate({ min_vagas: v })} />
          <FinField label="Vagas meta" value={fin.meta_vagas} onSave={(v) => update.mutate({ meta_vagas: v })} />
        </div>
      </div>

      <div className="section-label">Receita por participante confirmado</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Participante</th>
              <th>Tier</th>
              <th>Valor (R$)</th>
              <th>Contrato</th>
              <th>Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {confirmed.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text3)", padding: 16 }}>
                  Aguardando confirmações de pagamento.
                </td>
              </tr>
            )}
            {confirmed.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>
                  <span className={`badge ${p.tier === "premium" ? "badge-blue" : "badge-neutral"}`}>
                    {p.tier === "premium" ? "Premium" : "Standard"}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>{fmtBRL(Number(p.valor_pago))}</td>
                <td>
                  <span className={`badge ${p.contrato_status === "assinado" ? "badge-ok" : "badge-warn"}`}>
                    {p.contrato_status === "assinado" ? "Assinado" : "Pendente"}
                  </span>
                </td>
                <td>
                  <span className="badge badge-ok">Confirmado</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-header">
            <i className="ti ti-receipt" /> Estrutura de custos estimada
          </div>
          <div className="panel-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CUSTO_FIELDS.map((c) => (
                <div key={c.key} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 8, alignItems: "center", paddingBottom: 8, borderBottom: ".5px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{c.sub}</div>
                  </div>
                  <FinFieldInline value={fin[c.key] as number} onSave={(v) => update.mutate({ [c.key]: v } as any)} />
                  <FinFieldInline value={fin[c.max] as number} onSave={(v) => update.mutate({ [c.max]: v } as any)} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: ".5px solid var(--border-strong)", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Total estimado</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--accent)" }}>
                {fmtBRL(custoMin)}–{fmtBRL(custoMax)}
              </span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <i className="ti ti-chart-bar" /> Cenários de resultado
          </div>
          <div className="panel-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Cenario
                title={`Mínimo viável — ${minV} pax × ${fmtBRL(tierStd)}`}
                badge="Ponto de equilíbrio"
                badgeClass="badge-warn"
                receita={minV * tierStd}
                custo={custoMid}
                bg="var(--surface2)"
              />
              <Cenario
                title={`Meta — ${meta} pax × ${fmtBRL(ticketMedio)} médio`}
                badge="Cenário alvo"
                badgeClass="badge-ok"
                receita={meta * ticketMedio}
                custo={custoMid}
                bg="var(--teal-light)"
                accent="var(--teal)"
              />
              <Cenario
                title={`Otimista — ${meta} pax × ${fmtBRL(tierPrem)}`}
                badge="Upside"
                badgeClass="badge-blue"
                receita={meta * tierPrem}
                custo={custoMid}
                bg="var(--surface2)"
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 12 }}>
              * Custos reais dependem de confirmação com parceiros locais. Câmbio adotado: R$ {fin.cambio.toFixed(2).replace(".", ",")} / USD.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, sub, cls }: any) {
  return (
    <div className="metric-card">
      <div className="metric-label"><i className={`ti ${icon}`} />{label}</div>
      <div className={`metric-value ${cls ?? ""}`}>{value}</div>
      <div className="metric-sub">{sub}</div>
    </div>
  );
}

function Cenario({ title, badge, badgeClass, receita, custo, bg, accent }: any) {
  const resultado = receita - custo;
  const pct = ((resultado / receita) * 100) || 0;
  return (
    <div style={{ background: bg, borderRadius: "var(--radius-sm)", padding: 14, border: accent ? `.5px solid ${accent}33` : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: accent ?? "var(--text2)" }}>{title}</div>
        <span className={`badge ${badgeClass}`}>{badge}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "var(--text3)" }}>Receita bruta</span>
        <span style={{ fontWeight: 500 }}>{fmtBRL(receita)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: "var(--text3)" }}>Custo estimado</span>
        <span style={{ color: "var(--accent)" }}>− {fmtBRL(custo)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 8, paddingTop: 8, borderTop: ".5px solid var(--border)" }}>
        <span style={{ fontWeight: 500 }}>Resultado estimado</span>
        <span style={{ fontWeight: 500, color: "var(--teal)" }}>
          {fmtBRL(resultado)} ({pct.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}

function FinField({ label, value, onSave, step }: { label: string; value: number; onSave: (v: number) => void; step?: string }) {
  const [v, setV] = useState(String(value));
  useEffect(() => setV(String(value)), [value]);
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type="number"
        step={step ?? "1"}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => {
          const n = Number(v);
          if (!isNaN(n) && n !== value) onSave(n);
        }}
      />
    </div>
  );
}

function FinFieldInline({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [v, setV] = useState(String(value));
  useEffect(() => setV(String(value)), [value]);
  return (
    <input
      className="form-input"
      type="number"
      style={{ width: 110, padding: "5px 8px", fontSize: 12 }}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        const n = Number(v);
        if (!isNaN(n) && n !== value) onSave(n);
      }}
    />
  );
}
