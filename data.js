// ===== Catálogo =====
// Edita aqui os produtos. Preços em MZN.
// strength: intensidade de 1 a 5 (só charutos) · c1/c2: cores do charuto · icon: emoji (acessórios)
const CATEGORIES = ["Charutos", "Acessórios"];

const DEFAULT_PRODUCTS = [
  { id:1, name:"Robusto Maputo",     cat:"Charutos",   origin:"Moçambique", price:850,  stock:24, strength:3, c1:"#7a4a24", c2:"#3a2210", desc:"Corpo médio, notas de cedro e cacau." },
  { id:2, name:"Corona Índico",      cat:"Charutos",   origin:"Moçambique", price:1100, stock:12, strength:2, c1:"#a2713a", c2:"#5a3a1c", desc:"Suave e cremoso, ideal para iniciar." },
  { id:3, name:"Torpedo Reserva",    cat:"Charutos",   origin:"Importado",  price:1650, stock:8,  strength:5, c1:"#4a2c16", c2:"#1f1008", desc:"Intenso, com final longo de especiarias." },
  { id:4, name:"Humidor Cedro 25",   cat:"Acessórios", origin:"Importado",  price:5200, stock:5,  icon:"📦", desc:"Cedro espanhol para 25 charutos." },
  { id:5, name:"Cortador Duplo Aço", cat:"Acessórios", origin:"Importado",  price:1450, stock:15, icon:"✂️", desc:"Corte limpo, lâminas em aço inox." },
  { id:6, name:"Isqueiro Chama Tripla", cat:"Acessórios", origin:"Importado", price:2100, stock:10, icon:"🔥", desc:"Chama azul resistente ao vento." },
  { id:7, name:"Cinzeiro Cerâmica",  cat:"Acessórios", origin:"Local",      price:980,  stock:9,  icon:"🏺", desc:"Feito à mão, com quatro apoios." }
];
