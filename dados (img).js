const dadosIniciais = {
  "cupons": [
    {
      "codigo": "PROMO10",
      "valor": 10,
      "tipo": "porcentagem"
    },
    {
      "codigo": "BEMVINDO",
      "valor": 5,
      "tipo": "fixo"
    }
  ],
  "opcionais": {
    "Pães de fermentação natural": [
      { "nome": "Alichella (100g)", "preco": 20 },
      { "nome": "Sardella (100g)", "preco": 20 },
      { "nome": "Melanzane sottolio (100g)", "preco": 20 },
      { "nome": "Manteiga temperada (100g)", "preco": 17 },
      { "nome": "Confit de alho (100g)", "preco": 20 },
      { "nome": "Confit de alho e tomates cereja (100g)", "preco": 20 },
      { "nome": "Picles de cebola (100g)", "preco": 15 },
      { "nome": "Potinho de vidro", "preco": 5 }
    ],
    "Panini": [
      { "nome": "Ciabatta", "preco": 0 },
      { "nome": "Focaccia", "preco": 0 },
      { "nome": "Pão de Campanha", "preco": 0 },
      { "nome": "Pão de Forma Artesanal", "preco": 0 },
      { "nome": "Bresaola", "preco": 9 },
      { "nome": "Lombo piripiri", "preco": 9 },
      { "nome": "Mortadela", "preco": 5 },
      { "nome": "Pastrame", "preco": 9 },
      { "nome": "Presunto cru", "preco": 9 },
      { "nome": "Salame", "preco": 7 },
      { "nome": "Chancliche", "preco": 7 },
      { "nome": "Chancliche apimentado", "preco": 7 },
      { "nome": "Muçarela", "preco": 3 },
      { "nome": "Provolone", "preco": 5 },
      { "nome": "Queijo Prato", "preco": 5 },
      { "nome": "Alichella", "preco": 3 },
      { "nome": "Confit de alho", "preco": 2 },
      { "nome": "Confit de alho e tomates cereja", "preco": 3 },
      { "nome": "Melanzane sottolio", "preco": 3 },
      { "nome": "Picles de cebola", "preco": 2 },
      { "nome": "Sardella", "preco": 3 },
      { "nome": "Azeite", "preco": 1 },
      { "nome": "Manteiga", "preco": 2 },
      { "nome": "Manteiga temperada com alho e parmesão", "preco": 3 },
      { "nome": "Maionese", "preco": 2 },
      { "nome": "Maionese temperada", "preco": 2 },
      { "nome": "Pastinha de goronzola", "preco": 2 },
      { "nome": "Pastinha de parmesão", "preco": 2 },
      { "nome": "Pastinha de pimentão vermelho", "preco": 2 },
      { "nome": "Pesto de azeitona", "preco": 2 },
      { "nome": "Pesto tradicional (manjericão)", "preco": 2 },
      { "nome": "Alface", "preco": 1 },
      { "nome": "Pepino", "preco": 1 },
      { "nome": "Pimentão", "preco": 1 },
      { "nome": "Rúcula", "preco": 1 },
      { "nome": "Tomate", "preco": 1 }
    ],
    "Bebidas": [
      { "nome": "Taça de vidro", "preco": 40 },
      { "nome": "Taça champangne", "preco": 30 }
    ],
    "Antipasti": [
      { "nome": "Potinho de vidro", "preco": 5 }
    ],
    "Tábuas": [
      { "nome": "Alichella", "preco": 10 },
      { "nome": "Sardella", "preco": 10 },
      { "nome": "Melanzane sottolio", "preco": 10 },
      { "nome": "Manteiga", "preco": 3 },
      { "nome": "Manteiga temperada com alho e parmesão", "preco": 3 },
      { "nome": "Confit de alho", "preco": 4 },
      { "nome": "Confit de alho e tomates cereja", "preco": 4 },
      { "nome": "Picles de cebola", "preco": 3 },
      { "nome": "Bresaola", "preco": 15 },
      { "nome": "Lombo piripiri", "preco": 15 },
      { "nome": "Mortadela", "preco": 10 },
      { "nome": "Pastrame", "preco": 15 },
      { "nome": "Presunto cru", "preco": 15 },
      { "nome": "Salame", "preco": 11 },
      { "nome": "Chancliche", "preco": 7 },
      { "nome": "Chancliche apimentado", "preco": 7 },
      { "nome": "Muçarela", "preco": 5 },
      { "nome": "Provolone", "preco": 8 },
      { "nome": "Queijo Prato", "preco": 7 },
      { "nome": "Tomate", "preco": 3 },
      { "nome": "Azeite", "preco": 3 },
      { "nome": "Pesto tradicional (manjericão)", "preco": 4 },
      { "nome": "Pesto de azeitona", "preco": 4 },
      { "nome": "Maionese", "preco": 3 },
      { "nome": "Maionese temperada", "preco": 3 },
      { "nome": "Pastinha de goronzola", "preco": 4 },
      { "nome": "Pastinha de parmesão", "preco": 4 },
      { "nome": "Pastinha de pimentão vermelho", "preco": 4 }
    ]
  },
  "secoes": [
    {
      "nome": "Pães de fermentação natural",
      "itens": [
        {
          "nome": "Pão de Campanha",
          "descricao": "Pão rústico de longa fermentação...",
          "preco": 35,
          "imagem": "img/pao-campanha.jpg",
          "opcionais": "Pães de fermentação natural",
          "opcionais_ativos": ["Alichella (100g)", "Sardella (100g)", "Melanzane sottolio (100g)", "Manteiga temperada (100g)"],
          "esgotado": false
        },
        {
          "nome": "Pão Italiano",
          "descricao": "Pão artesanal de fermentação lenta...",
          "preco": 35,
          "imagem": "img/pao-italiano.jpg",
          "opcionais": "Pães de fermentação natural",
          "opcionais_ativos": ["Alichella (100g)", "Sardella (100g)", "Melanzane sottolio (100g)"],
          "esgotado": false
        },
        {
          "nome": "Demi baguette",
          "descricao": "Sabor rústico e autêntico...",
          "preco": 20,
          "imagem": "img/demi-baguette.jpg",
          "opcionais": "Pães de fermentação natural",
          "opcionais_ativos": ["Alichella (100g)", "Sardella (100g)", "Melanzane sottolio (100g)"],
          "esgotado": false
        },
        {
          "nome": "Ciabatta",
          "descricao": "Este pão rústico combina casca crocante...",
          "preco": 15,
          "imagem": "img/ciabatta.jpg",
          "opcionais": "Pães de fermentação natural",
          "opcionais_ativos": ["Alichella (100g)", "Sardella (100g)", "Melanzane sottolio (100g)", "Manteiga temperada (100g)", "Confit de alho (100g)", "Confit de alho e tomates cereja (100g)", "Picles de cebola (100g)", "Potinho de vidro"],
          "esgotado": false
        }
      ]
    },
    {
      "nome": "Antipasti",
      "itens": [
        {
          "nome": "Alichella (porção de 100g)",
          "descricao": "Conserva de aliche inteiras...",
          "preco": 20,
          "imagem": "img/alichella.jpg",
          "opcionais": "Antipasti",
          "opcionais_ativos": ["Potinho de vidro"]
        },
        {
          "nome": "Melanzane Sottolio (porção de 100g)",
          "descricao": "Berinjelas curtidas no vinagre...",
          "preco": 20,
          "imagem": "img/melanzane.jpg",
          "opcionais": "Antipasti",
          "opcionais_ativos": ["Potinho de vidro"]
        },
        {
          "nome": "Sardella (porção de 100g)",
          "descricao": "Pasta condimentada e cremosa...",
          "preco": 20,
          "imagem": "img/sardella.jpg",
          "opcionais": "Antipasti",
          "opcionais_ativos": ["Potinho de vidro"]
        }
      ]
    },
    {
      "nome": "Panini",
      "itens": [
        {
          "nome": "Monte seu Panino",
          "descricao": "Sanduíche feito na focaccia.",
          "preco": 5,
          "imagem": "img/panino-focaccia.webp",
          "opcionais": "Panini",
          "opcionais_ativos": ["Ciabatta", "Focaccia", "Lombo piripiri", "Mortadela", "Pastrame", "Presunto cru", "Salame", "Chancliche", "Chancliche apimentado", "Muçarela", "Provolone", "Queijo Prato", "Alichella", "Melanzane sottolio", "Sardella", "Azeite", "Manteiga", "Maionese", "Pesto de azeitona", "Pesto tradicional (manjericão)", "Alface", "Pepino", "Pimentão", "Rúcula", "Tomate"],
          "esgotado": false
        }
      ]
    },
    {
      "nome": "Tábuas",
      "itens": [
        {
          "nome": "Tábua de frios",
          "descricao": "Tábua de frios variados.",
          "preco": 49,
          "imagem": "img/tabua-frios.jpg",
          "opcionais": "Tábuas",
          "opcionais_ativos": ["Salame", "Muçarela", "Provolone", "Azeite", "Tomate"],
          "esgotado": false
        }
      ]
    },
    {
      "nome": "Bebidas",
      "itens": [
        {
          "nome": "Vinho Casillero del Diabo",
          "descricao": "Apresenta um perfil estruturado...",
          "preco": 65,
          "imagem": "img/vinho-casillero.jpg",
          "opcionais": "Bebidas",
          "opcionais_ativos": ["Taça de vidro", "Taça champangne"]
        },
        {
          "nome": "Vinho Gato Negro",
          "descricao": "Oferece um estilo acessível...",
          "preco": 65,
          "imagem": "img/vinho-gatonegro.jpg",
          "opcionais": "Bebidas",
          "opcionais_ativos": ["Taça de vidro"]
        },
        {
          "nome": "Espumante Veuve D`Argent Blanc De Blancs Demi-Sec",
          "descricao": "Com aroma de frutas frescas...",
          "preco": 85,
          "imagem": "img/espumante-veuve.jpg",
          "opcionais": "Bebidas",
          "opcionais_ativos": ["Taça champangne"]
        }
      ]
    }
  ]
};