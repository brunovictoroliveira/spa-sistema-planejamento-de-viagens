import React, { useEffect } from 'react';
// Importa os hubs de partida que criamos
import { ORIGIN_HUBS } from '../data/transporteData';

// Interesses generalizados para o quiz
const generalInterests = [
  'Praia/Litoral',
  'Ecoturismo/Aventura',
  'Histórico/Cultural',
  'Serra/Montanha',
  'Gastronomia',
  'Religioso',
  'Urbano/Lazer',
  'Arte/Arquitetura',
];

// Estados disponíveis
const states = [
  'Rio de Janeiro',
  'São Paulo',
  'Minas Gerais',
  'Espírito Santo',
];

// Transforma o objeto ORIGIN_HUBS em um array para o <select>
const originOptions = Object.entries(ORIGIN_HUBS).map(([key, value]) => ({
  key: key,
  value: value,
}));

function Quiz({ filters, setFilters, handleSubmit, estadoInicial }) {
  // Handler genérico para inputs (texto, número, data, select)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      // Converte 'people' e 'duration' para número ao digitar
      [name]:
        name === 'people' || name === 'duration' ? parseInt(value, 10) : value,
    }));
  };

  // Handler específico para os checkboxes (pílulas)
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target; // 'name' é o grupo (states/interests), 'value' é o item
    setFilters((prev) => {
      const list = prev[name]; // Pega o array (ex: prev.states)
      const newList = checked
        ? [...list, value] // Adiciona o item se marcado
        : list.filter((item) => item !== value); // Remove se desmarcado
      return { ...prev, [name]: newList };
    });
  };

  // Reseta o formulário para o estado inicial padrão
  const handleReset = () => {
    setFilters(estadoInicial);
  };

  // Efeito que auto-corrige o perfil se "1 pessoa" for selecionado
  useEffect(() => {
    const numPessoas = parseInt(filters.people, 10);
    const perfil = filters.companhia;

    const perfisDeGrupo = ['casal', 'familia', 'amigos', 'religioso'];

    if (numPessoas === 1 && perfisDeGrupo.includes(perfil)) {
      setFilters((prev) => ({
        ...prev,
        companhia: 'sozinho', // Força o perfil para "sozinho"
      }));
    }
  }, [filters.people, filters.companhia, setFilters]);

  // Variável de controle para desabilitar opções
  const isSinglePerson = parseInt(filters.people, 10) === 1;

  return (
    // O <form> agora controla o envio
    <form onSubmit={handleSubmit}>
      <h3>1. Detalhes da Viagem</h3>

      <div className="form-group">
        <label htmlFor="originState">Ponto de Partida (para custo)</label>
        <select
          id="originState"
          name="originState"
          value={filters.originState}
          onChange={handleChange}
        >
          <option value="sem_partida">-- Selecione sua origem --</option>
          {originOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.value}
            </option>
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
          min={new Date().toISOString().split('T')[0]} // Impede datas passadas
        />
      </div>

      {/* Layout de grid para Duração e Pessoas */}
      <div className="form-grid-2">
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
          <option value="casal" disabled={isSinglePerson}>
            Casal
          </option>
          <option value="familia" disabled={isSinglePerson}>
            Família
          </option>
          <option value="amigos" disabled={isSinglePerson}>
            Amigos
          </option>
          <option value="religioso" disabled={isSinglePerson}>
            Religioso
          </option>
        </select>
      </div>

      <h3>2. Quais estados você quer visitar?</h3>
      {/* CORREÇÃO DO BUG: O input é irmão do label, não filho */}
      <div className="filter-group">
        {states.map((state) => (
          <React.Fragment key={state}>
            <input
              type="checkbox"
              id={`state-${state}`}
              name="states" // Nome do grupo
              value={state} // Valor específico
              checked={filters.states.includes(state)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={`state-${state}`}>{state}</label>
          </React.Fragment>
        ))}
      </div>

      <h3>3. Quais seus principais interesses?</h3>
      {/* CORREÇÃO DO BUG: O input é irmão do label, não filho */}
      <div className="filter-group">
        {generalInterests.map((interest) => (
          <React.Fragment key={interest}>
            <input
              type="checkbox"
              id={`interest-${interest}`}
              name="interests" // Nome do grupo
              value={interest} // Valor específico
              checked={filters.interests.includes(interest)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={`interest-${interest}`}>{interest}</label>
          </React.Fragment>
        ))}
      </div>

      {/* Botões de Ação do Formulário */}
      <div className="form-actions">
        <button type="submit" className="submit-button">
          Gerar Roteiro
        </button>
        <button type="button" onClick={handleReset} className="reset-button">
          Limpar
        </button>
      </div>
    </form>
  );
}

export default Quiz;

