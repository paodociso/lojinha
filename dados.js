const dadosIniciais = {
  
  // =============================================
  // SISTEMA DE CUPONS DE DESCONTO
  // =============================================
  cupons: [
    { 
      codigo: "PROMO10",       // Código do cupom
      valor: 10,               // Valor do desconto
      tipo: "porcentagem"      // Tipo: "porcentagem" ou "fixo"
    },
    { 
      codigo: "BEMVINDO",      // Código para novos clientes
      valor: 5,                // Desconto fixo de R$ 5,00
      tipo: "fixo"             // Desconto em valor fixo
    }
  ],

  // =============================================
  // OPÇÕES ADICIONAIS PARA OS PRODUTOS
  // =============================================
  "opcionais": {
    // Opções específicas para Pães de fermentação natural
    "Pães de fermentação natural": [
      { "nome": "Alichella (100g)", "preco": 20.00 },
      { "nome": "Sardella (100g)", "preco": 20.00 },
      { "nome": "Melanzane sottolio (100g)", "preco": 20.00 },
      { "nome": "Manteiga temperada (100g)", "preco": 17.00 },
      { "nome": "Confit de alho (100g)", "preco": 20.00 },
      { "nome": "Confit de alho e tomates cereja (100g)", "preco": 20.00 },
      { "nome": "Picles de cebola (100g)", "preco": 15.00 },
      { "nome": "Potinho de vidro", "preco": 5.00 }  // Embalagem especial
    ],

    // Opções para montagem de Panini (sanduíches)
    "Panini": [
      // Tipos de pão (sem custo adicional)
      { "nome": "Ciabatta", "preco": 0.00 },
      { "nome": "Focaccia", "preco": 0.00 },
      { "nome": "Pão de Campanha", "preco": 0.00 },
      { "nome": "Pão de Forma Artesanal", "preco": 0.00 },

      // Frios e carnes
      { "nome": "Bresaola", "preco": 9.00 },
      { "nome": "Lombo piripiri", "preco": 9.00 },
      { "nome": "Mortadela", "preco": 5.00 },
      { "nome": "Pastrame", "preco": 9.00 },
      { "nome": "Presunto cru", "preco": 9.00 },
      { "nome": "Salame", "preco": 7.00 },
      { "nome": "Chancliche", "preco": 7.00 },
      { "nome": "Chancliche apimentado", "preco": 7.00 },

      // Queijos
      { "nome": "Muçarela", "preco": 3.00 },
      { "nome": "Provolone", "preco": 5.00 },
      { "nome": "Queijo Prato", "preco": 5.00 },

      // Condimentos e pastas
      { "nome": "Alichella", "preco": 3.00 },
      { "nome": "Confit de alho", "preco": 2.00 },
      { "nome": "Confit de alho e tomates cereja", "preco": 3.00 },
      { "nome": "Melanzane sottolio", "preco": 3.00 },
      { "nome": "Picles de cebola", "preco": 2.00 },
      { "nome": "Sardella", "preco": 3.00 },

      // Molhos e azeites
      { "nome": "Azeite", "preco": 1.00 },
      { "nome": "Manteiga", "preco": 2.00 },
      { "nome": "Manteiga temperada com alho e parmesão", "preco": 3.00 },
      { "nome": "Maionese", "preco": 2.00 },
      { "nome": "Maionese temperada", "preco": 2.00 },
      { "nome": "Pastinha de goronzola", "preco": 2.00 },
      { "nome": "Pastinha de parmesão", "preco": 2.00 },
      { "nome": "Pastinha de pimentão vermelho", "preco": 2.00 },
      { "nome": "Pesto de azeitona", "preco": 2.00 },
      { "nome": "Pesto tradicional (manjericão)", "preco": 2.00 },

      // Vegetais e folhas
      { "nome": "Alface", "preco": 1.00 },
      { "nome": "Pepino", "preco": 1.00 },
      { "nome": "Pimentão", "preco": 1.00 },
      { "nome": "Rúcula", "preco": 1.00 },
      { "nome": "Tomate", "preco": 1.00 }
    ],

    // Acessórios para bebidas
    "Bebidas": [
      { "nome": "Taça de vidro", "preco": 40.00 },
      { "nome": "Taça champangne", "preco": 30.00 }
    ],

    // Opções para Antipasti
    "Antipasti": [
      { "nome": "Potinho de vidro", "preco": 5.00 }
    ],

    // Opções para Tábuas (para compartilhar)
    "Tábuas": [
      // Condimentos e pastas
      { "nome": "Alichella", "preco": 10.00 },
      { "nome": "Sardella", "preco": 10.00 },
      { "nome": "Melanzane sottolio", "preco": 10.00 },
      { "nome": "Manteiga", "preco": 3.00 },
      { "nome": "Manteiga temperada com alho e parmesão", "preco": 3.00 },
      { "nome": "Confit de alho", "preco": 4.00 },
      { "nome": "Confit de alho e tomates cereja", "preco": 4.00 },
      { "nome": "Picles de cebola", "preco": 3.00 },

      // Frios e carnes
      { "nome": "Bresaola", "preco": 15.00 },
      { "nome": "Lombo piripiri", "preco": 15.00 },
      { "nome": "Mortadela", "preco": 10.00 },
      { "nome": "Pastrame", "preco": 15.00 },
      { "nome": "Presunto cru", "preco": 15.00 },
      { "nome": "Salame", "preco": 11.00 },

      // Queijos
      { "nome": "Chancliche", "preco": 7.00 },
      { "nome": "Chancliche apimentado", "preco": 7.00 },
      { "nome": "Muçarela", "preco": 5.00 },
      { "nome": "Provolone", "preco": 8.00 },
      { "nome": "Queijo Prato", "preco": 7.00 },

      // Acompanhamentos
      { "nome": "Tomate", "preco": 3.00 },
      { "nome": "Azeite", "preco": 3.00 },

      // Molhos
      { "nome": "Pesto tradicional (manjericão)", "preco": 4.00 },
      { "nome": "Pesto de azeitona", "preco": 4.00 },
      { "nome": "Maionese", "preco": 3.00 },
      { "nome": "Maionese temperada", "preco": 3.00 },
      { "nome": "Pastinha de goronzola", "preco": 4.00 },
      { "nome": "Pastinha de parmesão", "preco": 4.00 },
      { "nome": "Pastinha de pimentão vermelho", "preco": 4.00 }
    ]
  },

  // =============================================
  // CATEGORIAS PRINCIPAIS DO CARDÁPIO
  // =============================================
  "secoes": [
    {
      "nome": "Pães de fermentação natural",
      "itens": [
        {
          "nome": "Pão de Campanha",
          "descricao": "Pão rústico de longa fermentação, com blend de trigo italiano refinado, trigo integral orgânico e centeio integral orgânico. Casca crocante e miolo úmido e saboroso.",
          "preco": 35.00,
          "imagem": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBRTRiWaC_PMwgQXyjJfzsIWy_J3hkIHunKRcZYcLdN-CYG35K1L1EswxZ_Ath9EYFbaxbD8H9H7oDPCbQKtwhD5nVusLs7K0kOJHFzz7vmBr008_0VKT-lJ7fvn3WkneNE5oX6s3AoQC17B8urlCJlSIMH-payx2WCgUdjEx_ZuKxfesnfpHxiOTWBo0/s914/1000055109.jpg",
          "opcionais": "Pães de fermentação natural"  // Chave para encontrar opcionais
        },
        {
          "nome": "Pão Italiano",
          "descricao": "Pão artesanal de fermentação lenta, feito com farinha de trigo italiana refinada. Casca fina e dourada, miolo alveolado e úmido, com sabor autêntico.",
          "preco": 35.00,
          "imagem": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMFsu1AGezB-IwKPTAOIKWgIFGjyNAdFfGctT8EsfFLIPX0dFTpVSVuCgF2MYYpmoc1n30aJubSS1I2u6WNmueDDioKeV6yVLIC46C_vxPLxuN82nA4P5kPfHF6A2Qq67v4STkPL4a_ZrYkQCy7OmrEP4qCAjj79bm0Jst4LpKEd0VgU9pzRhgPSmvZY8/s320/IMG_20201101_192911-01.jpeg",
          "opcionais": "Pães de fermentação natural"
        },
        {
          "nome": "Demi baguette",
          "descricao": "Sabor rústico e autêntico em cada mordida com nossa Demi-Baguete de Campanha artesanal. A união equilibrada entre uma crosta crocante e o miolo macio com toque de farinha integral.",
          "preco": 20.00,
          "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdwFszh8tuVkp2ThvopyeO9STNUL_KMm2WTQ&s",
          "opcionais": "Pães de fermentação natural",
          "esgotado": false  // Status de disponibilidade
        },
        {
          "nome": "Ciabatta",
          "descricao": "Este pão rústico combina casca crocante e miolo leve, de sabor profundo. Simples, autêntica e feita para quem valoriza pão de verdade.",
          "preco": 15.00,
          "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp_hUL-2CI9KGs71HlX67WfdGKD3ZfxrgHaA&s",
          "opcionais": "Pães de fermentação natural",
          "esgotado": false
        }
      ]
    },
    {
      "nome": "Antipasti",
      "itens": [
        {
          "nome": "Alichella (porção de 100g)",
          "descricao": "Conserva de aliche inteiras, curadas e acondicionadas em azeite com salsa fresca.",
          "preco": 20.00,
          "imagem": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjB6CH6FBqAhBXaVZiqLdjRqhlXGeDsrhkxKNgpRaeZw6lVWyGJ92hhVzNU4GxLFqq_B651AwJVwi1axSj58lPa6bkByQtR8RuSBk2EkdFLmPhcb-y3V4yyt-WOXjCBvVsaRbS2IsIW_b4YglTwG9YkHncLqWdrEo7SiFdLT3f7KIq4Mfi3ayKaN_vJSp4/s320/IMG_20201202_174740.jpg",
          "opcionais": "Antipasti"
        },
        {
          "nome": "Melanzane Sottolio (porção de 100g)",
          "descricao": "Berinjelas curtidas no vinagre e preservada no azeite com ervas e alho.",
          "preco": 20.00,
          "imagem": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjygUAEJw4jjQR0fWMII5hc7QX1Ppu22I32LXjNTfcxf7B43coy-6gOXmdPiwCrL_NyWFuPM3HYzifiS_CuiqAD6efRxq9eYdbrr5I8C7x_jyn6I3w-OBplN5w184KYh5ZDnSF6iR6Bl6HQP5kRz8iycmQtRIfbeSR-5WvkfyQ7CFOuQKVLwwNPs5H_nj4/s4032/IMG_20201202_174658.jpg",
          "opcionais": "Antipasti"
        },
        {
          "nome": "Sardella (porção de 100g)",
          "descricao": "Pasta condimentada e cremosa, elaborada com aliche, pimenta e azeite de oliva.",
          "preco": 20.00,
          "imagem": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQr6FhXNpHgq1UNH0_J2bSno3jBTP98sUzlCXzFAAHXXdPFD2ml002SzVE-fvX8pnZ7TXAPZ45fcbMvN6oypcIspRmQzvSvyH9On2BUgnWzrEt77mQWdDo5XSk0hsrg5OrfCEGZWB1a-7htRxs10OhXCM504N4-b1mSmK8FX5z9O4d84Y3pri-cJtqUOE/s320/IMG_20201202_174720.jpg",
          "opcionais": "Antipasti"
        },
        {
          "nome": "Manteiga temperada (porção de 100g)",
          "descricao": "Manteiga batida com ervas finas e alho assado.",
          "preco": 17.00,
          "imagem": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-adSktW0kI4Kzb7Wd9S_GxgJ1LsAJ4U0UOTIPfHJbhfLo56YHRcLW4w2NXqiO-jfGA8Vm0RKUXzwYCIhHLoytuQnGfYOeV9WIL3rHZ2EM_HmVe-_axzJskHiK4Jerh1uBr0bLWEZkvdG3Zszn_1ysaRyWt1jJPqi1esQA0gpub7g9mn8PqP63s4WC9MU/s2048/garlicbutter1.jpeg",
          "opcionais": "Antipasti",
          "esgotado": true  // Produto temporariamente indisponível
        },
        {
          "nome": "Picles de cebola (porção de 100g)",
          "descricao": "Cebolas em conserva agridoce, que conservam uma agradável crocância.",
          "preco": 17.00,
          "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj4_qCb1HDgQQJ_28yAzCCZ1DkiP9OQNHrQA&s",
          "opcionais": "Antipasti",
          "esgotado": true
        },
        {
          "nome": "Confit de alho (porção de 100g)",
          "descricao": "Dentes de alho cozidos lentamente em azeite até ficarem cremosos.",
          "preco": 20.00,
          "imagem": "https://francinha.com/novo/wp-content/uploads/2020/12/alho-confit-10.jpg",
          "opcionais": "Antipasti",
          "esgotado": true
        },
        {
          "nome": "Confit de alho e tomates cereja (porção de 100g)",
          "descricao": "Mistura de alho confitado e tomates cereja assados.",
          "preco": 20.00,
          "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg-1J_u_Kx2CIKSxLN1kASv_KQoogDYMioEA&s",
          "opcionais": "Antipasti",
          "esgotado": true
        }
      ]
    },
    {
      "nome": "Panini",
      "itens": [
        {
          "nome": "Monte seu Panino",
          "descricao": "Sanduíche feito na focaccia.",
          "preco": 5.00,  // Preço base
          "imagem": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEitZymyPMeuU_jGjxwn3OHAYNZBI-HjQ3iDgT2h30x_bYHjuJ9yLVEujlN7ePgElLUsFoPEtuZ_50Dk1h6b7RDegdHkgfPn4jjX_aJ3V99nvLovOxgm5-3zIDDhEJndTiCwcV5F0_gx-j-M-bkHTzqv180cOFqVoJQETTlTnVDC1Fmw2QI8dqoBCUMoFLc/s984/panino-focaccia.webp",
          "opcionais": "Panini",  // Usa as opções da chave "Panini"
          "esgotado": true
        }
      ]
    },
    {
      "nome": "Tábuas",
      "itens": [
        {
          "nome": "Tábua de frios",
          "descricao": "Tábua de frios variados.",
          "preco": 49.00,
          "imagem": "https://www.seara.com.br/wp-content/uploads/2025/09/tabua-de-frios-portal-minha-receita-2.jpg",
          "opcionais": "Tábuas",  // Usa as opções da chave "Tábuas"
          "esgotado": true
        }
      ]
    },
    {
      "nome": "Bebidas",
      "itens": [
        {
          "nome": "Vinho Casillero del Diabo",
          "descricao": "Apresenta um perfil estruturado, com taninos presentes e notas de frutas escuras. Originário de vinhedos tradicionais do Chile, resulta em um vinho de caráter definido.",
          "preco": 65.00,
          "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYaHOkBDckYwSbN7zRWW8jBaTbpAspAhL7Yw&s",
          "opcionais": "Bebidas"
        },
        {
          "nome": "Vinho Gato Negro",
          "descricao": "Oferece um estilo acessível, com corpo médio e caráter frutado. Sua produção é voltada para a consistência e fácil harmonização.",
          "preco": 65.00,
          "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu2fnk2nSTof_uQEhdkvXZph42MlGq_jjLKQ&s",
          "opcionais": "Bebidas"
        },
        {
          "nome": "Espumante Veuve D`Argent Blanc De Blancs Demi-Sec",
          "descricao": "Com aroma de frutas frescas como abacaxi e pera. Elaborado na França, exemplar jovem, moderno e fácil de beber.",
          "preco": 85.00,
          "imagem": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl1vG1vVosO5TGSI8FdvkFkrp0WjzJTIGF6A&s",
          "opcionais": "Bebidas"
        }
      ]
    }
  ]
};