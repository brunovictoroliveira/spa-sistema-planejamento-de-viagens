// services/estimativaService.js

// Importa a matriz de custos de transporte
import { COST_MATRIX } from '../data/transporteData';

// --- Base de Conhecimento (Regras de Custo) ---

// REGRA 1: Custo base diário por pessoa (Hospedagem + Alimentação)
const CUSTO_DIARIO_BASE = {
  economico: 180, // (R$ 100 hostel + R$ 80 comida)
  conforto: 350,  // (R$ 200 hotel + R$ 150 comida)
  luxo: 900,      // (R$ 600 hotel + R$ 300 comida)
};

// REGRA 2: Modificadores de custo por interesse (ex: Gastronomia custa mais)
const MODIFICADOR_INTERESSE = {
  'Gastronomia': 1.4,
  'Urbano/Lazer': 1.2,
  'Ecoturismo/Aventura': 1.1,
};

// REGRA 3: Mapeia o perfil_custo_atividade do JSON para um valor em R$
const CUSTO_ATIVIDADE_MAP = {
  gratuito: 0,
  baixo: 30,  // ex: Museus, parques com taxa simples
  medio: 80,  // ex: Ingressos padrão, passeios curtos
  alto: 150,  // ex: Cristo/Pão de Açúcar, Inhotim, Passeios de barco
};

/**
 * Calcula os custos estimados da viagem com base nos filtros e destinos.
 * @param {Array} destinosFiltrados - A lista de destinos JÁ FILTRADA pelo App.jsx
 * @param {Object} quizData - O objeto de filtros (duration, people, budget, etc.)
 * @returns {Object} - Um objeto com os custos calculados
 */
export const calcularCustosEstimados = (destinosFiltrados, quizData) => {
  const { duration, people, budget, interests, states, originState } = quizData;

  // --- 1. Cálculo de Diárias (Hospedagem e Alimentação) ---
  let custoBasePorPessoa = CUSTO_DIARIO_BASE[budget] || CUSTO_DIARIO_BASE['conforto'];

  // Aplica modificador de interesse: Pega o maior modificador da lista
  let modificadorMax = 1.0;
  if (interests) {
    interests.forEach(interesse => {
      const mod = MODIFICADOR_INTERESSE[interesse];
      if (mod && mod > modificadorMax) {
        modificadorMax = mod;
      }
    });
  }

  const custoDiarioFinal = custoBasePorPessoa * modificadorMax;
  
  // Separa o custo diário em 40% alimentação, 60% hospedagem
  const custoAlimentacaoTotal = (custoDiarioFinal * 0.4) * people * duration;
  const custoHospedagemTotal = (custoDiarioFinal * 0.6) * people * duration;

  // --- 2. Cálculo de Transporte (Baseado na Matriz) ---
  let custoTransporteTotal = 0;

  // REGRA 4: Custo de Transporte Interestadual
  if (originState && originState !== 'sem_partida' && states && states.length > 0) {
    const originMatrix = COST_MATRIX[originState] || {};
    
    // Soma o custo de ida da origem para cada estado de destino
    const custoIda = states.reduce((acc, destState) => {
      // Usa o custo da matriz, ou 0 se não for encontrado
      const cost = originMatrix[destState] || 0;
      return acc + cost;
    }, 0);
    
    // REGRA 5: Custo de Volta (simula a volta do último estado visitado)
    const lastState = states[states.length - 1];
    const returnMatrix = COST_MATRIX[lastState] || {};
    const custoVolta = returnMatrix[originState] || 0;

    // Multiplica pelo número de pessoas
    custoTransporteTotal = (custoIda + custoVolta) * people;
  }
  
  // REGRA 6: Custo de Deslocamento Urbano (simulando Uber/Metrô)
  const custoDeslocamentoUrbano = (30 * duration) * Math.ceil(people / 4); // R$30/dia por carro (até 4 pessoas)
  custoTransporteTotal += custoDeslocamentoUrbano;


  // --- 3. Cálculo de Atividades (Baseado no JSON) ---
  let custoAtividadesTotal = 0;
  
  if (destinosFiltrados.length > 0) {
    // 1. Soma o custo de ingresso de todas as atividades filtradas
    const somaCustosAtividades = destinosFiltrados.reduce((acc, dest) => {
      const custo = CUSTO_ATIVIDADE_MAP[dest.perfil_custo_atividade] || 0;
      return acc + custo;
    }, 0);

    // 2. Calcula o custo médio por atividade
    const custoMedioPorAtividade = somaCustosAtividades / destinosFiltrados.length;

    // 3. Regra: Simula que o usuário fará 1 atividade a cada 2 dias.
    const numeroDeAtividadesSimuladas = Math.ceil(duration / 2);

    // 4. Custo total = (custo médio) x (qtd de atividades) x (qtd de pessoas)
    custoAtividadesTotal = (custoMedioPorAtividade * numeroDeAtividadesSimuladas) * people;

  }
  // Se nenhum destino for encontrado, o custo de atividades é 0.

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

