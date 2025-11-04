import React from 'react';
import ResumoCusto from './ResumoCusto';

// Componente para exibir os resultados (destinos e custos)
function Resultados({ items, loading, costs, quizData }) {
  // 1. Estado de Carregamento
  if (loading) {
    return (
      <div className="results-placeholder">
        <h2>Calculando seu roteiro...</h2>
        <p>Aguarde, nosso sistema especialista está processando sua viagem.</p>
      </div>
    );
  }

  // 2. Estado Inicial (Antes do primeiro envio)
  if (!quizData) {
    return (
      <div className="results-placeholder">
        <h2>Pronto para planejar?</h2>
        <p>
          Preencha os filtros ao lado e clique em "Gerar Roteiro" para que nosso
          sistema especialista crie sua viagem.
        </p>
      </div>
    );
  }

  // 3. Estado de "Nenhum Resultado Encontrado" (Após o envio)
  if (items.length === 0) {
    return (
      <div className="results-placeholder">
        <h2>Nenhum destino encontrado</h2>
        <p>
          Não encontramos destinos para essa combinação específica. Tente alterar
          seus filtros (ex: selecionar mais interesses ou estados).
        </p>
      </div>
    );
  }

  // 4. Estado de Sucesso (Exibe os resultados)
  return (
    <div className="results-grid">
      {/* LAYOUT BENTO: O Resumo de Custo agora é o primeiro item do grid 
        e ocupa todas as colunas.
      */}
      <div className="summary-wrapper">
        <ResumoCusto costs={costs} quizData={quizData} />
      </div>

      {/* Os cards de resultado vêm depois */}
      {items.map((item) => (
        <div key={item.nome} className="result-card">
          <h3>{item.nome}</h3>
          <p>
            <strong>Local:</strong> {item.municipio_regiao}
          </p>
          <p>
            <strong>Tipo:</strong> {item.tipo}
          </p>
          <span className="state-badge">{item.estado}</span>
        </div>
      ))}
    </div>
  );
}

export default Resultados;

