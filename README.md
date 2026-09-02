# HelpDesk Web

Frontend simples do HelpDesk, feito com HTML, Bootstrap, CSS e JavaScript. Ele consome a HelpDesk API usando `fetch()`.

Site publicado: https://helpdesk-web-plum.vercel.app

## Como executar

Não é necessário executar `npm install`. Abra a pasta com a extensão Live Server do VS Code e inicie pelo arquivo `index.html`. O endereço local normalmente será `http://127.0.0.1:5500`.

Para desenvolvimento local, confirme que a URL desejada está definida no começo de `js/api.js`.

## Configuração da API

Este projeto estático não utiliza arquivo `.env`. A constante `API_URL`, no começo de `js/api.js`, centraliza o endereço da API. Ela aponta para `https://helpdesk-api-t1hv.onrender.com/api`. Para usar uma API local, substitua temporariamente por `http://127.0.0.1:3001/api`.

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

O projeto foi importado como site estático na Vercel. A API usa `FRONTEND_URL=https://helpdesk-web-plum.vercel.app`, mantendo o CORS restrito ao frontend publicado.
