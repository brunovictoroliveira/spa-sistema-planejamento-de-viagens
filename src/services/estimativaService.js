// REGRA 1: Custo base diário por pessoa (Hospedagem + Alimentação)
const CUSTO_DIARIO_BASE = {
  economico: 180,
  conforto: 350,
  luxo: 900,
};

// REGRA 2: Modificadores de custo por interesse
const MODIFICADOR_INTERESSE = {
  'Gastronomia': 1.4,
  'Urbano/Lazer': 1.2,
  'Ecoturismo/Aventura': 1.1,
};

// REGRA 3: Custo de transporte fictício entre estados
const CUSTO_TRANSPORTE_INTERESTADUAL = 150;

// REGRA 4 (do JSON v2): Mapeia o perfil_custo_atividade do JSON para um valor em R$
const CUSTO_ATIVIDADE_MAP = {
  gratuito: 0,
  baixo: 30,
  medio: 80,
  alto: 150,
};

/**
 * @param {Array} destinosFiltrados - A lista de destinos JÁ FILTRADA pelo App.jsx
 * @param {Object} quizData - O objeto de filtros (duration, people, budget, etc.)
 * @returns {Object} - Um objeto com os custos calculados
 */
export const calcularCustosEstimados = (destinosFiltrados, quizData) => {
  const { duration, people, budget, interests, states } = quizData;

  // --- 1. Cálculo de Diárias (Hospedagem e Alimentação) ---
  let custoBasePorPessoa = CUSTO_DIARIO_BASE[budget] || CUSTO_DIARIO_BASE['conforto'];

  // Aplica modificador de interesse
  let modificadorMax = 1.0;
  interests.forEach(interesse => {
    const mod = MODIFICADOR_INTERESSE[interesse];
    if (mod && mod > modificadorMax) {
      modificadorMax = mod;
    }
  });

  const custoDiarioFinal = custoBasePorPessoa * modificadorMax;
  
  const custoAlimentacaoTotal = (custoDiarioFinal * 0.4) * people * duration; // 40% do custo
  const custoHospedagemTotal = (custoDiarioFinal * 0.6) * people * duration; // 60% do custo

  // --- 2. Cálculo de Transporte (Simulado) ---
  let custoTransporteTotal = 0;
  if (states.length > 1) {
    custoTransporteTotal = (CUSTO_TRANSPORTE_INTERESTADUAL * (states.length - 1)) * people;
  }
  
  // "Uber" fictício (custo fixo por dia para pequenos deslocamentos)
  const custoDeslocamentoUrbano = (20 * duration) * Math.ceil(people / 4); // R$20/dia por carro

  custoTransporteTotal += custoDeslocamentoUrbano;

  // --- 3. Cálculo de Atividades (Baseado no JSON v2) ---
  let custoAtividadesTotal = 0;
  
  if (destinosFiltrados.length > 0) {
    // 1. Soma o custo de ingresso de todas as atividades filtradas
    const somaCustosAtividades = destinosFiltrados.reduce((acc, dest) => {
      // Verifica se perfil_custo_atividade existe no destino
      const perfilCusto = dest.perfil_custo_atividade || 'gratuito';
      const custo = CUSTO_ATIVIDADE_MAP[perfilCusto] || 0;
      return acc + custo;
    }, 0);

    // 2. Calcula o custo médio por atividade
    const custoMedioPorAtividade = somaCustosAtividades / destinosFiltrados.length;

    // 3. Regra: Simula que o usuário fará 1 atividade a cada 2 dias.
    const numeroDeAtividadesSimuladas = Math.ceil(duration / 2);

    // 4. Custo total = (custo médio) x (qtd de atividades) x (qtd de pessoas)
    custoAtividadesTotal = (custoMedioPorAtividade * numeroDeAtividadesSimuladas) * people;

  } else {
    custoAtividadesTotal = 0;
  }

  // --- 4. Totalização ---
  const custoTotal = custoHospedagemTotal + custoAlimentacaoTotal + custoTransporteTotal + custoAtividadesTotal;

  return {
    custoTotal,
    custoHospedagemTotal,
    custoAlimentacaoTotal,
    custoTransporteTotal,
    custoAtividadesTotal,
  };
};

