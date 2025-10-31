import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import jsonData from './data/dados.json';
import Quiz from './components/Quiz';
import Resultados from './components/Resultados';
import { calcularCustosEstimados } from './services/estimativaService';
import './App.css';
// Importa a logo do React
import reactLogo from './assets/react.svg';

// Mapeamento dos interesses gerais para palavras-chave no JSON (RF-013 - Base de Regras)
const interestMapping = {
  'Praia/Litoral': ['Litoral', 'Praia', 'Balneário', 'Surf'],
  'Ecoturismo/Aventura': ['Ecoturismo', 'Trilhas', 'Cachoeiras', 'Montanhismo', 'Grutas', 'Cânions', 'Parque', 'Náutico', 'Vista Panorâmica', 'Praias Intocadas'],
  'Histórico/Cultural': ['Histórico', 'Cultural', 'Colonial', 'Patrimônio', 'Arquitetura Inglesa', 'Misticismo'],
  'Serra/Montanha': ['Serra', 'Clima Frio', 'Montanhas', 'Panorâmico', 'Montanhismo'],
  'Gastronomia': ['Gastronomia', 'Gastronômico', 'Agroturismo'],
  'Religioso': ['Religioso', 'Zen', 'Santuário'],
  'Urbano/Lazer': ['Urbano', 'Parque Urbano', 'Lazer', 'Boêmio', 'Vida Noturna', 'Financeiro'],
  'Arte/Arquitetura': ['Arquitetura', 'Arquitetônico', 'Arte', 'Monumento', 'Design', 'Patrimônio UNESCO', 'Arquitetura Moderna']
};

// Estado inicial para os filtros
const ESTADO_INICIAL_FILTROS = {
  states: [],
  interests: [],
  duration: 1,
  people: 1,
  budget: 'conforto',
  startDate: new Date().toISOString().split('T')[0],
  companhia: 'todos',
  originState: 'RJ', // Estado de origem padrão
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
  // RF-001: Usa o hook para salvar filtros no localStorage
  const [filters, setFilters] = useLocalStorage('travelFilters', ESTADO_INICIAL_FILTROS);
  
  const [results, setResults] = useState([]);
  const [costs, setCosts] = useState(CUSTO_INICIAL); 
  const [loading, setLoading] = useState(false);

  // Efeito para FILTRAR DESTINOS e CALCULAR CUSTOS
  useEffect(() => {
    setLoading(true);

    // 1. Achatamos todos os destinos em uma única lista
    const allDestinations = Object.entries(jsonData.regiao_sudeste).flatMap(
      ([stateName, destinations]) => {
        return destinations.map(dest => ({ ...dest, estado: stateName }));
      }
    );

    // 2. Aplicamos os filtros (MOTOR DE INFERÊNCIA - PARTE 1)
    const filteredDestinations = allDestinations.filter(dest => {
      
      const stateMatch = filters.states.length === 0 || filters.states.includes(dest.estado);

      const interestMatch = filters.interests.length === 0 || 
        filters.interests.some(interest => {
          const keywords = interestMapping[interest] || [];
          // Adiciona verificação para 'dest.tipo'
          return keywords.some(keyword => 
            dest.tipo && dest.tipo.toLowerCase().includes(keyword.toLowerCase())
          );
        });

      const companhiaMatch = 
        filters.companhia === 'todos' ||
        (dest.publico_ideal && dest.publico_ideal.includes('todos')) ||
        (dest.publico_ideal && dest.publico_ideal.includes(filters.companhia));

      return stateMatch && interestMatch && companhiaMatch;
    });

    // 3. Chamar o Sistema Especialista (MOTOR DE INFERÊNCIA - PARTE 2)
    const estimatedCosts = calcularCustosEstimados(filteredDestinations, filters);

    setTimeout(() => {
      setResults(filteredDestinations);
      setCosts(estimatedCosts);
      setLoading(false);
    }, 300);

  }, [filters]); // Re-executa sempre que os filtros mudarem

  return (
    <div className="App">
      <header>
        <h1>Planejador de Viagens (Sudeste)</h1>
        <p>Sistema Especialista com Cálculo de Custos</p>
      </header>
      
      <main>
        <aside className="quiz-container">
          <Quiz filters={filters} setFilters={setFilters} />
        </aside>
        <section className="results-container">
          <Resultados 
            items={results} 
            loading={loading}
            costs={costs}       
            quizData={filters}  
          />
        </section>
      </main>

      {/* --- RODAPÉ ADICIONADO --- */}
      <footer>
        <p>Aplicação criada usando JavaScript, React JS e Vite</p>
        <div className="logos">
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
            <img src="/vite.svg" className="logo" alt="Logo do Vite" />
          </a>
          <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="logo react" alt="Logo do React" />
          </a>
        </div>
      </footer>
      {/* --- FIM DO RODAPÉ --- */}
    </div>
  );
}

export default App;

