// Se o HTML for aberto diretamente, redireciona para o servidor local.
if (window.location.protocol === 'file:') {
  const pagina = window.location.pathname.split('/').pop() || 'index.html';
  window.location.href = `http://127.0.0.1:5500/${pagina}`;
}

// URL da API publicada no Render.
// Para voltar ao uso local, troque por: http://127.0.0.1:3001/api
const API_URL = 'https://helpdesk-api-t1hv.onrender.com/api';

function atualizarStatusApi(estado, texto) {
  const indicador = document.getElementById('service-status');
  if (!indicador) return;
  indicador.classList.remove('is-waking', 'is-error');
  if (estado === 'waking') indicador.classList.add('is-waking');
  if (estado === 'error') indicador.classList.add('is-error');
  indicador.textContent = texto;
}

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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  const avisoLentidao = setTimeout(() => {
    atualizarStatusApi('waking', 'Waking up API…');
  }, 2200);

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      ...opcoes,
      headers: cabecalhos,
      signal: controller.signal
    });
    atualizarStatusApi('online', 'API connected');
  } catch (erro) {
    atualizarStatusApi('error', 'API unavailable');
    const erroConexao = new Error(
      erro.name === 'AbortError'
        ? 'The API took too long to respond. Please try again.'
        : 'Could not connect to the API. Please try again in a moment.'
    );
    erroConexao.detalhes = [];
    throw erroConexao;
  } finally {
    clearTimeout(timeout);
    clearTimeout(avisoLentidao);
  }

  const dados = resposta.status === 204 ? null : await resposta.json();

  if (!resposta.ok) {
    if (resposta.status === 401 && token) sair();
    const erro = new Error(dados.mensagem || 'Could not complete the operation.');
    erro.detalhes = dados.erros || [];
    throw erro;
  }
  return dados;
}
