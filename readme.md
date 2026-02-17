🥖 Pão do Ciso - WebApp & Painel de Gestão
Versão: 2.0.0
Tipo: Single Page Application (SPA) / Static Site
Stack: HTML5, CSS3, Vanilla JavaScript (ES6+)

Este repositório contém o ecossistema digital da padaria artesanal Pão do Ciso, composto por duas aplicações web integradas via arquitetura de dados estáticos:

Cardápio Digital (Storefront): Interface para o cliente final realizar pedidos.

Painel de Gestão (Admin): Interface administrativa para controle de produtos, preços e configurações.

🏗️ Arquitetura do Sistema
O sistema opera sob uma arquitetura Serverless Static, onde não há banco de dados tradicional (SQL/NoSQL) rodando em tempo real. A persistência de dados é baseada em arquivos (dados.js), tornando a hospedagem extremamente leve (GitHub Pages, Vercel, Netlify) e de custo zero.

Fluxo de Dados
Leitura: O Cardápio Digital lê o arquivo js/dados.js ao carregar a página para renderizar produtos e configurações.

Escrita (Simulada): O Painel de Gestão carrega o dados.js, permite edições na UI e gera um novo arquivo dados.js para download.

Deploy: O administrador substitui o arquivo antigo pelo novo no servidor para atualizar o cardápio.

📂 Estrutura de Arquivos
Bash
/
├── index.html                  # Entry point do Cardápio Digital (SPA)
├── painelDeGestao-v3.2.html    # Ferramenta administrativa (Single File App)
├── css/
│   └── style.css               # Estilos globais, variáveis CSS e responsividade
├── js/
│   ├── config.js               # Constantes globais (WhatsApp, Pix, Versão)
│   ├── dados.js                # "Banco de Dados" em formato JSON
│   ├── main.js                 # Inicializador e orquestrador de scripts
│   ├── cardapio.js             # Lógica de renderização das seções e cards
│   ├── produto-modal.js        # Lógica do modal de detalhes, opcionais e subtotal
│   ├── carrinho.js             # Gestão de estado do carrinho (Add/Remove/Update)
│   ├── recuperacao-carrinho.js # Lógica de persistência (LocalStorage)
│   ├── cep-frete.js            # Cálculo de taxas de entrega por bairro
│   ├── fornada.js              # Lógica de datas e prazos de pedidos
│   ├── opcionais.js            # (Legado/Auxiliar) Tratamento de listas
│   ├── notificacoes.js         # Sistema de toasts/feedbacks visuais
│   └── utils.js                # Formatadores de moeda e helpers
└── img/                        # Ativos de imagem (WebP/JPG)
🧠 Módulos Principais e Lógica
1. Sistema de Opcionais Híbrido (produto-modal.js)
Este é o módulo mais complexo do sistema. Ele implementa uma lógica de "Busca em Árvore" para renderizar opcionais e acompanhamentos.

Problema: Produtos possuem opcionais complexos (ex: "Monte seu Panino" requer pães, queijos e saladas) e produtos simples.

Solução: O dados.js estrutura opcionais em categorias hierárquicas.

Algoritmo:

O produto define uma lista simples de IDs: ["Ciabatta", "Salame", "Rúcula"].

O script varre a árvore de categorias em dadosIniciais.opcionais.

Ao encontrar o item, ele identifica a categoria pai (ex: "🥖 Pães Artesanais").

Na renderização, agrupa automaticamente os itens sob seus respectivos títulos.

Fallback: Se o item não estiver na árvore, ele busca nas seções de produtos (permitindo vender produtos como adicionais, ex: "Alichella").

2. Carrinho e Persistência (carrinho.js & recuperacao-carrinho.js)
State Management: O carrinho é um objeto global window.carrinho.

Persistência: Todo update no carrinho dispara um salvamento no localStorage.

Recuperação: Ao recarregar a página, o sistema verifica o localStorage e, se houver itens pendentes, restaura o estado e exibe um modal perguntando se o cliente deseja continuar a compra.

3. Checkout via WhatsApp
O sistema não processa pagamentos. Ele compila o pedido em uma string formatada (usando encodeURIComponent) e gera um link wa.me que envia o pedido detalhado diretamente para o WhatsApp do vendedor.

🛠️ Painel de Gestão
O arquivo painelDeGestao-v3.2.html é uma ferramenta autônoma. Ele não depende do CSS do site principal para evitar conflitos.

Funcionalidades
CRUD de Produtos: Editar nome, preço, descrição e visibilidade.

Gestão de Logística: Adicionar/Remover bairros e taxas de entrega.

Controle de Fornada: Definir data da próxima fornada e dia limite para pedidos.

Gestão de Opcionais: Edição da árvore de categorias e preços de adicionais.

Mecanismo de Exportação
O painel possui uma função gerarConteudoDadosJS() que reconstrói a string do arquivo JavaScript.

JavaScript
// Exemplo simplificado da lógica de exportação
function gerarConteudoDadosJS() {
    let conteudo = "window.dadosIniciais = {\n";
    conteudo += `    loja: ${JSON.stringify(db.loja, null, 3)},\n`;
    // ...
    return conteudo;
}
Isso garante que a sintaxe do arquivo baixado seja válida para execução direta no navegador.

🎨 Design System & CSS
O projeto utiliza CSS puro com CSS Variables para fácil manutenção de tema.

Cores Principais:

--verde-militar: #2d3a27 (Ações primárias, Títulos)

--bg-creme: #fdf5e6 (Fundo, sensação orgânica)

Componentes Chave:

Modal Sticky Footer: O #container-subtotal-produto utiliza position: sticky para garantir que o subtotal e botões de ação estejam sempre visíveis, independentemente do tamanho da lista de rolagems.

Grid Responsivo: O cardápio utiliza display: grid com auto-fill para se adaptar de mobile (1 coluna) a desktop (3+ colunas).

🚀 Como Rodar e Atualizar
Instalação Local
Clone o repositório.

Abra o index.html diretamente no navegador (ou use uma extensão como "Live Server" no VS Code para evitar bloqueios de CORS em alguns navegadores, embora o projeto seja desenhado para rodar via protocolo file:// se necessário).

Atualizando o Cardápio (Dia a Dia)
Abra painelDeGestao-v3.2.html.

Carregue o arquivo js/dados.js atual.

Faça as alterações (ex: mudar data da fornada, esgotar um produto).

Clique em "Salvar Alterações (Baixar JS)".

Substitua o arquivo js/dados.js antigo pelo novo arquivo baixado.

Faça o commit/push para o repositório (se usar Git) ou upload para o servidor.

🐛 Troubleshooting Comum
Preço Zerado no Modal:

Causa: O nome do opcional na lista opcionais_ativos do produto não bate exatamente (case-sensitive) com o nome na biblioteca opcionais.

Solução: Verificar grafia no dados.js.

Alterações não aparecem:

Causa: Cache do navegador.

Solução: O cliente deve fazer Hard Reload (Ctrl+F5) ou o desenvolvedor deve alterar a versão no config.js para forçar atualização (se houver cache busting implementado).

Erro Unexpected token no Console:

Causa: Erro de sintaxe no JSON do dados.js (geralmente falta de vírgula entre objetos).

Solução: Usar um validador de JSON ou verificar as vírgulas após as chaves },.