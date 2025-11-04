import { useState, useEffect } from 'react';
// Importa a logo do React para o rodapé
import reactLogo from './assets/react.svg';
// Importa as bases de conhecimento
import jsonData from './data/dados.json';
import { ORIGIN_HUBS } from './data/transporteData';
// Importa os componentes da UI
import Quiz from './components/Quiz';
import Resultados from './components/Resultados';
// Importa o "cérebro"
import { calcularCustosEstimados } from './services/estimativaService.js';
// Importa os estilos
import './App.css';

// Mapeamento dos interesses gerais para palavras-chave no JSON (Base de Regras)
const interestMapping = {
  'Praia/Litoral': ['Litoral', 'Praia', 'Balneário'],
  'Ecoturismo/Aventura': [
    'Ecoturismo',
    'Trilhas',
    'Cachoeiras',
    'Montanhismo',
    'Grutas',
    'Cânions',
    'Parque',
    'Náutico',
    'Vista Panorâmica',
    'Surf',
    'Praias Intocadas',
  ],
  'Histórico/Cultural': [
    'Histórico',
    'Cultural',
    'Colonial',
    'Patrimônio',
    'Arquitetura Inglesa',
    'Misticismo',
    'Patrimônio UNESCO',
    'Boêmio',
  ],
  'Serra/Montanha': ['Serra', 'Clima Frio', 'Montanhas', 'Panorâmico', 'Montanhismo'],
  'Gastronomia': ['Gastronomia', 'Gastronômico', 'Agroturismo', 'Forró'],
  'Religioso': ['Religioso', 'Zen', 'Santuário'],
  'Urbano/Lazer': [
    'Urbano',
    'Parque Urbano',
    'Lazer',
    'Boêmio',
    'Vida Noturna',
    'Financeiro',
    'Litoral Urbano',
  ],
  'Arte/Arquitetura': [
    'Arquitetura',
    'Arquitetônico',
    'Arte',
    'Monumento',
    'Design',
    'Patrimônio UNESCO',
    'Arquitetura Moderna',
  ],
};

// Estado inicial padrão para os filtros (RF-002)
const ESTADO_INICIAL_FILTROS = {
  states: [],
  interests: [],
  duration: 7,
  people: 2,
  budget: 'conforto',
  startDate: new Date().toISOString().split('T')[0],
  companhia: 'casal',
  originState: 'SP',
};

// Custo inicial vazio
const CUSTO_INICIAL = {
  custoTotal: 0,
  custoHospedagemTotal: 0,
  custoAlimentacaoTotal: 0,
  custoTransporteTotal: 0,
  custoAtividadesTotal: 0,
};

function App() {
  // Estado para os filtros atuais (o que o usuário está digitando)
  const [filters, setFilters] = useState(ESTADO_INICIAL_FILTROS);
  
  // Estado para os filtros enviados (o que foi calculado)
  // Começa como 'null' para sabermos que o usuário ainda não enviou
  const [submittedFilters, setSubmittedFilters] = useState(null);
  
  // Estado para os resultados filtrados
  const [results, setResults] = useState([]);
  // Estado para os custos calculados
  const [costs, setCosts] = useState(CUSTO_INICIAL);
  const [loading, setLoading] = useState(false);

  // Efeito que roda *apenas* quando 'submittedFilters' muda
  useEffect(() => {
    // Só executa se o usuário tiver enviado o formulário
    if (!submittedFilters) {
      return;
    }

    setLoading(true);

    // 1. Achatamos todos os destinos em uma única lista
    const allDestinations = Object.entries(jsonData.regiao_sudeste).flatMap(
      ([stateName, destinations]) => {
        return destinations.map((dest) => ({ ...dest, estado: stateName }));
      }
    );

    // 2. Aplicamos os filtros (MOTOR DE INFERÊNCIA - PARTE 1)
    const filteredDestinations = allDestinations.filter((dest) => {
      // Regra de Filtro de Estado
      const stateMatch =
        submittedFilters.states.length === 0 ||
        submittedFilters.states.includes(dest.estado);

      // Regra de Filtro de Interesse
      const interestMatch =
        submittedFilters.interests.length === 0 ||
        submittedFilters.interests.some((interest) => {
          const keywords = interestMapping[interest] || [];
          return keywords.some((keyword) =>
            (dest.tipo || '').toLowerCase().includes(keyword.toLowerCase())
          );
        });

      // Regra de Filtro de Companhia
      const companhiaMatch =
        submittedFilters.companhia === 'todos' ||
        (dest.publico_ideal || []).includes('todos') ||
        (dest.publico_ideal || []).includes(submittedFilters.companhia);

      return stateMatch && interestMatch && companhiaMatch;
    });

    // 3. Chamar o Sistema Especialista (MOTOR DE INFERÊNCIA - PARTE 2)
    const estimatedCosts = calcularCustosEstimados(
      filteredDestinations,
      submittedFilters
    );

    // Simula um pequeno delay de "cálculo"
    setTimeout(() => {
      setResults(filteredDestinations);
      setCosts(estimatedCosts);
      setLoading(false);
    }, 500); // 500ms
  }, [submittedFilters]); // Re-executa *apenas* quando um novo roteiro é enviado

  // Função chamada pelo <form> do Quiz
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    
    // Validação de Partida
    if (filters.originState === 'sem_partida') {
      alert("Por favor, selecione um Ponto de Partida para calcular os custos.");
      return;
    }
    
    // Copia os filtros atuais para o estado de "enviado", disparando o useEffect
    setSubmittedFilters({ ...filters });
  };

  return (
    <div className="App">
      <header>
        <h1>Planejador de Viagens</h1>
        <p>Sistema Especialista para seu roteiro no Sudeste</p>
      </header>
      <main>
        {/* A Sidebar (Formulário) */}
        <aside className="quiz-container">
          <Quiz
            filters={filters}
            setFilters={setFilters}
            handleSubmit={handleFormSubmit}
            estadoInicial={ESTADO_INICIAL_FILTROS}
          />
        </aside>

        {/* Os Resultados */}
        <section className="results-container">
          <Resultados
            items={results}
            loading={loading}
            costs={costs}
            quizData={submittedFilters} // Passa os filtros *enviados*
          />
        </section>
      </main>

      {/* Rodapé */}
      <footer>
        <div className="footer-content">
          <p>Aplicação criada usando JavaScript, React JS e Vite</p>
          <div className="footer-logos">
            <img src="/vite.svg" alt="Logo do Vite" />
            <img src={reactLogo} className="logo-spin" alt="Logo do React" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

