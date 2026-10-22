const products=[
{name:"Nasi Goreng",cat:"Makanan",price:15000,emoji:"🍛",desc:"Nasi goreng gurih dengan telur dan sayuran."},
{name:"Mie Goreng",cat:"Makanan",price:12000,emoji:"🍜",desc:"Mie goreng dengan bumbu khas Waroeng CiTUT."},
{name:"Nasi Ayam Crispy",cat:"Makanan",price:18000,emoji:"🍗",desc:"Ayam crispy renyah dengan nasi hangat."},
{name:"Bakso",cat:"Makanan",price:12000,emoji:"🍲",desc:"Bakso kuah hangat dengan pelengkap."},
{name:"Es Teh Manis",cat:"Minuman",price:5000,emoji:"🧋",desc:"Es teh manis segar untuk menemani makan."},
{name:"Es Jeruk",cat:"Minuman",price:7000,emoji:"🍊",desc:"Minuman jeruk segar dan dingin."}
];
let category="Semua";
let cart=JSON.parse(localStorage.getItem("citut_cart")||"[]");
let orders=JSON.parse(localStorage.getItem("citut_orders")||"[]");
let logged=localStorage.getItem("citut_logged")==="1";

function rupiah(n){return "Rp "+Number(n).toLocaleString("id-ID")}
function save(){localStorage.setItem("citut_cart",JSON.stringify(cart));localStorage.setItem("citut_orders",JSON.stringify(orders));updateBadges()}
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
 const p=document.getElementById(id); if(p)p.classList.add("active-page");
 window.scrollTo({top:0,behavior:"smooth"});
 if(id==="menu")renderMenu();
 if(id==="cart")renderCart();
 if(id==="orders")renderOrders();
 if(id==="profile")renderProfile();
}
function productCard(p){
 return `<article class="food-card"><div class="food-img">${p.emoji}</div><div class="food-info"><h3>${p.name}</h3><p>${rupiah(p.price)}</p><button onclick="addCart('${p.name}')">+ Keranjang</button><button style="background:#fff;color:#c65b00;margin-left:4px" onclick="openDetail('${p.name}')">Detail</button></div></article>`
}
function renderPopular(){document.getElementById("popular").innerHTML=products.slice(0,3).map(productCard).join("")}
function renderMenu(){
 const q=(document.getElementById("menuSearch")?.value||"").toLowerCase();
 const arr=products.filter(p=>(category==="Semua"||p.cat===category)&&p.name.toLowerCase().includes(q));
 document.getElementById("menuGrid").innerHTML=arr.length?arr.map(productCard).join(""):"<p>Menu tidak ditemukan.</p>";
 document.getElementById("resultInfo").textContent=`${arr.length} menu`;
}
function filterMenu(c,el){category=c;document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));if(el)el.classList.add("active");showPage("menu")}
function searchFromHome(){document.getElementById("menuSearch").value=document.getElementById("homeSearch").value;showPage("menu")}
function addCart(name){
 const i=cart.findIndex(x=>x.name===name);
 if(i>=0)cart[i].qty++;else cart.push({name,qty:1});
 save();alert(name+" ditambahkan ke keranjang.");
}
function renderCart(){
 const el=document.getElementById("cartList");
 if(!cart.length){el.innerHTML="<div class='notice'>Keranjang masih kosong.</div>";document.getElementById("cartTotal").textContent="Rp 0";return}
 let total=0;
 el.innerHTML=cart.map((x,i)=>{const p=products.find(a=>a.name===x.name);total+=p.price*x.qty;return `<div class="cart-item"><div class="emoji">${p.emoji}</div><div><b>${p.name}</b><div>${rupiah(p.price)}</div></div><div class="qty"><button onclick="changeQty(${i},-1)">−</button><b>${x.qty}</b><button onclick="changeQty(${i},1)">+</button></div></div>`}).join("");
 document.getElementById("cartTotal").textContent=rupiah(total);
}
function changeQty(i,n){cart[i].qty+=n;if(cart[i].qty<=0)cart.splice(i,1);save();renderCart()}
function checkout(){
 if(!cart.length){alert("Keranjang masih kosong.");return}
 if(!logged){alert("Silakan login terlebih dahulu.");showPage("profile");return}
 let total=cart.reduce((s,x)=>s+products.find(p=>p.name===x.name).price*x.qty,0);
 orders.unshift({id:"CT"+Date.now().toString().slice(-6),total,date:new Date().toLocaleString("id-ID"),status:"Diproses"});
 cart=[];save();alert("Pesanan berhasil dibuat!");showPage("orders");
}
function renderOrders(){
 const el=document.getElementById("ordersList");
 el.innerHTML=orders.length?orders.map(o=>`<div class="notice"><b>Pesanan #${o.id}</b><p>${o.date}</p><strong>${rupiah(o.total)}</strong><p>Status: ${o.status}</p></div>`).join(""):"<div class='notice'>Belum ada pesanan.</div>";
 document.getElementById("orderCount").textContent=orders.length;
}
function openDetail(name){
 const p=products.find(x=>x.name===name);if(!p)return;
 document.getElementById("detailContent").innerHTML=`<div class="detail-img">${p.emoji}</div><h2>${p.name}</h2><p class="detail-price">${rupiah(p.price)}</p><p>${p.desc}</p><button class="checkout" onclick="addCart('${p.name}');closeDetail()">Tambah ke Keranjang</button>`;
 document.getElementById("detailModal").classList.add("show");
}
function closeDetail(){document.getElementById("detailModal").classList.remove("show")}
function toggleAuth(){
 if(logged){logged=false;localStorage.removeItem("citut_logged");alert("Berhasil logout.");}
 else{const name=prompt("Masukkan nama pengguna:","Ghanendra");if(!name)return;logged=true;localStorage.setItem("citut_logged","1");localStorage.setItem("citut_name",name)}
 renderProfile()
}
function renderProfile(){
 const name=localStorage.getItem("citut_name")||"Ghanendra";
 document.getElementById("profileName").textContent=logged?name:"Tamu";
 document.getElementById("profileEmail").textContent=logged?"user123@gmail.com":"Silakan login untuk mengelola akun";
 document.getElementById("authBtn").textContent=logged?"Logout":"Login";
 document.getElementById("orderCount").textContent=orders.length;
}
function updateBadges(){
 const n=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById("cartBadge").textContent=n;
 document.getElementById("cartCountProfile").textContent=n;
}
document.addEventListener("DOMContentLoaded",()=>{renderPopular();renderMenu();renderOrders();renderProfile();updateBadges()});
