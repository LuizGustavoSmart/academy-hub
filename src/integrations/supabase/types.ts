export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      financeiro_config: {
        Row: {
          cambio: number | null
          custo_hoteis_max: number | null
          custo_hoteis_min: number | null
          custo_interpretes_max: number | null
          custo_interpretes_min: number | null
          custo_jantares_max: number | null
          custo_jantares_min: number | null
          custo_parceiro_max: number | null
          custo_parceiro_min: number | null
          custo_transporte_max: number | null
          custo_transporte_min: number | null
          custo_videomaker_max: number | null
          custo_videomaker_min: number | null
          id: number
          meta_vagas: number | null
          min_vagas: number | null
          tier_premium: number | null
          tier_standard: number | null
          updated_at: string | null
        }
        Insert: {
          cambio?: number | null
          custo_hoteis_max?: number | null
          custo_hoteis_min?: number | null
          custo_interpretes_max?: number | null
          custo_interpretes_min?: number | null
          custo_jantares_max?: number | null
          custo_jantares_min?: number | null
          custo_parceiro_max?: number | null
          custo_parceiro_min?: number | null
          custo_transporte_max?: number | null
          custo_transporte_min?: number | null
          custo_videomaker_max?: number | null
          custo_videomaker_min?: number | null
          id?: number
          meta_vagas?: number | null
          min_vagas?: number | null
          tier_premium?: number | null
          tier_standard?: number | null
          updated_at?: string | null
        }
        Update: {
          cambio?: number | null
          custo_hoteis_max?: number | null
          custo_hoteis_min?: number | null
          custo_interpretes_max?: number | null
          custo_interpretes_min?: number | null
          custo_jantares_max?: number | null
          custo_jantares_min?: number | null
          custo_parceiro_max?: number | null
          custo_parceiro_min?: number | null
          custo_transporte_max?: number | null
          custo_transporte_min?: number | null
          custo_videomaker_max?: number | null
          custo_videomaker_min?: number | null
          id?: number
          meta_vagas?: number | null
          min_vagas?: number | null
          tier_premium?: number | null
          tier_standard?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          cargo: string | null
          cidade: string | null
          created_at: string | null
          empresa: string | null
          id: string
          nome: string
          observacoes: string | null
          ordem: number | null
          passo: number
          responsavel: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cargo?: string | null
          cidade?: string | null
          created_at?: string | null
          empresa?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          ordem?: number | null
          passo?: number
          responsavel?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cargo?: string | null
          cidade?: string | null
          created_at?: string | null
          empresa?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          ordem?: number | null
          passo?: number
          responsavel?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          codigo: string
          corpo: string | null
          created_at: string | null
          etapa: string
          id: string
          meta: string | null
          nota: string | null
          nota_tipo: string | null
          ordem: number | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          codigo: string
          corpo?: string | null
          created_at?: string | null
          etapa: string
          id?: string
          meta?: string | null
          nota?: string | null
          nota_tipo?: string | null
          ordem?: number | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string
          corpo?: string | null
          created_at?: string | null
          etapa?: string
          id?: string
          meta?: string | null
          nota?: string | null
          nota_tipo?: string | null
          ordem?: number | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          alergias: string | null
          cargo: string | null
          cidade: string | null
          contato_emergencia: string | null
          contrato_status: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          empresa: string | null
          id: string
          medicamentos: string | null
          nome: string
          nome_completo: string | null
          observacoes: string | null
          observacoes_medicas: string | null
          origem: string | null
          pagamento_status: string | null
          passaporte: string | null
          quarto: string | null
          restricoes_alimentares: string | null
          seguro_status: string | null
          status: string | null
          telefone: string | null
          tier: string | null
          updated_at: string | null
          uso_imagem_status: string | null
          valor_pago: number | null
          voo_ida_status: string | null
          voo_volta_status: string | null
        }
        Insert: {
          alergias?: string | null
          cargo?: string | null
          cidade?: string | null
          contato_emergencia?: string | null
          contrato_status?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          medicamentos?: string | null
          nome: string
          nome_completo?: string | null
          observacoes?: string | null
          observacoes_medicas?: string | null
          origem?: string | null
          pagamento_status?: string | null
          passaporte?: string | null
          quarto?: string | null
          restricoes_alimentares?: string | null
          seguro_status?: string | null
          status?: string | null
          telefone?: string | null
          tier?: string | null
          updated_at?: string | null
          uso_imagem_status?: string | null
          valor_pago?: number | null
          voo_ida_status?: string | null
          voo_volta_status?: string | null
        }
        Update: {
          alergias?: string | null
          cargo?: string | null
          cidade?: string | null
          contato_emergencia?: string | null
          contrato_status?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          empresa?: string | null
          id?: string
          medicamentos?: string | null
          nome?: string
          nome_completo?: string | null
          observacoes?: string | null
          observacoes_medicas?: string | null
          origem?: string | null
          pagamento_status?: string | null
          passaporte?: string | null
          quarto?: string | null
          restricoes_alimentares?: string | null
          seguro_status?: string | null
          status?: string | null
          telefone?: string | null
          tier?: string | null
          updated_at?: string | null
          uso_imagem_status?: string | null
          valor_pago?: number | null
          voo_ida_status?: string | null
          voo_volta_status?: string | null
        }
        Relationships: []
      }
      pendencias: {
        Row: {
          created_at: string | null
          descricao: string | null
          dono: string | null
          fase: string | null
          id: string
          impacto: string | null
          ordem: number | null
          prioridade: string | null
          status: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          dono?: string | null
          fase?: string | null
          id?: string
          impacto?: string | null
          ordem?: number | null
          prioridade?: string | null
          status?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          dono?: string | null
          fase?: string | null
          id?: string
          impacto?: string | null
          ordem?: number | null
          prioridade?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      touchpoints: {
        Row: {
          id: string
          participant_id: string
          status: string
          touchpoint_code: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          participant_id: string
          status?: string
          touchpoint_code: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          participant_id?: string
          status?: string
          touchpoint_code?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "touchpoints_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
