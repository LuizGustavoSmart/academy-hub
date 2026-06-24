import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardPage } from "@/components/pages/Dashboard";
import { ParticipantesPage } from "@/components/pages/Participantes";
import { FinanceiroPage } from "@/components/pages/Financeiro";
import { ComercialPage } from "@/components/pages/Comercial";
import { PreViagemPage } from "@/components/pages/PreViagem";
import { ViagemPage } from "@/components/pages/Viagem";
import { PendenciasList } from "@/components/PendenciasList";
import { usePendencias } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

type Tab = "dashboard" | "participantes" | "financeiro" | "comercial" | "preop" | "operacional" | "pendencias";

const PAGE_META: Record<Tab, { title: string; sub: string }> = {
  dashboard: { title: "Dashboard", sub: "Visão geral da operação" },
  participantes: { title: "Participantes", sub: "Dados e perfis dos confirmados" },
  financeiro: { title: "Financeiro", sub: "Receita, custos e margens" },
  comercial: { title: "Comercial", sub: "Etapas · Funil comercial" },
  preop: { title: "Pré-viagem", sub: "Etapas · Fase pré-operacional" },
  operacional: { title: "Viagem", sub: "Etapas · Fase operacional" },
  pendencias: { title: "Pendências", sub: "Backlog unificado" },
};

const SUBTABS: Record<string, { id: string; label: string; icon: string }[]> = {
  comercial: [
    { id: "dash", label: "Dashboard", icon: "ti-chart-bar" },
    { id: "leads", label: "Leads", icon: "ti-table" },
    { id: "pipeline", label: "Pipeline", icon: "ti-layout-columns" },
    { id: "mensagens", label: "Mensagens", icon: "ti-message" },
    { id: "pendencias", label: "Pendências", icon: "ti-alert-triangle" },
  ],
  preop: [
    { id: "dash", label: "Dashboard", icon: "ti-chart-bar" },
    { id: "pipeline", label: "Pipeline", icon: "ti-calendar-event" },
    { id: "parts", label: "Participantes", icon: "ti-users" },
    { id: "mensagens", label: "Mensagens", icon: "ti-message" },
    { id: "pendencias", label: "Pendências", icon: "ti-alert-triangle" },
  ],
  operacional: [
    { id: "dash", label: "Dashboard", icon: "ti-chart-bar" },
    { id: "prog", label: "Programação", icon: "ti-map-2" },
    { id: "pend", label: "Pendências", icon: "ti-alert-triangle" },
    { id: "msgs", label: "Mensagens", icon: "ti-message" },
  ],
};

function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [sub, setSub] = useState<string>("dash");
  const [etapasOpen, setEtapasOpen] = useState(true);
  const [openParticipantId, setOpenParticipantId] = useState<string | null>(null);
  const { data: pendencias = [] } = usePendencias();
  const pendCount = pendencias.filter((p) => p.status !== "resolvida").length;

  const switchTab = (t: Tab) => {
    setTab(t);
    setSub("dash");
    if (t === "participantes") setOpenParticipantId(null);
    if (t === "comercial" || t === "preop" || t === "operacional") setEtapasOpen(true);
  };

  const meta = PAGE_META[tab];
  const subtabs = SUBTABS[tab];

  return (
    <div className="app-shell">
      <nav className={`sidebar${collapsed ? " collapsed" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo"><i className="ti ti-map-2" /></div>
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-title">Academy China</div>
            <div className="sidebar-brand-sub">2026 · Matter Academy</div>
          </div>
        </div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          <NavItem active={tab === "dashboard"} icon="ti-layout-dashboard" label="Dashboard" onClick={() => switchTab("dashboard")} />
          <NavItem active={tab === "participantes"} icon="ti-users" label="Participantes" onClick={() => switchTab("participantes")} />
          <NavItem active={tab === "financeiro"} icon="ti-cash" label="Financeiro" onClick={() => switchTab("financeiro")} />
          <div className="nav-section-label">Etapas</div>
          <button
            className={`nav-item${etapasOpen ? " open" : ""}`}
            onClick={() => setEtapasOpen(!etapasOpen)}
          >
            <i className="ti ti-stairs nav-icon" />
            <span className="nav-label">Etapas</span>
            <i className="ti ti-chevron-down nav-arrow" />
          </button>
          <div className={`nav-sub${etapasOpen ? " open" : ""}`}>
            <NavSubItem active={tab === "comercial"} label="Comercial" onClick={() => switchTab("comercial")} />
            <NavSubItem active={tab === "preop"} label="Pré-viagem" onClick={() => switchTab("preop")} />
            <NavSubItem active={tab === "operacional"} label="Viagem" onClick={() => switchTab("operacional")} />
          </div>
          <NavItem
            active={tab === "pendencias"}
            icon="ti-alert-triangle"
            label={`Pendências${pendCount > 0 ? ` (${pendCount})` : ""}`}
            onClick={() => switchTab("pendencias")}
          />
        </div>
        <div className="sidebar-toggle">
          <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            <i className="ti ti-layout-sidebar" style={{ fontSize: 16 }} />
          </button>
        </div>
      </nav>

      <div className="right-col">
        <div className="header">
          <div>
            <div className="page-title">{meta.title}</div>
            <div className="page-breadcrumb">{meta.sub}</div>
          </div>
          <div className="header-status">
            <i className="ti ti-clock" /> Pré-operacional em curso
          </div>
        </div>

        {subtabs && (
          <div className="sub-tabs">
            {subtabs.map((s) => (
              <button
                key={s.id}
                className={`sub-tab-btn${sub === s.id ? " active" : ""}`}
                onClick={() => setSub(s.id)}
              >
                <i className={`ti ${s.icon}`} style={{ fontSize: 13 }} /> {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="main-content">
          {tab === "dashboard" && <DashboardPage />}
          {tab === "participantes" && (
            <ParticipantesPage openId={openParticipantId} setOpenId={setOpenParticipantId} />
          )}
          {tab === "financeiro" && <FinanceiroPage />}
          {tab === "comercial" && <ComercialPage sub={sub} />}
          {tab === "preop" && <PreViagemPage sub={sub} />}
          {tab === "operacional" && <ViagemPage sub={sub} />}
          {tab === "pendencias" && <PendenciasList title="Backlog unificado — todas as fases" />}
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return (
    <button className={`nav-item${active ? " active" : ""}`} onClick={onClick}>
      <i className={`ti ${icon} nav-icon`} />
      <span className="nav-label">{label}</span>
    </button>
  );
}

function NavSubItem({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className={`nav-sub-item${active ? " active" : ""}`} onClick={onClick}>
      <span className="nav-sub-dot" />
      {label}
    </button>
  );
}
