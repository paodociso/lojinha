// ============================================
// INICIALIZAÇÃO PRINCIPAL - PÃO DO CISO
// ============================================
function inicializarSistema() {
    log('Inicializando sistema Pão do Ciso...');
    
    // 1. CARREGAR CARRINHO PRIMEIRO (IMPORTANTE!)
    if (typeof carregarCarrinhoSalvo === 'function') {
        carregarCarrinhoSalvo();
    }
    
    // 1.1 CARREGAR DADOS DO CLIENTE (NOME, TEL, CEP) SALVOS - ITEM I
    if (typeof carregarDadosCliente === 'function') {
        carregarDadosCliente();
    }
    
    // 2. DEPOIS RENDERIZAR CARDÁPIO
    if (typeof renderizarCardapio === 'function') {
        renderizarCardapio();
    }
    
    // 3. CONFIGURAR DATAS DA FORNADA
    if (typeof configurarDatasFornada === 'function') {
        configurarDatasFornada();
    }
    
    // 4. ATUALIZAR BARRA DO CARRINHO
    if (typeof atualizarBarraCarrinho === 'function') {
        atualizarBarraCarrinho();
    }
    
    // 5. CONFIGURAR EVENTOS GERAIS
    if (typeof configurarEventosGerais === 'function') {
        configurarEventosGerais();
    }
    
    // 6. CONFIGURAR EVENTOS DE CEP
    if (typeof configurarEventosCEP === 'function') {
        configurarEventosCEP();
    }
    
    // 8. CONFIGURAR BARRA DO CARRINHO
    const barraCarrinho = elemento('barra-carrinho');
    if (barraCarrinho) {
        barraCarrinho.addEventListener('click', function() {
            if (typeof abrirModalCarrinho === 'function') {
                abrirModalCarrinho();
            }
        });
    }
    
    // 9. VERIFICAR AddressManager (APENAS PARA DEBUG)
    log('🔍 Verificando AddressManager...');
    setTimeout(() => {
        if (window.AddressManager) {
            log('✅ AddressManager carregado com sucesso!');
        } else {
            console.error('❌ AddressManager NÃO foi carregado!');
        }
    }, 500);
    
    // 10. INICIAR RECUPERAÇÃO DE CARRINHO
    setTimeout(() => {
        log('🔄 Timer de recuperação disparado...');
        
        // NOVA CHECAGEM DE SEGURANÇA: Só tenta recuperar se o carrinho existir e tiver itens
        const temItens = window.carrinho && Object.keys(window.carrinho).length > 0;

        if (temItens && window.iniciarRecuperacaoCarrinho) {
            log('✅ Carrinho detectado com itens. Executando recuperação...');
            window.iniciarRecuperacaoCarrinho();
        } else {
            log('✅ Carrinho vazio ou função não encontrada. Nenhuma ação.');
        }
    }, 800);

    log('✅ Sistema inicializado. Carrinho:', carrinho);

    // INICIALIZAR LINK DE CONTATO WHATSAPP
    const linkWA = document.getElementById('link-whatsapp-contato');
    const textoWA = document.getElementById('texto-whatsapp-contato');
    const num = window.config?.whatsappVendedor || '';
    if (linkWA) linkWA.href = `https://wa.me/${num}`;
    if (textoWA) textoWA.textContent = num.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
}

// INICIALIZAR QUANDO O DOM CARREGAR - APENAS UMA VEZ!
document.addEventListener('DOMContentLoaded', function() {
    log('DOM carregado, verificando dependências...');
    
    // Verificar se dados iniciais estão carregados
    if (!window.dadosIniciais) {
        console.error('❌ Dados iniciais não carregados. Verifique dados.js');
        
        // Mostrar mensagem de erro para o usuário
        const container = document.getElementById('container-aplicativo');
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; padding:40px; color:#cc0000;">
                    <i class="fas fa-exclamation-triangle" style="font-size:3rem; margin-bottom:20px;"></i>
                    <h2>Erro ao carregar o cardápio</h2>
                    <p>Por favor, recarregue a página ou entre em contato com o suporte.</p>
                </div>
            `;
        }
        return;
    }
    
    // Verificar funções essenciais
    if (!window.elemento) {
        console.warn('Função elemento não encontrada, criando fallback...');
        window.elemento = id => document.getElementById(id);
    }
    
    if (!window.formatarMoeda) {
        console.warn('Função formatarMoeda não encontrada, criando fallback...');
        window.formatarMoeda = valor => {
            return parseFloat(valor || 0).toLocaleString('pt-br', {
                style: 'currency',
                currency: 'BRL'
            });
        };
    }
    
    // Inicializar sistema
    setTimeout(() => {
        inicializarSistema();
    }, 100);
});

function ajustarAlturaModal() {
    if (window.innerWidth <= 768) {
        const modais = document.querySelectorAll('.modal');
        modais.forEach(modal => {
            const conteudo = modal.querySelector('.conteudo-modal, .conteudo-modal-produto, .conteudo-modal-carrinho');
            if (conteudo) {
                const alturaConteudo = conteudo.scrollHeight;
                const alturaMaxima = window.innerHeight * 0.8; 
                
                if (alturaConteudo > alturaMaxima) {
                    modal.style.maxHeight = '80vh';
                    conteudo.style.maxHeight = 'calc(80vh - 60px)';
                } else {
                    modal.style.maxHeight = 'auto';
                    conteudo.style.maxHeight = 'auto';
                }
            }
        });
    }
}

function atualizarDadosModalFornada() {
    const elData = document.getElementById('data-fornada-info');
    const elLimite = document.getElementById('limite-fornada-info');
    
    if (!elData || !elLimite) return;

    const dataTxt = document.querySelector('.data-fornada-texto')?.textContent;
    const limiteTxt = document.querySelector('.limite-pedido-texto')?.textContent;
    
    if (dataTxt && limiteTxt) {
        elData.textContent = dataTxt;
        elLimite.textContent = limiteTxt;
    } else if (typeof calcularDatasFornada === 'function') {
        try {
            const config = window.dadosIniciais?.fornada;
            if (config) {
                const datas = calcularDatasFornada(config);
                elData.textContent = datas.fornada || 'A definir';
                elLimite.textContent = datas.limite || 'A definir';
            }
        } catch (e) {
            elData.textContent = 'A definir';
            elLimite.textContent = 'A definir';
        }
    }
}

// ============================================
// INTERCEPTADOR DE MODAIS (MUDANÇA SOLICITADA)
// ============================================
const abrirModalOriginal = window.abrirModal;

// ✅ Passa callback adiante para não quebrar modais.js (AddressManager.init, etc.)
window.abrirModal = function(id, callback) {
    if (id === 'modal-informacoes-fornada') {
        atualizarDadosModalFornada();
    }

    if (typeof abrirModalOriginal === 'function') {
        abrirModalOriginal(id, callback);
    } else {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'block';
        if (typeof callback === 'function') callback();
    }
};

window.addEventListener('resize', ajustarAlturaModal);

window.inicializarSistema = inicializarSistema;