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
let products = store.get("cb_products2", DEFAULT_PRODUCTS);
let orders   = store.get("cb_orders", []);
let user     = store.get("cb_user", null);
let cart     = store.get("cb_cart", {});
let isAdmin  = false;
const filt   = { cat:"Todos", sub:"", q:"", sort:"destaque" };

// ---------- Componentes ----------
const dots = n => "●".repeat(n) + "○".repeat(5 - n);
const art = p => p.img ? `<div class="art"><img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy"></div>`
  : p.cat === "Charutos" ? `<div class="art"><div class="cigar" style="--c1:${p.c1};--c2:${p.c2}"></div></div>`
  : `<div class="art"><span class="glyph">${p.icon || "✦"}</span></div>`;

const card = p => `
  <article class="card reveal">
    ${art(p)}
    <div class="card-b">
      <span class="tag">${esc(p.sub || p.cat)}</span>
      <h3>${esc(p.name)}</h3>
      <p class="mut small">${esc(p.desc)}</p>
      ${p.strength ? `<div class="str" title="Intensidade">${dots(p.strength)}</div>` : ""}
      <b class="price">${mzn(p.price)}</b>
      <button class="btn sm" ${p.stock < 1 ? "disabled" : ""} onclick="addToCart(${p.id})">${p.stock < 1 ? "Esgotado" : "Comprar"}</button>
    </div>
  </article>`;

const banner = (t, s) => `<div class="banner">
  <div class="sticks">${Array.from({ length:7 }, (_, i) => `<i style="--h:${190 + (i * 37) % 36}px"></i>`).join("")}</div>
  <div class="b-txt"><b>${t}</b><span>${s}</span></div>
  <div class="logs"><i></i><i></i><i></i><i></i></div></div>`;

function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200);
}

// ---------- Navegação por categorias ----------
function pick(cat, sub = ""){
  filt.cat = cat; filt.sub = sub; filt.q = "";
  if (location.hash === "#/catalogo") route();   // se já estiver no catálogo, atualiza
}
function renderNav(){
  $("#cats").innerHTML = CATEGORIES.map(c => `<a href="#/catalogo" data-c="${c.name}" onclick="pick('${c.name}')">${c.name}</a>`).join("");
}
const sidebar = () => `<aside class="side"><details ${innerWidth > 960 ? "open" : ""}><summary>Categorias</summary>
  <div class="srow ${filt.cat === "Todos" ? "on" : ""}"><a href="#/catalogo" onclick="pick('Todos')">Todos os produtos</a></div>
  ${CATEGORIES.map(c => `<div class="srow ${filt.cat === c.name ? "open on" : ""}">
    <a href="#/catalogo" onclick="pick('${c.name}')">${c.name}</a>
    ${c.subs.length ? `<button class="tog" aria-label="Expandir" onclick="this.parentNode.classList.toggle('open')">+</button>
    <div class="subs">${c.subs.map(s => `<a href="#/catalogo" class="${filt.sub === s ? "on" : ""}" onclick="pick('${c.name}','${s}')">${s}</a>`).join("")}</div>` : ""}
  </div>`).join("")}
</details></aside>`;

// ---------- Páginas ----------
function home(){
  return `
  <div class="hero-wrap">${banner("Charutos e tabacos de Maputo para o mundo", "Seleção Casa Baobá")}</div>
  <div class="benefits">
    <div>🌍<span><b>Envio internacional</b>Conforme o país</span></div>
    <div>🔞<span><b>Só maiores de 18</b>Verificação de idade</span></div>
    <div>🌿<span><b>Seleção cuidada</b>Qualidade em cada peça</span></div>
    <div>🔒<span><b>Compra segura</b>Pagamento protegido</span></div>
  </div>
  <section class="section"><h2>Categorias</h2><div class="tiles">
    ${CATEGORIES.map(c => `<a class="tile" href="#/catalogo" onclick="pick('${c.name}')"><i>${["🟤","🔥","🚬","💨","🍂","🎁"][CATEGORIES.indexOf(c)] || "✦"}</i>${c.name}</a>`).join("")}
  </div></section>
  <section class="section"><h2>Mais vendidos</h2><div class="grid">${products.slice(0, 4).map(card).join("")}</div></section>`;
}

function catalogo(){
  const c = CATEGORIES.find(x => x.name === filt.cat);
  const crumbs = [`<a href="#/">Home</a>`];
  if (c){ crumbs.push(`<a href="#/catalogo" onclick="pick('${c.name}')">${c.name}</a>`); if (filt.sub) crumbs.push(esc(filt.sub)); }
  else crumbs.push(filt.q ? "Pesquisa" : "Catálogo");
  const title = filt.q ? `Resultados para “${esc(filt.q)}”` : esc(filt.sub || filt.cat === "Todos" ? (filt.sub || "Todos os produtos") : filt.cat);
  return `<div class="shop">
    ${sidebar()}
    <div>
      <div class="crumbs">${crumbs.join("<span>›</span>")}</div>
      ${banner(esc(filt.sub || (c ? c.name : "Todos os produtos")), "Casa Baobá")}
      <h1 class="page-t">${title}</h1>
      <p class="mut">${c && !filt.q ? esc(c.desc) : "Descubra a nossa seleção de charutos, cachimbos e acessórios."}</p>
      <div class="tool"><span class="mut small" id="cnt"></span>
        <select onchange="filt.sort=this.value;renderGrid()" aria-label="Ordenar">
          <option value="destaque">Ordenar: destaque</option>
          <option value="asc" ${filt.sort === "asc" ? "selected" : ""}>Preço: menor primeiro</option>
          <option value="desc" ${filt.sort === "desc" ? "selected" : ""}>Preço: maior primeiro</option>
        </select></div>
      <div class="grid" id="grid"></div>
    </div></div>`;
}
function renderGrid(){
  const q = filt.q.toLowerCase();
  let l = products.filter(p => (filt.cat === "Todos" || p.cat === filt.cat) && (!filt.sub || p.sub === filt.sub) && (!q || (p.name + p.desc + p.cat).toLowerCase().includes(q)));
  if (filt.sort === "asc")  l = [...l].sort((a, b) => a.price - b.price);
  if (filt.sort === "desc") l = [...l].sort((a, b) => b.price - a.price);
  $("#cnt").textContent = l.length + (l.length === 1 ? " produto" : " produtos");
  $("#grid").innerHTML = l.map(card).join("") || `<p class="mut">Nenhum produto encontrado.</p>`;
  reveal();
}

function sobre(){
  return `<section class="section" style="max-width:760px">
    <h1>Sobre nós</h1>
    <p class="mut" style="margin:1.2rem 0">A Casa Baobá nasceu em Maputo da paixão pela cultura do charuto e do orgulho na terra que nos viu crescer. Tal como o baobá, acreditamos que o que é bom precisa de tempo.</p>
    <p class="mut">A nossa missão é levar produtos de tabacaria premium a quem sabe apreciá-los, com serviço de confiança e de forma responsável, sempre e apenas a maiores de idade.</p>
  </section>`;
}

function contactos(){
  return `<section class="section"><h1>Contactos</h1>
    <div class="two" style="margin-top:1.5rem">
      <div class="box"><label>Nome<input id="cn"></label><label>Email<input id="ce" type="email"></label><label>Mensagem<textarea id="cm" rows="5"></textarea></label><button class="btn" onclick="sendMsg()">Enviar mensagem</button></div>
      <div class="box"><h3>Informações</h3><p class="mut" style="margin-top:.6rem">Maputo, Moçambique<br>loja@casabaoba.example<br>WhatsApp: +258 84 000 0000<br>Seg–Sáb · 9h–18h</p></div>
    </div></section>`;
}
function sendMsg(){
  if (!$("#ce").value.trim() || !$("#cm").value.trim()) return toast("Preencha o email e a mensagem");
  store.set("cb_msgs", [...store.get("cb_msgs", []), { n:$("#cn").value, e:$("#ce").value, m:$("#cm").value, d:Date.now() }]);
  toast("Mensagem enviada. Obrigado!"); location.hash = "#/";
}

function conta(){
  if (!user) return `<section class="section narrow"><h1>Minha conta</h1>
    <div class="box" style="margin-top:1.2rem"><label>Nome<input id="un"></label><label>Email<input id="ue" type="email"></label><button class="btn" onclick="login()">Entrar / criar conta</button></div></section>`;
  const mine = orders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());
  return `<section class="section"><h1>Olá, ${esc(user.name)}</h1><p class="mut">${esc(user.email)}</p>
    <h2 style="margin-top:2rem">Rastrear as minhas compras</h2>
    ${mine.map(o => `<div class="box" style="margin-bottom:.8rem"><div class="row"><b>#${o.id}</b><span class="mut">${o.date}</span><b>${mzn(o.total)}</b><span class="tag">${o.status}</span></div></div>`).join("") || `<p class="mut">Ainda sem encomendas.</p>`}
    <button class="btn ghost" style="margin-top:1rem" onclick="logout()">Terminar sessão</button></section>`;
}
function login(){
  const name = $("#un").value.trim(), email = $("#ue").value.trim();
  if (!name || !email.includes("@")) return toast("Indique nome e email válidos");
  user = { name, email }; store.set("cb_user", user); route();
}
function logout(){ user = null; store.set("cb_user", null); route(); }

function admin(){
  if (!isAdmin) return `<section class="section narrow"><h1>Administração</h1>
    <div class="box" style="margin-top:1.2rem"><label>Palavra-passe (demo: admin)<input id="ap" type="password"></label><button class="btn" onclick="isAdmin=$('#ap').value==='admin';route()">Entrar</button></div></section>`;
  const rev = orders.reduce((a, o) => a + o.total, 0);
  return `<section class="section"><h1>Painel</h1>
    <p class="mut small">Demonstração: dados só neste navegador. A versão real precisa de backend e autenticação segura.</p>
    <div class="stats"><div class="box"><b>${orders.length}</b>Encomendas</div><div class="box"><b>${mzn(rev)}</b>Receita</div><div class="box"><b>${products.filter(p => p.stock < 5).length}</b>Stock baixo</div></div>
    <h2>Produtos</h2><div class="tw"><table><tr><th>Produto</th><th>Preço (MZN)</th><th>Stock</th></tr>
    ${products.map(p => `<tr><td>${esc(p.name)}</td><td><input type="number" min="0" value="${p.price}" onchange="upd(${p.id},'price',this.value)"></td><td><input type="number" min="0" value="${p.stock}" onchange="upd(${p.id},'stock',this.value)"></td></tr>`).join("")}</table></div>
    <h2 style="margin-top:2rem">Encomendas</h2><div class="tw"><table>
    ${orders.map(o => `<tr><td>#${o.id}</td><td>${esc(o.name)} (${esc(o.country)})</td><td>${mzn(o.total)}</td><td><select onchange="setStatus(${o.id},this.value)">${["Pendente","Paga","Enviada","Entregue"].map(s => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`).join("") || `<tr><td class="mut">Sem encomendas.</td></tr>`}</table></div></section>`;
}
function upd(id, k, v){ products.find(p => p.id === id)[k] = Math.max(0, +v || 0); store.set("cb_products2", products); toast("Guardado"); }
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
    ? l.map(({ p, q }) => `<div class="li"><div><b>${esc(p.name)}</b><div class="mut small">${mzn(p.price)}</div><div class="qty"><button onclick="chg(${p.id},-1)">−</button><span>${q}</span><button onclick="chg(${p.id},1)">+</button></div></div><b>${mzn(p.price * q)}</b></div>`).join("")
      + `<div class="d-f"><div class="row"><span class="mut">Total</span><b style="font-size:1.4rem">${mzn(total())}</b></div><a class="btn" href="#/checkout">Finalizar encomenda</a></div>`
    : `<p class="mut">O carrinho está vazio.</p><a class="btn ghost" href="#/catalogo" onclick="pick('Todos');closeCart()">Ver catálogo</a>`;
}
const openCart  = () => document.body.classList.add("cart-open");
const closeCart = () => document.body.classList.remove("cart-open");

function checkout(){
  const l = items();
  if (!l.length) return `<section class="section"><h1>Finalizar</h1><p class="mut">O carrinho está vazio.</p></section>`;
  return `<section class="section"><h1>Finalizar encomenda</h1>
    <div class="two" style="margin-top:1.5rem">
      <div class="box"><label>Nome completo<input id="kn" value="${user ? esc(user.name) : ""}"></label><label>Email<input id="ke" type="email" value="${user ? esc(user.email) : ""}"></label><label>País de entrega<input id="kc"></label><label>Morada<textarea id="ka" rows="3"></textarea></label>
        <label class="check"><input type="checkbox" id="k18"><span>Confirmo ter 18 anos ou mais e que a importação de tabaco é permitida no meu país.</span></label>
        <button class="btn" onclick="placeOrder()">Confirmar encomenda</button><p class="mut small" style="margin-top:.8rem">O pagamento (M-Pesa, cartão) será ligado ao backend.</p></div>
      <div class="box"><h3>Resumo</h3>${l.map(({ p, q }) => `<div class="row" style="margin-top:.6rem"><span>${q} × ${esc(p.name)}</span><span>${mzn(p.price * q)}</span></div>`).join("")}<hr style="border:0;border-top:1px solid var(--line);margin:1rem 0"><div class="row"><b>Total</b><b>${mzn(total())}</b></div></div>
    </div></section>`;
}
function placeOrder(){
  const name = $("#kn").value.trim(), email = $("#ke").value.trim(), country = $("#kc").value.trim(), addr = $("#ka").value.trim();
  if (!$("#k18").checked) return toast("Confirme a idade para continuar");
  if (!name || !email.includes("@") || !country || !addr) return toast("Preencha todos os campos");
  items().forEach(({ p, q }) => p.stock -= q);
  orders.push({ id:1001 + orders.length, name, email, country, addr, total:total(), status:"Pendente", date:new Date().toLocaleDateString("pt-PT") });
  store.set("cb_products2", products); store.set("cb_orders", orders);
  user = user || { name, email }; store.set("cb_user", user);
  cart = {}; saveCart(); toast("Encomenda registada! 🎉"); location.hash = "#/conta";
}

// ---------- Router ----------
const views = { "":home, catalogo, sobre, contactos, conta, admin, checkout };
function route(){
  const r = location.hash.replace(/^#\/?/, "");
  $("#app").innerHTML = (views[r] || home)();
  if (r === "catalogo") renderGrid();
  $$("#cats a").forEach(a => a.classList.toggle("on", r === "catalogo" && a.dataset.c === filt.cat));
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
$("#sf").onsubmit = e => { e.preventDefault(); filt.cat = "Todos"; filt.sub = ""; filt.q = $("#q").value.trim(); location.hash === "#/catalogo" ? route() : (location.hash = "#/catalogo"); };
$("#age-yes").onclick = () => { store.set("cb_age", 1); $("#age").remove(); };
if (store.get("cb_age", 0)) $("#age").remove();
addEventListener("hashchange", route);
renderNav(); renderCart(); route();