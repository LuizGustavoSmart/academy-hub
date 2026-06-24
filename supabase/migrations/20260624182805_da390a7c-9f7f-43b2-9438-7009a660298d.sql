
-- PARTICIPANTS
CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  nome_completo TEXT,
  cargo TEXT,
  empresa TEXT,
  cidade TEXT,
  email TEXT,
  telefone TEXT,
  passaporte TEXT,
  data_nascimento TEXT,
  contato_emergencia TEXT,
  restricoes_alimentares TEXT,
  alergias TEXT,
  observacoes_medicas TEXT,
  medicamentos TEXT,
  quarto TEXT,
  tier TEXT DEFAULT 'standard',
  valor_pago NUMERIC DEFAULT 0,
  pagamento_status TEXT DEFAULT 'pendente',
  contrato_status TEXT DEFAULT 'pendente',
  seguro_status TEXT DEFAULT 'pendente',
  voo_ida_status TEXT DEFAULT 'pendente',
  voo_volta_status TEXT DEFAULT 'pendente',
  uso_imagem_status TEXT DEFAULT 'pendente',
  origem TEXT,
  observacoes TEXT,
  status TEXT DEFAULT 'em_andamento',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participants TO anon, authenticated;
GRANT ALL ON public.participants TO service_role;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access participants" ON public.participants FOR ALL USING (true) WITH CHECK (true);

-- LEADS
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cargo TEXT,
  empresa TEXT,
  cidade TEXT,
  passo INT NOT NULL DEFAULT 1,
  responsavel TEXT DEFAULT 'caetano',
  status TEXT DEFAULT 'abordado',
  observacoes TEXT,
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- TOUCHPOINTS
CREATE TABLE public.touchpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  touchpoint_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nao_iniciado',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(participant_id, touchpoint_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.touchpoints TO anon, authenticated;
GRANT ALL ON public.touchpoints TO service_role;
ALTER TABLE public.touchpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access touchpoints" ON public.touchpoints FOR ALL USING (true) WITH CHECK (true);

-- PENDENCIAS
CREATE TABLE public.pendencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  fase TEXT DEFAULT 'comercial',
  dono TEXT,
  prioridade TEXT DEFAULT 'normal',
  impacto TEXT,
  status TEXT DEFAULT 'aberta',
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pendencias TO anon, authenticated;
GRANT ALL ON public.pendencias TO service_role;
ALTER TABLE public.pendencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access pendencias" ON public.pendencias FOR ALL USING (true) WITH CHECK (true);

-- FINANCEIRO CONFIG (singleton)
CREATE TABLE public.financeiro_config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  cambio NUMERIC DEFAULT 5.50,
  tier_standard NUMERIC DEFAULT 99000,
  tier_premium NUMERIC DEFAULT 115500,
  meta_vagas INT DEFAULT 25,
  min_vagas INT DEFAULT 20,
  custo_parceiro_min NUMERIC DEFAULT 330000,
  custo_parceiro_max NUMERIC DEFAULT 440000,
  custo_hoteis_min NUMERIC DEFAULT 385000,
  custo_hoteis_max NUMERIC DEFAULT 495000,
  custo_transporte_min NUMERIC DEFAULT 82000,
  custo_transporte_max NUMERIC DEFAULT 110000,
  custo_jantares_min NUMERIC DEFAULT 82000,
  custo_jantares_max NUMERIC DEFAULT 110000,
  custo_videomaker_min NUMERIC DEFAULT 44000,
  custo_videomaker_max NUMERIC DEFAULT 66000,
  custo_interpretes_min NUMERIC DEFAULT 44000,
  custo_interpretes_max NUMERIC DEFAULT 55000,
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financeiro_config TO anon, authenticated;
GRANT ALL ON public.financeiro_config TO service_role;
ALTER TABLE public.financeiro_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access fin" ON public.financeiro_config FOR ALL USING (true) WITH CHECK (true);
INSERT INTO public.financeiro_config (id) VALUES (1);

-- MENSAGENS (accordion editáveis)
CREATE TABLE public.mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etapa TEXT NOT NULL, -- comercial | preop | viagem
  codigo TEXT NOT NULL, -- P1..P7, D-60..D-3, etc
  titulo TEXT NOT NULL,
  meta TEXT,
  nota TEXT,
  nota_tipo TEXT DEFAULT 'warn', -- warn | danger
  corpo TEXT, -- markdown/html-safe text editado pelo usuário
  ordem INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mensagens TO anon, authenticated;
GRANT ALL ON public.mensagens TO service_role;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access mensagens" ON public.mensagens FOR ALL USING (true) WITH CHECK (true);

-- Seed mensagens (comercial)
INSERT INTO public.mensagens (etapa, codigo, titulo, meta, nota, nota_tipo, corpo, ordem) VALUES
('comercial','P1','Abordagem do Roque — convite direto','Responsável: Roque · Canal: WhatsApp · Arquivo: nenhum',
 'Esse passo só funciona se o Roque tiver relação real e recente com a pessoa — convite genérico em massa quebra o efeito "pensei em você" e contamina a credibilidade da abordagem do Caetano no passo seguinte.','warn',
 E'WhatsApp\n\nOi [Nome], tudo bem? Olha, lembrei de você agora — estamos organizando uma missão executiva pra China em outubro/novembro, eu e o pessoal da Matter&Co. É uma imersão de 9 dias em Pequim, Xangai e Hangzhou pra entender como a China está usando IA na prática. Curadoria bem fechada, vaga limitada. Acho que faz muito sentido pra você. Topa eu te passar mais detalhes?\n\nObs: Não enviar e-mail neste passo. Se a pessoa responder "sim" pelo WhatsApp, o e-mail formal entra no P2 junto com o Caetano.', 1),
('comercial','P2','Contato comercial do Caetano — qualificação','Responsável: Caetano · Canal: WhatsApp + E-mail · Arquivo: resumo de 1 página',
 'Ponto de maior risco do funil: não pressionar fechamento antes de a pessoa ter informação real. Ofereça o contrato como disponibilidade, não como decisão pedida.','warn',
 E'WhatsApp\n\nOi [Nome], aqui é o Caetano, da Matter&Co — o Roque me passou que você ficou interessado na missão da China. Separei um resumo rápido com os números da viagem. Fica à vontade pra me mandar qualquer dúvida e já vou adiantando o contrato pra você ter em mãos quando quiser avançar.\n\nE-mail (Assunto: Academy China 2026 — informações da missão)\n\nOlá [Nome], como o Roque comentou, estamos organizando a Academy China 2026 — imersão de 9 dias em Pequim, Xangai e Hangzhou, com curadoria voltada para como a China aplica IA na prática. Em anexo, um resumo com as informações principais. Abraço, Caetano', 2),
('comercial','P3','Envio do mapa da viagem','Responsável: Caetano · Canal: WhatsApp + E-mail · Arquivo: deck completo',
 'Alguém que entende bem do conteúdo precisa revisar a mensagem antes de enviar. Vale ser transparente que a agenda fina ainda está em construção — sem soar incerto.','warn',
 E'WhatsApp\n\n[Nome], segue o material completo da viagem — cidades, o que está incluso, como funciona a curadoria de agenda e quem é nosso parceiro local na China. Dá uma olhada com calma.\n\nE-mail (Assunto: Roteiro completo — Academy China 2026)\n\nSegue em anexo o material completo da Academy China 2026, com o roteiro pelas três cidades. Vale lembrar que a agenda específica é construída em função do perfil do grupo confirmado. Abraço, Caetano', 3),
('comercial','P4','Sugestão de datas de voo','Responsável: Caetano · Canal: WhatsApp + E-mail · Arquivo: doc de voos (a criar)',
 '⚠ Passo bloqueado: esse passo não entra em operação enquanto as datas no material estiverem inconsistentes. É o ponto exato onde um erro de data vira visível e mensurável para o cliente.','danger',
 E'WhatsApp\n\n[Nome], pra te ajudar a já visualizar a logística: separei aqui sugestões de voo saindo de [BH/SP] no dia [DATA A CONFIRMAR], com retorno em [DATA A CONFIRMAR]. Faz sentido pra você essas datas?\n\nE-mail (Assunto: Sugestão de voos — Academy China 2026)\n\nMontei sugestões de voos saindo de Belo Horizonte e São Paulo, compatíveis com as datas da missão. A passagem aérea é contratada individualmente. Abraço, Caetano', 4),
('comercial','P5','Go / No-go — pedido de decisão','Responsável: Caetano · Canal: WhatsApp',
 'Escassez só funciona se for verdade no momento do envio. Mandar essa mensagem para muita gente ao mesmo tempo sem controle de vagas comprometidas mina a credibilidade do gatilho.','danger',
 E'WhatsApp\n\n[Nome], estamos fechando a lista final da missão — temos [N] vagas confirmadas até agora e o número que garante a viagem em plena potência está próximo. Posso te considerar dentro, ou ainda precisa de mais alguma informação antes de decidir?', 5),
('comercial','P6','Envio do contrato','Responsável: Caetano · Canal: WhatsApp + E-mail · Arquivo: contrato',
 '⚠ Passo bloqueado: não enviar contrato sem política de cancelamento explícita. Em viagem internacional de alto ticket, ausência dessa cláusula é risco jurídico.','danger',
 E'WhatsApp\n\n[Nome], que ótimo! Segue o link do contrato pra assinatura. Qualquer dúvida em alguma cláusula, me chama antes de assinar.\n\nE-mail (Assunto: Contrato — Academy China 2026)\n\nSeguem em anexo o contrato e as condições de pagamento. Após a assinatura, o próximo passo é a confirmação do pagamento, que garante sua vaga. Abraço, Caetano', 6),
('comercial','P7','Confirmação de pagamento e reserva de vaga','Responsável: Caetano · Canal: WhatsApp + E-mail · Arquivo: comprovante + boas-vindas',
 'Este é o gancho natural para a Fase 2 (pré-operacional). Vale já ter pronto o que vem a seguir antes de confirmar a vaga.','warn',
 E'WhatsApp\n\n[Nome], recebido! 🎉 Sua vaga na Academy China 2026 está confirmada. Em breve te incluo no grupo da turma. Bem-vindo a bordo!\n\nE-mail (Assunto: Vaga confirmada — Academy China 2026)\n\nConfirmamos o recebimento do pagamento e sua vaga está garantida. Em breve enviaremos os próximos passos. Seja bem-vindo à missão! Abraço, Caetano', 7);

INSERT INTO public.mensagens (etapa, codigo, titulo, meta, nota, nota_tipo, corpo, ordem) VALUES
('preop','D-60','Kickoff oficial — boas-vindas + IA','Obrigatório · Síncrono · Canal: WhatsApp grupo + E-mail',
 'Conteúdo do kickoff tem duas frentes (a decidir): boas-vindas institucionais e conteúdo de IA. Pedir formulário de perfil aqui.','warn',
 E'WhatsApp grupo\n\nBem-vindos à Academy China 2026! 🇨🇳 No dia [DATA], às [HORÁRIO], faremos nosso kickoff oficial. Link: [LINK]. Preencham o formulário antes: [LINK FORMULÁRIO].\n\nE-mail\n\nOlá [Nome], no dia [DATA] faremos o kickoff oficial com apresentação do grupo, informações de viagem e primeira leitura sobre IA aplicada. Preencha o formulário: [LINK]. Caetano', 1),
('preop','D-45','Aquecimento inicial — as 3 cidades','Recomendado · Async · WhatsApp grupo','Touchpoint 2 do aquecimento. Material: recortes do deck em formato visual.','warn',
 E'WhatsApp grupo\n\nConhece Pequim, Xangai e Hangzhou? Cada cidade representa uma face diferente da China que opera com IA — política, financeira e tecnológica. Material rápido pra você se situar: [LINK].', 2),
('preop','D-30','Logística da saída','Recomendado · Async · WhatsApp grupo',
 'Atenção: confirmar se o upgrade Emirates e o terminal BTG estão fechados antes de usar como gerador de expectativa.','danger',
 E'WhatsApp grupo\n\nFaltam 30 dias! Vou adiantar informações logísticas: terminal BTG [se confirmado], horário de chegada, conexões sugeridas.', 3),
('preop','D-21','Dicas práticas — apps, câmbio e etiqueta','Recomendado · Async · WhatsApp grupo · Guia PDF (a criar)',
 'Material: guia rápido de apps/etiqueta — documento novo a criar.','warn',
 E'WhatsApp grupo\n\nDaqui a 3 semanas embarcamos! Guia rápido com apps essenciais (VPN, WeChat), câmbio e dicas de etiqueta de negócios: [LINK].', 4),
('preop','D-14','Confirmação de logística pessoal','Recomendado · Async · WhatsApp grupo · Checklist (a criar)',
 'Lembrar que seguro viagem é item não incluso e obrigatório.','warn',
 E'WhatsApp grupo\n\nDuas semanas! Checklist:\n✅ Passaporte válido 6+ meses?\n✅ Isenção de visto (até 30 dias)?\n✅ Seguro viagem contratado? (obrigatório)\n✅ Voo de ida confirmado?', 5),
('preop','D-7','Preparação para os vídeos diários','Recomendado · Async · WhatsApp grupo',
 'Atenção: só disparar se a cláusula de uso de imagem já estiver assinada.','danger',
 E'WhatsApp grupo\n\nUma semana! Cada um vai gravar um vídeo de 1 min por dia com sua leitura. Sem pressão, sem roteiro rígido — o videomaker conduz.', 6),
('preop','D-3','Pré-embarque — sessão final obrigatória','Obrigatório · Síncrono · WhatsApp grupo',
 'Conteúdo: checklist final, ponto de encontro, contato de emergência, protocolos de imagem.','warn',
 E'WhatsApp grupo\n\nNa [DIA], [DATA], faremos nosso último encontro antes do embarque — checklist final e ponto de encontro. Não falte: [LINK].', 7);

INSERT INTO public.mensagens (etapa, codigo, titulo, meta, nota, nota_tipo, corpo, ordem) VALUES
('viagem','Dia 0','Embarque — início oficial da missão','WhatsApp grupo · No embarque ou pouso',
 'Tom: animação e pertencimento. Breve — a experiência fala por si.','warn',
 E'WhatsApp grupo\n\nMissão iniciada! 🇨🇳 Nos próximos 9 dias vamos viver de perto a China que opera com IA na escala real. Bem-vindos à Academy China 2026.', 1),
('viagem','Diário','Ativação de debrief — modelo diário','WhatsApp grupo · Antes do debrief',
 'Adaptar [EMPRESA] e [PRÉVIA] conforme roteiro do dia.','warn',
 E'Pré-debrief\nHoje passamos por [EMPRESA]. A pergunta que vai guiar nossa conversa: o que do que vimos você conseguiria aplicar no seu negócio nos próximos 90 dias?\n\nPós-debrief\nMais um dia concluído. Obrigado pela honestidade no debrief — e pelos vídeos. Amanhã: [PRÉVIA].', 2),
('viagem','Transições','Mensagem de transição entre cidades','WhatsApp grupo · Noite anterior ao deslocamento',
 'Usar antes de cada transição (Pequim→Xangai e Xangai→Hangzhou).','warn',
 E'WhatsApp grupo\n\nAmanhã nos movemos para [PRÓXIMA CIDADE]. Check-out às [HORÁRIO], encontro no lobby às [HORÁRIO], bagagem na recepção até [HORÁRIO]. Dúvidas: [CONTATO].', 3),
('viagem','Dia 9','Retorno — encerramento e expectativa pós-viagem','WhatsApp grupo · No embarque de volta',
 'Tom: gratidão e antecipação. Mensagem pessoal do Caetano.','warn',
 E'WhatsApp grupo\n\nQue 9 dias. Cada um trouxe uma leitura diferente — é essa diversidade que torna a Academy China única. Em breve, a síntese executiva. Obrigado. — Caetano', 4);

-- Seed inicial de pendências (do HTML)
INSERT INTO public.pendencias (titulo, descricao, fase, dono, prioridade, impacto, ordem) VALUES
('Inconsistência de datas no material','Capa vs. calendário vs. página de inclusos — bloqueia P4 e credibilidade do funil.','comercial','Caetano','critico','Bloqueia P4',1),
('Criar documento de sugestão de voos (P4)','Saídas de BH e SP com horários compatíveis. Não existe ainda.','comercial','Caetano','critico','Passo bloqueado',2),
('Definir condições de pagamento e cancelamento (P6)','Risco jurídico em viagem internacional de alto ticket. Bloqueia envio do contrato.','comercial','Caetano','critico','Passo bloqueado',3),
('Definir critério de tier de preço (R$ 99k vs. R$ 115,5k)','Precisa estar claro antes de P2 ou P6 para evitar inconsistência com leads.','comercial','Caetano + Roque','alta','Inconsistência P2/P6',4),
('Controle de vagas comprometidas em tempo real','Gatilho de escassez do P5 só funciona se o número for real e verificável.','comercial','Caetano','alta','Gatilho P5 sem controle',5),
('Decidir formato do kickoff: 1 sessão ou 2 separadas','Impacta a agenda C-level e a organização do material de IA.','preop','Caetano + Zé Ricardo','critico','Impacta D-60',6),
('Criar checklist de pré-viagem e guia de apps/etiqueta','Documentos a criar do zero para D-14 e D-21.','preop','Caetano','critico','Bloqueia D-14 e D-21',7),
('Resolver cláusula de uso de imagem antes do D-7','Comunicar a dinâmica dos vídeos antes da cláusula estar assinada é risco jurídico.','preop','Caetano','critico','Bloqueia D-7',8),
('Confirmar BTG/Emirates antes de usar como expectativa (D-30)','Prometer sem confirmação contamina credibilidade.','preop','Zé Ricardo / Lit','alta','Confiança do grupo',9),
('Definir moderador do grupo de WhatsApp da turma','Grupo sem dono tende a morrer após a segunda semana.','preop','Caetano','alta','Engajamento',10),
('Definir facilitador do debrief diário','Sem dono, o pilar "leitura executiva" do produto não tem entrega garantida.','viagem','Caetano + Roque','critico','Risco de produto',11),
('Confirmar se Caetano e/ou Roque viajam com o grupo','Impacta debrief e presença institucional.','viagem','Caetano + Roque','critico','Decisão pendente',12),
('Formalizar fluxo do videomaker','~225 vídeos de 1 min em 9 dias. Sem fluxo definido, vira caos desde o primeiro dia.','viagem','Caetano','alta','Bloqueia gravações',13),
('Criar checklist formal de logística de transição entre cidades','Mover 20-25 executivos sem roteiro escrito gera imprevistos.','viagem','Zé Ricardo / Lit','alta','Transições',14);
