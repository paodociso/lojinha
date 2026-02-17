// ============================================
// MODAL DE PRODUTO - BUSCA EM ÁRVORE
// ============================================

// produto-modal.js

function configurarProduto(indiceSessao, indiceItem) {
    const produto = dadosIniciais.secoes[indiceSessao].itens[indiceItem];
    const identificador = `item-${indiceSessao}-${indiceItem}`;

    if (produto.esgotado) {
        alert('Este produto está esgotado no momento.');
        return;
    }

    const itemExistente = carrinho[identificador];
    if (itemExistente) {
        produtoAtual = JSON.parse(JSON.stringify(itemExistente));
    } else {
        produtoAtual = {
            identificador: identificador,
            indiceSessao: indiceSessao,
            indiceItem: indiceItem,
            quantidade: 0, 
            opcionais: {}
        };
    }

    renderizarModalProduto(produto);
    abrirModal('modal-produto');
}

// --- BUSCADOR DEEP SEARCH (A Mágica acontece aqui) ---
function buscarDetalhesOpcional(nomeOpcional, chaveBiblioteca) {
    // Função interna para varrer uma biblioteca específica
    const procurarEmBiblioteca = (biblioteca) => {
        if (!biblioteca) return null;

        // CASO 1: A biblioteca é dividida em categorias (Objeto) - NOVO MODELO
        if (!Array.isArray(biblioteca)) {
            for (const [nomeCategoria, listaItens] of Object.entries(biblioteca)) {
                const item = listaItens.find(i => i.nome === nomeOpcional);
                if (item) {
                    // Retorna o item JÁ com a categoria injetada
                    return { ...item, categoria: nomeCategoria };
                }
            }
        } 
        // CASO 2: A biblioteca é uma lista simples (Array) - MODELO ANTIGO
        else {
            const item = biblioteca.find(i => i.nome === nomeOpcional);
            if (item) return item;
        }
        return null;
    };

    // 1. Tenta buscar na biblioteca indicada pelo produto (ex: "Panini")
    if (chaveBiblioteca) {
        const encontrado = procurarEmBiblioteca(dadosIniciais.opcionais[chaveBiblioteca]);
        if (encontrado) return encontrado;
    }

    // 2. Se não achou, varre TODAS as bibliotecas de opcionais (Fallback)
    for (const chave in dadosIniciais.opcionais) {
        const encontrado = procurarEmBiblioteca(dadosIniciais.opcionais[chave]);
        if (encontrado) return encontrado;
    }

    // 3. Última tentativa: Procura nas seções de produtos (ex: Alichella)
    for (const secao of dadosIniciais.secoes) {
        const itemProduto = secao.itens.find(i => i.nome === nomeOpcional);
        if (itemProduto) return { nome: nomeOpcional, preco: itemProduto.preco, categoria: 'Extras' };
    }

    // Se não achar nada, retorna zerado
    return { nome: nomeOpcional, preco: 0, categoria: 'Outros' };
}

function criarHTMLItemOpcional(info) {
    const qtdAtual = produtoAtual.opcionais[info.nome] ? produtoAtual.opcionais[info.nome].quantidade : 0;
    const idOpcional = info.nome.replace(/\s+/g, '-');
    
    return `
        <div class="opcional-item-moldura">
            <div class="opcional-texto-lado-a-lado">
                <span class="opcional-nome">${info.nome}</span>
                <span class="opcional-preco">+ ${formatarMoeda(info.preco)}</span>
            </div>
            <div class="controles-opcional">
                <button class="botao-quantidade-pequeno" onclick="alterarQuantidadeOpcional('${info.nome}', ${info.preco}, -1)">-</button>
                <span id="quantidade-opcional-${idOpcional}" class="quantidade-opcional">${qtdAtual}</span>
                <button class="botao-quantidade-pequeno" onclick="alterarQuantidadeOpcional('${info.nome}', ${info.preco}, 1)">+</button>
            </div>
        </div>`;
}

function gerarHTMLSecaoOpcionais(produto) {
    if ((produtoAtual.quantidade || 0) <= 0) return '';
    
    const ativos = produto.opcionais_ativos;
    if (!ativos || ativos.length === 0) return '';

    let conteudoHTML = '';

    // Se o produto usa lista simples (Recomendado), nós agrupamos automaticamente
    if (Array.isArray(ativos)) {
        const grupos = {};
        const semCategoria = [];

        ativos.forEach(nome => {
            // A busca agora retorna a categoria automaticamente!
            const info = buscarDetalhesOpcional(nome, produto.opcionais);
            
            if (info.categoria && info.categoria !== 'Outros') {
                if (!grupos[info.categoria]) grupos[info.categoria] = [];
                grupos[info.categoria].push(info);
            } else {
                semCategoria.push(info);
            }
        });

        // Renderiza Grupos
        for (const [nomeCategoria, itens] of Object.entries(grupos)) {
            conteudoHTML += `
                <h5 class="titulo-subcategoria">${nomeCategoria}</h5>
                <div class="moldura-agrupadora-opcionais" style="margin-bottom: 15px;">
                    ${itens.map(item => criarHTMLItemOpcional(item)).join('')}
                </div>`;
        }

        // Renderiza Itens Soltos
        if (semCategoria.length > 0) {
            conteudoHTML += `
                ${Object.keys(grupos).length > 0 ? '<h5 class="titulo-subcategoria">Outros</h5>' : ''}
                <div class="moldura-agrupadora-opcionais">
                    ${semCategoria.map(item => criarHTMLItemOpcional(item)).join('')}
                </div>`;
        }
    } 
    // Suporte legado para objeto direto no produto
    else if (typeof ativos === 'object') {
        for (const [categoria, listaNomes] of Object.entries(ativos)) {
            const itensHTML = listaNomes.map(nome => {
                const info = buscarDetalhesOpcional(nome, produto.opcionais);
                return criarHTMLItemOpcional(info);
            }).join('');

            conteudoHTML += `
                <h5 class="titulo-subcategoria">${categoria}</h5>
                <div class="moldura-agrupadora-opcionais" style="margin-bottom: 15px;">
                    ${itensHTML}
                </div>`;
        }
    }

    return `
        <div id="contener-opcionais-produto" class="visivel">
            <h4 class="titulo-opcionais"><i class="fas fa-list"></i> ADICIONAR OPCIONAIS</h4>
            ${conteudoHTML}
        </div>
    `;
}

// --- FUNÇÕES PADRÃO (RENDER, CÁLCULO, ETC) ---
// ATUALIZAÇÃO: CORREÇÃO DE VISIBILIDADE
function renderizarModalProduto(produto) {
    const container = document.getElementById('corpo-modal-produto');
    if (!container) return;

    // Lógica infalível de visibilidade
    const displayStatus = produtoAtual.quantidade > 0 ? 'block' : 'none';
    
    // O subtotal também deve sumir se for zero
    const displaySubtotal = produtoAtual.quantidade > 0 ? 'block' : 'none';

    container.innerHTML = `
        <div class="imagem-produto-container">
            <img src="${produto.imagem}" alt="${produto.nome}" class="imagem-produto-modal">
        </div>

        <div id="status-no-carrinho" 
             style="display: ${displayStatus}; text-align: center; color: #4b6b35; font-weight: bold; font-size: 0.85rem; padding: 10px 0; background-color: #f0f7ed; border-bottom: 1px solid #e0eadd;">
            <i class="fas fa-check-circle"></i> Item adicionado ao carrinho
        </div>
        
        <div class="moldura-padrao-modal">
            <h2 class="nome-produto-modal">${produto.nome}</h2>
            <p class="descricao-produto-modal">${produto.descricao || ''}</p>
        </div>
        
        <div class="moldura-padrao-modal">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="display: flex; flex-direction: column;">
                    <span style="font-weight: bold; font-size: 1rem; color: #000;">Quantidade</span>
                    <span style="font-size: 0.9rem; color: #666;">${formatarMoeda(produto.preco)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="botao-quantidade-pequeno" onclick="alterarQuantidadeProduto(-1)" style="width: 30px; height: 30px; border-radius: 50%; border: none; background-color: #332616; color: white; cursor: pointer;">-</button>
                    <span id="quantidade-produto-modal" style="font-weight: bold; font-size: 1rem; min-width: 20px; text-align: center;">${produtoAtual.quantidade}</span>
                    <button class="botao-quantidade-pequeno" onclick="alterarQuantidadeProduto(1)" style="width: 30px; height: 30px; border-radius: 50%; border: none; background-color: #332616; color: white; cursor: pointer;">+</button>
                </div>
            </div>
        </div>
        
        <div id="secao-opcionais-dinamica">
            ${gerarHTMLSecaoOpcionais(produto)}
        </div>
        
        <div id="container-subtotal-produto" class="moldura-padrao-modal" 
             style="display: ${displaySubtotal}; background-color: #e8e8e8 !important;">
            <div class="linha-flex-modal">
                <span class="subtitulo-subtotal">SUBTOTAL DO ITEM</span>
                <span id="valor-subtotal-produto" class="valor-subtotal">${formatarMoeda(calcularSubtotalProduto())}</span>
            </div>
        </div>
    `;

    verificarVisibilidadeBotoesModal();
}

function alterarQuantidadeProduto(valor) {
    const novaQuantidade = Math.max(0, (produtoAtual.quantidade || 0) + valor);
    if (novaQuantidade === produtoAtual.quantidade) return;
    produtoAtual.quantidade = novaQuantidade;
    if (produtoAtual.quantidade === 0) produtoAtual.opcionais = {};
    const produtoBase = dadosIniciais.secoes[produtoAtual.indiceSessao].itens[produtoAtual.indiceItem];
    renderizarModalProduto(produtoBase);
    sincronizarProdutoNoCarrinho();
}

function calcularSubtotalProduto() {
    const produto = dadosIniciais.secoes[produtoAtual.indiceSessao].itens[produtoAtual.indiceItem];
    let subtotal = produto.preco * produtoAtual.quantidade;
    for (let nome in produtoAtual.opcionais) {
        subtotal += produtoAtual.opcionais[nome].quantidade * produtoAtual.opcionais[nome].preco;
    }
    return subtotal;
}

function verificarVisibilidadeBotoesModal() {
    const qtd = produtoAtual.quantidade;
    const btnVerde = document.getElementById('botao-adicionar-e-ir-para-carrinho');
    const btnBege = document.getElementById('botao-adicionar-simples');
    if (btnVerde) btnVerde.style.display = qtd > 0 ? 'flex' : 'none';
    if (btnBege) btnBege.style.display = 'flex';
}

function adicionarItemAoCarrinho() {
    if (produtoAtual.quantidade === 0) { alert('Adicione pelo menos 1 item.'); return; }
    sincronizarProdutoNoCarrinho();
    fecharModal('modal-produto');
    mostrarNotificacao('Item adicionado ao carrinho!');
}

function adicionarEIrParaCarrinho() {
    sincronizarProdutoNoCarrinho();
    fecharModal('modal-produto');
    abrirModalCarrinho();
}

function sincronizarProdutoNoCarrinho() {
    if (produtoAtual.quantidade > 0) carrinho[produtoAtual.identificador] = JSON.parse(JSON.stringify(produtoAtual));
    else delete carrinho[produtoAtual.identificador];
    salvarCarrinho();
    atualizarBarraCarrinho();
    if (typeof atualizarBadgeNoCard === 'function') atualizarBadgeNoCard(produtoAtual.indiceSessao, produtoAtual.indiceItem);
}

// EXPORTAÇÕES
window.configurarProduto = configurarProduto;
window.renderizarModalProduto = renderizarModalProduto;
window.alterarQuantidadeProduto = alterarQuantidadeProduto;
window.gerarHTMLSecaoOpcionais = gerarHTMLSecaoOpcionais;
window.adicionarItemAoCarrinho = adicionarItemAoCarrinho;
window.adicionarEIrParaCarrinho = adicionarEIrParaCarrinho;
window.ajustarAlinhamentoOpcionais = function(){};