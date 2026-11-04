// Replace these demo items with your own products, prices, and licensed photos.
const products = [
  {id:'sticker-pack',name:'Happy Day Sticker Pack',price:5.00,category:'stickers',emoji:'🌷',color:'#f9dce5',tag:'BEST SELLER',description:'A bundle of adorable mini stickers.'},
  {id:'mystery-bag',name:'Mystery Blind Bag',price:8.00,category:'blind-bags',emoji:'🎁',color:'#f5e3c7',tag:'SURPRISE',description:'A little surprise in every bag.'},
  {id:'photocard-holder',name:'Heart Photocard Holder',price:7.50,category:'accessories',emoji:'💗',color:'#e3d9f7',tag:'CUTE PICK',description:'Keep your favorite card close.'},
  {id:'star-stickers',name:'Starry Sticker Sheet',price:4.00,category:'stickers',emoji:'⭐',color:'#dceaf7',tag:'NEW',description:'Dreamy stars for your journal.'}
];
const currency = n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const grid=document.querySelector('#product-grid');
const cart={};
function renderProducts(category='all'){
  grid.replaceChildren();
  products.filter(p=>category==='all'||p.category===category).forEach(p=>{
    const card=document.createElement('article');card.className='product-card';
    card.innerHTML=`<div class="product-image" style="--product-color:${p.color}"><span aria-hidden="true">${p.emoji}</span><b class="product-tag">${p.tag}</b></div><div class="product-meta"><h3>${p.name}</h3><strong>${currency(p.price)}</strong></div><p>${p.description}</p>`;
    const button=document.createElement('button');button.className='add-button';button.textContent='Add to bag +';button.addEventListener('click',()=>addToCart(p.id));card.append(button);grid.append(card);
  });
}
function addToCart(id){cart[id]=(cart[id]||0)+1;renderCart();openCart()}
function renderCart(){
  const target=document.querySelector('#cart-items');target.replaceChildren();
  let total=0,count=0;
  for(const [id,qty] of Object.entries(cart)){
    const p=products.find(p=>p.id===id);if(!p)continue;
    total+=p.price*qty;count+=qty;
    const line=document.createElement('div');line.className='cart-line';
    const detail=document.createElement('div');const name=document.createElement('strong');name.textContent=p.name;const info=document.createElement('small');info.textContent=`${qty} × ${currency(p.price)}`;detail.append(name,info);
    const remove=document.createElement('button');remove.textContent='Remove one';remove.setAttribute('aria-label',`Remove one ${p.name}`);remove.addEventListener('click',()=>{cart[id]--;if(cart[id]===0)delete cart[id];renderCart()});line.append(detail,remove);target.append(line);
  }
  if(!count){const empty=document.createElement('p');empty.className='empty';empty.textContent='Your bag is empty — find something cute! ♡';target.append(empty)}
  document.querySelector('#cart-count').textContent=count;document.querySelector('#cart-total').textContent=currency(total);
}
const panel=document.querySelector('#cart-panel'),overlay=document.querySelector('#overlay'),toggle=document.querySelector('#cart-toggle');
let previousFocus=null;
function openCart(){previousFocus=document.activeElement;panel.classList.add('open');panel.setAttribute('aria-hidden','false');overlay.hidden=false;document.body.style.overflow='hidden';document.querySelector('#cart-close').focus()}
function closeCart(){panel.classList.remove('open');panel.setAttribute('aria-hidden','true');overlay.hidden=true;document.body.style.overflow='';previousFocus?.focus()}
toggle.addEventListener('click',openCart);document.querySelector('#cart-close').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))closeCart();if(e.key==='Tab'&&panel.classList.contains('open')){const nodes=[...panel.querySelectorAll('button:not(:disabled),a[href]')];const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));button.classList.add('active');renderProducts(button.dataset.category)}));
document.querySelector('#year').textContent=new Date().getFullYear();renderProducts();renderCart();
