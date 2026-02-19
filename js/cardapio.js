// ============================================
// RENDERIZAÇÃO DO CARDÁPIO - PÃO DO CISO
// ============================================
// ⚠️  Depende de notificacoes.js carregado antes:
//     - window.mostrarNotificacao()  → notificação flutuante (versão completa)
// ============================================

// ===================== FUNÇÕES AUXILIARES MODULARIZADAS =====================

function criarCardProduto(sessao, indiceSessao, item, indiceItem) {
    const identificador = `item-${indiceSessao}-${indiceItem}`;
    const quantidadeNoCarrinho = carrinho[identificador]?.quantidade || 0;
    const estaEsgotado = !!item.esgotado;

    const card = document.createElement('div');
    card.className = `card ${estaEsgotado ? 'esgotado' : ''}`;
    card.dataset.sessao = indiceSessao;
    card.dataset.item = indiceItem;
    card.dataset.identificador = identificador;

    card.innerHTML = `
        <div class="card-imagem-wrapper">
            ${estaEsgotado ? '<div class="badge-esgotado">ESGOTADO</div>' : ''}
            ${quantidadeNoCarrinho > 0 ? `
            <div class="badge-quantidade" style="display: flex;">
                ${quantidadeNoCarrinho}
            </div>` : ''}
            <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
        </div>
        <div class="card-content">
            <div class="card-nome">${item.nome}</div>
            <div class="card-footer">
                <span class="coluna-preco">
                    <span class="card-preco">${formatarMoeda(item.preco)}</span>
                </span>
                <span class="coluna-controles"></span>
            </div>
        </div>
    `;

    if (!estaEsgotado) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => configurarProduto(indiceSessao, indiceItem));
    } else {
        card.style.cursor = 'not-allowed';
    }

    return card;
}

function criarSecaoProdutos(sessao, indiceSessao) {
    const itensVisiveis = sessao.itens.filter(item => item.visivel !== false);
    if (itensVisiveis.length === 0) return null;

    console.log(`📁 Criando seção ${indiceSessao} - "${sessao.nome}": ${itensVisiveis.length} itens`);

    const secaoDiv = document.createElement('div');
    secaoDiv.innerHTML = `
        <div class="titulo-secao-wrapper">
            <div class="linha-solida"></div>
            <h2 class="titulo-secao">${sessao.nome}</h2>
            <div class="linha-solida"></div>
        </div>
        <div class="grid-produtos"></div>
    `;

    const grid = secaoDiv.querySelector('.grid-produtos');
    let cardsCriados = 0;

    sessao.itens.forEach((item, indiceItem) => {
        if (item.visivel === false) return;
        grid.appendChild(criarCardProduto(sessao, indiceSessao, item, indiceItem));
        cardsCriados++;
    });

    console.log(`   ✅ ${cardsCriados} cards criados na seção "${sessao.nome}"`);
    return secaoDiv;
}

// ===================== RENDERIZAÇÃO DO CARDÁPIO =====================

function renderizarCardapio() {
    console.log('🎯 RENDERIZANDO CARDÁPIO COMPLETO');

    const container = elemento('container-aplicativo');
    if (!container || !dadosIniciais.secoes) {
        console.error('❌ Container ou dados iniciais não encontrados');
        return;
    }

    const fragment = document.createDocumentFragment();

    dadosIniciais.secoes.forEach((sessao, indiceSessao) => {
        const secaoElement = criarSecaoProdutos(sessao, indiceSessao);
        if (secaoElement) fragment.appendChild(secaoElement);
    });

    container.innerHTML = '';
    container.appendChild(fragment);

    console.log('✅ Renderização do cardápio concluída');
    atualizarDatasFornada();
}

function atualizarCardUnico(indiceSessao, indiceItem) {
    console.log(`🎯 ATUALIZANDO CARD ÚNICO: seção ${indiceSessao}, item ${indiceItem}`);

    const seletor = `.card[data-sessao="${indiceSessao}"][data-item="${indiceItem}"]`;
    const card = document.querySelector(seletor);

    if (!card) { console.log(`❌ Card não encontrado: ${seletor}`); return; }

    const sessao = dadosIniciais.secoes[indiceSessao];
    const item   = sessao.itens[indiceItem];

    if (!item || item.visivel === false) { console.log('❌ Item indisponível'); return; }

    card.parentNode.replaceChild(criarCardProduto(sessao, indiceSessao, item, indiceItem), card);
    console.log(`✅ Card atualizado: ${item.nome}`);
}

function atualizarBadgesAposRemocao() {
    console.log('🔄 ATUALIZANDO BADGES APÓS REMOÇÃO');

    const itensComQuantidade = Object.keys(carrinho).filter(id => carrinho[id].quantidade > 0);

    itensComQuantidade.forEach(identificador => {
        const match = identificador.match(/item-(\d+)-(\d+)/);
        if (match) atualizarBadgeNoCard(parseInt(match[1]), parseInt(match[2]));
    });

    document.querySelectorAll('.badge-quantidade').forEach(badge => {
        const card = badge.closest('.card');
        if (!card) return;
        const identificador = card.dataset.identificador;
        if (!identificador || !carrinho[identificador] || carrinho[identificador].quantidade === 0) {
            console.log(`🗑️ Removendo badge obsoleto: ${identificador}`);
            badge.remove();
        }
    });
}

// ===================== DATAS DA FORNADA =====================

function atualizarDatasFornada() {
    console.log('📅 Atualizando datas da fornada...');

    if (!dadosIniciais.fornada) { console.warn('⚠️ Dados da fornada não encontrados'); return; }

    const datas = calcularDatasFornada(dadosIniciais.fornada);

    const elementoData   = elemento('texto-data-fornada');
    const elementoLimite = elemento('texto-limite-pedido');

    if (elementoData) {
        elementoData.innerHTML = `<i class="fas fa-calendar-alt"></i> PRÓXIMA FORNADA: ${datas.fornada}`;
    }

    if (elementoLimite) {
        elementoLimite.textContent = `Pedidos até: ${datas.limite}`;
    }
}

function calcularDatasFornada(infoFornada) {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const dataFornada = new Date(infoFornada.dataISO + 'T12:00:00');
    const diaFornada  = diasSemana[dataFornada.getDay()];
    const dataFornadaFormatada = `${String(dataFornada.getDate()).padStart(2,'0')}/${String(dataFornada.getMonth()+1).padStart(2,'0')}`;

    const dataLimite = new Date(dataFornada);
    dataLimite.setDate(dataFornada.getDate() - infoFornada.diasAntecedencia);
    const diaLimite         = diasSemana[dataLimite.getDay()];
    const dataLimiteFormatada = `${String(dataLimite.getDate()).padStart(2,'0')}/${String(dataLimite.getMonth()+1).padStart(2,'0')}`;

    return {
        fornada: `${diaFornada}, ${dataFornadaFormatada}`,
        limite:  `${diaLimite}, ${dataLimiteFormatada} às ${infoFornada.horaLimite}`
    };
}

// ===================== FUNÇÕES RÁPIDAS DE ADIÇÃO =====================

function validarProduto(produto) {
    if (!produto)                                    { console.error('❌ Produto não definido'); return false; }
    if (!produto.nome || produto.nome.trim() === '') { console.error('❌ Produto sem nome');     return false; }
    if (!produto.preco || typeof produto.preco !== 'number') { console.error('❌ Produto sem preço válido'); return false; }
    return true;
}

function verificarDisponibilidade(indiceSessao, indiceItem) {
    if (!dadosIniciais.secoes?.[indiceSessao]?.itens?.[indiceItem]) {
        console.error(`❌ Produto não encontrado: seção ${indiceSessao}, item ${indiceItem}`);
        return false;
    }

    const produto = dadosIniciais.secoes[indiceSessao].itens[indiceItem];

    if (produto.esgotado) {
        // 🔑 Usa window.mostrarNotificacao de notificacoes.js
        window.mostrarNotificacao('Este produto está esgotado!', 'error');
        return false;
    }

    if (produto.visivel === false) return false;

    return true;
}

function adicionarRapido(indiceSessao, indiceItem) {
    console.log(`🛒 ADICIONAR RÁPIDO: seção ${indiceSessao}, item ${indiceItem}`);

    if (!verificarDisponibilidade(indiceSessao, indiceItem)) return;

    const produto = dadosIniciais.secoes[indiceSessao].itens[indiceItem];

    if (!validarProduto(produto)) {
        // 🔑 Usa window.mostrarNotificacao de notificacoes.js
        window.mostrarNotificacao('Erro ao adicionar produto', 'error');
        return;
    }

    const identificador = `item-${indiceSessao}-${indiceItem}`;

    if (!carrinho[identificador]) {
        carrinho[identificador] = {
            identificador,
            indiceSessao,
            indiceItem,
            quantidade: 1,
            opcionais: {},
            precoUnitario: produto.preco,
            nome: produto.nome
        };
    } else {
        carrinho[identificador].quantidade += 1;
    }

    salvarCarrinho();
    atualizarBarraCarrinho();
    atualizarBadgeNoCard(indiceSessao, indiceItem);

    // 🔑 Usa window.mostrarNotificacao de notificacoes.js
    window.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, 'success');
}

function atualizarBadgeNoCard(indiceSessao, indiceItem) {
    const identificador = `item-${indiceSessao}-${indiceItem}`;
    const quantidade    = carrinho[identificador]?.quantidade || 0;

    const seletor = `[data-sessao="${indiceSessao}"][data-item="${indiceItem}"]`;
    const card    = document.querySelector(seletor);

    if (!card) { console.error(`❌ Card não encontrado: ${seletor}`); return; }

    const badge = card.querySelector('.badge-quantidade');

    if (!badge && quantidade > 0) {
        const imagemWrapper = card.querySelector('.card-imagem-wrapper');
        if (imagemWrapper) {
            const novoBadge = document.createElement('div');
            novoBadge.className   = 'badge-quantidade';
            novoBadge.textContent = quantidade;
            novoBadge.style.display = 'flex';
            novoBadge.classList.add('updated');
            setTimeout(() => novoBadge.classList.remove('updated'), 300);
            imagemWrapper.appendChild(novoBadge);
        }
    } else if (badge) {
        if (quantidade > 0) {
            badge.textContent   = quantidade;
            badge.style.display = 'flex';
            badge.classList.add('updated');
            setTimeout(() => badge.classList.remove('updated'), 300);
        } else {
            badge.remove();
        }
    }
}

function diagnosticarBadges() {
    console.log('=== 🩺 DIAGNÓSTICO COMPLETO DE BADGES ===');

    const itensComBadge = Object.keys(carrinho).filter(id => carrinho[id].quantidade > 0);
    const badgesDOM     = document.querySelectorAll('.badge-quantidade');

    console.log(`🎯 Itens que DEVEM ter badge: ${itensComBadge.length}`);
    console.log(`🏷️ Badges visíveis no DOM: ${badgesDOM.length}`);

    if (itensComBadge.length === badgesDOM.length) {
        console.log('✅ CORRESPONDÊNCIA PERFEITA!');
    } else {
        console.log(`⚠️ DESCASAMENTO: Esperados ${itensComBadge.length}, encontrados ${badgesDOM.length}`);
    }

    return { itensComBadge, badgesDOM };
}

// ===================== EXPORTAÇÕES =====================

window.renderizarCardapio     = renderizarCardapio;
window.atualizarDatasFornada  = atualizarDatasFornada;
window.adicionarRapido        = adicionarRapido;
window.calcularDatasFornada   = calcularDatasFornada;
window.atualizarBadgeNoCard   = atualizarBadgeNoCard;
window.validarProduto         = validarProduto;
window.verificarDisponibilidade = verificarDisponibilidade;
window.atualizarCardUnico     = atualizarCardUnico;
window.atualizarBadgesAposRemocao = atualizarBadgesAposRemocao;
window.diagnosticarBadges     = diagnosticarBadges;

// 🔑 NÃO reexporta mostrarNotificacao — a versão canônica já está em notificacoes.js

console.log('✅ cardapio.js carregado');
