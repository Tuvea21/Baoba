"use strict";
/* ===== Casa Baobá — lógica da loja =====
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
let products = store.get("cb_products", DEFAULT_PRODUCTS);
let orders   = store.get("cb_orders", []);
let user     = store.get("cb_user", null);
let cart     = store.get("cb_cart", {});
let isAdmin  = false;
const filt   = { cat:"Todos", q:"", sort:"destaque" };

// ---------- Componentes ----------
const dots = n => "●".repeat(n) + "○".repeat(5 - n);
const art = p => p.cat === "Charutos"
  ? `<div class="art"><div class="cigar" style="--c1:${p.c1};--c2:${p.c2}"></div></div>`
  : `<div class="art"><span class="glyph">${p.icon || "✦"}</span></div>`;

const card = p => `
  <article class="card reveal">
    ${art(p)}
    <div class="card-b">
      <span class="tag">${esc(p.cat)} · ${esc(p.origin)}</span>
      <h3>${esc(p.name)}</h3>
      <p class="mut">${esc(p.desc)}</p>
      ${p.cat === "Charutos" ? `<div class="str" title="Intensidade">${dots(p.strength || 3)}</div>` : ""}
      <div class="row">
        <b class="price">${mzn(p.price)}</b>
        <button class="btn sm" ${p.stock < 1 ? "disabled" : ""} onclick="addToCart(${p.id})">${p.stock < 1 ? "Esgotado" : "Adicionar"}</button>
      </div>
    </div>
  </article>`;

function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200);
}

// ---------- Páginas ----------
function home(){
  return `
  <div class="hero-bg"><section class="hero wrap">
    <div>
      <p class="eyebrow">Maputo · Moçambique</p>
      <h1>O prazer lento de um bom charuto.</h1>
      <p class="lead">Charutos selecionados e acessórios de tabacaria, enviados de Moçambique para o mundo.</p>
      <div class="row gap"><a class="btn" href="#/catalogo">Explorar catálogo</a><a class="btn ghost" href="#/sobre">A nossa história</a></div>
    </div>
    <div class="hero-art"><div class="smoke"><span></span><span></span><span></span></div><div class="cigar big"></div></div>
  </section></div>
  <section class="strip"><div class="wrap">
    <div>🌍<span><b>Envio internacional</b>Conforme o país</span></div>
    <div>🔞<span><b>Só maiores de 18</b>Verificação de idade</span></div>
    <div>🌿<span><b>Seleção cuidada</b>Qualidade em cada peça</span></div>
    <div>🔒<span><b>Compra segura</b>Pagamento protegido</span></div>
  </div></section>
  <section class="pad wrap">
    <p class="eyebrow">Em destaque</p><h2>Escolhas da casa</h2>
    <div class="grid">${products.slice(0, 3).map(card).join("")}</div>
  </section>
  <section class="wrap"><div class="cats">
    ${CATEGORIES.map(c => `<a class="cat reveal" href="#/catalogo" onclick="filt.cat='${c}'"><p class="eyebrow">Categoria</p><h3>${c}</h3><p class="mut">${products.filter(p => p.cat === c).length} produtos →</p></a>`).join("")}
  </div></section>
  <section class="pad wrap"><div class="cta reveal"><h2>Pronto para acender?</h2><p class="mut" style="margin-bottom:1.4rem">Descubra todo o catálogo da Casa Baobá.</p><a class="btn" href="#/catalogo">Ver catálogo completo</a></div></section>`;
}

function catalogo(){
  return `<section class="pad wrap">
    <p class="eyebrow">Loja</p><h1 style="font-size:clamp(2rem,5vw,3rem)">Catálogo</h1>
    <div class="tool">
      ${["Todos", ...CATEGORIES].map(c => `<button class="chip ${c === filt.cat ? "on" : ""}" data-cat="${c}" onclick="setCat('${c}')">${c}</button>`).join("")}
    </div>
    <div class="tool">
      <input type="search" placeholder="Pesquisar produtos…" value="${esc(filt.q)}" oninput="filt.q=this.value;renderGrid()">
      <select onchange="filt.sort=this.value;renderGrid()">
        <option value="destaque">Ordenar: destaque</option>
        <option value="asc" ${filt.sort === "asc" ? "selected" : ""}>Preço: menor primeiro</option>
        <option value="desc" ${filt.sort === "desc" ? "selected" : ""}>Preço: maior primeiro</option>
      </select>
    </div>
    <div class="grid" id="grid"></div>
  </section>`;
}
function setCat(c){ filt.cat = c; $$(".chip").forEach(b => b.classList.toggle("on", b.dataset.cat === c)); renderGrid(); }
function renderGrid(){
  let l = products.filter(p => (filt.cat === "Todos" || p.cat === filt.cat) && (p.name + p.desc).toLowerCase().includes(filt.q.toLowerCase()));
  if (filt.sort === "asc")  l = [...l].sort((a, b) => a.price - b.price);
  if (filt.sort === "desc") l = [...l].sort((a, b) => b.price - a.price);
  $("#grid").innerHTML = l.map(card).join("") || `<p class="mut">Nenhum produto encontrado.</p>`;
  reveal();
}

function sobre(){
  return `<section class="pad wrap narrow" style="max-width:720px">
    <p class="eyebrow">Sobre nós</p><h1 style="font-size:clamp(2rem,5vw,3rem)">Uma casa feita de tempo.</h1>
    <p class="mut" style="margin:1.2rem 0">A Casa Baobá nasceu em Maputo da paixão pela cultura do charuto e do orgulho na terra que nos viu crescer. Tal como o baobá, acreditamos que o que é bom precisa de tempo.</p>
    <p class="mut">A nossa missão é levar produtos de tabacaria premium a quem sabe apreciá-los, com serviço de confiança e de forma responsável, sempre e apenas a maiores de idade.</p>
  </section>`;
}

function contactos(){
  return `<section class="pad wrap"><p class="eyebrow">Contactos</p><h1 style="font-size:clamp(2rem,5vw,3rem)">Fale connosco</h1>
    <div class="two" style="margin-top:1.5rem">
      <div class="box"><label>Nome<input id="cn"></label><label>Email<input id="ce" type="email"></label><label>Mensagem<textarea id="cm" rows="5"></textarea></label><button class="btn" onclick="sendMsg()">Enviar mensagem</button></div>
      <div class="box"><h3>Informações</h3><p class="mut" style="margin-top:.6rem">Maputo, Moçambique<br>loja@casabaoba.example<br>Seg–Sáb · 9h–18h</p></div>
    </div></section>`;
}
function sendMsg(){
  if (!$("#ce").value.trim() || !$("#cm").value.trim()) return toast("Preencha o email e a mensagem");
  store.set("cb_msgs", [...store.get("cb_msgs", []), { n:$("#cn").value, e:$("#ce").value, m:$("#cm").value, d:Date.now() }]);
  toast("Mensagem enviada. Obrigado!"); location.hash = "#/";
}

function conta(){
  if (!user) return `<section class="pad wrap narrow"><p class="eyebrow">Conta</p><h1 style="font-size:2.4rem">Entrar</h1>
    <div class="box" style="margin-top:1.2rem"><label>Nome<input id="un"></label><label>Email<input id="ue" type="email"></label><button class="btn" onclick="login()">Entrar / criar conta</button></div></section>`;
  const mine = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());
  return `<section class="pad wrap"><p class="eyebrow">A minha conta</p><h1 style="font-size:2.4rem">Olá, ${esc(user.name)}</h1><p class="mut">${esc(user.email)}</p>
    <h2 style="margin-top:2rem">Encomendas</h2>
    ${mine.map(o => `<div class="box" style="margin-bottom:.8rem"><div class="row"><b>#${o.id}</b><span class="mut">${o.date}</span><b class="price">${mzn(o.total)}</b><span class="tag">${o.status}</span></div></div>`).join("") || `<p class="mut">Ainda sem encomendas.</p>`}
    <button class="btn ghost" style="margin-top:1rem" onclick="logout()">Terminar sessão</button></section>`;
}
function login(){
  const name = $("#un").value.trim(), email = $("#ue").value.trim();
  if (!name || !email.includes("@")) return toast("Indique nome e email válidos");
  user = { name, email }; store.set("cb_user", user); route();
}
function logout(){ user = null; store.set("cb_user", null); route(); }

function admin(){
  if (!isAdmin) return `<section class="pad wrap narrow"><p class="eyebrow">Administração</p><h1 style="font-size:2.4rem">Acesso</h1>
    <div class="box" style="margin-top:1.2rem"><label>Palavra-passe (demo: admin)<input id="ap" type="password"></label><button class="btn" onclick="isAdmin=$('#ap').value==='admin';route()">Entrar</button></div></section>`;
  const rev = orders.reduce((a, o) => a + o.total, 0);
  return `<section class="pad wrap"><p class="eyebrow">Administração</p><h1 style="font-size:2.4rem">Painel</h1>
    <p class="mut small">Demonstração: dados só neste navegador. A versão real precisa de backend e autenticação segura.</p>
    <div class="stats"><div class="box"><b>${orders.length}</b>Encomendas</div><div class="box"><b>${mzn(rev)}</b>Receita</div><div class="box"><b>${products.filter(p => p.stock < 5).length}</b>Stock baixo</div></div>
    <h2>Produtos</h2><div class="tw"><table><tr><th>Produto</th><th>Preço (MZN)</th><th>Stock</th></tr>
    ${products.map(p => `<tr><td>${esc(p.name)}</td><td><input type="number" min="0" value="${p.price}" onchange="upd(${p.id},'price',this.value)"></td><td><input type="number" min="0" value="${p.stock}" onchange="upd(${p.id},'stock',this.value)"></td></tr>`).join("")}</table></div>
    <h2 style="margin-top:2rem">Encomendas</h2><div class="tw"><table>
    ${orders.map(o => `<tr><td>#${o.id}</td><td>${esc(o.name)} (${esc(o.country)})</td><td>${mzn(o.total)}</td><td><select onchange="setStatus(${o.id},this.value)">${["Pendente","Paga","Enviada","Entregue"].map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("") || `<tr><td class="mut">Sem encomendas.</td></tr>`}</table></div></section>`;
}
function upd(id, k, v){ products.find(p => p.id === id)[k] = Math.max(0, +v || 0); store.set("cb_products", products); toast("Guardado"); }
function setStatus(id, s){ orders.find(o => o.id === id).status = s; store.set("cb_orders", orders); toast("Estado atualizado"); }

// ---------- Carrinho ----------
const items = () => Object.entries(cart).map(([id, q]) => ({ p:products.find(x => x.id == id), q })).filter(i => i.p);
const total = () => items().reduce((a, i) => a + i.p.price * i.q, 0);
const count = () => items().reduce((a, i) => a + i.q, 0);

function addToCart(id){
  const p = products.find(x => x.id === id);
  if ((cart[id] || 0) >= p.stock) return toast("Stock máximo atingido");
  cart[id] = (cart[id] || 0) + 1; saveCart(); toast(p.name + " adicionado ✓");
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
    ? l.map(({ p, q }) => `<div class="li"><div><b>${esc(p.name)}</b><div class="mut small">${mzn(p.price)}</div><div class="qty"><button onclick="chg(${p.id},-1)">−</button><span>${q}</span><button onclick="chg(${p.id},1)">+</button></div></div><b class="price">${mzn(p.price * q)}</b></div>`).join("")
      + `<div class="d-f"><div class="row"><span class="mut">Total</span><b class="price" style="font-size:1.4rem">${mzn(total())}</b></div><a class="btn" style="text-align:center" href="#/checkout">Finalizar encomenda</a></div>`
    : `<p class="mut">O carrinho está vazio.</p><a class="btn ghost" style="text-align:center" href="#/catalogo" onclick="closeCart()">Ver catálogo</a>`;
}
const openCart  = () => document.body.classList.add("cart-open");
const closeCart = () => document.body.classList.remove("cart-open");

function checkout(){
  const l = items();
  if (!l.length) return `<section class="pad wrap"><h1 style="font-size:2.4rem">Finalizar</h1><p class="mut">O carrinho está vazio.</p></section>`;
  return `<section class="pad wrap"><p class="eyebrow">Checkout</p><h1 style="font-size:2.4rem">Finalizar encomenda</h1>
    <div class="two" style="margin-top:1.5rem">
      <div class="box"><label>Nome completo<input id="kn" value="${user ? esc(user.name) : ""}"></label><label>Email<input id="ke" type="email" value="${user ? esc(user.email) : ""}"></label><label>País de entrega<input id="kc"></label><label>Morada<textarea id="ka" rows="3"></textarea></label>
        <label class="check"><input type="checkbox" id="k18"><span>Confirmo ter 18 anos ou mais e que a importação de tabaco é permitida no meu país.</span></label>
        <button class="btn" onclick="placeOrder()">Confirmar encomenda</button><p class="mut small" style="margin-top:.8rem">O pagamento (M-Pesa, cartão) será ligado ao backend.</p></div>
      <div class="box"><h3>Resumo</h3>${l.map(({ p, q }) => `<div class="row" style="margin-top:.6rem"><span>${q} × ${esc(p.name)}</span><span>${mzn(p.price * q)}</span></div>`).join("")}<hr style="border:0;border-top:1px solid var(--line);margin:1rem 0"><div class="row"><b>Total</b><b class="price">${mzn(total())}</b></div></div>
    </div></section>`;
}
function placeOrder(){
  const name = $("#kn").value.trim(), email = $("#ke").value.trim(), country = $("#kc").value.trim(), addr = $("#ka").value.trim();
  if (!$("#k18").checked) return toast("Confirme a idade para continuar");
  if (!name || !email.includes("@") || !country || !addr) return toast("Preencha todos os campos");
  items().forEach(({ p, q }) => p.stock -= q);
  orders.push({ id:1001 + orders.length, name, email, country, addr, total:total(), status:"Pendente", date:new Date().toLocaleDateString("pt-PT") });
  store.set("cb_products", products); store.set("cb_orders", orders);
  user = user || { name, email }; store.set("cb_user", user);
  cart = {}; saveCart(); toast("Encomenda registada! 🎉"); location.hash = "#/conta";
}

// ---------- Router ----------
const views = { "":home, catalogo, sobre, contactos, conta, admin, checkout };
function route(){
  const r = location.hash.replace(/^#\/?/, "");
  $("#app").innerHTML = (views[r] || home)();
  if (r === "catalogo") renderGrid();
  $$("#nav a").forEach(a => a.classList.toggle("on", a.dataset.r === r));
  $("#nav").classList.remove("open");
  closeCart(); scrollTo(0, 0); reveal();
}
function reveal(){
  const els = $$(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold:.12 });
  els.forEach(e => io.observe(e));
}

// ---------- Arranque ----------
$("#cart-btn").onclick = openCart;
$("#close-cart").onclick = closeCart;
$("#ov").onclick = closeCart;
$("#burger").onclick = () => $("#nav").classList.toggle("open");
$("#age-yes").onclick = () => { store.set("cb_age", 1); $("#age").remove(); };
if (store.get("cb_age", 0)) $("#age").remove();
addEventListener("hashchange", route);
renderCart(); route();
