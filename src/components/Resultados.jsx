import React from 'react';
import ResumoCusto from './ResumoCusto';

function Resultados({ items, loading, costs, quizData }) {
  if (loading) {
    return <p>Calculando roteiro e custos...</p>;
  }

  // Não mostrar nada se não houver filtros (estado inicial)
  const hasSelectedFilters = quizData.states.length > 0 || quizData.interests.length > 0 || quizData.originState !== 'sem_partida';

  if (!hasSelectedFilters) {
     return (
      <div className="results-container">
        <h2>Seu Roteiro</h2>
        <p>Preencha os filtros ao lado para que o sistema especialista possa sugerir destinos e calcular custos.</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      {/* O Resumo de Custos é renderizado aqui */}
      <ResumoCusto costs={costs} quizData={quizData} />

      <h2 style={{ marginTop: '2rem' }}>Destinos Recomendados</h2>
      
      {items.length === 0 ? (
        <p>Nenhum destino encontrado para esta combinação de filtros.</p>
      ) : (
        <div className="results-grid">
          {items.map((item) => (
            <div key={item.nome} className="result-card">
              <h3>{item.nome}</h3>
              <p><strong>Local:</strong> {item.municipio_regiao}</p>
              <p><strong>Tipo:</strong> {item.tipo}</p>
              <span className="state-badge">{item.estado}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resultados;
