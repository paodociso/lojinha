// ============================================
// GERENCIAMENTO DO CARRINHO - PÃO DO CISO
// ============================================
// ⚠️  Depende de utils.js carregado antes:
//     - window.aplicarMascaraCEP()       → máscara de CEP no input
//     - window.validarEnderecoCompleto() → validação unificada de endereço
// ============================================

// ===================== BARRA DO CARRINHO =====================

function atualizarBarraCarrinho() {
    const barraCarrinho    = elemento('barra-carrinho');
    const quantidadeElemento = elemento('resumo-quantidade-carrinho');
    const totalElemento    = elemento('resumo-total-carrinho');

    if (!barraCarrinho || !quantidadeElemento || !totalElemento) return;

    let quantidadeTotal = 0;
    let valorTotal      = 0;

    Object.values(carrinho).forEach(item => {
        const produto = dadosIniciais.secoes[item.indiceSessao].itens[item.indiceItem];
        let subtotalItem = produto.preco * item.quantidade;

        for (let nomeOpcional in item.opcionais) {
            const opcional = item.opcionais[nomeOpcional];
            subtotalItem += opcional.quantidade * opcional.preco;
        }

        quantidadeTotal += item.quantidade;
        valorTotal      += subtotalItem;
    });

    if (quantidadeTotal > 0) {
        barraCarrinho.style.display  = 'flex';
        quantidadeElemento.textContent = `${quantidadeTotal} ${quantidadeTotal === 1 ? 'item' : 'itens'}`;
        totalElemento.textContent    = formatarMoeda(valorTotal);
    } else {
        barraCarrinho.style.display = 'none';
    }
}

// ===================== MODAL DO CARRINHO =====================

function abrirModalCarrinho() {
    renderizarCarrinho();

    setTimeout(() => {
        const campoCEP         = document.getElementById('cep-carrinho');
        const divNotificacaoCEP = document.getElementById('notificacao-bairro-carrinho');
        const spanNomeBairro   = document.getElementById('nome-bairro-info');
        const divResultadoCEP  = document.getElementById('resultado-frete-carrinho');
        const campoCupom       = document.getElementById('campo-cupom-carrinho');
        const divNotificacaoCupom = document.getElementById('notificacao-cupom-carrinho');

        // Restauração do CEP
        if (campoCEP && estadoAplicativo.cepCalculado) {
            const cepLimpo = estadoAplicativo.cepCalculado.replace(/\D/g, '');
            if (cepLimpo.length === 8) {
                // 🔑 Usa window.formatarCEP de utils.js
                campoCEP.value = window.formatarCEP(cepLimpo);
            }
        }

        // Restauração do frete / bairro
        if (estadoAplicativo.bairroIdentificado && divNotificacaoCEP && spanNomeBairro) {
            spanNomeBairro.innerHTML = `
                Bairro encontrado: <strong>${estadoAplicativo.bairroIdentificado}</strong>.<br>
                <i class="fas fa-truck"></i> Taxa de entrega: <strong>${formatarMoeda(estadoAplicativo.taxaEntrega)}</strong>
            `;
            divNotificacaoCEP.style.display = 'block';
            if (divResultadoCEP) divResultadoCEP.style.display = 'none';
        } else if (estadoAplicativo.taxaEntrega > 0 && divNotificacaoCEP && spanNomeBairro) {
            spanNomeBairro.innerHTML = `
                <i class="fas fa-truck"></i> Taxa de entrega: <strong>${formatarMoeda(estadoAplicativo.taxaEntrega)}</strong>
            `;
            divNotificacaoCEP.style.display = 'block';
        }

        // Restauração do cupom
        if (estadoAplicativo.cupomAplicado && divNotificacaoCupom) {
            divNotificacaoCupom.innerHTML = `
                <span style="color: #2e7d32;">
                    <i class="fas fa-check-circle"></i> Cupom <strong>${estadoAplicativo.cupomAplicado}</strong> aplicado!
                </span>
            `;
            divNotificacaoCupom.style.display = 'block';
            if (campoCupom) campoCupom.value = estadoAplicativo.cupomAplicado;
        }

        if (typeof atualizarResumoFinanceiroCarrinho === 'function') {
            atualizarResumoFinanceiroCarrinho();
        }
    }, 50);

    abrirModal('modal-carrinho');
}

function renderizarCarrinho() {
    const container = elemento('conteudo-carrinho');
    if (!container) return;

    const itens = Object.values(carrinho);

    if (itens.length === 0) {
        container.innerHTML = gerarHTMLCarrinhoVazio();
        return;
    }

    container.innerHTML = `
        <h3 class="titulo-carrinho">Carrinho de Compras</h3>
        <div class="lista-itens-carrinho">
            ${itens.map(item => gerarHTMLItemCarrinho(item)).join('')}
        </div>
        ${gerarHTMLOpcoesEntregaCupom()}
        <div id="resumo-financeiro-carrinho"></div>
        ${gerarHTMLBotoesAcaoCarrinho()}
    `;

    atualizarResumoFinanceiroCarrinho();
}

// --- SUB-FUNÇÕES DE RENDERIZAÇÃO ---

function gerarHTMLCarrinhoVazio() {
    return `
        <div class="carrinho-vazio">
            <i class="fas fa-shopping-basket" style="font-size:3rem; color:#ddd; margin-bottom:20px;"></i>
            <p style="color:#888; font-weight:500; margin-bottom:20px;">Seu carrinho está vazio no momento.</p>
            <button class="botao-acao botao-bege" onclick="fecharModal('modal-carrinho')">
                VOLTAR AO CARDÁPIO
            </button>
        </div>
    `;
}

function gerarHTMLItemCarrinho(item) {
    const produto = dadosIniciais.secoes[item.indiceSessao].itens[item.indiceItem];
    let subtotalItem = produto.preco * item.quantidade;
    let htmlOpcionais = '';

    Object.keys(item.opcionais).forEach(nomeOpcional => {
        const opcional = item.opcionais[nomeOpcional];
        subtotalItem += opcional.quantidade * opcional.preco;
        htmlOpcionais += `<div class="opcional-carrinho">+ ${opcional.quantidade}x ${nomeOpcional}</div>`;
    });

    return `
        <div class="item-carrinho">
            <div class="info-item-carrinho">
                <div class="nome-quantidade-item">
                    <span class="quantidade-item">${item.quantidade}x</span>
                    <span class="nome-item">${produto.nome}</span>
                </div>
                ${htmlOpcionais}
                <div class="subtotal-item">${formatarMoeda(subtotalItem)}</div>
            </div>
            <button class="botao-remover-item" onclick="removerItemDoCarrinho('${item.identificador}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

function gerarHTMLOpcoesEntregaCupom() {
    const mostrarCEP = estadoAplicativo.modoEntrega === 'entrega';

    // 🔑 Usa window.formatarCEP de utils.js para montar o valor inicial do campo
    const cepValue = estadoAplicativo.cepCalculado
        ? window.formatarCEP(estadoAplicativo.cepCalculado)
        : '';

    const cupomAtivo   = estadoAplicativo.cupomAplicado;
    const displayCupom = cupomAtivo ? 'block' : 'none';
    const textoCupom   = cupomAtivo
        ? `<span style="color: #2e7d32;"><i class="fas fa-check-circle"></i> Cupom <strong>${cupomAtivo}</strong> aplicado!</span>`
        : '';

    return `
        <div class="opcoes-carrinho">
            <div class="grupo-cupom" style="display: flex; gap: 8px; width: 100%; box-sizing: border-box; margin-bottom: 20px;">
                <input type="text"
                       id="campo-cupom-carrinho"
                       placeholder="CUPOM DE DESCONTO"
                       class="campo-cupom"
                       value="${cupomAtivo || ''}"
                       style="flex: 1; min-width: 0; margin-bottom: 0; height: 45px; border: 1px solid #ccc; border-radius: 8px; padding: 0 12px;">
                <button class="botao-aplicar-cupom"
                        onclick="aplicarCupom()"
                        style="flex: 0 0 auto; width: auto; white-space: nowrap; padding: 0 20px; height: 45px; background-color: var(--marrom-cafe); color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 13px; cursor: pointer;">
                    APLICAR
                </button>
            </div>

            <div id="notificacao-cupom-carrinho" style="display: ${displayCupom}; font-size: 13px; margin-top: -10px; margin-bottom: 15px; font-weight: 500;">
                ${textoCupom}
            </div>

            <div class="grupo-entrega">
                <p class="titulo-entrega" style="font-weight: bold; margin-bottom: 15px;">Como deseja receber seu pedido?</p>
                <div class="opcoes-entrega" style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <label class="opcao-entrega ${estadoAplicativo.modoEntrega === 'retirada' ? 'selecionada' : ''}" style="flex: 1;">
                        <input type="radio" name="modoEntrega" value="retirada"
                               ${estadoAplicativo.modoEntrega === 'retirada' ? 'checked' : ''}
                               onchange="alterarModoEntrega('retirada')">
                        <i class="fas fa-store"></i> <span>RETIRADA</span>
                    </label>
                    <label class="opcao-entrega ${estadoAplicativo.modoEntrega === 'entrega' ? 'selecionada' : ''}" style="flex: 1;">
                        <input type="radio" name="modoEntrega" value="entrega"
                               ${estadoAplicativo.modoEntrega === 'entrega' ? 'checked' : ''}
                               onchange="alterarModoEntrega('entrega')">
                        <i class="fas fa-motorcycle"></i> <span>ENTREGA</span>
                    </label>
                </div>

                <div id="secao-cep-carrinho" class="secao-cep-carrinho" style="${mostrarCEP ? 'display: block;' : 'display: none;'}">
                    <div class="informacao-taxa" style="margin-bottom: 10px; font-size: 12px; color: #666;">
                        <i class="fas fa-info-circle"></i> <span>Informe seu CEP para o cálculo da taxa</span>
                    </div>

                    <div style="display: flex !important; gap: 8px !important; width: 100% !important; box-sizing: border-box !important; margin-bottom: 20px;">
                        <input type="text"
                            id="cep-carrinho"
                            class="campo-input-carrinho"
                            placeholder="00000-000"
                            maxlength="9"
                            value="${cepValue}">

                        <button type="button"
                            onclick="const v = document.getElementById('cep-carrinho').value.replace(/\\D/g, ''); if(v.length === 8) { window.buscarEnderecoPorCodigoPostal(v); } else { window.validarCEPAuto(document.getElementById('cep-carrinho')); }"
                            style="flex: 0 0 auto !important; width: auto !important; white-space: nowrap !important; padding: 0 20px !important; height: 45px !important; background-color: #332616 !important; color: white !important; border: none !important; border-radius: 8px !important; font-weight: bold !important; font-size: 13px !important; cursor: pointer !important; margin: 0 !important;">
                            APLICAR
                        </button>
                    </div>

                    <div id="notificacao-bairro-carrinho" style="display: none; font-size: 13px; color: #5d4037; font-weight: bold; margin-top: 10px;">
                        <i class="fas fa-map-marker-alt"></i> <span id="nome-bairro-info"></span>
                    </div>

                    <div id="resultado-frete-carrinho" style="display: none; margin-top: 10px; padding: 5px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #666;">
                            <span style="display: flex; align-items: center; gap: 5px;">
                                <i class="fas fa-truck"></i> Taxa de entrega:
                            </span>
                            <span id="valor-frete-carrinho" style="font-weight: bold; color: var(--verde-militar);">R$ 0,00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function gerarHTMLBotoesAcaoCarrinho() {
    return `
        <div class="botoes-carrinho" style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
            <button class="botao-acao botao-verde-militar" onclick="prosseguirParaDadosCliente()">
                PROSSEGUIR PARA O PAGAMENTO <i class="fas fa-chevron-right"></i>
            </button>
            <button class="botao-acao botao-bege" onclick="fecharModal('modal-carrinho')">
                CONTINUAR COMPRANDO
            </button>
        </div>
    `;
}

// ===================== RESUMO FINANCEIRO — FUNÇÃO CENTRALIZADA =====================
// Gera o HTML do resumo a partir dos valores calculados.
// Usada tanto pelo carrinho quanto pelo modal de pagamento — fonte única de verdade.

function gerarHTMLResumo(totalProdutos, desconto, taxaEntrega, totalGeral, modoEntrega) {
    return `
        <div style="margin-top: 20px; margin-bottom: 25px; border: 1px solid var(--borda-nav); border-radius: 12px; background-color: var(--branco); overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); text-align: left;">
            <div style="background-color: var(--bege-claro); padding: 10px 15px; border-bottom: 1px solid var(--borda-nav);">
                <span style="font-size: 13px; color: var(--marrom-cafe); font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Resumo do Pedido</span>
            </div>
            <div style="padding: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-size: 14px; color: var(--cinza-escuro);">Produtos</span>
                    <span style="font-size: 14px; font-weight: 500;">${formatarMoeda(totalProdutos)}</span>
                </div>
                ${desconto > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-size: 14px; color: var(--red);">🏷️ Desconto</span>
                    <span style="font-size: 14px; color: var(--red); font-weight: bold;">- ${formatarMoeda(desconto)}</span>
                </div>` : ''}
                ${modoEntrega === 'entrega' ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-size: 14px; color: var(--cinza-escuro);">🚚 Taxa de Entrega</span>
                    <span style="font-size: 14px; font-weight: 500;">${taxaEntrega > 0 ? formatarMoeda(taxaEntrega) : 'Grátis'}</span>
                </div>` : ''}
                <div style="border-top: 1px dashed var(--borda-nav); margin: 12px 0;"></div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 16px; font-weight: bold; color: var(--verde-militar);">TOTAL GERAL</span>
                    <span style="font-size: 20px; font-weight: 800; color: var(--verde-militar);">${formatarMoeda(totalGeral)}</span>
                </div>
            </div>
        </div>
    `;
}

// Calcula o subtotal de produtos do carrinho atual
function calcularSubtotalProdutos() {
    let total = 0;
    Object.values(carrinho).forEach(item => {
        const produto = dadosIniciais.secoes[item.indiceSessao].itens[item.indiceItem];
        let subtotalItem = produto.preco * item.quantidade;
        if (item.opcionais) {
            Object.values(item.opcionais).forEach(opcional => {
                subtotalItem += opcional.quantidade * opcional.preco;
            });
        }
        total += subtotalItem;
    });
    return total;
}

function atualizarResumoFinanceiroCarrinho() {
    const container = elemento('resumo-financeiro-carrinho');
    if (!container) return;

    const totalProdutos = calcularSubtotalProdutos();

    // Recalcular desconto do cupom se houver
    if (estadoAplicativo.cupomAplicado) {
        const dadosCupom = dadosIniciais.cupons.find(c =>
            c.codigo.toUpperCase() === estadoAplicativo.cupomAplicado.toUpperCase()
        );
        if (dadosCupom) {
            estadoAplicativo.descontoCupom = dadosCupom.tipo === 'porcentagem'
                ? totalProdutos * (dadosCupom.valor / 100)
                : dadosCupom.valor;
        }
    }

    const desconto    = estadoAplicativo.descontoCupom || 0;
    const taxaEntrega = estadoAplicativo.modoEntrega === 'entrega' ? (estadoAplicativo.taxaEntrega || 0) : 0;
    const totalGeral  = (totalProdutos - desconto) + taxaEntrega;
    estadoAplicativo.totalGeral = totalGeral;

    container.innerHTML = gerarHTMLResumo(totalProdutos, desconto, taxaEntrega, totalGeral, estadoAplicativo.modoEntrega);

    const totalElementoBarra = elemento('resumo-total-carrinho');
    if (totalElementoBarra) totalElementoBarra.textContent = formatarMoeda(totalGeral);
}

function removerItemDoCarrinho(identificador) {
    delete carrinho[identificador];
    salvarCarrinho();
    renderizarCarrinho();
    atualizarBarraCarrinho();
    atualizarBadgesAposRemocao();
}

function aplicarCupom() {
    const campoCupom  = elemento('campo-cupom-carrinho');
    const notificacao = elemento('notificacao-cupom-carrinho');
    if (!campoCupom || !notificacao) return;

    const codigoCupom = campoCupom.value.trim().toUpperCase();

    notificacao.style.display = 'none';
    notificacao.style.color   = 'inherit';

    if (!codigoCupom) {
        notificacao.innerHTML     = `<span style="color: #d32f2f;"><i class="fas fa-info-circle"></i> Digite um código.</span>`;
        notificacao.style.display = 'block';
        return;
    }

    const cupomValido = dadosIniciais.cupons?.find(cupom =>
        cupom.codigo.toUpperCase() === codigoCupom
    );

    if (!cupomValido) {
        notificacao.innerHTML     = `<span style="color: #d32f2f;"><i class="fas fa-times-circle"></i> Cupom inválido ou expirado.</span>`;
        notificacao.style.display = 'block';
        campoCupom.value = '';
        return;
    }

    let subtotalParaDesconto = 0;
    Object.values(carrinho).forEach(item => {
        const produto = dadosIniciais.secoes[item.indiceSessao].itens[item.indiceItem];
        let valorItem = produto.preco * item.quantidade;
        if (item.opcionais) {
            Object.values(item.opcionais).forEach(op => valorItem += op.quantidade * op.preco);
        }
        subtotalParaDesconto += valorItem;
    });

    const desconto = cupomValido.tipo === 'porcentagem'
        ? subtotalParaDesconto * (cupomValido.valor / 100)
        : cupomValido.valor;

    estadoAplicativo.cupomAplicado  = codigoCupom;
    estadoAplicativo.descontoCupom  = desconto;

    notificacao.innerHTML     = `<span style="color: #2e7d32;"><i class="fas fa-check-circle"></i> Cupom <strong>${codigoCupom}</strong> aplicado!</span>`;
    notificacao.style.display = 'block';

    atualizarResumoFinanceiroCarrinho();
    if (typeof atualizarResumoPagamentoFinal === 'function') {
        atualizarResumoPagamentoFinal();
    }
}

function alterarModoEntrega(modo) {
    console.log(`[CEP] Alterando modo entrega para: ${modo}`);

    estadoAplicativo.modoEntrega = modo;

    if (modo === 'retirada') {
        estadoAplicativo.cepCalculado = null;
        estadoAplicativo.taxaEntrega  = 0;

        const campoCEP = elemento('cep-carrinho');
        if (campoCEP) campoCEP.value = '';

        const resultadoFrete = elemento('resultado-frete-carrinho');
        if (resultadoFrete) resultadoFrete.style.display = 'none';
    }

    document.querySelectorAll('.opcao-entrega').forEach(opcao => opcao.classList.remove('selecionada'));

    const opcaoSelecionada = document.querySelector(`[value="${modo}"]`)?.closest('.opcao-entrega');
    if (opcaoSelecionada) opcaoSelecionada.classList.add('selecionada');

    const secaoCEP = elemento('secao-cep-carrinho');
    if (secaoCEP) {
        secaoCEP.style.display = modo === 'entrega' ? 'block' : 'none';

        if (modo === 'entrega' && estadoAplicativo.cepCalculado) {
            const campoCEP = elemento('cep-carrinho');
            if (campoCEP && !campoCEP.value) {
                // 🔑 Usa window.formatarCEP de utils.js
                campoCEP.value = window.formatarCEP(estadoAplicativo.cepCalculado);
            }

            if (estadoAplicativo.taxaEntrega > 0) {
                const resultadoFrete = elemento('resultado-frete-carrinho');
                if (resultadoFrete) resultadoFrete.style.display = 'block';
            }
        }
    }

    if (modo === 'entrega' && window.AddressManager) {
        setTimeout(() => {
            if (window.AddressManager.init) window.AddressManager.init();
        }, 300);
    }

    atualizarResumoFinanceiroCarrinho();
}

function prosseguirParaDadosCliente() {
    console.log('[CEP] Prosseguindo para dados do cliente...');

    if (Object.keys(carrinho).length === 0) {
        window.mostrarNotificacao('Adicione itens ao carrinho antes de prosseguir.', 'aviso');
        return;
    }

    const cepAtualCarrinho = estadoAplicativo.cepCalculado
        ? estadoAplicativo.cepCalculado.replace(/\D/g, '')
        : '';

    fecharModal('modal-carrinho');

    setTimeout(() => {
        abrirModal('modal-dados-cliente');

        setTimeout(() => {
            if (estadoAplicativo.modoEntrega === 'entrega' && cepAtualCarrinho.length === 8) {
                const campoCepDados = document.getElementById('codigo-postal-cliente');

                if (campoCepDados) {
                    const cepJaNoCampo = campoCepDados.value.replace(/\D/g, '');

                    if (cepJaNoCampo !== cepAtualCarrinho) {
                        console.log('[CEP] CEP alterado. Forçando nova busca...');
                        // 🔑 Usa window.formatarCEP de utils.js
                        campoCepDados.value = window.formatarCEP(cepAtualCarrinho);

                        if (window.buscarEnderecoPorCodigoPostal) {
                            window.buscarEnderecoPorCodigoPostal(cepAtualCarrinho);
                        }
                    }
                }
            }

            const secaoEndereco = elemento('secao-endereco');
            if (secaoEndereco) {
                secaoEndereco.style.display = estadoAplicativo.modoEntrega === 'retirada' ? 'none' : 'block';
            }
        }, 300);
    }, 100);
}

function atualizarDisplayFreteCarrinho(valor) {
    const resultadoDiv = elemento('resultado-frete-carrinho');
    const valorSpan    = elemento('valor-frete-carrinho');

    if (resultadoDiv && valorSpan) {
        valorSpan.textContent     = formatarMoeda(valor);
        resultadoDiv.style.display = 'block';
    }

    estadoAplicativo.taxaEntrega = valor;
    console.log(`[CEP] Taxa salva: R$ ${valor.toFixed(2)}`);

    atualizarResumoFinanceiroCarrinho();
}

function calcularTotalFinal() {
    let subtotalItens = 0;
    Object.values(carrinho).forEach(item => {
        const produto = dadosIniciais.secoes[item.indiceSessao].itens[item.indiceItem];
        let precoBase = produto.preco * item.quantidade;
        for (let nomeOpcional in item.opcionais) {
            const opcional = item.opcionais[nomeOpcional];
            precoBase += opcional.quantidade * opcional.preco;
        }
        subtotalItens += precoBase;
    });

    const valorDesconto = estadoAplicativo.descontoCupom || 0;
    const taxaEntrega   = typeof window.obterTaxaEntregaAtual === 'function'
        ? window.obterTaxaEntregaAtual()
        : (estadoAplicativo.taxaEntrega || 0);

    const totalGeral = Math.max(0, subtotalItens - valorDesconto) + taxaEntrega;

    return { itens: subtotalItens, desconto: valorDesconto, taxa: taxaEntrega, total: totalGeral };
}

function atualizarResumoPagamentoFinal() {
    const container = elemento('resumo-final-pedido-pagamento');
    if (!container) return;

    const totalProdutos = calcularSubtotalProdutos();
    const desconto      = estadoAplicativo.descontoCupom || 0;
    const taxaEntrega   = estadoAplicativo.modoEntrega === 'entrega' ? (estadoAplicativo.taxaEntrega || 0) : 0;
    const totalGeral    = (totalProdutos - desconto) + taxaEntrega;

    estadoAplicativo.totalGeral = totalGeral;

    container.innerHTML = gerarHTMLResumo(totalProdutos, desconto, taxaEntrega, totalGeral, estadoAplicativo.modoEntrega);

    const valorPixElemento = elemento('valor-pix');
    if (valorPixElemento) valorPixElemento.textContent = formatarMoeda(totalGeral);
}

// ===================== MÁSCARA E VALIDAÇÃO DE CEP =====================

/**
 * Aplica a máscara de CEP no campo do carrinho.
 * 🔑 Delega para window.aplicarMascaraCEP (utils.js) — fonte única.
 */
function formatarCampoCEP(input) {
    window.aplicarMascaraCEP(input);
}

/**
 * Valida o CEP ao perder o foco; dispara busca se completo.
 */
function validarCEPAuto(input) {
    const cepLimpo = input.value.replace(/\D/g, '');

    if (cepLimpo.length > 0 && cepLimpo.length < 8) {
        const spanNomeBairro = document.getElementById('nome-bairro-info');
        const divNotificacao = document.getElementById('notificacao-bairro-carrinho');

        if (divNotificacao && spanNomeBairro) {
            spanNomeBairro.innerHTML        = `<span style="color: #d32f2f;">O CEP deve conter 8 números.</span>`;
            divNotificacao.style.display    = 'block';
        }
        input.focus();
    } else if (cepLimpo.length === 8) {
        window.buscarEnderecoPorCodigoPostal(cepLimpo);
    }
}

// Listener global para máscara do campo cep-carrinho
// 🔑 Usa window.aplicarMascaraCEP de utils.js
document.addEventListener('input', function(e) {
    if (e.target && e.target.id === 'cep-carrinho') {
        window.aplicarMascaraCEP(e.target);
    }
});

// ===================== EXPORTAÇÕES =====================

window.atualizarBarraCarrinho       = atualizarBarraCarrinho;
window.abrirModalCarrinho           = abrirModalCarrinho;
window.removerItemDoCarrinho        = removerItemDoCarrinho;
window.sincronizarProdutoNoCarrinho = sincronizarProdutoNoCarrinho;
window.aplicarCupom                 = aplicarCupom;
window.alterarModoEntrega           = alterarModoEntrega;
window.prosseguirParaDadosCliente   = prosseguirParaDadosCliente;
window.calcularTotalFinal           = calcularTotalFinal;
window.atualizarResumoPagamentoFinal = atualizarResumoPagamentoFinal;
window.atualizarDisplayFreteCarrinho = atualizarDisplayFreteCarrinho;
window.formatarCampoCEP             = formatarCampoCEP;
window.validarCEPAuto               = validarCEPAuto;

console.log('✅ carrinho.js carregado');