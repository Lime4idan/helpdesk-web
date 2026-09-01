let chamadosCarregados = [];
let chamadoAtual = null;

function escaparHtml(texto) {
  return String(texto ?? '').replace(/[&<>'"]/g, caractere => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[caractere]);
}

function dataFormatada(data) {
  return new Date(data).toLocaleString('pt-BR');
}

function mostrarMensagem(texto, tipo = 'erro') {
  const elemento = document.getElementById('mensagem');
  if (!elemento) return;
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
}

function classeStatus(status) {
  if (status === 'Concluído') return 'concluido';
  if (status === 'Em Atendimento') return 'atendimento';
  return 'aberto';
}

function renderizarLista(filtro = 'Todos') {
  const lista = document.getElementById('lista-chamados');
  if (!lista) return;
  const chamados = filtro === 'Todos' ? chamadosCarregados : chamadosCarregados.filter(item => item.status === filtro);
  if (!chamados.length) {
    lista.innerHTML = '<div class="painel vazio">Nenhum chamado encontrado.</div>';
    return;
  }
  lista.innerHTML = chamados.map(chamado => `
    <article class="card shadow-sm cartao">
      <div class="cartao-topo"><span class="status ${classeStatus(chamado.status)}">${escaparHtml(chamado.status)}</span><small>#${chamado.id}</small></div>
      <h2>${escaparHtml(chamado.titulo)}</h2>
      <p>${escaparHtml(chamado.descricao).slice(0, 140)}</p>
      <p class="muted">Cliente: ${escaparHtml(chamado.cliente_nome)}<br>Técnico: ${escaparHtml(chamado.tecnico_nome || 'Não atribuído')}</p>
      <a class="btn btn-outline-primary botao secundario" href="chamado.html?id=${chamado.id}">Ver detalhes</a>
    </article>`).join('');
}

async function carregarLista() {
  try {
    chamadosCarregados = await apiFetch('/chamados');
    renderizarLista();
  } catch (erro) { mostrarMensagem(erro.message); }
}

const listaElemento = document.getElementById('lista-chamados');
if (listaElemento) {
  const usuario = obterUsuario();
  const painelNovo = document.getElementById('painel-novo');
  const botaoNovo = document.getElementById('botao-novo');
  if (usuario.tipo === 'tecnico') {
    botaoNovo.classList.add('escondido');
    document.getElementById('descricao-lista').textContent = 'Visualize, assuma e atualize os atendimentos.';
  }
  botaoNovo.addEventListener('click', () => painelNovo.classList.remove('escondido'));
  document.getElementById('cancelar-novo').addEventListener('click', () => painelNovo.classList.add('escondido'));
  document.getElementById('form-chamado').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    try {
      await apiFetch('/chamados', { method: 'POST', body: JSON.stringify({ titulo: evento.target.titulo.value, descricao: evento.target.descricao.value }) });
      evento.target.reset();
      painelNovo.classList.add('escondido');
      mostrarMensagem('Chamado aberto com sucesso.', 'sucesso');
      await carregarLista();
    } catch (erro) { mostrarMensagem([erro.message, ...(erro.detalhes || [])].join(' ')); }
  });
  document.querySelectorAll('[data-filtro]').forEach(botao => botao.addEventListener('click', () => {
    document.querySelectorAll('[data-filtro]').forEach(item => item.classList.remove('ativo'));
    botao.classList.add('ativo');
    renderizarLista(botao.dataset.filtro);
  }));
  carregarLista();
}

function podeEditar(chamado, usuario) {
  if (usuario.tipo === 'cliente') return chamado.cliente_id === usuario.id && chamado.status === 'Aberto';
  return chamado.tecnico_id === usuario.id;
}

function renderizarDetalhes(chamado) {
  const area = document.getElementById('detalhes-chamado');
  const usuario = obterUsuario();
  const editar = podeEditar(chamado, usuario);
  const podeExcluir = usuario.tipo === 'cliente' && chamado.cliente_id === usuario.id && chamado.status === 'Aberto';
  const controleTecnico = usuario.tipo === 'tecnico' ? `
    <form id="form-status" class="controle-status"><label for="status">Alterar status e assumir chamado</label><div class="acoes"><select id="status"><option ${chamado.status === 'Aberto' ? 'selected' : ''}>Aberto</option><option ${chamado.status === 'Em Atendimento' ? 'selected' : ''}>Em Atendimento</option><option ${chamado.status === 'Concluído' ? 'selected' : ''}>Concluído</option></select><button>Salvar status</button></div></form>` : '';

  area.innerHTML = `<div class="cartao-topo"><span class="status ${classeStatus(chamado.status)}">${escaparHtml(chamado.status)}</span><small>Chamado #${chamado.id}</small></div><h1>${escaparHtml(chamado.titulo)}</h1><p class="descricao">${escaparHtml(chamado.descricao)}</p><div class="metadados"><span><strong>Cliente</strong>${escaparHtml(chamado.cliente_nome)}</span><span><strong>Técnico</strong>${escaparHtml(chamado.tecnico_nome || 'Não atribuído')}</span><span><strong>Atualizado</strong>${dataFormatada(chamado.atualizado_em)}</span></div>${controleTecnico}<div class="acoes">${editar ? '<button id="botao-editar" class="secundario">Editar</button>' : ''}${podeExcluir ? '<button id="botao-excluir" class="perigo">Excluir chamado</button>' : ''}<a class="botao secundario" href="chamados.html">Voltar</a></div>`;

  const botaoEditar = document.getElementById('botao-editar');
  if (botaoEditar) botaoEditar.addEventListener('click', abrirEdicao);
  const botaoExcluir = document.getElementById('botao-excluir');
  if (botaoExcluir) botaoExcluir.addEventListener('click', excluirChamado);
  const formStatus = document.getElementById('form-status');
  if (formStatus) formStatus.addEventListener('submit', alterarStatus);
}

function abrirEdicao() {
  document.getElementById('editar-titulo').value = chamadoAtual.titulo;
  document.getElementById('editar-descricao').value = chamadoAtual.descricao;
  document.getElementById('edicao').classList.remove('escondido');
}

async function alterarStatus(evento) {
  evento.preventDefault();
  try {
    chamadoAtual = await apiFetch(`/chamados/${chamadoAtual.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: document.getElementById('status').value }) });
    renderizarDetalhes(chamadoAtual);
    mostrarMensagem('Status atualizado.', 'sucesso');
  } catch (erro) { mostrarMensagem(erro.message); }
}

async function excluirChamado() {
  if (!confirm('Deseja realmente excluir este chamado?')) return;
  try {
    await apiFetch(`/chamados/${chamadoAtual.id}`, { method: 'DELETE' });
    window.location.href = 'chamados.html';
  } catch (erro) { mostrarMensagem(erro.message); }
}

async function carregarComentarios(id) {
  const comentarios = await apiFetch(`/chamados/${id}/comentarios`);
  const lista = document.getElementById('lista-comentarios');
  lista.innerHTML = comentarios.length ? comentarios.map(item => `<article class="comentario"><div><strong>${escaparHtml(item.usuario_nome)}</strong><span>${escaparHtml(item.usuario_tipo)}</span></div><p>${escaparHtml(item.comentario)}</p><small>${dataFormatada(item.criado_em)}</small></article>`).join('') : '<p class="muted">Ainda não há comentários.</p>';
}

async function carregarDetalhes() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) return mostrarMensagem('Id do chamado não informado.');
  try {
    chamadoAtual = await apiFetch(`/chamados/${id}`);
    renderizarDetalhes(chamadoAtual);
    await carregarComentarios(id);
  } catch (erro) { mostrarMensagem(erro.message); }
}

const detalhesElemento = document.getElementById('detalhes-chamado');
if (detalhesElemento) {
  document.getElementById('cancelar-edicao').addEventListener('click', () => document.getElementById('edicao').classList.add('escondido'));
  document.getElementById('form-edicao').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    try {
      chamadoAtual = await apiFetch(`/chamados/${chamadoAtual.id}`, { method: 'PUT', body: JSON.stringify({ titulo: document.getElementById('editar-titulo').value, descricao: document.getElementById('editar-descricao').value }) });
      document.getElementById('edicao').classList.add('escondido');
      renderizarDetalhes(chamadoAtual);
      mostrarMensagem('Chamado atualizado.', 'sucesso');
    } catch (erro) { mostrarMensagem([erro.message, ...(erro.detalhes || [])].join(' ')); }
  });
  document.getElementById('form-comentario').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    try {
      await apiFetch(`/chamados/${chamadoAtual.id}/comentarios`, { method: 'POST', body: JSON.stringify({ comentario: document.getElementById('comentario').value }) });
      evento.target.reset();
      await carregarComentarios(chamadoAtual.id);
    } catch (erro) { mostrarMensagem([erro.message, ...(erro.detalhes || [])].join(' ')); }
  });
  carregarDetalhes();
}
