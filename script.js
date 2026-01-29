// utilitários básicos
const el = id => document.getElementById(id);
const fmtMoeda = v => parseFloat(v).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'});

// --- 1. VARIÁVEIS GLOBAIS ---
let itemAtual = {
    id: null,
    sessaoIndex: null,
    itemIndex: null,
    qtd: 0,
    opcionais: {} 
};

let carrinho = {}; 

// Adicione junto às suas globais
let appState = {
    formaPgto: null,
    totalGeral: 0,
    modoEntrega: null // <--- Adicione isso
};

// --- 2. INICIALIZAÇÃO ---
window.onload = () => render();

function calcularDatasFornada(info) {
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    // 1. Data da Fornada (Lê o Ano-Mês-Dia)
    const dataF = new Date(info.dataISO + 'T12:00:00');
    const nomeDiaF = diasSemana[dataF.getDay()];
    const dataF_Formatada = `${dataF.getDate().toString().padStart(2, '0')}/${(dataF.getMonth() + 1).toString().padStart(2, '0')}`;

    // 2. Data Limite (Subtrai os dias de antecedência)
    const dataL = new Date(dataF);
    dataL.setDate(dataF.getDate() - info.diasAntecedencia);
    const nomeDiaL = diasSemana[dataL.getDay()];
    const dataL_Formatada = `${dataL.getDate().toString().padStart(2, '0')}/${(dataL.getMonth() + 1).toString().padStart(2, '0')}`;

    return {
        fornada: `${nomeDiaF}, ${dataF_Formatada}`,
        limite: `${nomeDiaL}, ${dataL_Formatada} às ${info.horaLimite}`
    };
}

function render() {
    // 1. ATUALIZAÇÃO AUTOMÁTICA DAS DATAS NO TOPO
    const info = dadosIniciais.fornada;
    // Aqui usamos a calculadora que você já tem no código
    const datas = calcularDatasFornada(info);

    const elFornada = el('txt-data-fornada');
    const elLimite = el('txt-limite-pedido');

    if (elFornada) {
            elFornada.style.textAlign = "center";
            elFornada.style.fontSize = "1.1rem"; 
            elFornada.style.lineHeight = "1.4";
            elFornada.style.color = "#4a4a4a"; // Cinza escuro unificado
            
            elFornada.innerHTML = `
                <span style="font-weight: 900; font-size: 0.8rem; display: block; text-transform: uppercase;">PRÓXIMA FORNADA</span>
                <span style="font-weight: 500; display: block;">${datas.fornada}</span>
            `;
        }

    if (elLimite) {
        elLimite.style.textAlign = "center";
        elLimite.style.fontSize = "0.9rem";
        elLimite.style.marginTop = "8px"; 
        elLimite.style.color = "#4a4a4a"; // Mesma cor do bloco de cima
        
        elLimite.innerHTML = `
            <span style="font-weight: 900; font-size: 0.75rem; display: block; text-transform: uppercase;">PEDIDOS ATÉ</span>
            <span style="font-weight: 500; display: block;">${datas.limite}</span>
        `;
    }

    // 2. RENDERIZAÇÃO DOS PRODUTOS
    const container = el('app-container');
    if (!container) return;
    
    let html = "";
    
    // Percorre as seções do seu dados.js
    dadosIniciais.secoes.forEach((secao, sIdx) => {
        html += `
            <div class="titulo-secao-wrapper">
                <div class="linha-solida"></div>
                <h2 class="titulo-secao">${secao.nome}</h2>
                <div class="linha-solida"></div>
            </div>
            <div class="grid-produtos">`;
            
        secao.itens.forEach((item, iIdx) => {
            const idBadge = `badge-prod-${sIdx}-${iIdx}`;
            const chave = `item-${sIdx}-${iIdx}`;
            const qtdNoCarrinho = carrinho[chave] ? carrinho[chave].qtd : 0;
            const displayBadge = qtdNoCarrinho > 0 ? 'flex' : 'none';

            html += `
                <div class="card" onclick="configurarProduto(${sIdx}, ${iIdx})">
                    <div class="card-imagem-wrapper" style="position: relative;">
                        <div id="${idBadge}" style="display:${displayBadge}; position:absolute; top:10px; right:10px; background:#2e7d32; color:white; width:30px; height:30px; border-radius:50%; align-items:center; justify-content:center; font-weight:900; font-size:0.9rem; z-index:10; box-shadow:0 2px 5px rgba(0,0,0,0.3); border: 2px solid white;">
                            ${qtdNoCarrinho}
                        </div>
                        <img src="${item.imagem}" alt="${item.nome}">
                    </div>
                    
                    <div class="card-content">
                        <div class="card-nome">${item.nome}</div>
                        <hr class="divisor-card">
                        <div class="card-desc">${item.descricao || ''}</div>
                        <div class="card-footer">
                            <span class="card-preco">${fmtMoeda(item.preco)}</span>
                        </div>
                    </div>
                </div>`;
        });
        html += `</div>`;
    });
    
    // Injeta o HTML gerado no container principal
    container.innerHTML = html;
}

// --- 3. CONTROLE DOS MODAIS ---

function abrirModal(id) {
    if (el(id)) {
        if (id === 'modalFornada') {
            const info = dadosIniciais.fornada;
            const datas = calcularDatasFornada(info);
            const elConteudo = el('conteudoFornada');

            if (elConteudo) {
                // Aqui injetamos as datas + o seu conteúdo original formatado
                elConteudo.innerHTML = `
                    <div style="text-align: center; margin-bottom: 20px; background: #fff4e5; padding: 15px; border-radius: 10px; border: 1px solid #ffe3bc;">
                        <span style="font-weight: 900; font-size: 0.8rem; display: block; text-transform: uppercase; color: #a35200;">PRÓXIMA FORNADA</span>
                        <span style="font-weight: 500; font-size: 1.1rem; display: block; color: #a35200; margin-bottom: 10px;">${datas.fornada}</span>
                        
                        <span style="font-weight: 900; font-size: 0.75rem; display: block; text-transform: uppercase; color: #a35200;">PEDIDOS ATÉ</span>
                        <span style="font-weight: 500; font-size: 1rem; display: block; color: #a35200;">${datas.limite}</span>
                    </div>

                    <div style="font-size: 0.95rem; color: #444;">
                        🥖 <b>Produção Artesanal:</b> Nossos pães são feitos com fermentação natural (Levain).<br><br>
                        ⏰ <b>Frescor:</b> Assamos tudo na manhã do dia da entrega.<br><br>
                        📦 <b>Pedidos:</b> Como nossa capacidade é limitada, encerramos as vendas assim que atingimos o limite da fornada.
                    </div>
                `;
            }
        }
        
        el(id).style.display = 'block';
        if (el('modal-overlay')) el('modal-overlay').style.display = 'block';
    }
}

function fecharModal(id) {
    if(el(id)) el(id).style.display = 'none';
    if(el('modal-overlay')) el('modal-overlay').style.display = 'none';
}

function fecharModalTudo() {
    // 1. Esconde o fundo escuro
    if (el('modal-overlay')) el('modal-overlay').style.display = 'none';

    // 2. Busca TODOS os elementos que têm a classe "modal" e esconde cada um deles
    const todosModais = document.querySelectorAll('.modal');
    todosModais.forEach(modal => {
        modal.style.display = 'none';
    });
}

// --- 4. LÓGICA DO PRODUTO (MODAL 5.1) - VERSÃO FINAL CORRIGIDA ---
function configurarProduto(sIdx, iIdx) {
    const produto = dadosIniciais.secoes[sIdx].itens[iIdx];
    const chave = produto.id || `item-${sIdx}-${iIdx}`;
    
    // Mantém o estado do carrinho para o item
    if (carrinho[chave]) {
        itemAtual = JSON.parse(JSON.stringify(carrinho[chave]));
    } else {
        itemAtual = {
            sessaoIndex: sIdx,
            itemIndex: iIdx,
            id: chave,
            qtd: 0,
            opcionais: {}
        };
    }

    const corpo = el('corpoModalProduto');
    let listaParaExibir = [];

    // --- LÓGICA DE PRIORIDADE ---
    // 1. Tenta usar os opcionais escolhidos no painel (opcionais_ativos)
    if (produto.opcionais_ativos && produto.opcionais_ativos.length > 0) {
        produto.opcionais_ativos.forEach(nomeOpc => {
            // Varre o banco de dados global para achar o preço de cada nome
            for (let cat in dadosIniciais.opcionais) {
                const busca = dadosIniciais.opcionais[cat].find(o => o.nome === nomeOpc);
                if (busca) {
                    listaParaExibir.push(busca);
                    break;
                }
            }
        });
    } 
    // 2. Se não houver ativos, usa a categoria antiga (compatibilidade)
    else if (produto.opcionais && dadosIniciais.opcionais[produto.opcionais]) {
        listaParaExibir = dadosIniciais.opcionais[produto.opcionais];
    }

    let htmlOpcionais = "";
    if (listaParaExibir.length > 0) {
        htmlOpcionais = `
            <div id="container-opcionais" style="display: ${itemAtual.qtd > 0 ? 'block' : 'none'}; margin-top:15px; padding:15px; border:1px solid #eee; border-radius:12px; background:#f9f9f9;">
                <h4 style="font-size: 0.9rem; font-weight: 900; margin-bottom:10px; color:#333; text-align:center; text-transform:uppercase;">OPCIONAIS</h4>
                <hr style="border:0; border-top:1px solid #ddd; margin-bottom:15px;">
        `;
        
        listaParaExibir.forEach(opc => {
            const idOpc = opc.nome.replace(/\s+/g, '');
            const qtdOpcSalva = itemAtual.opcionais[opc.nome] ? itemAtual.opcionais[opc.nome].qtd : 0;
            
            htmlOpcionais += `
                <div class="linha-opcional" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div class="opc-info">
                        <div style="font-size:1rem; font-weight:normal; color:#111;">${opc.nome}</div>
                        <div style="font-size:0.85rem; font-weight:bold; color:var(--verde-militar);">${fmtMoeda(opc.preco)}</div>
                    </div>
                    <div class="opc-controles">
                        <button type="button" class="btn-qtd-moderno" onclick="alterarQtdOpcional('${opc.nome}', ${opc.preco}, -1)">-</button>
                        <span id="qtd-opc-${idOpc}" style="font-weight:900; min-width:25px; text-align:center; color:#111;">${qtdOpcSalva}</span>
                        <button type="button" class="btn-qtd-moderno" onclick="alterarQtdOpcional('${opc.nome}', ${opc.preco}, 1)">+</button>
                    </div>
                </div>`;
        });
        htmlOpcionais += `</div>`;
    }

    // Renderização do HTML do Modal
    corpo.innerHTML = `
        <div id="status-adicionado" style="display: ${itemAtual.qtd > 0 ? 'block' : 'none'}; text-align:center; background:#e8f5e9; color:#2e7d32; padding:8px; border-radius:8px; font-weight:bold; margin-bottom:10px;">✓ Item adicionado</div>
        
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <div style="width: 200px; height: 200px; border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: #fff; padding: 5px;">
                <img src="${produto.imagem}" alt="${produto.nome}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            </div>
        </div>

        <div style="padding:15px; background:#f9f9f9; border-radius:12px; border:1px solid #eee; margin-bottom:15px;">
            <h2 style="font-size:0.95rem; font-weight:900; text-transform:uppercase; color:#000; margin:0;">${produto.nome}</h2>
            <p style="font-size:0.85rem; color:#444; margin-top:8px; line-height:1.4; font-weight:500;">${produto.descricao || ''}</p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; background:#f9f9f9; border-radius:12px; border:1px solid #eee;">
            <div style="font-size:1.4rem; font-weight:900; color:var(--verde-militar);">${fmtMoeda(produto.preco)}</div>
            <div style="display:flex; align-items:center; gap:12px;">
                <button class="btn-qtd-moderno" onclick="atualizarQtdPrincipal(-1)">-</button>
                <span id="qtd-display-principal" style="font-size:1.3rem; font-weight:900; min-width:25px; text-align:center; color:#000;">${itemAtual.qtd}</span>
                <button class="btn-qtd-moderno" onclick="atualizarQtdPrincipal(1)">+</button>
            </div>
        </div>

        ${htmlOpcionais}

        <div id="frame-subtotal" style="background:#ffeded; padding:12px; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:15px 0; border:1px solid #ffcccc;">
            <span style="font-size:0.7rem; color:#cc0000; letter-spacing:1px; font-weight:bold; text-transform:uppercase;">SUBTOTAL DO ITEM</span>
            <span id="valor-subtotal-display" style="font-size:1.4rem; font-weight:900; color:#cc0000;">${fmtMoeda(0)}</span>
        </div>
    `;

    abrirModal('modalProduto');
    recalcularSubtotal();
    atualizarBotaoCesta();
}

function atualizarQtdPrincipal(val) {
    let novaQtd = itemAtual.qtd + val;
    if (novaQtd < 0) return;

    itemAtual.qtd = novaQtd;
    el('qtd-display-principal').innerText = novaQtd;

    // 1. Notificação de texto no Modal
    const msgStatus = el('status-adicionado');
    if (msgStatus) msgStatus.style.display = novaQtd > 0 ? 'block' : 'none';

    // 2. Atualiza o Círculo de Quantidade no Card do Produto
    const idBadge = `badge-prod-${itemAtual.sessaoIndex}-${itemAtual.itemIndex}`;
    const badge = el(idBadge);
    if (badge) {
        if (novaQtd > 0) {
            badge.innerText = novaQtd;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    const containerOpc = el('container-opcionais');
    if (containerOpc) {
        containerOpc.style.display = novaQtd > 0 ? 'block' : 'none';
    }

    // --- O AJUSTE ESTÁ AQUI ---
    sincronizarCarrinho(); // Adicione esta linha para o item entrar no carrinho global e ativar a barra!
    // --------------------------
    
    recalcularSubtotal();
    atualizarBotaoCesta(); 
}

function alterarQtdOpcional(nome, preco, val) {
    if (itemAtual.qtd === 0) return;
    if (!itemAtual.opcionais[nome]) itemAtual.opcionais[nome] = { qtd: 0, preco: preco };
    
    let novaQtd = itemAtual.opcionais[nome].qtd + val;
    if (novaQtd < 0) return;

    itemAtual.opcionais[nome].qtd = novaQtd;
    el(`qtd-opc-${nome.replace(/\s+/g, '')}`).innerText = novaQtd;

    if (itemAtual.opcionais[nome].qtd === 0) delete itemAtual.opcionais[nome];

    sincronizarCarrinho();
    recalcularSubtotal();
}

function recalcularSubtotal() {
    const produto = dadosIniciais.secoes[itemAtual.sessaoIndex].itens[itemAtual.itemIndex];
    let somaOpcionais = 0;
    for (let k in itemAtual.opcionais) {
        somaOpcionais += itemAtual.opcionais[k].qtd * itemAtual.opcionais[k].preco;
    }
    let subtotal = (produto.preco * itemAtual.qtd) + somaOpcionais;
    el('valor-subtotal-display').innerText = fmtMoeda(subtotal);
}

// --- 5. LÓGICA DA CESTA E BARRA ---

function sincronizarCarrinho() {
    const chave = itemAtual.id;
    if (itemAtual.qtd > 0) {
        // Cria uma cópia fiel do item atual para a carrinho
        carrinho[chave] = JSON.parse(JSON.stringify(itemAtual)); 
    } else {
        // Se a quantidade zerar, remove da carrinho automaticamente
        delete carrinho[chave];
    }
    
    // Atualiza a barra do carrinho (se ela existir no HTML)
    if (typeof atualizarBarraCarrinho === "function") {
        atualizarBarraCarrinho();
    }
}

function atualizarBarraCarrinho() {
    let total = 0;
    let qtdTotal = 0;
    
    Object.values(carrinho).forEach(item => {
        const prod = dadosIniciais.secoes[item.sessaoIndex].itens[item.itemIndex];
        let somaOpc = 0;
        Object.values(item.opcionais).forEach(o => somaOpc += (o.qtd * o.preco));
        total += (prod.preco * item.qtd) + somaOpc;
        qtdTotal += item.qtd;
    });

    if (qtdTotal > 0) {
        el('barra-carrinho').style.display = 'flex';
        el('resumo-qtd').innerText = `${qtdTotal} itens`;
        el('resumo-total').innerText = fmtMoeda(total);
    } else {
        el('barra-carrinho').style.display = 'none';
    }
}

function abrirCarrinho() {
    fecharModal('modalProduto');
    renderizarCarrinho();
    abrirModal('modalCarrinho');
}

/**
 * 1. GERADOR DE HTML: LISTAGEM DE ITENS
 * Esta função é focada apenas em percorrer o objeto 'carrinho' e transformar 
 * os dados (nome, preço, opcionais) em HTML visual. 
 * Ela não toma decisões, apenas "desenha" os itens.
 */
function gerarHtmlListaItens(itens) {
    // Iniciamos o container cinza que agrupa todos os produtos
    let html = `<div style="background:#f9f9f9; padding:15px; border-radius:12px; border:1px solid #eee; margin-bottom:15px;">`;
    
    itens.forEach(item => {
        // Buscamos os dados originais do produto (como nome e imagem) no banco dadosIniciais
        const prod = dadosIniciais.secoes[item.sessaoIndex].itens[item.itemIndex];
        let subtotalItem = prod.preco * item.qtd;
        let htmlOpc = "";
        
        // Loop interno: se houver opcionais, somamos o valor e criamos as linhas de texto
        Object.keys(item.opcionais).forEach(nome => {
            const opc = item.opcionais[nome];
            subtotalItem += (opc.qtd * opc.preco);
            htmlOpc += `<div style="font-size:0.8rem; color:#666; margin-left:10px;">+ ${opc.qtd}x ${nome}</div>`;
        });

        // Montamos a linha do produto com nome, opcionais, preço e o botão de remover (X)
        html += `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div style="flex-grow:1;">
                    <div style="font-weight:900; color:#222; font-size:0.95rem;">${item.qtd}x ${prod.nome}</div>
                    ${htmlOpc}
                    <div style="font-weight:bold; color:var(--verde-militar); font-size:0.9rem; margin-top:4px;">${fmtMoeda(subtotalItem)}</div>
                </div>
                <button onclick="removerDaCarrinho('${item.id}')" class="btn-qtd-moderno" style="width:28px!important; height:28px!important; background:#ffeded!important; color:#cc0000!important; border:none; cursor:pointer;">&times;</button>
            </div>`;
    });
    
    html += `</div>`;
    return html; // Retorna todo o bloco pronto para a função principal
}

/**
 * 2. GERADOR DE HTML: BLOCO DE INTERAÇÃO (CUPOM E ENTREGA)
 * Esta função retorna o HTML das configurações do pedido. 
 * Ela isola a parte onde o usuário escolhe como receber e aplica cupons.
 */
function gerarHtmlOpcoesCarrinho() {
    return `
        <div style="background:#f9f9f9; padding:12px; border-radius:12px; border:1px solid #eee; margin-bottom:15px; display:flex; gap:10px; align-items:center;">
            <input type="text" id="input-cupom" placeholder="CUPOM DE DESCONTO" style="flex-grow:1; padding:10px; border-radius:8px; border:1px solid #ccc; font-size:0.8rem; font-weight:bold;">
            <button onclick="recalcularValoresCarrinho()" style="background:var(--marrom-cafe); color:white; border:none; padding:10px 15px; border-radius:8px; font-weight:900; font-size:0.75rem; cursor:pointer;">APLICAR</button>
        </div>

        <div style="background:#f9f9f9; padding:15px; border-radius:12px; border:1px solid #eee; margin-bottom:15px;">
            <p style="font-size:0.75rem; font-weight:900; color:#444; margin-bottom:10px; text-transform:uppercase; text-align:center;">Como deseja receber seu pedido?</p>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <label style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px; border:1px solid #ccc; border-radius:8px; cursor:pointer; font-weight:900; font-size:0.7rem; background:white;">
                    <input type="radio" name="opcaoEntrega" value="entrega" onchange="recalcularValoresCarrinho()"> RECEBER EM CASA
                </label>
                <label style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px; border:1px solid #ccc; border-radius:8px; cursor:pointer; font-weight:900; font-size:0.7rem; background:white;">
                    <input type="radio" name="opcaoEntrega" value="retirada" onchange="recalcularValoresCarrinho()"> RETIRADA
                </label>
            </div>
            <div id="info-taxa-pontilhada" style="border: 2px dashed var(--borda-nav); padding: 10px; border-radius: 8px; text-align: center; font-size: 0.85rem; font-weight: bold; color: var(--marrom-detalhe); display:none;"></div>
        </div>`;
}

/**
 * 3. FUNÇÃO PRINCIPAL: RENDERIZAR CARRINHO
 * É o cérebro que organiza tudo. Ela decide se mostra o aviso de "vazio"
 * ou se chama as funções acima para montar o carrinho completo.
 */
function renderizarCarrinho() {
    const corpoCarrinho = el('itensCarrinho'); // Alvo onde o HTML será injetado
    if (!corpoCarrinho) return;

    const itens = Object.values(carrinho); // Converte o objeto de itens em uma lista (array)

    // Caso de segurança: se o cliente remover tudo, mostra a mensagem de carrinho vazio
    if (itens.length === 0) {
        corpoCarrinho.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <p style="color:#888; font-weight:500;">Seu carrinho está vazio no momento.</p>
                <button class="btn-acao-carrinho primario" style="margin-top:20px;" onclick="fecharModal('modalCarrinho')">VOLTAR AO CARDÁPIO</button>
            </div>`;
        return;
    }

    // Título do Modal
    let htmlFinal = `<h3 style="text-align:center; font-weight:900; text-transform:uppercase; color:var(--marrom-cafe); margin-bottom:20px; letter-spacing:1px;">Carrinho de Compras</h3>`;
    
    // CHAMADA DOS COMPONENTES: Aqui juntamos as peças que criamos acima
    htmlFinal += gerarHtmlListaItens(itens);      
    htmlFinal += gerarHtmlOpcoesCarrinho();       
    
    // Adicionamos os botões finais e o container que receberá o valor total
    htmlFinal += `
        <div id="resumo-financeiro-carrinho"></div>
        <button class="btn-acao-carrinho btn-bege-personalizado" onclick="fecharModal('modalCarrinho')">+ ADICIONAR MAIS ITENS +</button>
        <button class="btn-acao-carrinho btn-verde-personalizado" onclick="irParaCheckout()">PROSSEGUIR PARA O PAGAMENTO ></button>
    `;

    // Injeta tudo de uma vez no HTML (mais rápido para o navegador)
    corpoCarrinho.innerHTML = htmlFinal;
    
    // Dispara o cálculo final de taxas e descontos para atualizar o 'resumo-financeiro-carrinho'
    if (typeof recalcularValoresCarrinho === "function") {
        recalcularValoresCarrinho();
    }
}

function recalcularValoresCarrinho() {
    const itens = Object.values(carrinho);
    let totalProdutos = 0;
    
    itens.forEach(item => {
        const prod = dadosIniciais.secoes[item.sessaoIndex].itens[item.itemIndex];
        let subtotalItem = (prod.preco * item.qtd);
        Object.values(item.opcionais).forEach(o => subtotalItem += (o.qtd * o.preco));
        totalProdutos += subtotalItem;
    });

    const radioSel = document.querySelector('input[name="opcaoEntrega"]:checked');
    const modoEntrega = radioSel ? radioSel.value : null;
    let taxa = (modoEntrega === 'entrega') ? 10 : 0;

    const cupomInput = el('input-cupom');
    const codigoDigitado = cupomInput ? cupomInput.value.trim().toLowerCase() : "";
    let desconto = 0;

    if (codigoDigitado && dadosIniciais.cupons) {
        const cupomEncontrado = dadosIniciais.cupons.find(c => c.codigo.toLowerCase() === codigoDigitado);
        if (cupomEncontrado) {
            desconto = cupomEncontrado.tipo === 'porcentagem' 
                ? totalProdutos * (cupomEncontrado.valor / 100) 
                : cupomEncontrado.valor;
        }
    }

    // ATUALIZA O ESTADO GLOBAL
    appState.totalGeral = (totalProdutos - desconto) + taxa;

    // Renderiza o resumo financeiro (mantenha seu código de innerHTML aqui...)
    renderizarResumoFinanceiro(totalProdutos, desconto, taxa, modoEntrega);
}

function removerDaCarrinho(id) {
    delete carrinho[id];
    renderizarCarrinho();
    atualizarBarraCarrinho();
}

function irParaCheckout() {
    const radioSel = document.querySelector('input[name="opcaoEntrega"]:checked');
    
    if(!radioSel) {
        alert("Por favor, selecione se deseja Receber em Casa ou Retirada.");
        return;
    }

    // 1. Atualiza o estado global
    appState.modoEntrega = radioSel.value;

    // 2. Prepara o visual do modal (mostra/esconde campos de endereço)
    renderizarCamposDadosCliente(); 
    
    // 3. Ativa a validação em tempo real 
    // DICA: O ideal é que esta função limpe ouvintes antigos ou verifique se já foi chamada
    configurarValidacaoRealTime();

    // 4. Faz a transição de modais
    fecharModal('modalCarrinho');
    abrirModal('modalDadosDoCliente');

    // 5. UX: Foca automaticamente no primeiro campo (Nome) para facilitar pro cliente
    setTimeout(() => {
        const inputNome = el('nomeCliente');
        if(inputNome) inputNome.focus();
    }, 300);
}

// 1. ESSA FUNÇÃO ENVIA PARA O GOOGLE (Adicione ao final do seu JS)
function salvarPedidoNaPlanilha(metodoPagamento) {
    const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbxnbNO1lc24JMIeEAOjS1tCUaYEGjTXuIKxH-FEvUxlRuVb5ov78j-_tDk_W77QgcVCRw/exec"; 

    const resumoItens = Object.values(carrinho).map(item => {
        const prod = dadosIniciais.secoes[item.sessaoIndex].itens[item.itemIndex];
        let info = `${item.qtd}x ${prod.nome}`;
        const nomesOpc = Object.keys(item.opcionais);
        if (nomesOpc.length > 0) {
            info += ` (${nomesOpc.map(n => `${item.opcionais[n].qtd} ${n}`).join(', ')})`;
        }
        return info;
    }).join(' | ');

    const dados = {
        data: new Date().toLocaleString('pt-BR'),
        nome: el('nomeCliente').value.trim(),
        whatsapp: el('telefoneCliente').value.trim(),
        endereco: el('enderecoCliente').value.trim() || "Retirada",
        pagamento: metodoPagamento,
        total: appState.totalGeral,
        itens: resumoItens
    };

    fetch(URL_PLANILHA, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
}

// 3. ESSA É A QUE VOCÊ JÁ TEM, MAS GARANTA QUE ELA ESTEJA ASSIM (Com emojis)
function enviarParaWhatsApp(metodoPagamento) {
    const nome = el('nomeCliente').value.trim();
    const tel = el('telefoneCliente').value.trim();
    const endereco = el('enderecoCliente').value.trim();
    const modoEntrega = appState.modoEntrega;

    // Cálculo de Taxa e Desconto para o texto
    const taxa = (modoEntrega === 'entrega') ? 10 : 0;
    
    // Recuperar valor do desconto (lógica idêntica à da carrinho)
    let desconto = 0;
    const cupomInput = el('input-cupom');
    const codigoDigitado = cupomInput ? cupomInput.value.trim().toLowerCase() : "";
    if (codigoDigitado && dadosIniciais.cupons) {
        const cupomEncontrado = dadosIniciais.cupons.find(c => c.codigo.toLowerCase() === codigoDigitado);
        if (cupomEncontrado) {
            // Cálculo simplificado para o texto
            let totalProds = 0;
            Object.values(carrinho).forEach(item => {
                const p = dadosIniciais.secoes[item.sessaoIndex].itens[item.itemIndex];
                totalProds += (p.preco * item.qtd);
                Object.values(item.opcionais).forEach(o => totalProds += (o.qtd * o.preco));
            });
            desconto = cupomEncontrado.tipo === 'porcentagem' ? totalProds * (cupomEncontrado.valor / 100) : cupomEncontrado.valor;
        }
    }

    let texto = "🍞 *NOVO PEDIDO - PÃO DO CISO*\n";
    texto += "--------------------------------\n";
    texto += "👤 *Cliente:* " + nome + "\n";
    texto += "📞 *WhatsApp:* " + tel + "\n";
    texto += "🛵 *Entrega:* " + (modoEntrega === 'entrega' ? 'Receber em Casa' : '🏠 Retirada') + "\n";
    
    if (modoEntrega === 'entrega') {
        texto += "📍 *Endereço:* " + endereco + "\n";
    }
    
    texto += "💳 *Pagamento:* " + metodoPagamento + "\n";
    texto += "--------------------------------\n\n";
    texto += "🛒 *ITENS DO PEDIDO:*\n";
    
    Object.values(carrinho).forEach(item => {
        const prod = dadosIniciais.secoes[item.sessaoIndex].itens[item.itemIndex];
        let subtotalItem = prod.preco * item.qtd;
        Object.values(item.opcionais).forEach(o => subtotalItem += (o.qtd * o.preco));
        texto += "✅ *" + item.qtd + "x " + prod.nome + "* (" + fmtMoeda(subtotalItem) + ")\n";
        Object.keys(item.opcionais).forEach(nomeOpc => {
            const opc = item.opcionais[nomeOpc];
            texto += "    └ " + opc.qtd + "x " + nomeOpc + "\n";
        });
    });

    texto += "\n--------------------------------\n";
    
    // --- ADIÇÃO DA TAXA E DESCONTO NO TEXTO ---
    if (taxa > 0) texto += "🛵 *Taxa de Entrega:* " + fmtMoeda(taxa) + "\n";
    if (desconto > 0) texto += "🏷️ *Desconto Cupom:* -" + fmtMoeda(desconto) + "\n";
    
    texto += "💰 *TOTAL FINAL: " + fmtMoeda(appState.totalGeral) + "*\n";
    texto += "--------------------------------\n";
    texto += "_Pedido gerado pelo catálogo virtual_";

    window.open("https://api.whatsapp.com/send?phone=5511982391781&text=" + encodeURIComponent(texto), '_blank');
}

function validarDadosCliente() {
    const nome = el('nomeCliente').value.trim();
    const telRaw = el('telefoneCliente').value.replace(/\D/g, '');
    const dddsValidos = ["11", "12", "13", "14", "15", "16", "17", "18", "19"];

    // 1. Validação de Nome
    if (nome.length < 3) {
        alert("Por favor, digite seu nome completo.");
        el('nomeCliente').focus();
        return;
    }

    // 2. Validação de Telefone (Trava de 11 dígitos)
    if (telRaw.length !== 11) {
        alert("O WhatsApp deve ter exatamente 11 números (DDD + Número).");
        el('telefoneCliente').focus();
        return;
    }
    if (!dddsValidos.includes(telRaw.substring(0, 2))) {
        alert("Por favor, use um DDD válido de SP (11 a 19).");
        return;
    }

    let enderecoFinal = "Retirada no Local";

    // 3. Validação de Endereço Detalhado (Se for Entrega)
    if (appState.modoEntrega === 'entrega') {
        const cep = el('cepCliente').value.trim();
        const rua = el('ruaCliente').value.trim();
        const num = el('numCliente').value.trim();
        const comp = el('compCliente').value.trim();
        const ref = el('refCliente').value.trim();

        if (cep.length < 8 || rua === "" || num === "") {
            alert("Para entrega, os campos CEP, Rua e Número são obrigatórios.");
            return;
        }

        // Monta a frase que será enviada no WhatsApp/Planilha
        enderecoFinal = `${rua}, nº ${num}${comp ? ' ('+comp+')' : ''} - CEP: ${cep}${ref ? ' [Ref: '+ref+']' : ''}`;
    }

    // 4. Sincronização com o campo oculto (que o restante do script usa)
    if(!el('enderecoCliente')) {
        const input = document.createElement('input');
        input.id = 'enderecoCliente';
        input.type = 'hidden';
        document.body.appendChild(input);
    }
    el('enderecoCliente').value = enderecoFinal;

    // 5. Avançar para o pagamento
    fecharModal('modalDadosDoCliente');
    abrirModal('modalFormaDePagamento');

    // Atualiza o valor do PIX caso a função exista
    if (typeof renderizarOpcoesPagamento === 'function') {
        renderizarOpcoesPagamento();
    }
}

function selPgto(tipo, elemento) {
    appState.formaPgto = tipo;

    document.querySelectorAll('.opcao-pagamento').forEach(opt => {
        opt.style.borderColor = "#eee";
        opt.style.background = "#fff";
        const frame = opt.querySelector('.pagamento-info-frame');
        if (frame) frame.style.display = 'none';
    });

    elemento.style.borderColor = "var(--marrom-cafe)";
    elemento.style.background = "#fdfaf7";
    const infoFrame = elemento.querySelector('.pagamento-info-frame');
    if (infoFrame) infoFrame.style.display = 'block';

    if (tipo === 'Pix') {
        const txtValor = el('pix-valor-txt');
        if (txtValor) txtValor.innerText = fmtMoeda(appState.totalGeral);
    }
}

function copiarPix() {
    const texto = "paodociso@gmail.com";
    navigator.clipboard.writeText(texto).then(() => {
        const aviso = el('aviso-copiado');
        if (aviso) {
            aviso.style.display = 'block';
            setTimeout(() => { aviso.style.display = 'none'; }, 2500);
        }
    });
}


function renderizarResumoFinanceiro(totalProdutos, desconto, taxa, modoEntrega) {
    const container = el('resumo-financeiro-carrinho');
    const containerTaxa = el('info-taxa-pontilhada');
    if (!container) return;

    // 1. Volta a exibir o aviso da taxa (pontilhado)
    if (containerTaxa) {
        if (modoEntrega) {
            containerTaxa.style.display = 'block';
            containerTaxa.innerText = modoEntrega === 'entrega' ? "Taxa de entrega: R$ 10,00 🛵" : "Sem taxa de entrega";
        } else {
            containerTaxa.style.display = 'none';
        }
    }

    const totalGeral = (totalProdutos - desconto) + taxa;

    // 2. Renderiza o resumo
    container.innerHTML = `
        <div style="padding:5px 15px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#666; margin-bottom:5px;">
                <span>Produtos e Opcionais:</span>
                <span>${fmtMoeda(totalProdutos)}</span>
            </div>
            ${desconto > 0 ? `
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#cc0000; margin-bottom:5px;">
                <span>Desconto Cupom:</span>
                <span>- ${fmtMoeda(desconto)}</span>
            </div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#666; margin-bottom:5px;">
                <span>Taxa de Entrega:</span>
                <span>${modoEntrega ? (taxa === 0 ? 'Grátis' : fmtMoeda(taxa)) : '--'}</span>
            </div>
        </div>
        <div style="background:#ffeded; padding:15px; border-radius:12px; display:flex; flex-direction:column; align-items:center; border:1px solid #ffcccc; margin-bottom:20px;">
            <span style="font-size:0.7rem; color:#cc0000; letter-spacing:1px; font-weight:bold; text-transform:uppercase;">TOTAL DA CESTA</span>
            <span style="font-size:1.6rem; font-weight:900; color:#cc0000;">${fmtMoeda(totalGeral)}</span>
        </div>
    `;
}

// 3. O Botão chama esta (A ÚNICA)
function finalizarPedido() {
    if (!appState.formaPgto) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    // Feedback visual
    const btn = event.target; // O botão que foi clicado
    btn.innerHTML = 'ENVIANDO... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    // Executa as ações
    salvarPedidoNaPlanilha(appState.formaPgto);
    
    // Pequeno delay para o usuário ver que processou antes de abrir o Zap
    setTimeout(() => {
        enviarParaWhatsApp(appState.formaPgto);
        // Opcional: recarregar a página ou fechar tudo
        // location.reload(); 
    }, 1500);
}

// NOVAS FUNÇÕES

// --- FUNÇÕES DE CONTROLE DOS BOTÕES DO MODAL PRODUTO ---

// Função para o botão bege "+ ADICIONAR MAIS ITENS +"
function adicionarMais() {
    // Se a quantidade for 0, adiciona ao menos 1 para não ir vazio
    if (itemAtual.qtd === 0) {
        atualizarQtdPrincipal(1);
    }
    
    // Salva o item no carrinho global
    carrinho[itemAtual.id] = JSON.parse(JSON.stringify(itemAtual));
    
    // Fecha o modal e volta para o cardápio
    fecharModal('modalProduto');
    
    // Atualiza os badges de quantidade no cardápio inicial
    render(); 
}

// Função para o botão verde "IR PARA A CESTA DE COMPRAS"
function irParaCesta() {
    // Garante que o item atual seja salvo antes de sair
    if (itemAtual.qtd === 0) {
        atualizarQtdPrincipal(1);
    }
    carrinho[itemAtual.id] = JSON.parse(JSON.stringify(itemAtual));
    
    // Fecha o modal de produto e abre o do carrinho
    fecharModal('modalProduto');
    abrirCarrinho();
}

// Função que controla se o botão verde aparece ou não
function atualizarBotaoCesta() {
    const btnCesta = el('btn-ir-cesta');
    if (!btnCesta) return;

    // O botão aparece se já houver algo no carrinho OU se o usuário aumentou a qtd deste item
    if (Object.keys(carrinho).length > 0 || itemAtual.qtd > 0) {
        btnCesta.style.display = 'block';
    } else {
        btnCesta.style.display = 'none';
    }
}

// ======== CRIAÇÃO DOS CONTAINERS PONTILHADOS DE SEUS DADOS =================== //

function renderizarCamposDadosCliente() {
    // Usamos o ID que está no seu HTML (wrapper-endereco)
    const wrapper = el('wrapper-endereco');
    if (!wrapper) return;

    if (appState.modoEntrega === 'entrega') {
        wrapper.style.display = 'block';
    } else {
        wrapper.style.display = 'none';
    }
}

async function buscarCEP(valor) {
    const cep = valor.replace(/\D/g, '');
    if (cep.length !== 8) return;
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await response.json();
        if (!dados.erro) {
            el('ruaCliente').value = `${dados.logradouro}, ${dados.bairro} - ${dados.localidade}/${dados.uf}`;
            el('numCliente').focus();
        }
    } catch (e) { console.error("Erro CEP"); }
}

function validarDadosCliente() {
    const nome = el('nomeCliente').value.trim();
    const telRaw = el('telefoneCliente').value.replace(/\D/g, '');
    const dddsValidos = ["11", "12", "13", "14", "15", "16", "17", "18", "19"];

    // 1. Validação de Nome
    if (nome.length < 3) {
        alert("Por favor, digite seu nome completo.");
        el('nomeCliente').focus();
        return;
    }

    // 2. Validação de Telefone (11 dígitos)
    if (telRaw.length !== 11) {
        alert("O WhatsApp deve ter exatamente 11 números (DDD + Número).");
        el('telefoneCliente').focus();
        return;
    }
    if (!dddsValidos.includes(telRaw.substring(0, 2))) {
        alert("Por favor, use um DDD válido de SP (11 a 19).");
        return;
    }

    let enderecoFinal = "Retirada no Local";

    // 3. Validação de Endereço (Só se for Entrega)
    if (appState.modoEntrega === 'entrega') {
        const cep = el('cepCliente').value.trim();
        const rua = el('ruaCliente').value.trim();
        const num = el('numCliente').value.trim();
        const comp = el('compCliente').value.trim();
        const ref = el('refCliente').value.trim();

        if (cep.length < 8 || rua === "" || num === "") {
            alert("Para entrega, os campos CEP, Rua e Número são obrigatórios.");
            return;
        }

        // Monta a string única que será usada no resumo do pedido
        enderecoFinal = `${rua}, nº ${num}${comp ? ' (' + comp + ')' : ''} - CEP: ${cep}${ref ? ' [Ref: ' + ref + ']' : ''}`;
    }

    // 4. Salva no campo oculto que o seu sistema de WhatsApp já utiliza
    const campoOculto = el('enderecoCliente');
    if (campoOculto) {
        campoOculto.value = enderecoFinal;
    }

    // 5. Avança para a próxima etapa
    fecharModal('modalDadosDoCliente');
    abrirModal('modalFormaDePagamento');

    // Atualiza o valor do PIX no próximo modal
    if (typeof renderizarOpcoesPagamento === 'function') {
        renderizarOpcoesPagamento();
    }
}

// Ativa a escuta de erros em tempo real
function configurarValidacaoRealTime() {
    const campos = [
        { id: 'nomeCliente', validar: v => v.trim().length >= 3, msg: "Digite seu nome completo." },
        { id: 'telefoneCliente', validar: v => v.replace(/\D/g, '').length === 11, msg: "O WhatsApp precisa de 11 números." },
        { id: 'cepCliente', validar: v => v.replace(/\D/g, '').length === 8, msg: "CEP inválido." },
        { id: 'ruaCliente', validar: v => v.trim().length > 3, msg: "Preencha a rua." },
        { id: 'numCliente', validar: v => v.trim().length > 0, msg: "Nº obrigatório." }
    ];

    campos.forEach(campo => {
        const input = el(campo.id);
        if (!input) return;

        // VALIDAÇÃO AO SAIR DO CAMPO (BLUR)
        input.addEventListener('blur', () => {
            const wrapperEndereco = el('wrapper-endereco');
            // Se o campo for de endereço mas o modo for retirada (escondido), ignora
            if (input.closest('#wrapper-endereco') && wrapperEndereco && wrapperEndereco.style.display === 'none') {
                return;
            }

            if (!campo.validar(input.value)) {
                input.style.borderColor = 'var(--red)';
                input.style.backgroundColor = '#fff0f0';
                console.log("Erro: " + campo.msg);
            } else {
                input.style.borderColor = '#ddd';
                input.style.backgroundColor = '#fdfdfd';
            }
        });
    });

    // MÁSCARA EM TEMPO REAL NO TELEFONE
    const inputTel = el('telefoneCliente');
    if (inputTel) {
        inputTel.addEventListener('input', (e) => {
            let num = e.target.value.replace(/\D/g, ""); // Pega só números
            if (num.length > 11) num = num.slice(0, 11); // Trava em 11
            e.target.value = aplicarMascaraTelefone(num); // Aplica a máscara (xx) x.xxxx.xxxx
        });
    }
}

function aplicarMascaraTelefone(valor) {
    if (!valor) return "";
    valor = valor.replace(/\D/g, ""); // Remove tudo que não é número
    
    // Aplica o formato: (XX) X.XXXX.XXXX
    if (valor.length > 0) valor = valor.replace(/^(\d{2})/, "($1) ");
    if (valor.length > 2) valor = valor.replace(/(\d{2})\s(\d{1})/, "($1) $2.");
    if (valor.length > 7) valor = valor.replace(/(\d{2})\s(\d{1})\.(\d{4})/, "($1) $2.$3.");
    
    return valor;
}