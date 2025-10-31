import React from 'react';

// Formata o número para o padrão BRL (R$ 1.234,56)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

function ResumoCusto({ costs, quizData }) {
  const { duration, people } = quizData;

  // Garante que os valores sejam numéricos para exibição
  const displayDuration = Number(duration) || 0;
  const displayPeople = Number(people) || 0;

  return (
    <div className="summary-container">
      <h2>Estimativa de Custos</h2>
      <p className="summary-subtitle">
        Baseado em {displayDuration} dia(s) para {displayPeople} pessoa(s) no perfil "{quizData.budget}".
      </p>

      <div className="summary-total">
        <span>Custo Total Estimado</span>
        <strong>{formatCurrency(costs.custoTotal)}</strong>
      </div>

      <div className="summary-details">
        <div className="detail-item">
          <span>🏨 Hospedagem</span>
          <span>{formatCurrency(costs.custoHospedagemTotal)}</span>
        </div>
        <div className="detail-item">
          <span>🍽️ Alimentação</span>
          <span>{formatCurrency(costs.custoAlimentacaoTotal)}</span>
        </div>
        <div className="detail-item">
          <span>🚌 Transporte/Desloc.</span>
          <span>{formatCurrency(costs.custoTransporteTotal)}</span>
        </div>
        <div className="detail-item">
          <span>🎟️ Atividades/Passeios</span>
          <span>{formatCurrency(costs.custoAtividadesTotal)}</span>
        </div>
      </div>
      
      <small>*Esta é uma estimativa simulada para fins de planejamento.</small>
    </div>
  );
}

export default ResumoCusto;
