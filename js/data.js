// ===== Catálogo =====
// Edita aqui categorias e produtos. Preços em MZN.
// img: caminho de uma foto (ex.: "img/robusto.jpg") — se não houver, usa-se um desenho em CSS.
// strength: intensidade 1–5 (charutos) · c1/c2: cores do charuto · icon: emoji
const CATEGORIES = [
  { name:"Charutos", subs:["Cubanos","Moçambicanos","Importados"], desc:"Charutos selecionados de diferentes origens, do suave ao intenso, para todos os momentos." },
  { name:"Acessórios p/ charutos", subs:["Humidores","Cortadores","Isqueiros","Cinzeiros"], desc:"Tudo o que precisa para conservar, cortar e apreciar o seu charuto como deve ser." },
  { name:"Cigarrilhas", subs:[], desc:"Cigarrilhas aromáticas e clássicas, práticas para o dia a dia." },
  { name:"Cachimbos", subs:[], desc:"Cachimbos de qualidade para quem aprecia o ritual lento do tabaco de cachimbo." },
  { name:"Fumos para cachimbo", subs:[], desc:"Misturas aromáticas e tradicionais de tabaco para cachimbo." },
  { name:"Kits", subs:[], desc:"Conjuntos prontos a oferecer ou para começar com tudo o que é essencial." }
];

const DEFAULT_PRODUCTS = [
  { id:1,  name:"Robusto Maputo",        cat:"Charutos", sub:"Moçambicanos", origin:"Moçambique", price:850,  stock:24, strength:3, c1:"#7a4a24", c2:"#3a2210", desc:"Corpo médio, notas de cedro e cacau." },
  { id:2,  name:"Corona Índico",         cat:"Charutos", sub:"Moçambicanos", origin:"Moçambique", price:1100, stock:12, strength:2, c1:"#a2713a", c2:"#5a3a1c", desc:"Suave e cremoso, ideal para iniciar." },
  { id:3,  name:"Torpedo Reserva",       cat:"Charutos", sub:"Importados",   origin:"Importado",  price:1650, stock:8,  strength:5, c1:"#4a2c16", c2:"#1f1008", desc:"Intenso, com final longo de especiarias." },
  { id:4,  name:"Lonsdale Selecta",      cat:"Charutos", sub:"Cubanos",      origin:"Importado",  price:2600, stock:6,  strength:4, c1:"#8a5a2b", c2:"#3f2512", desc:"Formato elegante, aroma a tabaco curado." },
  { id:5,  name:"Humidor Cedro 25",      cat:"Acessórios p/ charutos", sub:"Humidores",  origin:"Importado", price:5200, stock:5,  icon:"📦", desc:"Cedro espanhol para 25 charutos." },
  { id:6,  name:"Cortador Duplo Aço",    cat:"Acessórios p/ charutos", sub:"Cortadores", origin:"Importado", price:1450, stock:15, icon:"✂️", desc:"Corte limpo, lâminas em aço inox." },
  { id:7,  name:"Isqueiro Chama Tripla", cat:"Acessórios p/ charutos", sub:"Isqueiros",  origin:"Importado", price:2100, stock:10, icon:"🔥", desc:"Chama azul resistente ao vento." },
  { id:8,  name:"Cinzeiro Cerâmica",     cat:"Acessórios p/ charutos", sub:"Cinzeiros",  origin:"Local",     price:980,  stock:9,  icon:"🏺", desc:"Feito à mão, com quatro apoios." },
  { id:9,  name:"Cigarrilha Baunilha",   cat:"Cigarrilhas", sub:"", origin:"Importado", price:320, stock:40, icon:"🍦", desc:"Maço de 10, doce e aromática." },
  { id:10, name:"Cigarrilha Clássica",   cat:"Cigarrilhas", sub:"", origin:"Importado", price:280, stock:50, icon:"🚬", desc:"Maço de 10, sabor tradicional." },
  { id:11, name:"Cachimbo Clássico",     cat:"Cachimbos",   sub:"", origin:"Importado", price:3200, stock:4, icon:"💨", desc:"Madeira de urze, acabamento polido." },
  { id:12, name:"Fumo Aromático Cereja", cat:"Fumos para cachimbo", sub:"", origin:"Importado", price:450, stock:18, icon:"🍒", desc:"Lata de 50 g, suave e frutado." },
  { id:13, name:"Kit Iniciação",         cat:"Kits", sub:"", origin:"Local", price:3900, stock:7, icon:"🎁", desc:"3 charutos, cortador e isqueiro." }
];