// ============================================
// SISTEMA DE PAGAMENTO - PÃO DO CISO
// ============================================

// Lê a chave PIX em tempo de execução (não no carregamento do script)
// para garantir que config.js já foi carregado antes
function obterChavePix() {
    return window.config?.chavePix || '';
}

function abrirModalPagamento() {
    console.log("=== ABRINDO PAGAMENTO ===");

    if (typeof window.atualizarResumoPagamentoFinal === 'function') {
        window.atualizarResumoPagamentoFinal();
        console.log("✅ Resumo financeiro gerado com sucesso pela função do carrinho.");
    } else {
        console.error("❌ ERRO CRÍTICO: Função atualizarResumoPagamentoFinal não encontrada.");
        mostrarNotificacao('Erro ao carregar valores. Por favor, recarregue a página.', 'erro');
        return;
    }

    abrirModal('modal-pagamento');
}

function selecionarPagamento(forma, elementoHtml) {
    estadoAplicativo.formaPagamento = forma;

    // Remover seleção de todos usando classList
    document.querySelectorAll('.opcao-pagamento').forEach(opcao => {
        opcao.classList.remove('ativa');
    });

    // Selecionar atual usando classList
    elementoHtml.classList.add('ativa');

    // Atualizar valor do PIX
    if (forma === 'PIX') {
        const chave = obterChavePix();

        const textoChave = document.getElementById('texto-chave-pix');
        if (textoChave) textoChave.textContent = chave;

        const txtValor = document.getElementById('pix-valor-txt');
        if (txtValor) txtValor.textContent = formatarMoeda(estadoAplicativo.totalGeral);

        const valorPix = document.getElementById('valor-pix');
        if (valorPix) valorPix.textContent = formatarMoeda(estadoAplicativo.totalGeral);
    }

    const botaoFinalizar = document.getElementById('botao-finalizar-pedido');
    if (botaoFinalizar) botaoFinalizar.disabled = false;
}

function copiarChavePix() {
    const chave = obterChavePix();
    navigator.clipboard.writeText(chave).then(() => {
        const mensagem = elemento('mensagem-copiado');
        if (mensagem) {
            mensagem.style.display = 'block';
            setTimeout(() => { mensagem.style.display = 'none'; }, 3000);
        }
    });
}

function finalizarPedido() {
    if (!estadoAplicativo.formaPagamento) {
        mostrarNotificacao('Por favor, selecione uma forma de pagamento.', 'aviso');
        return;
    }

    const botao = elemento('botao-finalizar-pedido');
    if (botao) {
        botao.disabled = true;
        botao.innerHTML = 'PROCESSANDO... <i class="fas fa-spinner fa-spin"></i>';
    }

    if (typeof processarFinalizacaoPedido === 'function') {
        setTimeout(() => {
            processarFinalizacaoPedido();
        }, 1000);
    } else {
        mostrarNotificacao('Erro: Função de processamento não encontrada.', 'erro');
        if (botao) {
            botao.disabled = false;
            botao.innerHTML = 'FINALIZAR PEDIDO <i class="fab fa-whatsapp"></i>';
        }
    }
}

// EXPORTAR FUNÇÕES
window.abrirModalPagamento = abrirModalPagamento;
window.selecionarPagamento = selecionarPagamento;
window.copiarChavePix = copiarChavePix;
window.finalizarPedido = finalizarPedido;
