// Esta é a nossa base de conhecimento "fictícia" para custos de transporte.
// Simula o custo (ida e volta) de uma passagem (aérea/ônibus) entre as capitais.
// ATUALIZADO para refletir os custos aproximados do final de 2024 / início de 2025.

// Mapeamento dos estados para seus "hubs" (capitais/aeroportos principais)
export const ORIGIN_HUBS = {
  SP: "São Paulo (SP)",
  RJ: "Rio de Janeiro (RJ)",
  MG: "Belo Horizonte (MG)",
  ES: "Vitória (ES)",
};

// Matriz de custo simulado (ex: SP -> RJ custa R$ 400 ida e volta)
// Usamos uma matriz simétrica (ida = volta) para simplificar
export const COST_MATRIX = {
  SP: {
    SP: 0,
    RJ: 400, // SP <-> RJ
    MG: 500, // SP <-> MG
    ES: 750, // SP <-> ES
  },
  RJ: {
    SP: 400,
    RJ: 0,
    MG: 450, // RJ <-> MG
    ES: 600, // RJ <-> ES
  },
  MG: {
    SP: 500,
    MG: 0,
    RJ: 450,
    ES: 700, // MG <-> ES
  },
  ES: {
    SP: 750,
    RJ: 600,
    MG: 700,
    ES: 0,
  },
};

