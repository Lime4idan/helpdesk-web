# HelpDesk Web

Frontend simples do HelpDesk, feito com HTML, Bootstrap, CSS e JavaScript. Ele consome a HelpDesk API usando `fetch()`.

## Como executar

Não é necessário executar `npm install`. Abra a pasta com a extensão Live Server do VS Code e inicie pelo arquivo `index.html`. O endereço local normalmente será `http://127.0.0.1:5500`.

Antes, confirme se a API está em `http://localhost:3001`. A URL fica centralizada no começo de `js/api.js`.

## Configuração da API

Este projeto estático não utiliza arquivo `.env`. A constante `API_URL`, no começo de `js/api.js`, centraliza o endereço da API. Localmente ela aponta para `http://127.0.0.1:3001/api`. Depois do deploy, substitua apenas esse valor pela URL pública do Render seguida de `/api`.

## Funcionalidades

- Cadastro e login.
- JWT salvo no `localStorage`.
- Bearer Token enviado nas requisições privadas.
- Lista e filtros de chamados.
- Abertura, detalhes, edição e exclusão permitidas.
- Comentários.
- Alteração de status e atribuição para técnicos.
- Logout.

## Arquivos

- `index.html`: apresentação.
- `login.html` e `cadastro.html`: autenticação.
- `chamados.html`: lista e abertura.
- `chamado.html`: detalhes, comentários e status.
- `css/style.css`: aparência responsiva.
- `js/api.js`: URL e função central de acesso à API.
- `js/auth.js`: sessão do navegador.
- `js/chamados.js`: fluxo dos chamados.

O Bootstrap 5.3.8 é carregado pelo CDN oficial recomendado na documentação. O CSS próprio adiciona a identidade visual roxo-claro sem alterar as funções do sistema.

## Deploy na Vercel

Importe esta pasta como um projeto estático na Vercel. Depois, altere `API_URL` em `js/api.js` para a URL da API publicada no Render. Na API, defina `FRONTEND_URL` com a origem do site Vercel. Não é necessário informar resultados ou links antes de realizar o deploy.
