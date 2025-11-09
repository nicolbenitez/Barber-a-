const SERVICES = [
  {id:'svc1',title:'Corte clásico',price:18,duration:30,desc:'Corte tradicional con tijera y máquina. Incluye lavado rápido.', img:'img/servicios/corte_clasico.jpg'},
  {id:'svc2',title:'Corte moderno',price:25,duration:45,desc:'Corte estilizado, diseño y acabado con navaja.', img:'img/servicios/corte_moderno.jpg'},
  {id:'svc3',title:'Afeitado a navaja',price:22,duration:35,desc:'Afeitado profesional con toalla caliente y loción.', img:'img/servicios/afeitado.jpg'},
  {id:'svc4',title:'Corte + Barba',price:30,duration:50,desc:'Combo de corte y perfilado de barba con tratamiento.', img:'img/servicios/corte_barba.jpg'},
  {id:'svc5',title:'Perfilado de barba',price:12,duration:20,desc:'Definición y estilizado de barba con aceites.', img:'img/servicios/perfilado.jpg'},
  {id:'svc6',title:'Tinte parcial',price:28,duration:40,desc:'Cobertura de entradas o canas - consulta previa.', img:'img/servicios/tinte.jpg'}
];

const cart = [];

function renderServices(list) {
  const container = document.getElementById('services');
  container.innerHTML = list.map(s => `
    <div class="card">
      <div class="img" style="background-image:url('${s.img}')"></div>
      <div class="content">
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <p><strong>${s.price}€</strong> — ${s.duration} min</p>
        <button onclick="addToCart('${s.id}')">Reservar</button>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const service = SERVICES.find(s => s.id === id);
  if (service) cart.push(service);
  document.getElementById('cart-count').textContent = cart.length;
}

document.getElementById('open-cart').onclick = () => {
  const modal = document.getElementById('cart-modal');
  const list = document.getElementById('cart-list');
  const total = cart.reduce((sum, s) => sum + s.price, 0);

  list.innerHTML = cart.map(s => `<li>${s.title} — ${s.price}€</li>`).join('');
  document.getElementById('total').textContent = `Total: ${total}€`;
  modal.style.display = 'flex';
};

document.getElementById('close-cart').onclick = () => {
  document.getElementById('cart-modal').style.display = 'none';
};

document.getElementById('search').oninput = e => {
  const q = e.target.value.toLowerCase();
  const filtered = SERVICES.filter(s => s.title.toLowerCase().includes(q));
  renderServices(filtered);
};

renderServices(SERVICES);
