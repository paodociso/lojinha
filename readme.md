# 🥖 Pão do Ciso - Ecossistema Web

> **Versão:** 2.0.0
> **Stack:** HTML5, CSS3, JavaScript (Vanilla ES6+)
> **Arquitetura:** Static Serverless (JSON-based persistence)

Este repositório contém o código-fonte da presença digital da padaria artesanal **Pão do Ciso**. O projeto é composto por duas interfaces desacopladas que compartilham uma base de dados estática.

---

## 🏗️ Arquitetura do Sistema

O sistema opera sem um backend dinâmico (como Node.js, PHP ou Python) em tempo real. A persistência e a lógica de negócios são geridas através de arquivos estáticos, permitindo hospedagem de custo zero (GitHub Pages, Vercel) e alta performance.

### Fluxo de Dados (Ciclo de Vida)
1.  **Storefront (Cliente):** A loja lê o arquivo `js/dados.js` no carregamento. Este arquivo contém todo o inventário, configurações de loja e regras de negócio.
2.  **Painel Administrativo (Gestão):** Uma ferramenta offline-first que carrega o `dados.js`, permite a edição visual de produtos e preços, e regenera o código do arquivo.
3.  **Atualização:** O administrador substitui o arquivo `js/dados.js` no servidor para aplicar mudanças globais.

---

## 📂 Estrutura de Arquivos

```bash
/
├── index.html                  # Entry point da Loja (SPA)
├── painelDeGestao-v3.2.html    # Ferramenta Admin (Single File Application)
├── css/
│   └── style.css               # Estilização global, variáveis e responsividade
├── js/
│   ├── config.js               # Constantes (WhatsApp, Pix, Versão)
│   ├── dados.js                # O "Banco de Dados" JSON
│   ├── main.js                 # Bootloader da aplicação
│   ├── cardapio.js             # Renderização das seções e cards
│   ├── produto-modal.js        # Lógica de Opcionais (Tree Search) e Subtotal
│   ├── carrinho.js             # State Management do carrinho
│   ├── recuperacao-carrinho.js # Persistência via LocalStorage
│   ├── cep-frete.js            # Lógica de taxas por bairro
│   ├── fornada.js              # Controle de datas e prazos
│   ├── notificacoes.js         # Sistema de Toasts/Alertas
│   └── utils.js                # Formatadores (Moeda, Datas)
└── img/                        # Assets otimizados (WebP/JPG)
```

---

## 🧠 Módulos e Lógicas Chave

### 1. Sistema de Opcionais em Árvore (`produto-modal.js`)
Implementamos uma estrutura hierárquica para lidar com produtos complexos (ex: "Monte seu Panino").
* **Estrutura de Dados:** No `dados.js`, os opcionais são organizados por categorias (ex: `Panini -> { Pães: [...], Queijos: [...] }`).
* **Deep Search:** O algoritmo de busca varre essa árvore para encontrar itens pelo nome e identificar automaticamente a qual categoria pertencem, renderizando títulos organizadores no modal sem necessidade de configuração manual no produto.

### 2. Carrinho Persistente (`recuperacao-carrinho.js`)
* O estado do carrinho é salvo no `localStorage` a cada modificação.
* Ao reabrir a página, o sistema detecta carrinhos abandonados e oferece ao usuário a opção de restaurar o pedido pendente.

### 3. Checkout via WhatsApp
* Não há gateway de pagamento. O pedido é serializado em uma string de texto formatada (URI Encoded) e enviado diretamente para a API do WhatsApp (`wa.me`).

---

## 🛠️ Painel de Gestão (Admin)

O arquivo `painelDeGestao-v3.2.html` funciona de forma independente do site principal.

**Funcionalidades:**
* **CRUD de Produtos:** Edição de preços, descrições, imagens e status (Esgotado/Visível).
* **Gestão Logística:** Configuração de taxas de entrega por bairro.
* **Controle de Fornada:** Definição da data limite para pedidos.
* **Exportação:** Gera uma string JavaScript válida (`window.dadosIniciais = ...`) pronta para substituir o arquivo de produção.

---

## 🚀 Instalação e Deploy

### Rodando Localmente
1.  Clone o repositório.
2.  Abra o `index.html` no navegador.
    * *Recomendado:* Usar uma extensão como "Live Server" (VS Code) para simular um servidor HTTP e evitar bloqueios de CORS estritos de alguns navegadores, embora o projeto suporte protocolo `file://`.

### Atualizando o Cardápio (Deploy)
1.  Abra o Painel de Gestão localmente.
2.  Carregue o arquivo `js/dados.js` atual.
3.  Faça as alterações necessárias.
4.  Clique em **"Baixar Arquivo Atualizado"**.
5.  Substitua o arquivo `js/dados.js` na pasta do projeto.
6.  Faça o *push* para o repositório/servidor.

---

## 🐛 Troubleshooting

* **Alterações não aparecem no celular:**
    Devido à natureza estática dos arquivos JS, navegadores móveis tendem a fazer cache agressivo.
    * *Solução:* Alterar a versão no `config.js` ou instruir o usuário a limpar o cache.
* **Preço "R$ 0,00" nos Opcionais:**
    Ocorre se o nome do opcional na lista do produto não for **exatamente idêntico** (incluindo maiúsculas/minúsculas) ao nome cadastrado na biblioteca de opcionais.

---

© 2026 Pão do Ciso - Desenvolvido internamente.
