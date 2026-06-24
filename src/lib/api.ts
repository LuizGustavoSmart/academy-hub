import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ────────── TYPES ──────────
export type Participant = {
  id: string;
  nome: string;
  nome_completo: string | null;
  cargo: string | null;
  empresa: string | null;
  cidade: string | null;
  email: string | null;
  telefone: string | null;
  passaporte: string | null;
  data_nascimento: string | null;
  contato_emergencia: string | null;
  restricoes_alimentares: string | null;
  alergias: string | null;
  observacoes_medicas: string | null;
  medicamentos: string | null;
  quarto: string | null;
  tier: string;
  valor_pago: number;
  pagamento_status: string;
  contrato_status: string;
  seguro_status: string;
  voo_ida_status: string;
  voo_volta_status: string;
  uso_imagem_status: string;
  origem: string | null;
  observacoes: string | null;
  status: string;
  created_at: string;
};

export type Lead = {
  id: string;
  nome: string;
  cargo: string | null;
  empresa: string | null;
  cidade: string | null;
  passo: number;
  responsavel: string;
  status: string | null;
  observacoes: string | null;
  ordem: number;
  created_at: string;
};

export type Touchpoint = {
  id: string;
  participant_id: string;
  touchpoint_code: string;
  status: string;
};

export type Pendencia = {
  id: string;
  titulo: string;
  descricao: string | null;
  fase: string;
  dono: string | null;
  prioridade: string;
  impacto: string | null;
  status: string;
  ordem: number;
  created_at: string;
};

export type FinanceiroConfig = {
  id: number;
  cambio: number;
  tier_standard: number;
  tier_premium: number;
  meta_vagas: number;
  min_vagas: number;
  custo_parceiro_min: number;
  custo_parceiro_max: number;
  custo_hoteis_min: number;
  custo_hoteis_max: number;
  custo_transporte_min: number;
  custo_transporte_max: number;
  custo_jantares_min: number;
  custo_jantares_max: number;
  custo_videomaker_min: number;
  custo_videomaker_max: number;
  custo_interpretes_min: number;
  custo_interpretes_max: number;
};

export type Mensagem = {
  id: string;
  etapa: string;
  codigo: string;
  titulo: string;
  meta: string | null;
  nota: string | null;
  nota_tipo: string;
  corpo: string | null;
  ordem: number;
};

const sb = supabase as any;

// ────────── PARTICIPANTS ──────────
export function useParticipants() {
  return useQuery<Participant[]>({
    queryKey: ["participants"],
    queryFn: async () => {
      const { data, error } = await sb.from("participants").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useParticipant(id: string | null) {
  return useQuery<Participant | null>({
    queryKey: ["participant", id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await sb.from("participants").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Partial<Participant>) => {
      const { data, error } = await sb.from("participants").insert(p).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["participants"] }),
  });
}

export function useUpdateParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Participant> }) => {
      const { error } = await sb.from("participants").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["participants"] });
      qc.invalidateQueries({ queryKey: ["participant", v.id] });
    },
  });
}

export function useDeleteParticipant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("participants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["participants"] }),
  });
}

// ────────── LEADS ──────────
export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await sb.from("leads").select("*").order("passo").order("ordem");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (l: Partial<Lead>) => {
      const { data, error } = await sb.from("leads").insert(l).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Lead> }) => {
      const { error } = await sb.from("leads").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

// ────────── TOUCHPOINTS ──────────
export function useTouchpoints() {
  return useQuery<Touchpoint[]>({
    queryKey: ["touchpoints"],
    queryFn: async () => {
      const { data, error } = await sb.from("touchpoints").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpsertTouchpoint() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (t: { participant_id: string; touchpoint_code: string; status: string }) => {
      const { error } = await sb
        .from("touchpoints")
        .upsert({ ...t, updated_at: new Date().toISOString() }, { onConflict: "participant_id,touchpoint_code" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["touchpoints"] }),
  });
}

// ────────── PENDENCIAS ──────────
export function usePendencias() {
  return useQuery<Pendencia[]>({
    queryKey: ["pendencias"],
    queryFn: async () => {
      const { data, error } = await sb.from("pendencias").select("*").order("ordem");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreatePendencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Partial<Pendencia>) => {
      const { data, error } = await sb.from("pendencias").insert(p).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendencias"] }),
  });
}

export function useUpdatePendencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Pendencia> }) => {
      const { error } = await sb.from("pendencias").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendencias"] }),
  });
}

export function useDeletePendencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await sb.from("pendencias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendencias"] }),
  });
}

// ────────── FINANCEIRO ──────────
export function useFinanceiroConfig() {
  return useQuery<FinanceiroConfig | null>({
    queryKey: ["financeiro_config"],
    queryFn: async () => {
      const { data, error } = await sb.from("financeiro_config").select("*").eq("id", 1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateFinanceiroConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<FinanceiroConfig>) => {
      const { error } = await sb
        .from("financeiro_config")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["financeiro_config"] }),
  });
}

// ────────── MENSAGENS ──────────
export function useMensagens(etapa: string) {
  return useQuery<Mensagem[]>({
    queryKey: ["mensagens", etapa],
    queryFn: async () => {
      const { data, error } = await sb.from("mensagens").select("*").eq("etapa", etapa).order("ordem");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpdateMensagem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, corpo }: { id: string; corpo: string }) => {
      const { error } = await sb.from("mensagens").update({ corpo, updated_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mensagens"] }),
  });
}

// ────────── HELPERS ──────────
export const PASSO_LABELS: Record<number, string> = {
  1: "P1 — Abordagem",
  2: "P2 — Qualificação",
  3: "P3 — Mapa enviado",
  4: "P4 — Voos sugeridos",
  5: "P5 — Go / No-go",
  6: "P6 — Contrato",
  7: "P7 — Confirmado",
};

export const fmtBRL = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export const respLabel = (r: string) =>
  r === "roque" ? "Roque" : r === "caetano" ? "Caetano" : "Caetano + Roque";
export const respClass = (r: string) =>
  r === "roque" ? "resp-roque" : r === "caetano" ? "resp-caetano" : "resp-ambos";
