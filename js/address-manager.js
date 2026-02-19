// address-manager.js - VERSÃO REFATORADA
// ⚠️  Depende de utils.js carregado antes:
//     - window.formatarCEP()         → máscara de CEP
//     - window.aplicarMascaraCEP()   → aplica máscara em <input>
//     - window.validarEnderecoCompleto() → validação unificada

window.AddressManager = {
    enderecoAtual: {},
    cepAnterior: '',

    init: function() {
        console.log('📍 AddressManager iniciando...');

        this.adicionarAvisoCEP();

        const campoCEP = document.getElementById('codigo-postal-cliente');
        if (campoCEP) {
            this.cepAnterior = campoCEP.value;

            // 🔑 Delega formatação para window.aplicarMascaraCEP (utils.js)
            campoCEP.addEventListener('input', (e) => {
                const limpo = window.aplicarMascaraCEP(e.target);
                this.enderecoAtual.cep = limpo;
            });

            campoCEP.addEventListener('blur',   this.validarEbuscarCEP.bind(this));
            campoCEP.addEventListener('change', this.verificarCEPRemovido.bind(this));
        }

        this.configurarCampoEditavel('logradouro-cliente',           'logradouro');
        this.configurarCampoEditavel('bairro-cliente',               'bairro');
        this.configurarCampoEditavel('cidade-cliente',               'cidade');
        this.configurarCampoEditavel('numero-residencia-cliente',    'numero');
        this.configurarCampoEditavel('complemento-residencia-cliente','complemento');
        this.configurarCampoEditavel('ponto-referencia-entrega',     'referencia');

        console.log('✅ AddressManager pronto');
    },

    adicionarAvisoCEP: function() {
        const containerCEP = document.getElementById('codigo-postal-cliente')?.parentElement;
        if (!containerCEP) return;

        const avisoAnterior = containerCEP.querySelector('.aviso-cep');
        if (avisoAnterior) avisoAnterior.remove();

        const aviso = document.createElement('small');
        aviso.className = 'aviso-cep';
        aviso.style.cssText = `
            display: block;
            margin-top: 5px;
            color: #666;
            font-size: 0.75rem;
            font-style: italic;
        `;
        aviso.innerHTML = '<i class="fas fa-info-circle"></i> Os dados do endereço podem ser preenchidos automaticamente por meio do CEP.';
        containerCEP.appendChild(aviso);
    },

    verificarCEPRemovido: function(event) {
        const cepAtual = event.target.value.replace(/\D/g, '');

        if (this.cepAnterior.length === 8 && cepAtual.length < 8) {
            console.log('🗑️ CEP removido, limpando campos...');
            this.limparCamposEndereco();
        }

        this.cepAnterior = cepAtual;
    },

    limparCamposEndereco: function() {
        ['logradouro-cliente', 'bairro-cliente', 'cidade-cliente'].forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                campo.value = '';
                campo.placeholder = 'Preencha manualmente';
                campo.classList.remove('campo-valido', 'campo-invalido');
            }
        });

        this.enderecoAtual.logradouro = '';
        this.enderecoAtual.bairro     = '';
        this.enderecoAtual.cidade     = '';
    },

    validarEbuscarCEP: function(event) {
        const cep = event.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            this.buscarEndereco(cep);
        }
    },

    buscarEndereco: async function(cep) {
        console.log('🔍 AddressManager.buscarEndereco():', cep);

        try {
            if (typeof buscarEnderecoPorCodigoPostal === 'function') {
                await buscarEnderecoPorCodigoPostal(cep);
                this.tornarCamposEditaveis();
                console.log('✅ Endereço buscado e campos editáveis');
            } else {
                console.error('❌ buscarEnderecoPorCodigoPostal não encontrada');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar CEP:', error);
        }
    },

    tornarCamposEditaveis: function() {
        console.log('🔓 AddressManager.tornarCamposEditaveis()');

        ['logradouro-cliente', 'bairro-cliente', 'cidade-cliente'].forEach(id => {
            const campo = document.getElementById(id);
            if (campo) {
                campo.readOnly = false;
                campo.style.backgroundColor = '';
                campo.placeholder = 'Pode editar este campo';
                console.log(`✅ Campo ${id} editável`);
            }
        });

        const campoNumero = document.getElementById('numero-residencia-cliente');
        if (campoNumero) {
            campoNumero.disabled = false;
            campoNumero.placeholder = 'Digite o número (obrigatório)';
        }
    },

    configurarCampoEditavel: function(idCampo, nomePropriedade) {
        const campo = document.getElementById(idCampo);
        if (!campo) {
            console.warn(`⚠️ Campo ${idCampo} não encontrado`);
            return;
        }

        campo.readOnly = false;
        campo.disabled = false;
        campo.classList.remove('campo-leitura');

        if (['logradouro-cliente', 'bairro-cliente', 'cidade-cliente'].includes(idCampo)) {
            campo.placeholder = 'Digite ou será preenchido pelo CEP';
        }

        campo.addEventListener('input', () => {
            this.enderecoAtual[nomePropriedade] = campo.value;
        });

        campo.addEventListener('blur', () => {
            this.validarCampoIndividual(campo);
        });

        console.log(`✅ Campo ${idCampo} configurado`);
    },

    validarCampoIndividual: function(campo) {
        const valor = campo.value.trim();
        if (valor) {
            campo.classList.add('campo-valido');
            campo.classList.remove('campo-invalido');
        } else {
            campo.classList.remove('campo-valido', 'campo-invalido');
        }
    },

    /**
     * Validação do endereço.
     * 🔑 Delega para window.validarEnderecoCompleto() (utils.js),
     * que é a fonte única de verdade.
     */
    validar: function() {
        console.log('🔍 AddressManager.validar()');
        const resultado = window.validarEnderecoCompleto();
        console.log('📊 Resultado:', resultado);
        return resultado;
    },

    getEndereco: function() {
        const endereco = {
            cep:         document.getElementById('codigo-postal-cliente')?.value          || '',
            logradouro:  document.getElementById('logradouro-cliente')?.value             || '',
            bairro:      document.getElementById('bairro-cliente')?.value                 || '',
            cidade:      document.getElementById('cidade-cliente')?.value                 || '',
            numero:      document.getElementById('numero-residencia-cliente')?.value      || '',
            complemento: document.getElementById('complemento-residencia-cliente')?.value || '',
            referencia:  document.getElementById('ponto-referencia-entrega')?.value       || ''
        };

        console.log('📦 AddressManager.getEndereco():', endereco);
        return endereco;
    },

    limparTudo: function() {
        console.log('🗑️ AddressManager.limparTudo()');

        const campos = [
            'codigo-postal-cliente',
            'logradouro-cliente',
            'bairro-cliente',
            'cidade-cliente',
            'numero-residencia-cliente',
            'complemento-residencia-cliente',
            'ponto-referencia-entrega'
        ];

        campos.forEach(id => {
            const campo = document.getElementById(id);
            if (!campo) return;

            campo.value = '';
            campo.classList.remove('campo-valido', 'campo-invalido');

            if (['logradouro-cliente', 'bairro-cliente', 'cidade-cliente'].includes(id)) {
                campo.placeholder = 'Os dados podem ser preenchidos pelo CEP';
            }

            if (id === 'numero-residencia-cliente') {
                campo.disabled = false;
                campo.placeholder = 'Digite o número';
            }

            console.log(`✅ Campo ${id} limpo`);
        });

        this.enderecoAtual = {};
        this.cepAnterior   = '';
        console.log('✅ Estado resetado');
    },

    sincronizarCEPComModalDados: function(cep) {
        console.log('🔄 AddressManager: Sincronização forçada...');

        let tentativas = 0;
        const maxTentativas = 10;

        const executarSincronizacao = setInterval(() => {
            const campoCEPDados = document.getElementById('codigo-postal-cliente');
            tentativas++;

            if (campoCEPDados) {
                clearInterval(executarSincronizacao);

                const cepLimpo = cep.replace(/\D/g, '');

                // 🔑 Usa window.formatarCEP (utils.js) para formatar visualmente
                campoCEPDados.value = window.formatarCEP(cepLimpo);

                this.enderecoAtual.cep = cepLimpo;
                this.cepAnterior       = cepLimpo;

                if (cepLimpo.length === 8) {
                    console.log('🎯 Disparando busca de endereço...');

                    if (typeof window.buscarEnderecoPorCodigoPostal === 'function') {
                        window.buscarEnderecoPorCodigoPostal(cepLimpo);

                        setTimeout(() => {
                            const elLabelFrete = document.querySelector('.info-frete-titulo');
                            if (elLabelFrete) {
                                elLabelFrete.innerHTML      = 'FRETE ATUALIZADO:';
                                elLabelFrete.style.color      = 'var(--verde-militar)';
                                elLabelFrete.style.fontWeight = '900';
                            }
                        }, 1000);
                    }
                }
            } else if (tentativas >= maxTentativas) {
                clearInterval(executarSincronizacao);
                console.error('❌ Modal de dados não apareceu a tempo.');
            }
        }, 200);
    }
};
