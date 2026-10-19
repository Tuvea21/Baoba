"use strict";
/* ===== Baobá — lógica da loja =====
   Dados guardados no navegador (localStorage) — versão de demonstração.
   Para produção, ligar a um backend + base de dados. */

// ---------- Utilitários ----------
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const mzn = n => n.toLocaleString("pt-PT") + " MZN";
const store = {
  get(k, f){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; }catch{ return f; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
};

// ---------- Estado ----------
let products = store.get("cb_products3", DEFAULT_PRODUCTS);
let orders   = store.get("cb_orders", []);
let user     = store.get("cb_user", null);
let cart     = store.get("cb_cart", {});
let isAdmin  = false;
const filt   = { cat:"Todos", q:"", sort:"destaque" };

// ---------- Componentes ----------
// Foto do produto: se o ficheiro não existir, o <img> remove-se e fica o bloco neutro com o nome.
const photo = p => `<div class="ph"><span>${esc(p.name)}</span>${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ""}</div>`;

const card = p => `
  <div class="pc reveal">
    <a href="#/produto/${p.id}">${photo(p)}
      <div class="pi"><h3>${esc(p.name)}</h3><span class="price">${mzn(p.price)}</span></div></a>
    <span class="mut small">${esc(p.cat)} · ${esc(p.origin)}</span>
    <button class="link add" ${p.stock < 1 ? "disabled" : ""} onclick="addToCart(${p.id})">${p.stock < 1 ? "Esgotado" : "Adicionar +"}</button>
  </div>`;

function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200);
}

// ---------- Navegação ----------
function pick(cat){
  filt.cat = cat; filt.q = "";
  if (location.hash === "#/catalogo") route();
}
function renderNav(){
  $("#nav").innerHTML = CATEGORIES.map(c => `<a href="#/catalogo" data-c="${c.name}" onclick="pick('${c.name}')">${c.name}</a>`).join("")
    + `<a href="#/sobre" data-c="sobre">Sobre</a>`;
}

// ---------- Páginas ----------
function home(){
  return `
  <section class="hero" style="background-image:linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,.6)),url('img/front2.png')"><div class="wrap">
    <p class="tag">Two five eigth</p>
    <h1>Charutos selecionados, para quem não tem pressa.</h1>
    <a class="link" href="#/catalogo" onclick="pick('Todos')">Ver coleção →</a>
  </div></section>
  <section class="sec"><div class="head-s"><h2>Seleção</h2><a class="link" href="#/catalogo" onclick="pick('Todos')">Ver tudo</a></div>
    <div class="grid">${products.slice(0, 4).map(card).join("")}</div></section>
  <section class="sec"><div class="split">
    <div class="ph reveal"><span>Sobre</span><img src="img/sobre.jpg" alt="" loading="lazy" onerror="this.remove()"></div>
    <div class="reveal"><p class="tag">Sobre a Baobá</p><h2 style="margin-top:.8rem">Feita de tempo, como o baobá.</h2>
      <p class="mut">Nascemos em Maputo da paixão pelo charuto e pelo orgulho na nossa terra. Escolhemos poucos produtos, mas bons, para quem sabe apreciar.</p>
      <a class="link" href="#/sobre">Conhecer a nossa história</a></div>
  </div></section>
  <section class="sec" style="padding-top:0"><div class="cats-row">
    ${CATEGORIES.map(c => `<a href="#/catalogo" onclick="pick('${c.name}')">${c.name}<span>→</span></a>`).join("")}</div></section>`;
}

function catalogo(){
  const c = CATEGORIES.find(x => x.name === filt.cat);
  const title = filt.q ? `“${esc(filt.q)}”` : (c ? c.name : "Coleção");
  return `<section class="sec" style="padding-top:clamp(2rem,5vw,3.5rem)">
    <p class="tag">${filt.q ? "Resultados" : "Loja"}</p>
    <h1 style="margin-top:.5rem">${title}</h1>
    <p class="mut" style="margin-top:.8rem">${c && !filt.q ? esc(c.desc) : "Charutos, cachimbos e acessórios selecionados."}</p>
    <div class="filters">${["Todos", ...CATEGORIES.map(x => x.name)].map(n => `<button class="${n === filt.cat && !filt.q ? "on" : ""}" onclick="pick('${n}');route()">${n}</button>`).join("")}</div>
    <div class="tool"><span class="mut small" id="cnt"></span>
      <select onchange="filt.sort=this.value;renderGrid()" aria-label="Ordenar">
        <option value="destaque">Destaque</option>
        <option value="asc" ${filt.sort === "asc" ? "selected" : ""}>Preço: menor primeiro</option>
        <option value="desc" ${filt.sort === "desc" ? "selected" : ""}>Preço: maior primeiro</option>
      </select></div>
    <div class="grid" id="grid"></div></section>`;
}
function renderGrid(){
  const q = filt.q.toLowerCase();
  let l = products.filter(p => (filt.cat === "Todos" || p.cat === filt.cat) && (!q || (p.name + p.desc + p.cat).toLowerCase().includes(q)));
  if (filt.sort === "asc")  l = [...l].sort((a, b) => a.price - b.price);
  if (filt.sort === "desc") l = [...l].sort((a, b) => b.price - a.price);
  $("#cnt").textContent = l.length + (l.length === 1 ? " produto" : " produtos");
  $("#grid").innerHTML = l.map(card).join("") || `<p class="mut">Nenhum produto encontrado.</p>`;
  reveal();
}

function produto(id){
  const p = products.find(x => x.id == id);
  if (!p) return `<section class="sec"><p class="mut">Produto não encontrado.</p><a class="link" href="#/catalogo">Voltar ao catálogo</a></section>`;
  return `<section class="sec" style="padding-top:2rem"><div class="pd">
    ${photo(p)}
    <div class="pd-i"><a class="back" href="#/catalogo" onclick="pick('${p.cat}')">← ${esc(p.cat)}</a>
      <p class="tag">${esc(p.origin)}</p><h1 style="font-size:clamp(2rem,4vw,3rem)">${esc(p.name)}</h1>
      <p class="price">${mzn(p.price)}</p><p class="mut">${esc(p.desc)}</p>
      ${p.strength ? `<p class="str" title="Intensidade">${"●".repeat(p.strength)}${"○".repeat(5 - p.strength)} <span class="mut small" style="letter-spacing:0">Intensidade</span></p>` : ""}
      <p class="mut small">${p.stock > 0 ? p.stock + " em stock" : "Esgotado"}</p>
      <button class="btn" ${p.stock < 1 ? "disabled" : ""} onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
      <p class="mut small">Venda apenas a maiores de 18 anos.</p></div>
  </div></section>`;
}

function sobre(){
  return `<section class="sec" style="max-width:780px"><p class="tag">Sobre</p><h1 style="margin:.6rem 0 1.4rem">Feita de tempo.</h1>
    <p class="mut">A Baobá nasceu em Maputo da paixão pela cultura do charuto e do orgulho na terra que nos viu crescer. Tal como o baobá, acreditamos que o que é bom precisa de tempo.</p>
    <p class="mut" style="margin-top:1rem">A nossa missão é levar produtos de tabacaria premium a quem sabe apreciá-los, com serviço de confiança e de forma responsável, sempre e apenas a maiores de idade.</p></section>`;
}

function contactos(){
  return `<section class="sec"><p class="tag">Contactos</p><h1 style="margin:.6rem 0 2rem">Fale connosco</h1>
    <div class="two">
      <div><label>Nome<input id="cn"></label><label>Email<input id="ce" type="email"></label><label>Mensagem<textarea id="cm" rows="4"></textarea></label><button class="btn" onclick="sendMsg()">Enviar</button></div>
      <div><h3>Loja</h3><p class="mut" style="margin-top:.6rem">Maputo, Moçambique<br>loja@baoba.example<br>WhatsApp: +258 84 000 0000<br>Seg–Sáb · 9h–18h</p></div>
    </div></section>`;
}
function sendMsg(){
  if (!$("#ce").value.trim() || !$("#cm").value.trim()) return toast("Preencha o email e a mensagem");
  store.set("cb_msgs", [...store.get("cb_msgs", []), { n:$("#cn").value, e:$("#ce").value, m:$("#cm").value, d:Date.now() }]);
  toast("Mensagem enviada. Obrigado!"); location.hash = "#/";
}

function conta(){
  if (!user) return `<section class="sec narrow"><p class="tag">Conta</p><h1 style="margin:.6rem 0 2rem;font-size:2.6rem">Entrar</h1>
    <label>Nome<input id="un"></label><label>Email<input id="ue" type="email"></label><button class="btn" onclick="login()">Entrar / criar conta</button></section>`;
  const mine = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());
  return `<section class="sec"><p class="tag">Conta</p><h1 style="margin:.6rem 0 .4rem">Olá, ${esc(user.name)}</h1><p class="mut">${esc(user.email)}</p>
    <h2 style="margin:2.5rem 0 1rem">As minhas compras</h2>
    ${mine.map(o => `<div class="row" style="padding:1rem 0;border-bottom:1px solid var(--line)"><b>#${o.id}</b><span class="mut">${o.date}</span><span>${mzn(o.total)}</span><span class="tag">${o.status}</span></div>`).join("") || `<p class="mut">Ainda sem encomendas.</p>`}
    <button class="link" style="margin-top:2rem" onclick="logout()">Terminar sessão</button></section>`;
}
function login(){
  const name = $("#un").value.trim(), email = $("#ue").value.trim();
  if (!name || !email.includes("@")) return toast("Indique nome e email válidos");
  user = { name, email }; store.set("cb_user", user); route();
}
function logout(){ user = null; store.set("cb_user", null); route(); }

function admin(){
  if (!isAdmin) return `<section class="sec narrow"><p class="tag">Administração</p><h1 style="margin:.6rem 0 2rem;font-size:2.6rem">Acesso</h1>
    <label>Palavra-passe (demo: admin)<input id="ap" type="password"></label><button class="btn" onclick="isAdmin=$('#ap').value==='admin';route()">Entrar</button></section>`;
  const rev = orders.reduce((a, o) => a + o.total, 0);
  return `<section class="sec"><p class="tag">Administração</p><h1 style="margin:.6rem 0">Painel</h1>
    <p class="mut small">Demonstração: dados só neste navegador. A versão real precisa de backend e autenticação segura.</p>
    <div class="stats"><div class="box"><b>${orders.length}</b>Encomendas</div><div class="box"><b>${mzn(rev)}</b>Receita</div><div class="box"><b>${products.filter(p => p.stock < 5).length}</b>Stock baixo</div></div>
    <h2>Produtos</h2><div class="tw"><table><tr><th>Produto</th><th>Preço (MZN)</th><th>Stock</th></tr>
    ${products.map(p => `<tr><td>${esc(p.name)}</td><td><input type="number" min="0" value="${p.price}" onchange="upd(${p.id},'price',this.value)"></td><td><input type="number" min="0" value="${p.stock}" onchange="upd(${p.id},'stock',this.value)"></td></tr>`).join("")}</table></div>
    <h2 style="margin-top:2.5rem">Encomendas</h2><div class="tw"><table>
    ${orders.map(o => `<tr><td>#${o.id}</td><td>${esc(o.name)} (${esc(o.country)})</td><td>${mzn(o.total)}</td><td><select onchange="setStatus(${o.id},this.value)">${["Pendente","Paga","Enviada","Entregue"].map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("") || `<tr><td class="mut">Sem encomendas.</td></tr>`}</table></div></section>`;
}
function upd(id, k, v){ products.find(p => p.id === id)[k] = Math.max(0, +v || 0); store.set("cb_products3", products); toast("Guardado"); }
function setStatus(id, s){ orders.find(o => o.id === id).status = s; store.set("cb_orders", orders); toast("Estado atualizado"); }

// ---------- Carrinho ----------
const items = () => Object.entries(cart).map(([id, q]) => ({ p:products.find(x => x.id == id), q })).filter(i => i.p);
const total = () => items().reduce((a, i) => a + i.p.price * i.q, 0);
const count = () => items().reduce((a, i) => a + i.q, 0);

function addToCart(id){
  const p = products.find(x => x.id === id);
  if ((cart[id] || 0) >= p.stock) return toast("Stock máximo atingido");
  cart[id] = (cart[id] || 0) + 1; saveCart(); toast(p.name + " adicionado");
}
function chg(id, d){
  const p = products.find(x => x.id === id), q = (cart[id] || 0) + d;
  if (q > p.stock) return toast("Stock máximo atingido");
  if (q <= 0) delete cart[id]; else cart[id] = q;
  saveCart();
}
function saveCart(){ store.set("cb_cart", cart); renderCart(); if (location.hash === "#/checkout") route(); }
function renderCart(){
  $("#cc").textContent = count();
  const l = items();
  $("#d-body").innerHTML = l.length
    ? l.map(({ p, q }) => `<div class="li"><div><b>${esc(p.name)}</b><div class="mut small">${mzn(p.price)}</div><div class="qty"><button onclick="chg(${p.id},-1)">−</button><span>${q}</span><button onclick="chg(${p.id},1)">+</button></div></div><span>${mzn(p.price * q)}</span></div>`).join("")
      + `<div class="d-f"><div class="row"><span class="mut">Total</span><b style="font-size:1.3rem">${mzn(total())}</b></div><a class="btn" href="#/checkout">Finalizar encomenda</a></div>`
    : `<p class="mut">O carrinho está vazio.</p><a class="btn ghost" href="#/catalogo" onclick="pick('Todos');closeCart()">Ver coleção</a>`;
}
const openCart  = () => document.body.classList.add("cart-open");
const closeCart = () => document.body.classList.remove("cart-open");

function checkout(){
  const l = items();
  if (!l.length) return `<section class="sec"><h1>Finalizar</h1><p class="mut" style="margin-top:1rem">O carrinho está vazio.</p></section>`;
  return `<section class="sec"><p class="tag">Checkout</p><h1 style="margin:.6rem 0 2rem">Finalizar encomenda</h1>
    <div class="two">
      <div><label>Nome completo<input id="kn" value="${user ? esc(user.name) : ""}"></label><label>Email<input id="ke" type="email" value="${user ? esc(user.email) : ""}"></label><label>País de entrega<input id="kc"></label><label>Morada<textarea id="ka" rows="3"></textarea></label>
        <label class="check"><input type="checkbox" id="k18"><span>Confirmo ter 18 anos ou mais e que a importação de tabaco é permitida no meu país.</span></label>
        <button class="btn" onclick="placeOrder()">Confirmar encomenda</button><p class="mut small" style="margin-top:.8rem">O pagamento (M-Pesa, cartão) será ligado ao backend.</p></div>
      <div class="box"><h3>Resumo</h3>${l.map(({ p, q }) => `<div class="row" style="margin-top:.7rem"><span>${q} × ${esc(p.name)}</span><span>${mzn(p.price * q)}</span></div>`).join("")}<hr style="border:0;border-top:1px solid var(--line);margin:1.2rem 0"><div class="row"><b>Total</b><b>${mzn(total())}</b></div></div>
    </div></section>`;
}
function placeOrder(){
  const name = $("#kn").value.trim(), email = $("#ke").value.trim(), country = $("#kc").value.trim(), addr = $("#ka").value.trim();
  if (!$("#k18").checked) return toast("Confirme a idade para continuar");
  if (!name || !email.includes("@") || !country || !addr) return toast("Preencha todos os campos");
  items().forEach(({ p, q }) => p.stock -= q);
  orders.push({ id:1001 + orders.length, name, email, country, addr, total:total(), status:"Pendente", date:new Date().toLocaleDateString("pt-PT") });
  store.set("cb_products3", products); store.set("cb_orders", orders);
  user = user || { name, email }; store.set("cb_user", user);
  cart = {}; saveCart(); toast("Encomenda registada"); location.hash = "#/conta";
}

// ---------- Router ----------
const views = { "":home, catalogo, sobre, contactos, conta, admin, checkout, produto };
function route(){
  const [r, arg] = location.hash.replace(/^#\/?/, "").split("/");
  $("#app").innerHTML = (views[r] || home)(arg);
  if (r === "catalogo") renderGrid();
  $$("#nav a").forEach(a => a.classList.toggle("on", (r === "catalogo" && a.dataset.c === filt.cat) || a.dataset.c === r));
  $("#nav").classList.remove("open"); $("#sbar").hidden = true;
  closeCart(); scrollTo(0, 0); reveal();
}
function reveal(){
  const els = $$(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold:.1 });
  els.forEach(e => io.observe(e));
}

// ---------- Arranque ----------
$("#cart-btn").onclick = openCart;
$("#close-cart").onclick = closeCart;
$("#ov").onclick = closeCart;
$("#burger").onclick = () => $("#nav").classList.toggle("open");
$("#sb-btn").onclick = () => { const b = $("#sbar"); b.hidden = !b.hidden; if (!b.hidden) $("#q").focus(); };
$("#sbar").onsubmit = e => { e.preventDefault(); filt.cat = "Todos"; filt.q = $("#q").value.trim(); $("#q").value = ""; location.hash === "#/catalogo" ? route() : (location.hash = "#/catalogo"); };
// Verificação de idade: pergunta em cada nova visita (a resposta só dura enquanto o separador/navegador estiver aberto).
// Para perguntar SEMPRE, em cada atualização da página, apaga as duas linhas com "sessionStorage".
$("#age-yes").onclick = () => { try{ sessionStorage.setItem("cb_age", "1"); }catch{} $("#age").remove(); };
try{ if (sessionStorage.getItem("cb_age") === "1") $("#age").remove(); }catch{}
addEventListener("hashchange", route);
renderNav(); renderCart(); route();