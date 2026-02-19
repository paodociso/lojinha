// ============================================
// SISTEMA DE CEP E CÁLCULO DE FRETE
// ============================================

// --- 1. UTILITÁRIOS E FORMATAÇÃO ---

function formatarCodigoPostal(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.substring(0, 8);
    
    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '-' + valor.substring(5);
    }
    
    input.value = valor;
    estadoAplicativo.dadosCliente.cep = valor.replace(/\D/g, '');
    
    if (estadoAplicativo.dadosCliente.cep.length === 8) {
        buscarEnderecoPorCodigoPostal(estadoAplicativo.dadosCliente.cep);
        input.classList.add('campo-valido');
        input.classList.remove('campo-invalido');
    } else if (estadoAplicativo.dadosCliente.cep.length === 0) {
        input.classList.remove('campo-valido', 'campo-invalido');
    } else {
        input.classList.add('campo-invalido');
        input.classList.remove('campo-valido');
    }
}

function elemento(id) { return document.getElementById(id); } // Função auxiliar comum em sistemas assim

// --- 2. BUSCA DE ENDEREÇO (API) ---
async function buscarEnderecoPorCodigoPostal(cepCru) {
    const cep = String(cepCru).replace(/\D/g, '');
    console.log("🚀 [Debug] Iniciando busca para o CEP:", cep);

    if (!cep || cep.length !== 8) {
        console.warn("⚠️ [Debug] CEP inválido ou incompleto detectado:", cep);
        return;
    }

    if (typeof mostrarCarregamentoCEP === 'function') {
        console.log("⏳ [Debug] Ativando loading...");
        mostrarCarregamentoCEP(true);
    }

    try {
        console.log("🌐 [Debug] Chamando API ViaCEP...");
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        // --- TRATAMENTO PARA CEP NÃO ENCONTRADO ---
        if (dados.erro) {
            console.warn("❌ [Debug] CEP não encontrado na base de dados. Aplicando taxa padrão.");
            
            const taxaPadrao = window.dadosIniciais.entrega.taxaGeral;
            
            // Atualiza estados globais
            if (window.estadoAplicativo) {
                window.estadoAplicativo.taxaEntrega = taxaPadrao;
                window.estadoAplicativo.bairroIdentificado = null;
                window.estadoAplicativo.cepCalculado = cep; 
            }

            // Notifica o usuário no Carrinho
            const divNotificacao = document.getElementById('notificacao-bairro-carrinho');
            const spanNomeBairro = document.getElementById('nome-bairro-info');
            const divResultado = document.getElementById('resultado-frete-carrinho');

            if (divNotificacao && spanNomeBairro) {
                spanNomeBairro.innerHTML = `
                    <span style="color: #d32f2f; font-weight: bold;">CEP não encontrado.</span><br>
                    <i class="fas fa-truck"></i> Taxa padrão aplicada: <strong>${formatarMoeda(taxaPadrao)}</strong>
                `;
                divNotificacao.style.display = 'block';
            }
            if (divResultado) divResultado.style.display = 'none';

            if (typeof atualizarResumoFinanceiroCarrinho === 'function') {
                atualizarResumoFinanceiroCarrinho();
            }
            return; // Permite que o cliente prossiga com a taxa padrão
        }

        console.log("✅ [Debug] Dados recebidos da API:", dados);

        if (typeof renderizarCarrinho === 'function') {
            console.log("🔄 [Debug] Chamando renderizarCarrinho() antes do cálculo...");
            renderizarCarrinho();
        }

        if (typeof preencherCamposEndereco === 'function') {
            console.log("📝 [Debug] Preenchendo campos de endereço...");
            preencherCamposEndereco(dados);
        }

        if (dados.bairro && typeof calcularFretePorBairro === 'function') {
            console.log(`🚚 [Debug] Aplicando frete e notificações para: ${dados.bairro}`);
            calcularFretePorBairro(dados.bairro);
        }

        setTimeout(() => {
            const campoNome = document.getElementById('nome-cliente');
            if (campoNome) {
                console.log("🎯 [Debug] Movendo foco para o campo Nome.");
                campoNome.focus();
            }
        }, 1500);

    } catch (erro) {
        console.error('❌ [Debug] Erro catastrófico na busca:', erro);
    } finally {
        if (typeof mostrarCarregamentoCEP === 'function') {
            mostrarCarregamentoCEP(false);
            console.log("🏁 [Debug] Processo de busca finalizado.");
        }
    }
}

function preencherCamposEndereco(dados) {
    estadoAplicativo.dadosCliente = {
        ...estadoAplicativo.dadosCliente,
        logradouro: dados.logradouro || '',
        bairro: dados.bairro || '',
        cidade: dados.localidade || '',
        estado: dados.uf || ''
    };
    
    const campoLogradouro = elemento('logradouro-cliente');
    const campoBairro = elemento('bairro-cliente');
    const campoCidade = elemento('cidade-cliente');
    
    if (campoLogradouro) {
        campoLogradouro.value = dados.logradouro || '';
        campoLogradouro.classList.add('campo-valido');
    }
    if (campoBairro) {
        campoBairro.value = dados.bairro || '';
        campoBairro.classList.add('campo-valido');
    }
    if (campoCidade) {
        campoCidade.value = dados.localidade ? `${dados.localidade}/${dados.uf}` : '';
        campoCidade.classList.add('campo-valido');
    }
    
    const campoNumero = elemento('numero-residencia-cliente');
    if (campoNumero) {
        campoNumero.disabled = false;
        campoNumero.placeholder = 'Digite o número';
    }
}

// --- 3. LÓGICA DE CÁLCULO DE FRETE ---
function calcularFretePorBairro(nomeBairro) {
    if (!nomeBairro) return;

    const bairros = window.dadosIniciais.entrega.bairros;
    const bairroEncontrado = bairros.find(b => 
        b.nome.toLowerCase().trim() === nomeBairro.toLowerCase().trim()
    );

    const taxaCalculada = bairroEncontrado ? bairroEncontrado.taxa : window.dadosIniciais.entrega.taxaGeral;

    // 1. Atualiza estado global (fonte única da taxa de entrega)
    if (window.estadoAplicativo) {
        window.estadoAplicativo.taxaEntrega = taxaCalculada;
        window.estadoAplicativo.bairroIdentificado = nomeBairro;
    }

// --- 2. ATUALIZAÇÃO NO CARRINHO ---
    const divNotificacao = document.getElementById('notificacao-bairro-carrinho');
    const spanNomeBairro = document.getElementById('nome-bairro-info');
    const divResultado = document.getElementById('resultado-frete-carrinho');

    if (divNotificacao && spanNomeBairro) {
        // Unifica bairro e taxa em uma única mensagem com o ícone solicitado
        spanNomeBairro.innerHTML = `
            Bairro encontrado: <strong>${nomeBairro}</strong>.<br>
            <i class="fas fa-truck"></i> Taxa de entrega: <strong>${formatarMoeda(taxaCalculada)}</strong>
        `;
        divNotificacao.style.display = 'block';
    }

    // Oculta a div de resultado antiga para evitar repetição do valor
    if (divResultado) {
        divResultado.style.display = 'none';
    }

    // --- 3. ATUALIZAÇÃO NO MODAL DE DADOS ---
    const divInfoFreteModal = document.getElementById('informacao-frete');
    const spanValorFreteModal = document.getElementById('valor-frete');
    
    if (divInfoFreteModal && spanValorFreteModal) {
        spanValorFreteModal.textContent = formatarMoeda(taxaCalculada);
        divInfoFreteModal.style.display = 'flex';
    }

    if (typeof atualizarResumoFinanceiroCarrinho === 'function') {
        atualizarResumoFinanceiroCarrinho();
    }
}

function obterTaxaEntregaAtual() {
    // Fonte única: estadoAplicativo.taxaEntrega
    return (window.estadoAplicativo && window.estadoAplicativo.taxaEntrega)
        ? window.estadoAplicativo.taxaEntrega
        : window.dadosIniciais.entrega.taxaGeral;
}

// --- 4. VALIDAÇÃO E FORMATAÇÃO FINAL ---

function validarEnderecoCompleto() {
    const camposObrigatorios = [
        { id: 'codigo-postal-cliente', nome: 'CEP' },
        { id: 'logradouro-cliente', nome: 'Rua' },
        { id: 'bairro-cliente', nome: 'Bairro' },
        { id: 'numero-residencia-cliente', nome: 'Número' }
    ];
    
    const camposInvalidos = [];
    
    camposObrigatorios.forEach(campo => {
        const elementoCampo = elemento(campo.id);
        if (elementoCampo) {
            const valor = elementoCampo.value.trim();
            if (!valor) {
                camposInvalidos.push(campo.nome);
                elementoCampo.classList.add('campo-invalido');
            } else {
                elementoCampo.classList.remove('campo-invalido');
                elementoCampo.classList.add('campo-valido');
            }
        }
    });
    
    if (camposInvalidos.length > 0) {
        return {
            valido: false,
            mensagem: `Preencha os campos obrigatórios: ${camposInvalidos.join(', ')}`,
            campos: camposInvalidos
        };
    }
    
    return {
        valido: true,
        mensagem: 'Endereço válido',
        dados: {
            ...estadoAplicativo.dadosCliente,
            numero: elemento('numero-residencia-cliente').value.trim(),
            complemento: elemento('complemento-residencia-cliente').value.trim(),
            referencia: elemento('ponto-referencia-entrega').value.trim()
        }
    };
}

function obterEnderecoFormatado() {
    const validacao = validarEnderecoCompleto();
    if (!validacao.valido) return null;
    
    const dados = validacao.dados;
    let enderecoFormatado = '';
    
    if (dados.logradouro && dados.numero) {
        enderecoFormatado += `${dados.logradouro}, ${dados.numero}`;
        if (dados.complemento) enderecoFormatado += ` - ${dados.complemento}`;
        if (dados.bairro) enderecoFormatado += ` - ${dados.bairro}`;
        if (dados.cidade) enderecoFormatado += ` - ${dados.cidade}`;
        if (dados.cep) enderecoFormatado += ` (CEP: ${dados.cep})`;
        if (dados.referencia) enderecoFormatado += ` [Ref: ${dados.referencia}]`;
    }
    
    return enderecoFormatado;
}

// --- 5. INTERFACE E FEEDBACK (DOM) ---

function mostrarCarregamentoCEP(mostrar) {
    const campoCEP = elemento('codigo-postal-cliente');
    const containerCEP = campoCEP?.parentElement;
    if (!containerCEP) return;
    
    ['.loading-cep', '.sucesso-cep', '.erro-cep'].forEach(classe => {
        const el = containerCEP.querySelector(classe);
        if (el) el.remove();
    });
    
    if (mostrar) {
        const loading = document.createElement('div');
        loading.className = 'loading-cep';
        loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando endereço...';
        loading.style.cssText = `font-size: 0.75rem; color: var(--marrom-cafe); margin-top: 5px; display: flex; align-items: center; gap: 8px;`;
        containerCEP.appendChild(loading);
    }
}

function mostrarSucessoCEP(mensagem) {
    const campoCEP = elemento('codigo-postal-cliente');
    const containerCEP = campoCEP?.parentElement;
    if (!containerCEP) return;
    mostrarCarregamentoCEP(false);
    
    const sucesso = document.createElement('div');
    sucesso.className = 'sucesso-cep';
    sucesso.innerHTML = `<i class="fas fa-check-circle"></i> ${mensagem}`;
    sucesso.style.cssText = `font-size: 0.75rem; color: var(--verde-sucesso); margin-top: 5px; display: flex; align-items: center; gap: 8px;`;
    containerCEP.appendChild(sucesso);
    setTimeout(() => { if (sucesso.parentNode) sucesso.parentNode.removeChild(sucesso); }, 5000);
}

function mostrarErroCEP(mensagem) {
    const campoCEP = elemento('codigo-postal-cliente');
    const containerCEP = campoCEP?.parentElement;
    if (!containerCEP) return;
    mostrarCarregamentoCEP(false);
    
    campoCEP.classList.add('campo-invalido');
    campoCEP.classList.remove('campo-valido');
    
    const erro = document.createElement('div');
    erro.className = 'erro-cep';
    erro.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensagem}`;
    erro.style.cssText = `font-size: 0.75rem; color: var(--vermelho-alerta); margin-top: 5px; display: flex; align-items: center; gap: 8px;`;
    containerCEP.appendChild(erro);
    habilitarCamposManuais();
    setTimeout(() => { if (erro.parentNode) erro.parentNode.removeChild(erro); }, 10000);
}

function habilitarCamposManuais() {
    ['logradouro-cliente', 'bairro-cliente', 'cidade-cliente'].forEach(id => {
        const campo = elemento(id);
        if (campo) {
            campo.readOnly = false;
            campo.classList.remove('campo-leitura');
            campo.placeholder = 'Preencha manualmente';
        }
    });
}

function limparEnderecoCliente() {
    estadoAplicativo.dadosCliente = { nome: estadoAplicativo.dadosCliente.nome, telefone: estadoAplicativo.dadosCliente.telefone, cep: '', logradouro: '', bairro: '', cidade: '', estado: '', numero: '', complemento: '', referencia: '' };
    const campos = ['codigo-postal-cliente', 'logradouro-cliente', 'bairro-cliente', 'cidade-cliente', 'numero-residencia-cliente', 'complemento-residencia-cliente', 'ponto-referencia-entrega'];
    
    campos.forEach(id => {
        const campo = elemento(id);
        if (campo) {
            campo.value = '';
            campo.classList.remove('campo-valido', 'campo-invalido');
            if (['logradouro-cliente', 'bairro-cliente', 'cidade-cliente'].includes(id)) {
                campo.readOnly = true;
                campo.classList.add('campo-leitura');
                campo.placeholder = 'Será preenchido automaticamente';
            }
            if (id === 'numero-residencia-cliente') {
                campo.disabled = true;
                campo.placeholder = 'Digite o CEP primeiro';
            }
        }
    });
    
    const divNotificacao = document.getElementById('notificacao-bairro-carrinho');
    const divResultado = document.getElementById('resultado-frete-carrinho');
    if (divNotificacao) divNotificacao.style.display = 'none';
    if (divResultado) divResultado.style.display = 'none';
    window.estadoAplicativo.taxaEntrega = 0; // Fonte única da taxa de entrega
}

// --- 6. CONFIGURAÇÃO DE EVENTOS ---

function configurarRemocaoDestaqueCampos() {
    const campoNumero = elemento('numero-residencia-cliente');
    if (campoNumero) {
        campoNumero.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('campo-invalido');
                this.style.border = '';
                this.style.backgroundColor = '';
            }
        });
    }
    
    const campoNome = elemento('nome-cliente');
    const campoWhatsapp = elemento('whatsapp-cliente');
    [campoNome, campoWhatsapp].forEach(campo => {
        if (campo) {
            campo.addEventListener('input', function() {
                this.classList.remove('campo-invalido');
                this.style.border = '';
                this.style.backgroundColor = '';
            });
        }
    });
}

function configurarEventosCEP() {
    const campoCEP = elemento('codigo-postal-cliente');
    if (campoCEP) {
        campoCEP.addEventListener('input', function() { formatarCodigoPostal(this); });
        campoCEP.addEventListener('blur', function() {
            const cepNumeros = this.value.replace(/\D/g, '');
            if (cepNumeros.length === 8 && !estadoAplicativo.dadosCliente.logradouro) {
                buscarEnderecoPorCodigoPostal(cepNumeros);
            }
        });
    }
    
    const campoBairro = elemento('bairro-cliente');
    if (campoBairro) {
        campoBairro.addEventListener('change', function() {
            if (this.value.trim()) {
                estadoAplicativo.dadosCliente.bairro = this.value.trim();
                calcularFretePorBairro(this.value.trim());
            }
        });
    }
    
    const campoNumero = elemento('numero-residencia-cliente');
    if (campoNumero) {
        campoNumero.addEventListener('change', function() {
            estadoAplicativo.dadosCliente.numero = this.value.trim();
            if (this.value.trim() && estadoAplicativo.dadosCliente.bairro) {
                calcularFretePorBairro(estadoAplicativo.dadosCliente.bairro);
            }
        });
    }
}

document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'cep-carrinho') {
        let input = e.target;
        
        // 1. Remove absolutamente tudo que não for número
        let v = input.value.replace(/\D/g, ''); 
        
        // 2. Garante que não ultrapasse 8 números (limite lógico)
        if (v.length > 8) {
            v = v.substring(0, 8);
        }
        
        // 3. Aplica a máscara visual (00000-000)
        let valorFormatado = "";
        if (v.length > 5) {
            valorFormatado = v.substring(0, 5) + '-' + v.substring(5);
        } else {
            valorFormatado = v;
        }

        // 4. Atualiza o valor do campo
        input.value = valorFormatado;
        
        // 5. Atualiza o estado global apenas com os números (limpos)
        if (window.estadoAplicativo) {
            estadoAplicativo.cepCalculado = v;
        }
    }
});

// --- 7. EXPORTAÇÕES E INICIALIZAÇÃO GLOBAL ---

window.obterTaxaEntregaAtual = obterTaxaEntregaAtual;
window.configurarRemocaoDestaqueCampos = configurarRemocaoDestaqueCampos;
window.formatarCodigoPostal = formatarCodigoPostal;
window.buscarEnderecoPorCodigoPostal = buscarEnderecoPorCodigoPostal;
window.calcularFretePorBairro = calcularFretePorBairro;
window.obterDadosEnderecoCliente = obterEnderecoFormatado; // Vinculando à função de dados formatados
window.limparEnderecoCliente = limparEnderecoCliente;
window.validarEnderecoCompleto = validarEnderecoCompleto;
window.configurarEventosCEP = configurarEventosCEP;
window.obterDadosEnderecoClienteRaw = obterDadosEnderecoCliente; // Mantendo a original se necessário