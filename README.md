# SPA - Sistema Especialista para Planejamento de Viagens (Sudeste)

Este projeto é um protótipo de um Sistema Especialista leve, desenvolvido como uma Single Page Application (SPA), focado no planejamento de viagens e estimativa de custos para a Região Sudeste do Brasil.

A aplicação opera inteiramente no client-side (no navegador do usuário), sem a necessidade de um backend ou banco de dados externo, sendo ideal para hospedagem estática gratuita (como Firebase Hosting).

## Arquitetura

A arquitetura do projeto simula um Sistema Especialista clássico, dividido em três componentes principais:

## 1. Base de Conhecimento (Knowledge Base)

Armazenada em arquivos estáticos (/src/data/).

dados.json: Contém os "fatos" sobre os destinos (cidades, locais), incluindo suas categorias (tipo), custo de atividade (perfil_custo_atividade) e público ideal.

transporteData.js: Contém a matriz de custos (regras heurísticas) para transporte interestadual.

## 2. Motor de Inferência (Inference Engine)

Localizado em /src/services/estimativaService.js.

Este é o "cérebro" da aplicação. Ele contém as regras de negócio e a lógica heurística para calcular os custos (hospedagem, transporte, atividades) com base nos fatos coletados.

## 3. Interface de Fatos (Fact Interface)

Composta pelos componentes React (/src/components/), principalmente o Quiz.jsx.

Responsável por coletar as entradas (fatos) do usuário (orçamento, datas, interesses, etc.) que alimentarão o Motor de Inferência.

O fluxo de dados é unidirecional: o Quiz.jsx atualiza o estado no App.jsx, que aciona o useEffect (Motor de Inferência) para processar os dados da Base de Conhecimento e, por fim, exibir os resultados no Resultados.jsx. O estado da sessão é persistido no localStorage.

## Tecnologias Utilizadas

JavaScript (ES6+): Linguagem principal da aplicação.

React (v18+): Biblioteca utilizada para a construção da interface do usuário de forma componentizada (usando Hooks).

Vite: Ferramenta de build e servidor de desenvolvimento de alta performance, responsável por otimizar e empacotar a aplicação (HMR, bundling).

CSS3: Utilizado para a estilização responsiva (Mobile-First), com uso de Flexbox e Grid Layout.

Firebase Hosting: Plataforma utilizada para o deploy (hospedagem) da SPA.

Git & GitHub: Sistema de controle de versão utilizado para o gerenciamento do código-fonte.
