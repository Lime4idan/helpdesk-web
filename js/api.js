// Se o HTML for aberto diretamente, redireciona para o servidor local.
if (window.location.protocol === 'file:') {
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  window.location.href = `http://127.0.0.1:5500/${pagina}`;
}

// Em produção, substitua esta URL pela URL da API publicada no Render.
const API_URL = "http://127.0.0.1:3001/api";

function obterToken() {
  return localStorage.getItem('helpdesk_token');
}

function obterUsuario() {
  const dados = localStorage.getItem('helpdesk_usuario');
  return dados ? JSON.parse(dados) : null;
}

async function apiFetch(caminho, opcoes = {}) {
  const cabecalhos = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  const token = obterToken();
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers: cabecalhos });
  } catch (erro) {
    const erroConexao = new Error('Não foi possível conectar à API. Verifique se ela está executando na porta 3001.');
    erroConexao.detalhes = [];
    throw erroConexao;
  }

  const dados = resposta.status === 204 ? null : await resposta.json();

  if (!resposta.ok) {
    if (resposta.status === 401 && token) sair();
    const erro = new Error(dados.mensagem || 'Não foi possível completar a operação.');
    erro.detalhes = dados.erros || [];
    throw erro;
  }
  return dados;
}
