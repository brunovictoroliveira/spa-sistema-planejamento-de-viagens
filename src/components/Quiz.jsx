import React from 'react';
// Importa os hubs de partida que criamos
import { ORIGIN_HUBS } from '../data/transporteData';

// Interesses generalizados para o quiz (RF-010)
const generalInterests = [
  'Praia/Litoral',
  'Ecoturismo/Aventura',
  'Histórico/Cultural',
  'Serra/Montanha',
  'Gastronomia',
  'Religioso',
  'Urbano/Lazer',
  'Arte/Arquitetura'
];

// Estados disponíveis (RF-011)
const states = ['Rio de Janeiro', 'São Paulo', 'Minas Gerais', 'Espírito Santo'];

// Transforma o objeto ORIGIN_HUBS em um array para o <select>
// Resultado: [ { key: 'SP', value: 'São Paulo (SP)' }, ... ]
const originOptions = Object.entries(ORIGIN_HUBS).map(([key, value]) => ({
  key: key,
  value: value,
}));


function Quiz({ filters, setFilters }) {
  
  // Handler genérico para inputs simples (texto, número, data, select)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Função para atualizar os checkboxes de estado
  const handleStateChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => {
      const newStates = checked
        ? [...prev.states, name]
        : prev.states.filter((s) => s !== name);
      return { ...prev, states: newStates };
    });
  };

  // Função para atualizar os checkboxes de interesse
  const handleInterestChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => {
      const newInterests = checked
        ? [...prev.interests, name]
        : prev.interests.filter((i) => i !== name);
      return { ...prev, interests: newInterests };
    });
  };

  // RF-002: Resetar filtros
  const handleReset = () => {
    // Reseta para o estado inicial completo
    setFilters({
      states: [],
      interests: [],
      duration: 1,
      people: 1,
      budget: 'conforto',
      startDate: new Date().toISOString().split('T')[0],
      companhia: 'todos',
      originState: 'sem_partida', // Reseta o novo campo
    });
  };

  // Fragmento React (<>) para evitar a div duplicada
  return (
    <>
      <h3>1. Detalhes da Viagem</h3>
      
      {/* NOVO CAMPO: PONTO DE PARTIDA */}
      <div className="form-group">
        <label htmlFor="originState">Ponto de Partida (para custo)</label>
        <select
          id="originState"
          name="originState"
          value={filters.originState}
          onChange={handleChange}
        >
          <option value="sem_partida">-- Selecione sua origem --</option>
          {originOptions.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.value}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="startDate">Data de Início (aprox.)</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Duração (dias)</label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="1"
          value={filters.duration}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="people">Número de Pessoas</label>
        <input
          type="number"
          id="people"
          name="people"
          min="1"
          value={filters.people}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="budget">Orçamento</label>
        <select
          id="budget"
          name="budget"
          value={filters.budget}
          onChange={handleChange}
        >
          <option value="economico">Econômico (Mochilão)</option>
          <option value="conforto">Conforto (Padrão)</option>
          <option value="luxo">Luxo (Premium)</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="companhia">Perfil da Companhia</label>
        <select
          id="companhia"
          name="companhia"
          value={filters.companhia}
          onChange={handleChange}
        >
          <option value="todos">Qualquer (Todos)</option>
          <option value="sozinho">Sozinho(a)</option>
          <option value="casal">Casal</option>
          <option value="familia">Família</option>
          <option value="amigos">Amigos</option>
          <option value="religioso">Religioso</option>
        </select>
      </div>

      <hr />

      <h3>2. Quais estados você quer visitar?</h3>
      <div className="filter-group">
        {states.map((state) => (
          <label key={state}>
            <input
              type="checkbox"
              name={state}
              checked={filters.states.includes(state)}
              onChange={handleStateChange}
            />
            {state}
          </label>
        ))}
      </div>

      <hr />

      <h3>3. Quais seus principais interesses?</h3>
      <div className="filter-group">
        {generalInterests.map((interest) => (
          <label key={interest}>
            <input
              type="checkbox"
              name={interest}
              checked={filters.interests.includes(interest)}
              onChange={handleInterestChange}
            />
            {interest}
          </label>
        ))}
      </div>

      <button onClick={handleReset} className="reset-button">
        Limpar Filtros
      </button>
    </>
  );
}

export default Quiz;

