// ============================================
// DADOS DO SISTEMA - PÃO DO CISO
// ============================================

window.dadosIniciais = {
    loja: {
  "nome": "PÃO DO CISO",
  "telefone": "(11) 97679-9866",
  "whatsapp": "5511976799866",
  "email": "paodociso@gmail.com",
  "endereco": "Endereço da loja",
  "instagram": "@paodociso"
},

    fornada: {
  "dataISO": "2026-02-23",
  "diasAntecedencia": 2,
  "horaLimite": "23:59h"
},

    entrega: {
        "taxaGeral": 10,
        "bairros": [
            {"nome":"Centro","taxa":10},
            {"nome":"Vila Aparecida","taxa":12},
            {"nome":"Cidade Planejada","taxa":17},
            {"nome":"Parque dos Estados","taxa":17},
            {"nome":"Altos de Bragança","taxa":13},
            {"nome":"Residencial das Ilhas","taxa":13},
            {"nome":"Jardim Nova Bragança","taxa":11},
            {"nome":"Santa Helena","taxa":15},
            {"nome":"Jardim Europa","taxa":10},
            {"nome":"Jardim América","taxa":10},
            {"nome":"Bosques da Pedra","taxa":18},
            {"nome":"Jardim Fraternidade","taxa":18},
            {"nome":"Jardim São Miguel","taxa":15},
            {"nome":"Taboão","taxa":10}
        ]
    },

    cupons: [
        {"codigo":"PROMO10","valor":10,"tipo":"porcentagem"},
        {"codigo":"MATHILDE15","tipo":"porcentagem","valor":15},
        {"codigo":"PRIMEIRACOMPRA","tipo":"porcentagem","valor":15},
        {"codigo":"MENOS10","tipo":"fixo","valor":10}
    ],

    opcionais: {
        "Pães de fermentação natural": [
            {"nome":"Alichella (100g)","preco":20},
            {"nome":"Sardella (100g)","preco":20},
            {"nome":"Melanzane sottolio (100g)","preco":20},
            {"nome":"Manteiga temperada (100g)","preco":17},
            {"nome":"Confit de alho (100g)","preco":20},
            {"nome":"Confit de alho e tomates cereja (100g)","preco":20},
            {"nome":"Picles de cebola (100g)","preco":15},
            {"nome":"Potinho de vidro","preco":5}
        ],
        "Panini": {
            "🥖 Escolha seu Pão": [
                {"nome":"Ciabatta","preco":3},
                {"nome":"Focaccia","preco":3},
                {"nome":"Demi baguette","preco":3},
                {"nome":"Pão de Campanha","preco":3}
            ],
            "🥓 Charcutaria": [
                {"nome":"Bresaola","preco":9},
                {"nome":"Lombo piripiri","preco":9},
                {"nome":"Mortadela","preco":5},
                {"nome":"Pastrame","preco":9},
                {"nome":"Presunto cru","preco":9},
                {"nome":"Salame","preco":7}
            ],
            "🧀 Queijos": [
                {"nome":"Chancliche","preco":7},
                {"nome":"Chancliche apimentado","preco":7},
                {"nome":"Muçarela","preco":3},
                {"nome":"Provolone","preco":5},
                {"nome":"Queijo Prato","preco":5}
            ],
            "🏺 Antepastos e Conservas": [
                {"nome":"Alichella","preco":3},
                {"nome":"Confit de alho","preco":3},
                {"nome":"Confit de alho e tomates cereja","preco":3},
                {"nome":"Melanzane sottolio","preco":3},
                {"nome":"Picles de cebola","preco":2},
                {"nome":"Sardella","preco":3}
            ],
            "🥣 Molhos e Pastas": [
                {"nome":"Azeite extravirgem","preco":1},
                {"nome":"Manteiga","preco":2},
                {"nome":"Manteiga temperada com alho e parmesão","preco":3},
                {"nome":"Maionese","preco":2},
                {"nome":"Maionese temperada","preco":2},
                {"nome":"Pastinha de goronzola","preco":2},
                {"nome":"Pastinha de parmesão","preco":2},
                {"nome":"Pastinha de pimentão vermelho","preco":2},
                {"nome":"Pesto de azeitona","preco":2},
                {"nome":"Pesto tradicional (manjericão)","preco":2}
            ],
            "🥗 Vegetais Frescos": [
                {"nome":"Alface","preco":1},
                {"nome":"Pepino","preco":1},
                {"nome":"Pimentão","preco":1},
                {"nome":"Rúcula","preco":1},
                {"nome":"Tomate","preco":1}
            ]
        },
        "Bebidas": [
            {"nome":"Taça para vinho","preco":40},
            {"nome":"Taça para espumante","preco":30}
        ],
        "Antipasti": [
            {"nome":"Potinho de vidro","preco":5}
        ],
        "Tábuas": {
            "🥓 Charcutaria": [
                {"nome":"Bresaola","preco":15},
                {"nome":"Lombo piripiri","preco":15},
                {"nome":"Mortadela","preco":10},
                {"nome":"Pastrame","preco":15},
                {"nome":"Presunto cru","preco":15},
                {"nome":"Salame","preco":11}
            ],
            "🧀 Queijos": [
                {"nome":"Chancliche","preco":7},
                {"nome":"Chancliche apimentado","preco":7},
                {"nome":"Muçarela","preco":5},
                {"nome":"Provolone","preco":8},
                {"nome":"Queijo Prato","preco":7}
            ],
            "🏺 Antipasti": [
                {"nome":"Alichella","preco":10},
                {"nome":"Sardella","preco":10},
                {"nome":"Melanzane sottolio","preco":10},
                {"nome":"Confit de alho","preco":4},
                {"nome":"Confit de alho e tomates cereja","preco":4},
                {"nome":"Picles de cebola","preco":3},
                {"nome":"Tomate","preco":3}
            ],
            "🥣 Pastas, Patês e Molhos": [
                {"nome":"Pastinha de goronzola","preco":4},
                {"nome":"Pastinha de parmesão","preco":4},
                {"nome":"Pastinha de pimentão vermelho","preco":4},
                {"nome":"Pesto de azeitona","preco":4},
                {"nome":"Pesto tradicional (manjericão)","preco":4},
                {"nome":"Manteiga","preco":3},
                {"nome":"Manteiga temperada com alho e parmesão","preco":3},
                {"nome":"Maionese","preco":3},
                {"nome":"Maionese temperada","preco":3},
                {"nome":"Azeite extravirgem","preco":3}
            ]
        },
        "Cafés": [
            {"nome":"Potinho de plástico","preco":2},
            {"nome":"Potinho de vidro","preco":5}
        ]
    },

    secoes: [
  {
    "nome": "Pães de fermentação natural",
    "itens": [
      {
        "nome": "Pão de Campanha",
        "descricao": "Pão rústico de longa fermentação, com blend de trigo italiano refinado, trigo integral orgânico e centeio integral orgânico. Casca crocante e miolo úmido e saboroso.",
        "preco": 35,
        "imagem": "img/paodecampanha.jpg",
        "opcionais_ativos": [
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Potinho de vidro"
        ],
        "esgotado": false,
        "visivel": true
      },
      {
        "nome": "Pão Italiano",
        "descricao": "Pão artesanal de fermentação lenta, feito com farinha de trigo italiana refinada. Casca fina e dourada, miolo alveolado e úmido, com sabor autêntico.",
        "preco": 35,
        "imagem": "img/paoitaliano.jpeg",
        "opcionais_ativos": [
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Potinho de vidro"
        ],
        "esgotado": false,
        "visivel": true
      },
      {
        "nome": "Demi baguette",
        "descricao": "Sabor rústico e autêntico em cada mordida com nossa Demi-Baguete de Campanha artesanal. A união equilibrada entre uma crosta crocante e o miolo macio com toque de farinha integral.",
        "imagem": "img/demibaguete.jpeg",
        "preco": 20,
        "opcionais_ativos": [
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Potinho de vidro"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Pão com mix de grãos",
        "descricao": "Pão rústico de longa fermentação, com blend de trigo italiano refinado, trigo integral orgânico e centeio integral orgânico. Casca crocante e miolo úmido e saboroso.",
        "preco": 38,
        "imagem": "img/paodecampanha.jpg",
        "opcionais_ativos": [
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Potinho de vidro"
        ],
        "esgotado": true,
        "visivel": true
      },
      {
        "nome": "Ciabatta",
        "descricao": "Este pão rústico combina casca crocante e miolo leve, de sabor profundo. Simples, autêntica e feita para quem valoriza pão de verdade.",
        "preco": 15,
        "imagem": "img/ciabatta.webp",
        "opcionais_ativos": [
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Potinho de vidro"
        ],
        "esgotado": false,
        "visivel": true
      }
    ]
  },
  {
    "nome": "Antipasti",
    "itens": [
      {
        "nome": "Alichella (porção de 100g)",
        "descricao": "Conserva de aliche inteiras, curadas e acondicionadas em Azeite extravirgem com salsa fresca.",
        "preco": 20,
        "imagem": "img/alichella.jpg",
        "opcionais": "Antipasti",
        "opcionais_ativos": [
          "Potinho de vidro"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Melanzane Sottolio (porção de 100g)",
        "descricao": "Berinjelas curtidas e preservadas no Azeite extravirgem com ervas,alho e pimenta.",
        "preco": 20,
        "imagem": "img/melanzanesottolio.jpg",
        "opcionais": "Antipasti",
        "opcionais_ativos": [
          "Potinho de vidro"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Sardella (porção de 100g)",
        "descricao": "Pasta condimentada e cremosa, elaborada com aliche, pimenta e Azeite extravirgem de oliva.",
        "preco": 20,
        "imagem": "img/sardella.jpg",
        "opcionais": "Antipasti",
        "opcionais_ativos": [
          "Potinho de vidro"
        ],
        "visivel": true,
        "esgotado": false
      }
    ]
  },
  {
    "nome": "Panini",
    "itens": [
      {
        "nome": "Giovanni",
        "descricao": "Sanduíche feito com mortadela Giovanni Ceratti.",
        "preco": 7,
        "imagem": "img/panino-mortadela.webp",
        "opcionais": "Panini",
        "opcionais_ativos": [
          "Focaccia",
          "Ciabatta",
          "Chancliche",
          "Chancliche apimentado",
          "Muçarela",
          "Provolone",
          "Queijo Prato",
          "Azeite extravirgem",
          "Manteiga",
          "Maionese",
          "Pesto de azeitona",
          "Pesto tradicional (manjericão)",
          "Melanzane sottolio",
          "Alface",
          "Tomate",
          "Rúcula"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Italiano",
        "descricao": "Sanduíche feito com salame italiano.",
        "preco": 7,
        "imagem": "img/panino-salame.webp",
        "opcionais": "Panini",
        "opcionais_ativos": [
          "Focaccia",
          "Ciabatta",
          "Chancliche",
          "Chancliche apimentado",
          "Muçarela",
          "Provolone",
          "Queijo Prato",
          "Azeite extravirgem",
          "Manteiga",
          "Maionese",
          "Pesto de azeitona",
          "Pesto tradicional (manjericão)",
          "Melanzane sottolio",
          "Alface",
          "Tomate",
          "Rúcula"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Piripiri",
        "descricao": "Monte seu sanduíche de lombo piripiri (lombo suíno apimentado).",
        "preco": 9,
        "imagem": "img/panino-piripiri.webp",
        "opcionais": "Panini",
        "opcionais_ativos": [
          "Focaccia",
          "Ciabatta",
          "Chancliche",
          "Chancliche apimentado",
          "Muçarela",
          "Provolone",
          "Queijo Prato",
          "Azeite extravirgem",
          "Manteiga",
          "Maionese",
          "Pesto de azeitona",
          "Pesto tradicional (manjericão)",
          "Melanzane sottolio",
          "Alface",
          "Tomate",
          "Rúcula"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Canadense",
        "descricao": "Sanduíche feito com lombo canadense Ceratti.",
        "preco": 7,
        "imagem": "img/panino-lombocanadense.webp",
        "opcionais": "Panini",
        "opcionais_ativos": [
          "Ciabatta",
          "Focaccia",
          "Chancliche",
          "Chancliche apimentado",
          "Muçarela",
          "Provolone",
          "Queijo Prato",
          "Melanzane sottolio",
          "Azeite extravirgem",
          "Manteiga",
          "Maionese",
          "Pesto de azeitona",
          "Pesto tradicional (manjericão)",
          "Alface",
          "Rúcula",
          "Tomate"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Peru",
        "descricao": "Sanduíche feito com peito de peru defumado Ceratti.",
        "preco": 7,
        "imagem": "img/panino-peru.webp",
        "opcionais": "Panini",
        "opcionais_ativos": [
          "Ciabatta",
          "Focaccia",
          "Chancliche",
          "Chancliche apimentado",
          "Muçarela",
          "Provolone",
          "Queijo Prato",
          "Melanzane sottolio",
          "Azeite extravirgem",
          "Manteiga",
          "Maionese",
          "Pesto de azeitona",
          "Pesto tradicional (manjericão)",
          "Alface",
          "Rúcula",
          "Tomate"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Vegano",
        "descricao": "Panini vegano. ",
        "preco": 7,
        "imagem": "img/panino-vegano.jpg",
        "visivel": true,
        "esgotado": false,
        "opcionais_ativos": [
          "Ciabatta",
          "Focaccia",
          "Confit de alho",
          "Confit de alho e tomates cereja",
          "Pastinha de pimentão vermelho",
          "Pesto de azeitona",
          "Pesto tradicional (manjericão)",
          "Alface",
          "Pepino",
          "Pimentão",
          "Rúcula",
          "Tomate"
        ]
      },
      {
        "nome": "Monte seu Panino",
        "descricao": "Sanduíche feito na focaccia.",
        "preco": 5,
        "imagem": "img/panino-monteoseu.webp",
        "opcionais": "Panini",
        "opcionais_ativos": [
          "Ciabatta",
          "Focaccia",
          "Lombo piripiri",
          "Mortadela",
          "Pastrame",
          "Presunto cru",
          "Salame",
          "Chancliche",
          "Chancliche apimentado",
          "Muçarela",
          "Provolone",
          "Queijo Prato",
          "Alichella",
          "Melanzane sottolio",
          "Sardella",
          "Azeite extravirgem",
          "Manteiga",
          "Maionese",
          "Pesto de azeitona",
          "Pesto tradicional (manjericão)",
          "Alface",
          "Pepino",
          "Pimentão",
          "Rúcula",
          "Tomate"
        ],
        "visivel": true,
        "esgotado": true
      }
    ]
  },
  {
    "nome": "Cafés",
    "itens": [
      {
        "nome": "Capuccino",
        "descricao": "A combinação clássica do café intenso com a cremosidade do leite vaporizado cria uma textura suave e envolvente a cada gole. É o convite perfeito para uma pausa restauradora, unindo sabor equilibrado e o conforto de uma bebida preparada com cuidado.",
        "preco": 20,
        "imagem": "img/capuccino.webp",
        "visivel": true,
        "esgotado": false,
        "opcionais_ativos": [
          "Potinho de plástico",
          "Potinho de vidro"
        ]
      },
      {
        "nome": "Café cremoso",
        "descricao": "Feito batendo apenas café solúvel e açúcar, este café surpreende por sua textura aveludada e densa. Sua praticidade de preparo entrega um sabor marcante que transforma qualquer momento em uma experiência especial.",
        "preco": 20,
        "imagem": "img/cafe-cremoso.webp",
        "visivel": true,
        "esgotado": false,
        "opcionais_ativos": [
          "Potinho de plástico",
          "Potinho de vidro"
        ]
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
        "imagem": "img/tabuadefrios.webp",
        "opcionais": "Tábuas",
        "opcionais_ativos": [
          "Salame",
          "Muçarela",
          "Provolone",
          "Azeite extravirgem",
          "Tomate"
        ],
        "visivel": true,
        "esgotado": true
      }
    ]
  },
  {
    "nome": "Bebidas",
    "itens": [
      {
        "nome": "Vinho Casillero del Diablo",
        "descricao": "Vinho tinto",
        "preco": 55,
        "imagem": "img/vinhocasillerodeldiabo.webp",
        "opcionais_ativos": [
          "Taça para vinho",
          "Taça para espumante",
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Manteiga temperada (100g)",
          "Confit de alho (100g)"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Vinho Gato Negro",
        "descricao": "Vinho tinto",
        "preco": 55,
        "imagem": "img/vinhogatonegro.webp",
        "opcionais_ativos": [
          "Taça para vinho",
          "Taça para espumante",
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Manteiga temperada (100g)",
          "Confit de alho (100g)"
        ],
        "visivel": true,
        "esgotado": false
      },
      {
        "nome": "Espumante Veuve D`Argent Blanc De Blancs Demi-Sec",
        "descricao": "Com aroma de frutas frescas como abacaxi e pera. Elaborado na França, exemplar jovem, moderno e fácil de beber.",
        "preco": 85,
        "imagem": "img/espumanteveuvedargentblancdeblancsdemisec.jpeg",
        "opcionais_ativos": [
          "Taça para espumante",
          "Alichella (100g)",
          "Sardella (100g)",
          "Melanzane sottolio (100g)",
          "Confit de alho (100g)",
          "Manteiga temperada (100g)",
          "Taça para vinho"
        ],
        "visivel": true,
        "esgotado": false
      }
    ]
  }
]
};