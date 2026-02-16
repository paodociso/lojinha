// ============================================
// MODAL DE PRODUTO - PÃO DO CISO
// ============================================

// produto-modal.js

function configurarProduto(indiceSessao, indiceItem) {
    const produto = dadosIniciais.secoes[indiceSessao].itens[indiceItem];
    const identificador = `item-${indiceSessao}-${indiceItem}`;

    if (produto.esgotado) {
        alert('Este produto está esgotado no momento.');
        return;
    }

    // --- LÓGICA DE RECUPERAÇÃO DO CARRINHO ---
    const itemExistente = carrinho[identificador];

    if (itemExistente) {
        produtoAtual = JSON.parse(JSON.stringify(itemExistente));
        console.log(`✅ Produto recuperado do carrinho: ${produto.nome} (Qtde: ${produtoAtual.quantidade})`);
    } else {
        produtoAtual = {
            identificador: identificador,
            indiceSessao: indiceSessao,
            indiceItem: indiceItem,
            quantidade: 0, 
            opcionais: {}
        };
        console.log(`📝 Iniciando novo produto no modal: ${produto.nome}`);
    }

    renderizarModalProduto(produto);
    abrirModal('modal-produto');
}

// --- FUNÇÃO DE RENDERIZAÇÃO DO ITEM OPCIONAL (AUXILIAR) ---
// Separei esta função para não repetir código HTML
function criarHTMLItemOpcional(opcional) {
    const qtdAtual = produtoAtual.opcionais[opcional.nome] ? produtoAtual.opcionais[opcional.nome].quantidade : 0;
    const idOpcional = opcional.nome.replace(/\s+/g, '-');
    
    // Mantendo EXATAMENTE as classes do seu CSS original
    return `
        <div class="opcional-item-moldura">
            <div class="opcional-texto-lado-a-lado">
                <span class="opcional-nome">${opcional.nome}</span>
                <span class="opcional-preco">+ ${formatarMoeda(opcional.preco)}</span>
            </div>
            <div class="controles-opcional">
                <button class="botao-quantidade-pequeno" onclick="alterarQuantidadeOpcional('${opcional.nome}', ${opcional.preco}, -1)">-</button>
                <span id="quantidade-opcional-${idOpcional}" class="quantidade-opcional">${qtdAtual}</span>
                <button class="botao-quantidade-pequeno" onclick="alterarQuantidadeOpcional('${opcional.nome}', ${opcional.preco}, 1)">+</button>
            </div>
        </div>`;
}

// --- BUSCADOR DE DETALHES (PREÇO) ---
function buscarDetalhesOpcional(nomeOpcional, categoriaPadrao) {
    // 1. Tenta buscar na categoria padrão do produto (ex: "Panini")
    if (categoriaPadrao && dadosIniciais.opcionais[categoriaPadrao]) {
        const encontrado = dadosIniciais.opcionais[categoriaPadrao].find(o => o.nome === nomeOpcional);
        if (encontrado) return encontrado;
    }

    // 2. Se não achar, varre todas as listas de opcionais
    for (const key in dadosIniciais.opcionais) {
        const encontrado = dadosIniciais.opcionais[key].find(o => o.nome === nomeOpcional);
        if (encontrado) return encontrado;
    }

    // 3. Fallback: Se for um item que existe como produto principal (ex: Alichella)
    for (const secao of dadosIniciais.secoes) {
        const itemProduto = secao.itens.find(i => i.nome === nomeOpcional);
        if (itemProduto) return { nome: nomeOpcional, preco: itemProduto.preco };
    }

    return { nome: nomeOpcional, preco: 0 };
}

// --- NOVA LÓGICA HÍBRIDA (LISTA OU CATEGORIAS) ---
function gerarHTMLSecaoOpcionais(produto) {
    // Regra: Só mostra opcionais se tiver quantidade > 0
    if ((produtoAtual.quantidade || 0) <= 0) {
        return '';
    }

    const ativos = produto.opcionais_ativos;
    if (!ativos) return ''; // Sem opcionais definidos

    let conteudoHTML = '';

    // CASO 1: Lista Simples (Array) - Como funciona hoje
    if (Array.isArray(ativos)) {
        if (ativos.length === 0) return '';
        
        const itensHTML = ativos.map(nome => {
            const info = buscarDetalhesOpcional(nome, produto.opcionais);
            return criarHTMLItemOpcional(info);
        }).join('');
        
        conteudoHTML = `<div class="moldura-agrupadora-opcionais">${itensHTML}</div>`;
    } 
    // CASO 2: Categorias (Objeto) - O que você quer adicionar
    else if (typeof ativos === 'object') {
        for (const [categoria, listaNomes] of Object.entries(ativos)) {
            // Título da Categoria com estilo inline (para não precisar mexer no CSS agora)
            const tituloHTML = `
                <h5 style="margin: 15px 0 5px 0; color: #2d3a27; font-size: 0.9rem; text-transform: uppercase; border-bottom: 1px solid #dccbb0; padding-bottom: 2px;">
                    ${categoria}
                </h5>`;
            
            const itensHTML = listaNomes.map(nome => {
                const info = buscarDetalhesOpcional(nome, produto.opcionais);
                return criarHTMLItemOpcional(info);
            }).join('');

            conteudoHTML += `
                ${tituloHTML}
                <div class="moldura-agrupadora-opcionais" style="margin-bottom: 10px;">
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

// FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO
function renderizarModalProduto(produto) {
    console.log('🔄 Renderizando Modal (Versão Híbrida) para:', produto.nome);
    
    const container = document.getElementById('corpo-modal-produto'); // Usando getElementById direto para segurança
    if (!container) return;

    container.innerHTML = `
        <div class="imagem-produto-container">
            <img src="${produto.imagem}" alt="${produto.nome}" class="imagem-produto-modal">
        </div>

        <div id="status-no-carrinho" class="${produtoAtual.quantidade > 0 ? 'visivel' : 'escondido'}" 
             style="text-align: center; color: #4b6b35; font-weight: bold; font-size: 0.85rem; padding: 10px 0; background-color: #f0f7ed; border-bottom: 1px solid #e0eadd;">
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
                    <button class="botao-quantidade-pequeno" 
                            onclick="alterarQuantidadeProduto(-1)"
                            style="width: 30px; height: 30px; border-radius: 50%; border: none; background-color: #332616; color: white; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                    
                    <span id="quantidade-produto-modal" 
                          style="font-weight: bold; font-size: 1rem; min-width: 20px; text-align: center;">${produtoAtual.quantidade}</span>
                    
                    <button class="botao-quantidade-pequeno" 
                            onclick="alterarQuantidadeProduto(1)"
                            style="width: 30px; height: 30px; border-radius: 50%; border: none; background-color: #332616; color: white; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">+</button>
                </div>
            </div>
        </div>
        
        <div id="secao-opcionais-dinamica">
            ${gerarHTMLSecaoOpcionais(produto)}
        </div>
        
        <div id="container-subtotal-produto" class="moldura-padrao-modal ${produtoAtual.quantidade > 0 ? 'visivel' : 'escondido'}" style="background-color: #e8e8e8 !important;">
            <div class="linha-flex-modal">
                <span class="subtitulo-subtotal">SUBTOTAL DO ITEM</span>
                <span id="valor-subtotal-produto" class="valor-subtotal">${formatarMoeda(calcularSubtotalProduto())}</span>
            </div>
        </div>
    `;

    verificarVisibilidadeBotoesModal();
}

// ===================== FUNÇÕES DE CONTROLE (Mantidas do original) =====================

function alterarQuantidadeProduto(valor) {
    const novaQuantidade = Math.max(0, (produtoAtual.quantidade || 0) + valor);
    if (novaQuantidade === produtoAtual.quantidade) return;

    produtoAtual.quantidade = novaQuantidade;

    if (produtoAtual.quantidade === 0) {
        produtoAtual.opcionais = {};
    }

    // Re-renderiza o modal inteiro para atualizar estados
    const produtoBase = dadosIniciais.secoes[produtoAtual.indiceSessao].itens[produtoAtual.indiceItem];
    renderizarModalProduto(produtoBase);
    
    // Sincroniza
    sincronizarProdutoNoCarrinho();
}

function calcularSubtotalProduto() {
    const produto = dadosIniciais.secoes[produtoAtual.indiceSessao].itens[produtoAtual.indiceItem];
    let subtotal = produto.preco * produtoAtual.quantidade;
    
    for (let nomeOpcional in produtoAtual.opcionais) {
        const opcional = produtoAtual.opcionais[nomeOpcional];
        subtotal += opcional.quantidade * opcional.preco;
    }
    return subtotal;
}

function verificarVisibilidadeBotoesModal() {
    const qtd = produtoAtual.quantidade;
    const btnBege = document.getElementById('botao-adicionar-simples');
    const btnVerde = document.getElementById('botao-adicionar-e-ir-para-carrinho');

    if (btnVerde) btnVerde.style.display = (qtd > 0) ? 'flex' : 'none';
    if (btnBege) btnBege.style.display = 'flex';
}

function adicionarItemAoCarrinho() {
    if (produtoAtual.quantidade === 0) {
        alert('Adicione pelo menos 1 item antes de continuar.');
        return;
    }
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
    if (produtoAtual.quantidade > 0) {
        carrinho[produtoAtual.identificador] = JSON.parse(JSON.stringify(produtoAtual));
    } else {
        delete carrinho[produtoAtual.identificador];
    }
    salvarCarrinho();
    atualizarBarraCarrinho();
    
    if (typeof atualizarBadgeNoCard === 'function') {
        atualizarBadgeNoCard(produtoAtual.indiceSessao, produtoAtual.indiceItem);
    }
}

function removerItemDoCarrinho(identificador) {
    delete carrinho[identificador];
    salvarCarrinho();
    if (typeof renderizarCarrinho === 'function') renderizarCarrinho();
    atualizarBarraCarrinho();
    if (typeof atualizarBadgesAposRemocao === 'function') atualizarBadgesAposRemocao();
}

// Helper para alinhamento (caso necessário)
function ajustarAlinhamentoOpcionais() {
    // Mantido por compatibilidade, mas o CSS original já deve resolver
}

// ===================== EXPORTAÇÕES GLOBAIS =====================
window.configurarProduto = configurarProduto;
window.renderizarModalProduto = renderizarModalProduto;
window.alterarQuantidadeProduto = alterarQuantidadeProduto;
window.gerarHTMLSecaoOpcionais = gerarHTMLSecaoOpcionais;
window.adicionarItemAoCarrinho = adicionarItemAoCarrinho;
window.adicionarEIrParaCarrinho = adicionarEIrParaCarrinho;
window.removerItemDoCarrinho = removerItemDoCarrinho;
window.ajustarAlinhamentoOpcionais = ajustarAlinhamentoOpcionais;