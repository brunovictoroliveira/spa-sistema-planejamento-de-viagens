// Esta é a nossa base de conhecimento "fictícia" para custos de transporte.
// Simula o custo (ida e volta) de uma passagem (aérea/ônibus) entre as capitais.

// Mapeamento dos estados para seus "hubs" (capitais/aeroportos principais)
export const ORIGIN_HUBS = {
  SP: "São Paulo (SP)",
  RJ: "Rio de Janeiro (RJ)",
  MG: "Belo Horizonte (MG)",
  ES: "Vitória (ES)",
};

// Matriz de custo simulado (ex: SP -> RJ custa R$ 300 ida e volta)
// Usamos uma matriz simétrica (ida = volta) para simplificar
export const COST_MATRIX = {
  SP: {
    SP: 0,
    RJ: 300, // SP <-> RJ
    MG: 400, // SP <-> MG
    ES: 650, // SP <-> ES
  },
  RJ: {
    SP: 300,
    RJ: 0,
    MG: 350, // RJ <-> MG
    ES: 500, // RJ <-> ES
  },
  MG: {
    SP: 400,
    MG: 0,
    RJ: 350,
    ES: 600, // MG <-> ES
  },
  ES: {
    SP: 650,
    RJ: 500,
    MG: 600,
    ES: 0,
  },
};
