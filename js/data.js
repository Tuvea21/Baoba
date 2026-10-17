// ===== Catálogo =====
// Edita aqui categorias e produtos. Preços em MZN.
// img: caminho da foto (pasta img/). Se a foto não existir, aparece um bloco neutro.
// strength: intensidade 1–5 (só charutos).
const CATEGORIES = [
  { name:"Charutos",    desc:"Charutos selecionados de diferentes origens, do suave ao intenso." },
  { name:"Acessórios",  desc:"Para conservar, cortar e apreciar o charuto como deve ser." },
  { name:"Cigarrilhas", desc:"Cigarrilhas aromáticas e clássicas, práticas para o dia a dia." },
  { name:"Cachimbos",   desc:"Cachimbos e misturas para o ritual lento do tabaco de cachimbo." },
  { name:"Kits",        desc:"Conjuntos prontos a oferecer ou para começar com o essencial." }
];

const DEFAULT_PRODUCTS = [
  { id:1,  name:"Robusto Maputo",        cat:"Charutos",    origin:"Moçambique", price:850,  stock:24, strength:3, img:"img/robusto-maputo.jpg",     desc:"Corpo médio, notas de cedro e cacau." },
  { id:2,  name:"Corona Índico",         cat:"Charutos",    origin:"Moçambique", price:1100, stock:12, strength:2, img:"img/corona-indico.jpg",      desc:"Suave e cremoso, ideal para iniciar." },
  { id:3,  name:"Torpedo Reserva",       cat:"Charutos",    origin:"Importado",  price:1650, stock:8,  strength:5, img:"img/torpedo-reserva.jpg",    desc:"Intenso, com final longo de especiarias." },
  { id:4,  name:"Lonsdale Selecta",      cat:"Charutos",    origin:"Importado",  price:2600, stock:6,  strength:4, img:"img/lonsdale-selecta.jpg",   desc:"Formato elegante, aroma a tabaco curado." },
  { id:5,  name:"Humidor Cedro 25",      cat:"Acessórios",  origin:"Importado",  price:5200, stock:5,  img:"img/humidor-cedro.jpg",     desc:"Cedro espanhol para 25 charutos." },
  { id:6,  name:"Cortador Duplo Aço",    cat:"Acessórios",  origin:"Importado",  price:1450, stock:15, img:"img/cortador-duplo.jpg",    desc:"Corte limpo, lâminas em aço inox." },
  { id:7,  name:"Isqueiro Chama Tripla", cat:"Acessórios",  origin:"Importado",  price:2100, stock:10, img:"img/isqueiro-triplo.jpg",   desc:"Chama azul resistente ao vento." },
  { id:8,  name:"Cinzeiro Cerâmica",     cat:"Acessórios",  origin:"Local",      price:980,  stock:9,  img:"img/cinzeiro-ceramica.jpg", desc:"Feito à mão, com quatro apoios." },
  { id:9,  name:"Cigarrilha Baunilha",   cat:"Cigarrilhas", origin:"Importado",  price:320,  stock:40, img:"img/cigarrilha-baunilha.jpg", desc:"Maço de 10, doce e aromática." },
  { id:10, name:"Cigarrilha Clássica",   cat:"Cigarrilhas", origin:"Importado",  price:280,  stock:50, img:"img/cigarrilha-classica.jpg", desc:"Maço de 10, sabor tradicional." },
  { id:11, name:"Cachimbo Clássico",     cat:"Cachimbos",   origin:"Importado",  price:3200, stock:4,  img:"img/cachimbo-classico.jpg", desc:"Madeira de urze, acabamento polido." },
  { id:12, name:"Kit Iniciação",         cat:"Kits",        origin:"Local",      price:3900, stock:7,  img:"img/kit-iniciacao.jpg",     desc:"Três charutos, cortador e isqueiro." }
];