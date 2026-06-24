# Plano: Academy China 2026 — Plataforma Operacional Dinâmica

Converter o HTML monolítico em uma aplicação React (TanStack Start) com backend persistente (Lovable Cloud / Supabase), preservando layout, cores, tipografia e navegação exatamente como no original.

## Abordagem geral

- **Fidelidade visual primeiro**: copiar o CSS do HTML para `src/styles.css` (mantendo todas as variáveis `--accent`, `--teal`, `--bg`, etc.) e replicar a marcação JSX bloco a bloco. Layout sidebar+header+main, sub-abas, accordions, kanban e tabelas ficam idênticos.
- **Sem login** nesta fase. Toda escrita usa policies abertas (`anon` + `authenticated`) numa estrutura preparada para amarrar autenticação depois sem refatoração.
- **Dados dinâmicos via Lovable Cloud**: ativar Cloud, criar schema, ler/escrever via `createServerFn` e React Query.
- **Cálculos sempre derivados**: nenhum indicador é gravado; tudo recomputado a partir das tabelas-fonte.

## Estrutura de rotas (TanStack)

```
src/routes/
  __root.tsx                  layout shell (sidebar + header)
  index.tsx                   Dashboard
  participantes.index.tsx     lista
  participantes.$id.tsx       perfil editável
  financeiro.tsx
  comercial.tsx               layout com sub-abas
    comercial.index|leads|pipeline|mensagens|pendencias.tsx
  pre-viagem.tsx (idem sub-abas)
  viagem.tsx (idem sub-abas)
  pendencias.tsx              backlog unificado
```

Sub-abas são implementadas como rotas filhas para preservar URL e o comportamento visual das abas.

## Schema do banco (Lovable Cloud)

```text
participants(id, nome, cargo, empresa, cidade, email, telefone,
             status, pagamento_status, valor_pago, tier,
             restricoes, observacoes, logistica jsonb, created_at)

leads(id, nome, cargo, empresa, cidade, passo, responsavel,
      status, observacoes, ordem, created_at)

touchpoints(id, participant_id, touchpoint_code, status,
            updated_at)  -- status: nao_iniciado|pendente|realizado

pendencias(id, titulo, descricao, fase, dono, prioridade,
           status, created_at)

financeiro_config(id singleton, cambio, tier_preco,
                  custos jsonb {parceiro, hoteis, transporte,
                  jantares, videomaker, interpretes, outros})

mensagens(id, etapa, titulo, corpo, ordem)  -- accordion editável
```

Todas as tabelas com `GRANT` para `anon` + `authenticated` e RLS aberta (preparada para apertar quando entrar auth). Seed inicial via migração: mensagens, financeiro_config default e qualquer conteúdo fixo do HTML.

## Funcionalidades por página

1. **Dashboard** — métricas calculadas em tempo real (vagas confirmadas, pagamentos recebidos = SUM valor_pago WHERE pagamento_status='confirmado', falta p/ break-even, leads no funil, pendências abertas).

2. **Participantes** — listagem + modal "novo participante"; perfil em `/participantes/$id` com edição inline (campo vira input no clique, salva no blur). Excluir com `AlertDialog`.

3. **Leads + Pipeline** — CRUD tabela; Kanban com drag-and-drop (`@dnd-kit/core`). Drop atualiza `passo`. Mover para P7 abre modal de promoção a participante.

4. **Pré-viagem / Touchpoints** — grid participantes × touchpoints; clique cicla status (`nao_iniciado → pendente → realizado`); upsert em `touchpoints`. Status geral derivado.

5. **Pendências** — CRUD em qualquer etapa; filtros por fase; contador no sidebar reflete `status='aberta'`.

6. **Financeiro** — campos editáveis inline em `financeiro_config`; cenários (mínimo/meta/otimista) recomputados client-side conforme participantes confirmados × custos.

7. **Mensagens** — accordion idêntico ao HTML; cada item editável via `<textarea>` quando aberto em modo edição; salva em `mensagens`.

## Stack técnica

- TanStack Start + Query (já no template).
- Lovable Cloud (Supabase) para persistência.
- `createServerFn` para todas as leituras/escritas (cliente publishable no server).
- `@dnd-kit/core` para kanban.
- shadcn `dialog`, `alert-dialog`, `accordion`, `input`, `textarea`, `select` reutilizados — **estilizados com as variáveis CSS do HTML original** (sobrescritas em `styles.css`) para manter o visual.
- Realtime opcional via canal Supabase para refletir mudanças entre sessões (fase 2 se sobrar escopo; fallback: invalidate on focus + intervalo curto).

## Entregas em ordem

1. Ativar Lovable Cloud + migração com schema completo + seeds.
2. Portar CSS e shell (sidebar retrátil, header, sub-abas, rotas).
3. Dashboard + Participantes (CRUD + perfil).
4. Financeiro editável + cálculos derivados.
5. Comercial (Leads, Pipeline kanban, Mensagens, Pendências).
6. Pré-viagem (Touchpoints grid, Mensagens, Pendências).
7. Viagem (Programação, Mensagens, Pendências).
8. Pendências unificadas + contadores sidebar.
9. Passagem final de fidelidade visual comparando contra o HTML.

## Premissas (avise se quiser mudar)

- Cloud habilitada agora; sem autenticação ainda (RLS aberta, schema já com `created_by uuid` reservado para o futuro).
- Sem realtime na v1 (atualização em refetch / foco da janela). Posso adicionar depois.
- Conteúdo textual do HTML (mensagens, programação, observações financeiras) entra como seed inicial — depois editável.
- Dados de exemplo do HTML (participantes/leads fictícios) **não** são importados; começamos com base vazia. Diga se prefere importar como seed.