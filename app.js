const DEF=[
{id:1,n:"Robusto Maputo",c:"Charutos",o:"Moçambique",p:850,s:24,d:"Corpo médio, notas de cedro e cacau."},
{id:2,n:"Corona Índico",c:"Charutos",o:"Moçambique",p:1100,s:12,d:"Suave e cremoso, ideal para iniciar."},
{id:3,n:"Torpedo Reserva",c:"Charutos",o:"Importado",p:1650,s:8,d:"Intenso, final longo de especiarias."},
{id:4,n:"Humidor Cedro 25",c:"Acessórios",o:"Importado",p:5200,s:5,d:"Humidor em cedro espanhol para 25 charutos."},
{id:5,n:"Cortador Duplo Aço",c:"Acessórios",o:"Importado",p:1450,s:15,d:"Corte limpo, lâminas em aço inoxidável."},
{id:6,n:"Isqueiro de Chama Tripla",c:"Acessórios",o:"Importado",p:2100,s:10,d:"Chama azul resistente ao vento."},
{id:7,n:"Cinzeiro Cerâmica",c:"Acessórios",o:"Local",p:980,s:9,d:"Feito à mão, com quatro apoios."}];
const S={route:"home",cat:"Todos",cart:{},user:null,admin:false};
let P=DEF.map(x=>({...x})),O=[];
function ld(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
P=ld("cb_p",P);O=ld("cb_o",[]);S.user=ld("cb_u",null);
const $=s=>document.querySelector(s),M=n=>n.toLocaleString("pt-PT")+" MZN";
function ageOk(){sv("cb_age",1);$("#age").remove()}
if(ld("cb_age",0))$("#age").remove();
function go(r){S.route=r;draw();scrollTo(0,0)}
function add(i){const p=P.find(x=>x.id==i);if((S.cart[i]||0)<p.s){S.cart[i]=(S.cart[i]||0)+1;draw()}else alert("Stock esgotado.")}
function rm(i){delete S.cart[i];draw()}
const total=()=>Object.entries(S.cart).reduce((a,[i,q])=>a+P.find(x=>x.id==i).p*q,0);
function card(p){return `<div class="card"><div class="band"></div><h3>${p.n}</h3><div class="mut">${p.c} · ${p.o}</div><p>${p.d}</p><div class="price">${M(p.p)}</div><div class="mut">${p.s>0?p.s+" em stock":"Esgotado"}</div><br><button ${p.s<1?"disabled":""} onclick="add(${p.id})">Adicionar</button></div>`}
const V={
home:()=>`<section class="hero"><h1>A arte do charuto, de Maputo para o mundo</h1><p>Charutos selecionados, acessórios e rituais para quem aprecia o tempo bem passado.</p><button onclick="go('catalogo')">Ver catálogo</button></section><h2 style="margin-top:2rem">Em destaque</h2><div class="grid">${P.slice(0,3).map(card).join("")}</div>`,
catalogo:()=>{const cs=["Todos",...new Set(P.map(x=>x.c))];return `<h1>Catálogo</h1><div class="tabs">${cs.map(c=>`<button class="${c==S.cat?"":"alt"}" onclick="S.cat='${c}';draw()">${c}</button>`).join("")}</div><div class="grid">${P.filter(x=>S.cat=="Todos"||x.c==S.cat).map(card).join("")}</div>`},
sobre:()=>`<h1>Sobre nós</h1><p>A Casa Baobá nasceu em Maputo da paixão pela cultura do charuto e pelo orgulho na terra que nos viu crescer. Selecionamos charutos e acessórios com critério, para quem valoriza qualidade e calma.</p><p><b>Missão:</b> oferecer produtos de tabacaria premium com serviço de confiança, de forma responsável e só a maiores de idade.</p>`,
contactos:()=>`<h1>Contactos</h1><p class="mut">Maputo, Moçambique · loja@casabaoba.example</p><div style="max-width:440px"><label>Nome<input id="cnome"></label><label>Email<input id="cmail" type="email"></label><label>Mensagem<textarea id="cmsg" rows="4"></textarea></label><button onclick="msg()">Enviar</button></div>`,
carrinho:()=>{const e=Object.entries(S.cart);if(!e.length)return `<h1>Carrinho</h1><p>O carrinho está vazio.</p>`;return `<h1>Carrinho</h1><div class="tw"><table>${e.map(([i,q])=>{const p=P.find(x=>x.id==i);return `<tr><td>${p.n}</td><td>${q} × ${M(p.p)}</td><td><button class="alt" onclick="rm(${i})">Remover</button></td></tr>`}).join("")}</table></div><h2>Total: ${M(total())}</h2><label>Nome<input id="knome" value="${S.user?S.user.n:""}"></label><label>País de entrega<input id="kpais"></label><label><input type="checkbox" id="k18" style="width:auto"> Confirmo ter 18 anos ou mais e que a importação é permitida no meu país.</label><button onclick="order()">Finalizar encomenda</button><p class="mut">O pagamento (M-Pesa, cartão) será ligado ao backend.</p>`},
conta:()=>S.user?`<h1>Olá, ${S.user.n}</h1><p class="mut">${S.user.e}</p><h2>As minhas encomendas</h2>${O.filter(o=>o.e==S.user.e).map(o=>`<div class="card" style="margin-bottom:.6rem">#${o.id} · ${o.dt} · ${M(o.t)} · <b>${o.st}</b></div>`).join("")||"<p>Sem encomendas.</p>"}<button class="alt" onclick="S.user=null;sv('cb_u',null);draw()">Terminar sessão</button>`:`<h1>Conta do cliente</h1><div style="max-width:380px"><label>Nome<input id="un"></label><label>Email<input id="ue" type="email"></label><button onclick="login()">Entrar / Criar conta</button></div>`,
admin:()=>{if(!S.admin)return `<h1>Administração</h1><div style="max-width:300px"><label>Palavra-passe (demo: admin)<input id="ap" type="password"></label><button onclick="S.admin=$('#ap').value=='admin';draw()">Entrar</button></div>`;return `<h1>Administração</h1><p class="mut">Demonstração: dados guardados só neste navegador. A versão real precisa de backend e autenticação segura.</p><h2>Produtos</h2><div class="tw"><table><tr><th>Produto</th><th>Preço</th><th>Stock</th></tr>${P.map(p=>`<tr><td>${p.n}</td><td><input type="number" value="${p.p}" onchange="up(${p.id},'p',this.value)"></td><td><input type="number" value="${p.s}" onchange="up(${p.id},'s',this.value)"></td></tr>`).join("")}</table></div><h2>Encomendas</h2><div class="tw"><table>${O.map(o=>`<tr><td>#${o.id}</td><td>${o.n} (${o.pais})</td><td>${M(o.t)}</td><td><select onchange="us(${o.id},this.value)">${["Pendente","Paga","Enviada","Entregue"].map(s=>`<option ${s==o.st?"selected":""}>${s}</option>`).join("")}</select></td></tr>`).join("")||"<tr><td>Sem encomendas.</td></tr>"}</table></div>`}};
function up(i,k,v){P.find(x=>x.id==i)[k]=+v;sv("cb_p",P)}
function us(i,v){O.find(x=>x.id==i).st=v;sv("cb_o",O)}
function msg(){if(!$("#cmail").value||!$("#cmsg").value)return alert("Preencha email e mensagem.");alert("Mensagem registada. Responderemos em breve.");go("home")}
function login(){const n=$("#un").value.trim(),e=$("#ue").value.trim();if(!n||!e)return alert("Preencha nome e email.");S.user={n,e};sv("cb_u",S.user);draw()}
function order(){if(!$("#k18").checked)return alert("É necessário confirmar a idade.");const n=$("#knome").value.trim(),pais=$("#kpais").value.trim();if(!n||!pais)return alert("Indique nome e país.");Object.entries(S.cart).forEach(([i,q])=>P.find(x=>x.id==i).s-=q);O.push({id:O.length+1001,n,pais,e:S.user?S.user.e:"",t:total(),st:"Pendente",dt:new Date().toLocaleDateString("pt-PT")});sv("cb_p",P);sv("cb_o",O);S.cart={};alert("Encomenda registada! Entraremos em contacto para pagamento e envio.");go("conta")}
function draw(){$("#app").innerHTML=V[S.route]();$("#cn").textContent=Object.values(S.cart).reduce((a,b)=>a+b,0)}
draw();
