function salvarSessao(dados) {
  localStorage.setItem('helpdesk_token', dados.token);
  localStorage.setItem('helpdesk_usuario', JSON.stringify(dados.usuario));
}

function sair() {
  localStorage.removeItem('helpdesk_token');
  localStorage.removeItem('helpdesk_usuario');
  window.location.href = 'login.html';
}

function mostrarMensagemAuth(texto, tipo = 'erro') {
  const elemento = document.getElementById('mensagem');
  if (!elemento) return;
  elemento.textContent = texto;
  elemento.className = `mensagem ${tipo}`;
}

function protegerPagina() {
  const nomePagina = window.location.pathname.split('/').pop().replace('.html', '');
  const paginaProtegida = nomePagina === 'chamados' || nomePagina === 'chamado';
  if (paginaProtegida && !obterToken()) {
    window.location.href = 'login.html';
    return;
  }

  const usuario = obterUsuario();
  const elementoUsuario = document.getElementById('usuario-logado');
  if (usuario && elementoUsuario) {
    const role = usuario.tipo === 'tecnico' ? 'technician' : 'customer';
    elementoUsuario.textContent = `${usuario.nome} (${role})`;
  }
}

const formLogin = document.getElementById('form-login');
if (formLogin) {
  formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = formLogin.querySelector('button[type="submit"]');
    const rotuloOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Connecting…';
    try {
      const dados = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: formLogin.email.value, senha: formLogin.senha.value })
      });
      salvarSessao(dados);
      window.location.href = 'chamados.html';
    } catch (erro) {
      mostrarMensagemAuth([erro.message, ...(erro.detalhes || [])].join(' '));
    } finally {
      botao.disabled = false;
      botao.textContent = rotuloOriginal;
    }
  });
}

const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
  formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const botao = formCadastro.querySelector('button[type="submit"]');
    const rotuloOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Creating account…';
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nome: formCadastro.nome.value,
          email: formCadastro.email.value,
          senha: formCadastro.senha.value,
          tipo: formCadastro.tipo.value
        })
      });
      mostrarMensagemAuth('Account created! Redirecting to sign in...', 'sucesso');
      setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    } catch (erro) {
      mostrarMensagemAuth([erro.message, ...(erro.detalhes || [])].join(' '));
    } finally {
      botao.disabled = false;
      botao.textContent = rotuloOriginal;
    }
  });
}

document.querySelectorAll('[data-logout]').forEach(botao => botao.addEventListener('click', sair));
protegerPagina();
