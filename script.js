const SERVICES = [
  {id:'svc1',title:'Corte clásico',price:18,duration:30,desc:'Corte tradicional con tijera y máquina. Incluye lavado rápido.'},
  {id:'svc2',title:'Corte moderno',price:25,duration:45,desc:'Corte estilizado, diseño y acabado con navaja.'},
  {id:'svc3',title:'Afeitado a navaja',price:22,duration:35,desc:'Afeitado profesional con toalla caliente y loción.'},
  {id:'svc4',title:'Corte + Barba',price:30,duration:50,desc:'Combo de corte y perfilado de barba con tratamiento.'},
  {id:'svc5',title:'Perfilado de barba',price:12,duration:20,desc:'Definición y estilizado de barba con aceites.'},
  {id:'svc6',title:'Tinte parcial',price:28,duration:40,desc:'Cobertura de entradas o canas - consulta previa.'}
];

let cart = JSON.parse(localStorage.getItem('barber_cart')||'{}');
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

function init(){
  qs('#year').textContent = new Date().getFullYear();
  renderServices(SERVICES);
  bindUI();
  refreshCartUI();
}

function bindUI(){
  qs('#open-cart').addEventListener('click',()=>qs('#cart').classList.add('open'));
  qs('#close-cart').addEventListener('click',()=>qs('#cart').classList.remove('open'));
  qs('#search').addEventListener('input',onSearch);
  qs('#sort').addEventListener('change',onSort);
  qs('#booking-form').addEventListener('submit',onConfirmBooking);
  qs('#close-modal').addEventListener('click',closeModal);
}

function renderServices(list){
  const cont = qs('#services'); cont.innerHTML='';
  list.forEach(s=>{
    const card = document.createElement('article'); card.className='card';
    card.innerHTML = `
      <div class="img">✂️</div>
      <h3>${s.title}</h3>
      <div class="meta">Duración: ${s.duration} min</div>
      <div class="price-row"><div class="meta">Precio</div><div><strong>$${s.price}</strong></div></div>
      <p class="meta">${s.desc}</p>
      <div class="actions">
        <button class="small" data-id="${s.id}" data-action="details">Ver</button>
        <button class="small" data-id="${s.id}" data-action="add">Agregar</button>
      </div>`;
    cont.appendChild(card);
  });
  cont.querySelectorAll('[data-action]').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const id = e.currentTarget.dataset.id;
      const act = e.currentTarget.dataset.action;
      if(act==='add') addToCart(id);
      if(act==='details') openDetails(id);
    });
  });
}

function addToCart(id){
  cart[id] = (cart[id]||0) + 1;
  persistCart();
  refreshCartUI();
}

function removeFromCart(id){
  delete cart[id]; persistCart(); refreshCartUI();
}

function changeQty(id,qty){
  if(qty<=0) removeFromCart(id); else {cart[id]=qty;persistCart();refreshCartUI();}
}

function persistCart(){
  localStorage.setItem('barber_cart',JSON.stringify(cart));
}

function refreshCartUI(){
  const container = qs('#cart-items'); container.innerHTML='';
  const keys = Object.keys(cart);
  if(keys.length===0){container.innerHTML='<p class="empty">No has agregado servicios.</p>';}
  let total=0; let count=0;
  keys.forEach(id=>{
    const svc = SERVICES.find(s=>s.id===id); const qty = cart[id];
    total += svc.price * qty; count += qty;
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <div class="title"><strong>${svc.title}</strong><div class="meta">${svc.duration} min • $${svc.price}</div></div>
      <div class="controls">
        <input type="number" min="0" value="${qty}" data-id="${id}" class="qty" style="width:64px">
        <button class="small remove" data-id="${id}">Quitar</button>
      </div>`;
    container.appendChild(div);
  });
  qs('#cart-count').textContent = count;
  qs('#cart-total').textContent = `$${total}`;
  qsa('.qty').forEach(inp=>inp.addEventListener('change',e=>{
    const id = e.target.dataset.id; const v = parseInt(e.target.value)||0; changeQty(id,v);
  }));
  qsa('.remove').forEach(b=>b.addEventListener('click',e=>removeFromCart(e.currentTarget.dataset.id)));
}

function openDetails(id){
  const svc = SERVICES.find(s=>s.id===id);
  const body = qs('#modal-body');
  body.innerHTML = `
    <h2>${svc.title}</h2>
    <p class="meta">Duración: ${svc.duration} minutos • Precio: <strong>$${svc.price}</strong></p>
    <p>${svc.desc}</p>
    <div style="margin-top:12px"><button class="btn primary" id="modal-add" data-id="${id}">Agregar a reserva</button></div>
  `;
  qs('#modal').classList.add('show');
  qs('#modal').setAttribute('aria-hidden','false');
  qs('#modal-add').addEventListener('click',()=>{ addToCart(id); closeModal(); qs('#cart').classList.add('open'); });
}
function closeModal(){ qs('#modal').classList.remove('show'); qs('#modal').setAttribute('aria-hidden','true'); }

function onSearch(e){
  const q = e.target.value.toLowerCase().trim();
  const filtered = SERVICES.filter(s=> s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
  renderServices(filtered);
}

function onSort(e){
  const val = e.target.value; let list = [...SERVICES];
  if(val==='price-asc') list.sort((a,b)=>a.price-b.price);
  if(val==='price-desc') list.sort((a,b)=>b.price-a.price);
  if(val==='duration-asc') list.sort((a,b)=>a.duration-b.duration);
  renderServices(list);
}

function onConfirmBooking(evt){
  evt.preventDefault();
  const name = qs('#client-name').value.trim();
  const when = qs('#client-datetime').value;
  const items = Object.keys(cart);
  if(!name || !when || items.length===0){ alert('Completa tu nombre, fecha/hora y agrega al menos un servicio.'); return; }

  const payload = {
    cliente:name,
    cuando:when,
    servicios: items.map(id=>({...SERVICES.find(s=>s.id===id), qty:cart[id]})),
    total: Object.keys(cart).reduce((sum,id)=>sum + SERVICES.find(s=>s.id===id).price * cart[id],0)
  };
  console.log('Reserva confirmada',payload);
  alert('Reserva confirmada para ' + name + ' el ' + new Date(when).toLocaleString());
  cart = {}; persistCart(); refreshCartUI(); qs('#booking-form').reset(); qs('#cart').classList.remove('open');
}

init();
