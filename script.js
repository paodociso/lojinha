// --- ESTADO GLOBAL ---
let appState = {
    carrinho: [],
    totalItens: 0,
    totalGeral: 0,
    taxaEntrega: 0,
    desconto: 0,
    cupomAtivo: null,
    pagamentoSel: "",
    user: { nome: "", tel: "", entrega: "", endereco: "" },
    ultimaMsg: ""
};

const el = id => document.getElementById(id);
const fmtMoeda = val => `R$ ${parseFloat(val || 0).toFixed(2)}`;

const fecharModais = () => {
    document.querySelectorAll('.modal-pedido, .modal-overlay, #modalImg').forEach(m => m.style.display = 'none');
};

// --- RENDERIZAÇÃO INICIAL (MANTIDA) ---
function render() {
    const saved = localStorage.getItem('paodociso_dados');
    if(saved) {
        const d = JSON.parse(saved);
        if(el('nomeCli')) el('nomeCli').value = d.nome || "";
        if(el('telCli')) el('telCli').value = d.tel || "";
    }
    
    if (typeof dadosIniciais !== 'undefined') {
        const { secoes } = dadosIniciais;
        el('render-cli').innerHTML = secoes.map((s, si) => {
            
            // Filtra itens ocultos (índice 6)
            const itensParaExibir = s.itens.filter(i => i[6] !== true);
            if (itensParaExibir.length === 0) return ""; 

            return `
                <div class="secao-titulo">${s.nome}</div>
                <div class="grid-produtos">
                    ${itensParaExibir.map((i, originalIndex) => {
                        const esgotado = i[5] === true;
                        
                        return `
                        <div class="card-quadrado ${esgotado ? 'card-esgotado' : ''}" 
                             onclick="${esgotado ? '' : `abrirDetalhes(${si}, ${originalIndex})`}">
                            
                            ${esgotado ? '<div class="selo-esgotado">ESGOTADO</div>' : ''}
                            
                            <div class="conteudo-card">
                                <img src="${i[3]}" class="img-grid">
                                <div class="info-grid">
                                    <div class="nome-grid">${i[0]}</div>
                                    <div class="preco-grid">${esgotado ? 'Indisponível' : fmtMoeda(i[2])}</div>
                                </div>
                            </div>
                        </div>
                    `;}).join('')}
                </div>`;
        }).join('');
    }
    atualizarTotais();
}

// --- LÓGICA DO PRODUTO (MODAL DETALHES - MANTIDA) ---
function abrirDetalhes(secaoIdx, itemIdx) {
    const produto = dadosIniciais.secoes[secaoIdx].itens[itemIdx];
    const nomeSecao = dadosIniciais.secoes[secaoIdx].nome;
    const modalConteudo = el('conteudo-produto-modal');
    
    let htmlOpcionais = "";
    if (produto[4] && produto[4].length > 0) {
        const chaveOpcionais = "opcionais" + nomeSecao;
        const listaPrecosOpcionais = dadosIniciais[chaveOpcionais] || [];

        // Alteração: menu-opc começa com display: none
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

    // Alteração: Frame da imagem quadrado com borda e margem (padding)
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

    el('modalOverlay').style.display = 'block';
    el('modalProduto').style.display = 'block';
}

function atualizarSubtotalItem(nome, precoBase) {
    const qtdPrincipal = parseInt(el('qtd-principal').value);
    let precoOpcionais = 0;
    document.querySelectorAll('.opc-qtd').forEach(input => {
        precoOpcionais += (parseFloat(input.dataset.preco) * parseInt(input.value));
    });

    const subtotal = (precoBase + precoOpcionais) * qtdPrincipal;
    const frame = el('sub-total-frame');
    const btnProsseguir = el('btn-modal-prosseguir');
    
    if (subtotal > 0) {
        frame.innerText = `Subtotal do item: ${fmtMoeda(subtotal)}`;
        frame.style.display = 'block';
        btnProsseguir.style.display = 'block';
    } else {
        frame.style.display = 'none';
        btnProsseguir.style.display = 'none';
    }

    appState.carrinho = appState.carrinho.filter(i => i.nome !== nome);
    if (qtdPrincipal > 0) {
        let opcs = [];
        document.querySelectorAll('.opc-qtd').forEach(input => {
            if(parseInt(input.value) > 0) {
                opcs.push({ nome: input.dataset.nome, qtd: parseInt(input.value), preco: parseFloat(input.dataset.preco) });
            }
        });
        appState.carrinho.push({ nome, preco: precoBase + precoOpcionais, qtd: qtdPrincipal, detalhes: opcs });
    }
    atualizarTotais();
}

function alterarQtdPrincipal(delta, nome, preco) {
    let input = el('qtd-principal');
    let menuOpc = el('menu-opc');
    let novaVal = parseInt(input.value) + delta;
    if (novaVal >= 0) {
        input.value = novaVal;
        
        // Regra solicitada: Só exibe os opcionais se a quantidade for pelo menos 1
        if (menuOpc) {
            if (novaVal >= 1) {
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

function alterarQtdOpcional(btn, delta, nome, preco) {
    const input = btn.parentElement.querySelector('.opc-qtd');
    let v = parseInt(input.value) + delta;
    if (v >= 0) {
        input.value = v;
        atualizarSubtotalItem(nome, preco);
    }
}

// --- ATUALIZAÇÃO DE TOTAIS (REVISADA COM RESUMO) ---
function atualizarTotais() {
    // 1. Cálculos de negócio
    const subtotalProd = appState.carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
    appState.desconto = appState.cupomAtivo ? (subtotalProd * (appState.cupomAtivo.porcentagem / 100)) : 0;
    appState.totalGeral = subtotalProd - appState.desconto + appState.taxaEntrega;
    appState.totalItens = appState.carrinho.reduce((acc, item) => acc + item.qtd, 0);

    // 2. Atualiza os textos da barra (IDs que estão no seu HTML)
    const valFormatado = fmtMoeda(appState.totalGeral);
    const qtdFormatada = `${appState.totalItens} ${appState.totalItens === 1 ? 'item' : 'itens'}`;

    // Atualiza o primeiro rodapé (cesta-rodape)
    if(el('count-txt')) el('count-txt').innerText = qtdFormatada;
    if(el('total-txt')) el('total-txt').innerText = valFormatado;

    // Atualiza o segundo rodapé (barra-carrinho)
    if(el('carrinho-qtd-fixo')) el('carrinho-qtd-fixo').innerText = qtdFormatada;
    if(el('carrinho-total-fixo')) el('carrinho-total-fixo').innerText = valFormatado;

    // 3. LOGICA DE EXIBIÇÃO: Mostra a barra se houver itens
    const barra = el('barra-carrinho');
    const rodapeSimples = el('cesta-rodape');

    if (appState.totalItens > 0) {
        if(barra) barra.style.display = 'flex';
        if(rodapeSimples) rodapeSimples.style.display = 'block';
    } else {
        if(barra) barra.style.display = 'none';
        if(rodapeSimples) rodapeSimples.style.display = 'none';
    }

    // 4. Resumo financeiro dentro do Modal de Revisão
    const resumoTotal = el('revisao-total-txt');
    if(resumoTotal) {
        resumoTotal.innerHTML = `
            <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee;">
                <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px;">
                    <span>Subtotal produtos:</span> <span>${fmtMoeda(subtotalProd)}</span>
                </div>
                ${appState.desconto > 0 ? `
                <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#27ae60; margin-bottom:5px;">
                    <span>Desconto:</span> <span>- ${fmtMoeda(appState.desconto)}</span>
                </div>` : ''}
                <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:5px;">
                    <span>Taxa de entrega:</span> <span>${fmtMoeda(appState.taxaEntrega)}</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:bold; margin-top:10px; padding-top:10px; border-top:2px solid #ddd; color:var(--a-brown);">
                    <span>TOTAL:</span> <span>${valFormatado}</span>
                </div>
            </div>`;
    }
}

// --- LÓGICA DO MODAL MINHA CESTA (REVISADA COM NOVOS REQUISITOS) ---

function abrirRevisao() {
    const lista = el('lista-revisao-completa');
    if (!lista) return;

    // 1. Renderiza os itens com background suave e botão EXCLUIR vermelho
    if (appState.carrinho.length === 0) {
        lista.innerHTML = "<p style='text-align:center; padding:20px; color:#666;'>Sua cesta está vazia.</p>";
    } else {
        lista.innerHTML = appState.carrinho.map((item, idx) => {
            let textoOpcionais = item.detalhes && item.detalhes.length > 0 
                ? item.detalhes.map(o => `<div style="font-size:0.75rem; color:#888; margin-left:10px;">+ ${o.qtd}x ${o.nome}</div>`).join('')
                : "";
            
            return `
                <div style="background:#fdf8f3; border: 1px solid #eee; border-radius:10px; padding:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="flex:1;">
                        <div style="color:var(--a-brown); font-weight:bold; font-size:0.95rem;">${item.qtd}x ${item.nome}</div>
                        ${textoOpcionais}
                        <div style="font-weight:bold; font-size:0.85rem; margin-top:4px;">${fmtMoeda(item.preco * item.qtd)}</div>
                    </div>
                    <button onclick="removerItem(${idx})" style="background:#ff4d4d; border:none; color:white; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:0.7rem; font-weight:bold; text-transform:uppercase;">
                        Excluir
                    </button>
                </div>`;
        }).join('');
    }

    // 2. Ajuste de Alinhamento e Estilo do Cupom (B)
    const btnAplicar = el('modalRevisao').querySelector('button[onclick="aplicarCupom()"]');
    const inputCupom = el('inputCupom');
    
    if (btnAplicar && inputCupom) {
        // Garante que o contêiner pai alinhe os dois ao centro
        inputCupom.parentElement.style.display = "flex";
        inputCupom.parentElement.style.alignItems = "center";
        inputCupom.parentElement.style.gap = "8px";

        // Estilo do Input
        inputCupom.style.height = "34px"; // Altura menor
        inputCupom.style.margin = "0";
        inputCupom.style.flex = "1";

        // Estilo do Botão Aplicar (Mais largo e mesma altura do input)
        btnAplicar.style.height = "34px";
        btnAplicar.style.width = "100px"; // Um pouco mais largo
        btnAplicar.style.padding = "0";
        btnAplicar.style.margin = "0";
        btnAplicar.style.display = "flex";
        btnAplicar.style.alignItems = "center";
        btnAplicar.style.justifyContent = "center";
        btnAplicar.style.fontSize = "0.8rem";
    }

    // Sincroniza fontes dos títulos
    const pCupom = inputCupom.parentElement.previousElementSibling;
    if (pCupom && pCupom.tagName === "P") {
        pCupom.style.cssText = "font-weight: bold; font-size: 0.85rem; margin-bottom: 8px;";
    }

    atualizarTotais();
    fecharModais();
    el('modalOverlay').style.display = 'block';
    el('modalRevisao').style.display = 'block';
}
// 3. Nova função para destacar botões de recebimento
function selEntrega(tipo, elemento) {
    // Define a taxa
    appState.taxaEntrega = (tipo === 'Entrega') ? 10 : 0;
    
    // Remove destaque de todos
    document.querySelectorAll('#modalRevisao .opcao-entrega').forEach(opt => {
        opt.style.border = "2px solid #eee";
        opt.style.background = "#fff";
        opt.style.color = "#333";
    });

    // Aplica destaque no selecionado
    elemento.style.border = "2px solid var(--a-brown)";
    elemento.style.background = "#fdf8f3";
    elemento.style.color = "var(--a-brown)";
    elemento.style.fontWeight = "bold";

    // Mostra/Esconde o frame de aviso de taxa se existir
    const aviso = elemento.querySelector('.entrega-info-frame');
    document.querySelectorAll('.entrega-info-frame').forEach(f => f.style.display = 'none');
    if(aviso) aviso.style.display = 'block';

    atualizarTotais();
}

// --- NOVAS FUNÇÕES ADICIONADAS ---

function selecionarRecebimento(tipo) {
    appState.taxaEntrega = (tipo === 'Entrega') ? 10 : 0;
    const isE = (tipo === 'Entrega');
    
    // Destaque visual (Melhoria 2)
    const btnE = el('opt-entrega');
    const btnR = el('opt-retirada');
    if(btnE && btnR) {
        btnE.style.borderColor = isE ? 'var(--a-brown)' : '#eee';
        btnE.style.background = isE ? '#fdf8f3' : '#fff';
        btnR.style.borderColor = !isE ? 'var(--a-brown)' : '#eee';
        btnR.style.background = !isE ? '#fdf8f3' : '#fff';
    }
    
    if(el('aviso-entrega-frame')) el('aviso-entrega-frame').style.display = isE ? 'block' : 'none';
    atualizarTotais();
}

function aplicarCupom() {
    const cod = el('inputCupom').value.trim().toLowerCase();
    const cupons = {'mathilde10': 10, 'mathilde15': 15, 'mathilde20': 20};
    const msg = el('msgCupom');
    if (cupons[cod]) {
        appState.cupomAtivo = { nome: cod.toUpperCase(), porcentagem: cupons[cod] };
        msg.innerText = "Cupom aplicado!";
        msg.style.color = "green";
    } else {
        appState.cupomAtivo = null;
        msg.innerText = "Cupom inválido";
        msg.style.color = "red";
    }
    atualizarTotais();
}

// --- FUNÇÕES DE NAVEGAÇÃO (MANTIDAS) ---

function removerItem(idx) {
    appState.carrinho.splice(idx, 1);
    if (appState.carrinho.length === 0) {
        fecharModais();
        atualizarTotais();
    } else {
        abrirRevisao();
        atualizarTotais();
    }
}

// 1. Criando a função que faltava para o botão voltar
function voltarParaRevisao() {
    fecharModais();
    abrirRevisao(); 
}

//função validar cpf
function validarCPF(cpf) {
    // 1. Remove caracteres não numéricos (caso existam, por segurança)
    cpf = cpf.replace(/[^\d]+/g, '');

    // 2. Verifica se tem 11 caracteres e se não é uma sequência inválida repetida
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
        return false;
    }

    // 3. Validação dos dois dígitos verificadores
    let cpfBase = cpf.substring(0, 9);
    let digitosVerificadores = cpf.substring(9);
    
    let soma = 0;
    let resto;

    // Cálculo do primeiro dígito
    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpfBase.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(digitosVerificadores.substring(0, 1))) return false;

    // Cálculo do segundo dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(digitosVerificadores.substring(1, 2))) return false;

    return true; // CPF válido
}

// --- Exemplos de uso ---
console.log(validarCPF("12345678909")); // false (exemplo inválido)
console.log(validarCPF("11111111111")); // false (repetido)
// Coloque um CPF real com 11 números para testar como true


// 2. Ajustando a abertura de dados com lógica de endereço, CPF e Senha
function abrirDados() {
    // Abre o modal de dados
    fecharModais();
    el('modalOverlay').style.display = 'block';
    el('modalDados').style.display = 'block';

    // Garante que a etapa inicial de dados apareça
    el('etapa-dados').style.display = 'block';
    el('etapa-pagamento').style.display = 'none';

    // Lógica do Endereço: Mostra apenas se houver taxa de entrega (appState.taxaEntrega > 0)
    const campoEndereco = el('endCliDados');
    if (campoEndereco) {
        campoEndereco.style.display = (appState.taxaEntrega > 0) ? 'block' : 'none';
        campoEndereco.required = (appState.taxaEntrega > 0);
    }

    // 3. Adicionando campos de CPF e Senha (apenas se não existirem no HTML)
    const inputTel = el('telCli');
    if (inputTel && !el('cpfCli')) {
        // Criar Input CPF
        const inputCpf = document.createElement('input');
        inputCpf.type = 'tel';
        inputCpf.id = 'cpfCli';
        inputCpf.placeholder = 'CPF (Apenas números) *';
        inputCpf.maxLength = 11;
        inputCpf.style.width = "100%";
        inputCpf.style.marginTop = "10px";
        inputCpf.oninput = function() { validarApenasNumeros(this); };
        
        // Criar Input Senha
        const inputSenha = document.createElement('input');
        inputSenha.type = 'password';
        inputSenha.id = 'senhaCli';
        inputSenha.placeholder = 'Crie uma Senha *';
        inputSenha.style.width = "100%";
        inputSenha.style.marginTop = "10px";

        // Inserir no HTML logo abaixo do Telefone
        inputTel.insertAdjacentElement('afterend', inputCpf);
        inputCpf.insertAdjacentElement('afterend', inputSenha);
    }
}

// 1. Função para validar e avançar para o pagamento
function irParaPagamento() {
    const nome = el('nomeCli').value.trim();
    const tel = el('telCli').value.trim();
    const cpf = el('cpfCli') ? el('cpfCli').value.trim() : "";
    const senha = el('senhaCli') ? el('senhaCli').value.trim() : "";
    const endereco = el('endCliDados').value.trim();

    // 1. Validação de Nome
    if (nome.length < 3) {
        alert("Por favor, informe seu nome completo.");
        return;
    }

    // 2. Validação de WhatsApp (DDD + Número)
    if (tel.replace(/\D/g, '').length !== 11) {
        alert("Informe o WhatsApp com DDD (11 dígitos, apenas números).");
        return;
    }

    // 3. Validação de CPF (Usando sua nova função matemática)
    if (!validarCPF(cpf)) {
        alert("O CPF informado é inválido. Por favor, verifique os números.");
        return;
    }

    // 4. Validação de Senha
    if (senha.length < 4) {
        alert("Crie uma senha de pelo menos 4 caracteres.");
        return;
    }

    // 5. Validação de Endereço (Se for Entrega)
    if (appState.taxaEntrega > 0 && endereco.length < 10) {
        alert("Por favor, informe o endereço completo para entrega.");
        return;
    }

    // Se tudo estiver OK, avança para o pagamento
    el('etapa-dados').style.display = 'none';
    el('etapa-pagamento').style.display = 'block';
    
    if (el('pix-valor-txt')) {
        el('pix-valor-txt').innerText = fmtMoeda(appState.totalGeral);
    }
}

// Mantenha a sua função validarCPF(cpf) abaixo ou acima desta.

// 2. Função auxiliar para garantir que só entrem números (caso não tenha)
function validarApenasNumeros(input) {
    input.value = input.value.replace(/\D/g, '');
}

// Seleção da Forma de Pagamento
function selPgto(tipo, elemento) {
    appState.formaPgto = tipo;

    // Remove destaque de todos os botões de pagamento
    document.querySelectorAll('.opcao-pagamento').forEach(opt => {
        opt.style.border = "2px solid #eee";
        opt.style.background = "#fff";
    });

    // Destaca o selecionado
    elemento.style.border = "2px solid var(--a-brown)";
    elemento.style.background = "#fdf8f3";

    // Mostra/Esconde informações específicas (como QR Code do PIX)
    const infoFrame = elemento.querySelector('.pagamento-info-frame');
    document.querySelectorAll('.pagamento-info-frame').forEach(f => f.style.display = 'none');
    if (infoFrame) infoFrame.style.display = 'block';

    // Atualiza o valor do PIX caso seja a opção selecionada
    if (tipo === 'Pix' && el('pix-valor-txt')) {
        el('pix-valor-txt').innerText = fmtMoeda(appState.totalGeral);
    }
}

// Voltar da etapa de Pagamento para Dados
function voltarParaDados() {
    el('etapa-pagamento').style.display = 'none';
    el('etapa-dados').style.display = 'block';
}

// --- FUNÇÃO PARA SALVAR NA PLANILHA (CHAMAR ANTES DO WHATSAPP) ---
function salvarPedidoNaPlanilha() {
    // COLE A URL GERADA PELO GOOGLE AQUI EMBAIXO:
    const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbw8ASk-ehg-q10WK7oJE0Ah8WB1ZD7eTHryH3KLxNAvWs3WkD9cTh7vDlehe5nMOj5aWg/exec"; 

    const dados = {
        data: new Date().toLocaleString('pt-BR'),
        nome: el('nomeCli').value,
        whatsapp: el('telCli').value,
        cpf: el('cpfCli') ? el('cpfCli').value : "",
        senha: el('senhaCli') ? el('senhaCli').value : "",
        endereco: el('endCliDados').value || "Retirada",
        pagamento: appState.formaPgto,
        total: appState.totalGeral,
        itens: appState.carrinho.map(i => `${i.qtd}x ${i.nome}`).join(', ')
    };

    fetch(URL_PLANILHA, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    }).catch(err => console.error("Erro planilha:", err));
}

// --- FUNÇÃO MONTAR MENSAGEM WHATSAPP (SEM CPF E SENHA) ---
function montarMensagemWhats() {
    let texto = `*🍞 NOVO PEDIDO - PÃO DO CISO*\n`;
    texto += `--------------------------------\n`;
    texto += `*Cliente:* ${el('nomeCli').value}\n`;
    texto += `*WhatsApp:* ${el('telCli').value}\n`;
    
    // Se houver taxa de entrega, mostra endereço, senão é retirada
    if (appState.taxaEntrega > 0) {
        texto += `*Entrega em:* ${el('endCliDados').value}\n`;
    } else {
        texto += `*Forma:* Retirada no Local\n`;
    }
    
    texto += `--------------------------------\n`;
    texto += `*ITENS DO PEDIDO:*\n`;
    
    appState.carrinho.forEach(item => {
        texto += `• ${item.qtd}x ${item.nome} (${fmtMoeda(item.preco * item.qtd)})\n`;
        // Adiciona opcionais se existirem
        if (item.detalhes && item.detalhes.length > 0) {
            item.detalhes.forEach(opc => {
                texto += `  └ _${opc.qtd}x ${opc.nome}_\n`;
            });
        }
    });
    
    texto += `--------------------------------\n`;
    
    if (appState.desconto > 0) {
        texto += `*Desconto:* - ${fmtMoeda(appState.desconto)}\n`;
    }
    
    if (appState.taxaEntrega > 0) {
        texto += `*Taxa de Entrega:* ${fmtMoeda(appState.taxaEntrega)}\n`;
    }

    texto += `*Pagamento:* ${appState.formaPgto}\n`;
    texto += `*TOTAL A PAGAR: ${fmtMoeda(appState.totalGeral)}*\n`;
    texto += `--------------------------------\n`;
    texto += `_Pedido gerado pelo catálogo virtual_`;
    
    return texto;
}

// Finalizar Pedido e Redirecionar
function finalizar() {
    if (!appState.formaPgto) {
        alert("Por favor, selecione uma forma de pagamento.");
        return;
    }

    salvarPedidoNaPlanilha();

    // 1. Exibe o Modal de Sucesso
    fecharModais();
    el('modalOverlay').style.display = 'block';
    el('modalSucesso').style.display = 'block';

    // 2. Gerencia o elemento da contagem regressiva
    let displayContagem = el('contagem-regressiva');
    if (!displayContagem) {
        displayContagem = document.createElement('div');
        displayContagem.id = 'contagem-regressiva';
        // Usei uma cor marrom fixa caso sua variável não carregue
        displayContagem.style.cssText = "font-size: 3rem; font-weight: bold; color: #5d4037; margin-top: 10px; text-align: center;";
        el('modalSucesso').appendChild(displayContagem);
    }

    // 3. Inicia a lógica da Contagem Regressiva Visual
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

    // 4. Prepara a mensagem e abre o WhatsApp após os 3 segundos
    // Tentei envolver em um try/catch para evitar que erros na mensagem travem tudo
    let msg = "";
    try {
        msg = montarMensagemWhats();
    } catch (e) {
        msg = "Olá, gostaria de fazer um pedido!";
        console.error("Erro ao montar mensagem:", e);
    }

    const foneLoja = "5511982391781";
    const url = `https://api.whatsapp.com/send?phone=${foneLoja}&text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
        const win = window.open(url, '_blank');
        
        // Se o pop-up for bloqueado, redireciona na mesma aba
        if (!win || win.closed || typeof win.closed == 'undefined') {
            window.location.href = url;
        }

        // Mostra o modal de suporte pós-envio logo após o disparo
        setTimeout(() => {
            if (typeof mostrarModalPosEnvio === "function") {
                mostrarModalPosEnvio();
            }
        }, 800);
        
    }, 3000); 
}

function mostrarModalPosEnvio() {
    fecharModais();
    el('modalOverlay').style.display = 'block';
    
    // Cria o modal pós-envio caso ele não exista no HTML
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

function reenviarWhats() {
    const msg = montarMensagemWhats();
    const url = `https://wa.me/5511982391781?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}