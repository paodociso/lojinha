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

let cesta = {}; 

// Adicione junto às suas globais
let appState = {
    formaPgto: null,
    totalGeral: 0
};

// --- 2. INICIALIZAÇÃO ---
window.onload = () => render();

function render() {
    const container = el('app-container');
    if (!container) return;
    
    let html = "";
    dadosIniciais.secoes.forEach((secao, sIdx) => {
        html += `
            <div class="titulo-secao-wrapper">
                <div class="linha-solida"></div>
                <h2 class="titulo-secao">${secao.nome}</h2>
                <div class="linha-solida"></div>
            </div>
            <div class="grid-produtos">`;
            
        secao.itens.forEach((item, iIdx) => {
            html += `
                <div class="card" onclick="configurarProduto(${sIdx}, ${iIdx})">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="card-content">
                        <div class="card-nome">${item.nome}</div>
                        <hr class="divisor-card">
                        <div class="card-desc">${item.descricao}</div>
                        <hr class="divisor-card">
                        <div class="card-footer">
                            <span class="card-preco">${fmtMoeda(item.preco)}</span>
                        </div>
                    </div>
                </div>`;
        });
        html += `</div>`;
    });
    container.innerHTML = html;
}

// --- 3. CONTROLE DOS MODAIS ---

function abrirModal(id) {
    if(el(id)) el(id).style.display = 'block';
    if(el('modal-overlay')) el('modal-overlay').style.display = 'block';
}

function fecharModal(id) {
    if(el(id)) el(id).style.display = 'none';
    if(el('modal-overlay')) el('modal-overlay').style.display = 'none';
}

function fecharModalTudo() {
    // Certifique-se de que todos os IDs aqui batem com os do seu HTML
    const modais = ['modalProduto', 'modalCesta', 'modalDadosDoCliente', 'modalFormaDePagamento'];
    modais.forEach(id => { 
        if(el(id)) el(id).style.display = 'none'; 
    });
    if(el('modal-overlay')) el('modal-overlay').style.display = 'none';
}

// --- 4. LÓGICA DO PRODUTO (MODAL 5.1) - VERSÃO FINAL CORRIGIDA ---
function configurarProduto(sIdx, iIdx) {
    const produto = dadosIniciais.secoes[sIdx].itens[iIdx];
    
    itemAtual = {
        sessaoIndex: sIdx,
        itemIndex: iIdx,
        id: produto.id || `item-${sIdx}-${iIdx}`,
        qtd: 0,
        opcionais: {}
    };

    const corpo = el('corpoModalProduto');
    
    let htmlOpcionais = "";
    const listaOpcionais = dadosIniciais.opcionais[produto.opcionais] || [];

    if (listaOpcionais.length > 0) {
        htmlOpcionais = `
            <div id="container-opcionais" style="display:none; margin-top:15px; padding:15px; border:1px solid #eee; border-radius:12px; background:#f9f9f9;">
                <h4 style="font-size: 0.9rem; font-weight: 900; margin-bottom:10px; color:#333; text-align:center; text-transform:uppercase;">OPCIONAIS</h4>
                <hr style="border:0; border-top:1px solid #ddd; margin-bottom:15px;">
        `;
        
        listaOpcionais.forEach(opc => {
            const idOpc = opc.nome.replace(/\s+/g, '');
            htmlOpcionais += `
                <div class="linha-opcional" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <div class="opc-info">
                        <div style="font-size:1rem; font-weight:normal; color:#111;">${opc.nome}</div>
                        <div style="font-size:0.85rem; font-weight:bold; color:var(--verde-militar);">${fmtMoeda(opc.preco)}</div>
                    </div>
                    <div class="opc-controles">
                        <button type="button" class="btn-qtd-moderno" onclick="alterarQtdOpcional('${opc.nome}', ${opc.preco}, -1)">-</button>
                        <span id="qtd-opc-${idOpc}" style="font-weight:900; min-width:25px; text-align:center; color:#111;">0</span>
                        <button type="button" class="btn-qtd-moderno" onclick="alterarQtdOpcional('${opc.nome}', ${opc.preco}, 1)">+</button>
                    </div>
                </div>`;
        });
    }

    corpo.innerHTML = `
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <div style="width: 200px; height: 200px; border: 1px solid #eee; border-radius: 12px; overflow: hidden; background: #fff; padding: 5px;">
                <img src="${produto.imagem}" alt="${produto.nome}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            </div>
        </div>

        <div style="padding:15px; background:#f9f9f9; border-radius:12px; border:1px solid #eee; margin-bottom:15px;">
            <h2 style="font-size:0.95rem; font-weight:900; text-transform:uppercase; color:#000; margin:0;">${produto.nome}</h2>
            <p style="font-size:0.85rem; color:#444; margin-top:8px; line-height:1.4; font-weight:500;">${produto.descricao}</p>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 15px; background:#f9f9f9; border-radius:12px; border:1px solid #eee;">
            <div style="font-size:1.4rem; font-weight:900; color:var(--verde-militar);">
                ${fmtMoeda(produto.preco)}
            </div>
            
            <div style="display:flex; align-items:center; gap:12px;">
                <button class="btn-qtd-moderno" onclick="atualizarQtdPrincipal(-1)">-</button>
                <span id="qtd-display-principal" style="font-size:1.3rem; font-weight:900; min-width:25px; text-align:center; color:#000;">0</span>
                <button class="btn-qtd-moderno" onclick="atualizarQtdPrincipal(1)">+</button>
            </div>
        </div>

        ${htmlOpcionais}

        <div id="frame-subtotal" style="background:#ffeded; padding:12px; border-radius:12px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:15px 0; border:1px solid #ffcccc;">
            <span style="font-size:0.7rem; color:#cc0000; letter-spacing:1px; font-weight:bold; text-transform:uppercase;">SUBTOTAL DO ITEM</span>
            <span id="valor-subtotal-display" style="font-size:1.4rem; font-weight:900; color:#cc0000;">R$ 0,00</span>
        </div>

        <button class="btn-acao-cesta secundario" onclick="fecharModal('modalProduto')">+ ADICIONAR MAIS +</button>
        <button class="btn-acao-cesta primario" onclick="abrirCesta()">VER CESTA DE COMPRAS ></button>
    `;

    abrirModal('modalProduto');
}

function atualizarQtdPrincipal(val) {
    let novaQtd = itemAtual.qtd + val;
    if (novaQtd < 0) return;

    itemAtual.qtd = novaQtd;
    el('qtd-display-principal').innerText = novaQtd;

    const containerOpc = el('container-opcionais');
    if (containerOpc) {
        containerOpc.style.display = novaQtd > 0 ? 'block' : 'none';
    }

    sincronizarCesta();
    recalcularSubtotal();
}

function alterarQtdOpcional(nome, preco, val) {
    if (itemAtual.qtd === 0) return;
    if (!itemAtual.opcionais[nome]) itemAtual.opcionais[nome] = { qtd: 0, preco: preco };
    
    let novaQtd = itemAtual.opcionais[nome].qtd + val;
    if (novaQtd < 0) return;

    itemAtual.opcionais[nome].qtd = novaQtd;
    el(`qtd-opc-${nome.replace(/\s+/g, '')}`).innerText = novaQtd;

    if (itemAtual.opcionais[nome].qtd === 0) delete itemAtual.opcionais[nome];

    sincronizarCesta();
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

function sincronizarCesta() {
    const chave = itemAtual.id;
    if (itemAtual.qtd > 0) {
        // Cria uma cópia fiel do item atual para a cesta
        cesta[chave] = JSON.parse(JSON.stringify(itemAtual)); 
    } else {
        // Se a quantidade zerar, remove da cesta automaticamente
        delete cesta[chave];
    }
    
    // Atualiza a barra do carrinho (se ela existir no HTML)
    if (typeof atualizarBarraCarrinho === "function") {
        atualizarBarraCarrinho();
    }
}

function atualizarBarraCarrinho() {
    let total = 0;
    let qtdTotal = 0;
    
    Object.values(cesta).forEach(item => {
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

function abrirCesta() {
    fecharModal('modalProduto');
    renderizarCesta();
    abrirModal('modalCesta');
}

function renderizarCesta() {
    const corpoCesta = el('itensCesta');
    const itens = Object.values(cesta);
    let html = "";
    let totalProdutos = 0;

    if (itens.length === 0) {
        corpoCesta.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <p style="color:#888; font-weight:500;">Sua cesta está vazia no momento.</p>
                <button class="btn-acao-cesta primario" style="margin-top:20px;" onclick="fecharModal('modalCesta')">VOLTAR AO CARDÁPIO</button>
            </div>`;
        return;
    }

    html += `<h3 style="text-align:center; font-weight:900; text-transform:uppercase; color:var(--marrom-cafe); margin-bottom:20px; letter-spacing:1px;">Cesta de Compras</h3>`;

    // 1. LISTAGEM DE ITENS
    html += `<div style="background:#f9f9f9; padding:15px; border-radius:12px; border:1px solid #eee; margin-bottom:15px;">`;
    itens.forEach(item => {
        const prod = dadosIniciais.secoes[item.sessaoIndex].itens[item.itemIndex];
        let subtotalItem = prod.preco * item.qtd;
        let htmlOpc = "";
        Object.keys(item.opcionais).forEach(nome => {
            const opc = item.opcionais[nome];
            subtotalItem += (opc.qtd * opc.preco);
            htmlOpc += `<div style="font-size:0.8rem; color:#666; margin-left:10px;">+ ${opc.qtd}x ${nome}</div>`;
        });
        totalProdutos += subtotalItem;
        html += `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
                <div style="flex-grow:1;">
                    <div style="font-weight:900; color:#222; font-size:0.95rem;">${item.qtd}x ${prod.nome}</div>
                    ${htmlOpc}
                    <div style="font-weight:bold; color:var(--verde-militar); font-size:0.9rem; margin-top:4px;">${fmtMoeda(subtotalItem)}</div>
                </div>
                <button onclick="removerDaCesta('${item.id}')" class="btn-qtd-moderno" style="width:28px !important; height:28px !important; font-size:1rem !important; background:#ffeded !important; color:#cc0000 !important; box-shadow:none !important;">&times;</button>
            </div>`;
    });
    html += `</div>`;

    // 2. CAMPO DE CUPOM
    html += `
        <div style="background:#f9f9f9; padding:12px; border-radius:12px; border:1px solid #eee; margin-bottom:15px; display:flex; gap:10px; align-items:center;">
            <input type="text" id="input-cupom" placeholder="CUPOM DE DESCONTO" style="flex-grow:1; padding:10px; border-radius:8px; border:1px solid #ccc; font-size:0.8rem; font-weight:bold;">
            <button onclick="recalcularValoresCesta()" style="background:var(--marrom-cafe); color:white; border:none; padding:10px 15px; border-radius:8px; font-weight:900; font-size:0.75rem; cursor:pointer;">APLICAR</button>
        </div>
    `;

    // 3. OPÇÕES DE ENTREGA (Vazias por padrão)
    html += `
        <div style="background:#f9f9f9; padding:15px; border-radius:12px; border:1px solid #eee; margin-bottom:15px;">
            <p style="font-size:0.75rem; font-weight:900; color:#444; margin-bottom:10px; text-transform:uppercase; text-align:center;">Como deseja receber seu pedido?</p>
            <div style="display:flex; gap:10px; margin-bottom:15px;">
                <label style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px; border:1px solid #ccc; border-radius:8px; cursor:pointer; font-weight:900; font-size:0.7rem; background:white;">
                    <input type="radio" name="opcaoEntrega" value="entrega" onchange="recalcularValoresCesta()"> RECEBER EM CASA
                </label>
                <label style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px; border:1px solid #ccc; border-radius:8px; cursor:pointer; font-weight:900; font-size:0.7rem; background:white;">
                    <input type="radio" name="opcaoEntrega" value="retirada" onchange="recalcularValoresCesta()"> RETIRADA
                </label>
            </div>
            
            <div id="info-taxa-pontilhada" style="border: 2px dashed var(--borda-nav); padding: 10px; border-radius: 8px; text-align: center; font-size: 0.85rem; font-weight: bold; color: var(--marrom-detalhe); display:none;"></div>
        </div>
    `;

    html += `
        <div id="resumo-financeiro-cesta"></div>
        <button class="btn-acao-cesta primario" onclick="irParaCheckout()">PROSSEGUIR PARA O PAGAMENTO ></button>
        <button class="btn-acao-cesta secundario" onclick="fecharModal('modalCesta')">+ ADICIONAR MAIS ITENS</button>
    `;

    corpoCesta.innerHTML = html;
    recalcularValoresCesta(); // Inicia o resumo financeiro
}

function recalcularValoresCesta() {
    const itens = Object.values(cesta);
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

function removerDaCesta(id) {
    delete cesta[id];
    renderizarCesta();
    atualizarBarraCarrinho();
}

function irParaCheckout() {
    const radioSel = document.querySelector('input[name="opcaoEntrega"]:checked');
    if(!radioSel) {
        alert("Por favor, selecione se deseja Receber em Casa ou Retirada.");
        return;
    }

    const modo = radioSel.value;
    
    // Agora mostramos/escondemos o "wrapper-endereco" que contém o label e o input
    el('wrapper-endereco').style.display = (modo === 'retirada') ? 'none' : 'block';
    
    fecharModal('modalCesta');
    abrirModal('modalDadosDoCliente');
}

// 1. ESSA FUNÇÃO ENVIA PARA O GOOGLE (Adicione ao final do seu JS)
function salvarPedidoNaPlanilha(metodoPagamento) {
    const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbxnbNO1lc24JMIeEAOjS1tCUaYEGjTXuIKxH-FEvUxlRuVb5ov78j-_tDk_W77QgcVCRw/exec"; 

    const resumoItens = Object.values(cesta).map(item => {
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
    const radioSel = document.querySelector('input[name="opcaoEntrega"]:checked');
    const modoEntrega = radioSel ? radioSel.value : 'retirada';

    // Cálculo de Taxa e Desconto para o texto
    const taxa = (modoEntrega === 'entrega') ? 10 : 0;
    
    // Recuperar valor do desconto (lógica idêntica à da cesta)
    let desconto = 0;
    const cupomInput = el('input-cupom');
    const codigoDigitado = cupomInput ? cupomInput.value.trim().toLowerCase() : "";
    if (codigoDigitado && dadosIniciais.cupons) {
        const cupomEncontrado = dadosIniciais.cupons.find(c => c.codigo.toLowerCase() === codigoDigitado);
        if (cupomEncontrado) {
            // Cálculo simplificado para o texto
            let totalProds = 0;
            Object.values(cesta).forEach(item => {
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
    
    Object.values(cesta).forEach(item => {
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
    const tel = el('telefoneCliente').value.trim();
    const modoRadio = document.querySelector('input[name="opcaoEntrega"]:checked');
    
    if (!modoRadio) {
        alert("Selecione Entrega ou Retirada na cesta!");
        return;
    }

    const modo = modoRadio.value;
    const end = el('enderecoCliente').value.trim();

    if (!nome || !tel) {
        alert("Nome e WhatsApp são obrigatórios!");
        return;
    }

    if (modo === 'entrega' && !end) {
        alert("Informe o endereço para entrega!");
        return;
    }

    fecharModal('modalDadosDoCliente');
    abrirModal('modalFormaDePagamento');
    renderizarOpcoesPagamento(); // Essa função cria os botões de Pix, Cartão, etc.
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
    const container = el('resumo-financeiro-cesta');
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

    // Executa as duas ações
    salvarPedidoNaPlanilha(appState.formaPgto);
    enviarParaWhatsApp(appState.formaPgto);
}