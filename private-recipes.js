
(function(){
"use strict";
const URL="https://ozpjjvvvdqytcnisepeb.supabase.co";
const KEY="sb_publishable_NLj7g3fqEd58lMpRWxUfiQ_FRbbWEkT";
const BUCKET="recipes-image";
let sb=null, sub=null;
const S={user:null,recipes:[],urls:new Map(),editId:null,ready:false};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const errText=e=>{
  const m=String(e?.message||e||"Error");
  if(/invalid login credentials/i.test(m))return "El correo o la contraseña no son correctos.";
  if(/email not confirmed/i.test(m))return "Confirma primero tu correo electrónico desde el mensaje recibido.";
  if(/bucket not found/i.test(m))return "No se encontró el almacenamiento de fotos.";
  if(/row-level security|42501|permission denied/i.test(m))return "Supabase rechazó la operación por permisos. Revisa las políticas de tu cuenta.";
  return m;
};
function toast(t){if(typeof window.toast==="function")return window.toast(t);alert(t)}
function style(){
 const x=document.createElement("style");x.id="privateStyles";x.textContent=`
.accountBtn{display:inline-flex;align-items:center;justify-content:center;width:132px;height:132px;padding:0;border:1px solid rgba(241,200,91,.28);background:rgba(255,255,255,.04);color:var(--text);border-radius:50%;cursor:pointer;font-weight:700;flex:0 0 auto}.accountBtn b{font-size:34px;font-weight:400;line-height:1}.accountBtn span{display:none}.accountBtn:hover{border-color:rgba(241,200,91,.55)}.myRecipesBtn{display:none;align-items:center;justify-content:center;border:1px solid rgba(241,200,91,.28);background:rgba(255,255,255,.04);color:var(--text);border-radius:999px;padding:12px 17px;cursor:pointer;font-weight:700;white-space:nowrap}.myRecipesBtn.show{display:inline-flex}.myRecipesBtn:hover{border-color:rgba(241,200,91,.55)}
.privateOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(8px);z-index:80;padding:12px;align-items:center;justify-content:center}.privateOverlay.show{display:flex}
.privateModal{width:min(720px,100%);max-height:92vh;overflow:auto;background:#0b0f14;border:1px solid rgba(241,200,91,.24);border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.7)}.privateHead{display:flex;align-items:center;justify-content:space-between;padding:20px 22px;border-bottom:1px solid var(--line)}.privateHead h2{font-family:Georgia,serif;margin:0;color:#fff;font-size:28px}.privateBody{padding:20px 22px}.privateClose{border:1px solid var(--line);background:rgba(255,255,255,.06);color:#fff;width:40px;height:40px;border-radius:50%;font-size:22px;cursor:pointer}
.privateForm{display:grid;gap:12px}.privateField{display:grid;gap:6px}.privateField label{font-size:11px;text-transform:uppercase;letter-spacing:1.3px;color:var(--gold)}.privateField input,.privateField textarea,.privateField select{width:100%;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.045);color:#fff;padding:12px;outline:none}.privateField textarea{min-height:105px;resize:vertical}.privateActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.privateActions .primary{background:var(--gold);color:#090a0c;border-color:var(--gold);font-weight:800}.privateMsg{min-height:20px;color:var(--gold);font-size:13px;line-height:1.45}.privateMsg.error{color:#ff8d98}.privateTabs{display:flex;gap:8px;margin-bottom:16px}.privateTabs button{flex:1}.privateTabs .active{background:var(--gold);color:#090a0c;border-color:var(--gold);font-weight:800}
.accountInfo,.privateNotice{padding:13px;border:1px solid var(--line);border-radius:15px;background:rgba(255,255,255,.035);color:#cfd3d8;font-size:13px;line-height:1.5}.accountInfo strong{display:block;color:#fff}.accountInfo span{display:block;color:var(--muted);margin-top:3px;word-break:break-all}.accountMenu{display:grid;gap:10px}.accountOption{width:100%;text-align:left}.accountOption.danger{color:#ff8d98}
.privateList{display:grid;gap:11px}.privateEmpty{text-align:center;color:var(--muted);padding:30px 10px}.privateCard{display:grid;grid-template-columns:82px 1fr auto;gap:12px;align-items:center;border:1px solid var(--line);border-radius:16px;padding:9px;background:rgba(255,255,255,.035)}.privateCard img,.privateThumb{width:82px;height:72px;object-fit:cover;border-radius:11px;background:#090b0e}.privateCard h3{margin:0 0 4px;font-size:16px}.privateCard p{margin:0;color:var(--muted);font-size:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.privateCardActions{display:flex;gap:6px;flex-direction:column}.privateCardActions .chip{padding:7px 10px;font-size:12px}.privatePreview{display:none;width:100%;max-height:180px;object-fit:cover;border-radius:13px;border:1px solid var(--line)}@media(max-width:560px){.accountBtn{width:70px;height:70px;padding:0}.accountBtn b{font-size:25px}.myRecipesBtn{padding:9px 11px;font-size:12px}.privateModal{max-height:94vh;border-radius:22px}.privateBody{padding:18px}.privateHead{padding:16px 18px}.privateHead h2{font-size:24px}.privateCard{grid-template-columns:65px 1fr}.privateCard img,.privateThumb{width:65px;height:60px}.privateCardActions{grid-column:1/-1;flex-direction:row}.privateCardActions .chip{flex:1}}
`;document.head.appendChild(x)
}
function overlay(id,title){const o=document.createElement("div");o.className="privateOverlay";o.id=id;o.innerHTML='<div class="privateModal"><div class="privateHead"><h2>'+title+'</h2><button class="privateClose" type="button">×</button></div><div class="privateBody"></div></div>';document.body.appendChild(o);o.querySelector(".privateClose").onclick=()=>close(o);o.onclick=e=>{if(e.target===o)close(o)};return o}
function close(o){o.classList.remove("show");document.body.style.overflow=""}
function open(o){document.querySelectorAll(".privateOverlay.show").forEach(close);o.classList.add("show");document.body.style.overflow="hidden"}
function client(){
 if(sb)return sb;if(!window.supabase?.createClient)return null;
 sb=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 if(!sub){const r=sb.auth.onAuthStateChange((event,session)=>setTimeout(()=>authChanged(event,session),0));sub=r?.data?.subscription||null}
 return sb
}
async function authChanged(event,session){S.user=session?.user||null;S.ready=true;updateAccount();if(S.user)await load();else{S.recipes=[];S.urls.clear()}if(event==="SIGNED_OUT")document.querySelectorAll(".privateOverlay.show").forEach(close)}
async function ensure(){const c=client();if(!c)throw Error("El servicio de cuenta todavía no está disponible.");if(!S.ready){const {data,error}=await c.auth.getSession();if(error)throw error;S.user=data.session?.user||null;S.ready=true;updateAccount();if(S.user)await load()}return S.user}
function updateAccount(){const b=$("#accountBtn"),m=$("#myRecipesBtn");if(!b)return;b.innerHTML='<b>♙</b>';if(m)m.classList.toggle("show",!!S.user)}
function auth(mode="login"){
 const o=$("#authOverlay"),b=o.querySelector(".privateBody");
 b.innerHTML='<div class="privateTabs"><button class="chip '+(mode==="login"?"active":"")+'" data-mode="login">Iniciar sesión</button><button class="chip '+(mode==="signup"?"active":"")+'" data-mode="signup">Crear cuenta</button></div><form class="privateForm" id="authForm"><div class="privateField"><label>Correo electrónico</label><input id="aEmail" type="email" autocomplete="email" required></div><div class="privateField"><label>Contraseña</label><input id="aPass" type="password" minlength="8" required></div><div id="aMsg" class="privateMsg"></div><button id="aSubmit" class="chip primary" type="submit">'+(mode==="login"?"Iniciar sesión":"Crear cuenta")+'</button></form>';
 b.querySelectorAll("[data-mode]").forEach(x=>x.onclick=()=>auth(x.dataset.mode));$("#authForm").onsubmit=authSubmit;open(o)
}
async function authSubmit(e){
 e.preventDefault();const email=$("#aEmail").value.trim(),pass=$("#aPass").value,msg=$("#aMsg"),btn=$("#aSubmit"),signup=document.querySelector("#authForm")?.previousElementSibling?.querySelector(".active")?.dataset.mode==="signup";
 btn.disabled=true;btn.textContent="Procesando…";msg.textContent="";msg.className="privateMsg";
 try{const c=client();if(!c)throw Error("El servicio de cuenta no está disponible.");
  if(signup){if(!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pass))throw Error("La contraseña debe tener al menos 8 caracteres e incluir letras y números.");const {data,error}=await c.auth.signUp({email,password:pass,options:{emailRedirectTo:location.origin+location.pathname}});if(error)throw error;if(data.session){close($("#authOverlay"));await authChanged("SIGNED_IN",data.session);toast("Cuenta creada")}else msg.textContent="Cuenta creada. Revisa tu correo y confirma la cuenta antes de iniciar sesión."}
  else{const {data,error}=await c.auth.signInWithPassword({email,password:pass});if(error)throw error;close($("#authOverlay"));await authChanged("SIGNED_IN",data.session);toast("Sesión iniciada")}
 }catch(x){msg.textContent=errText(x);msg.className="privateMsg error"}finally{btn.disabled=false;btn.textContent=signup?"Crear cuenta":"Iniciar sesión"}
}
function account(){
 if(!S.user)return auth("login");const o=$("#accountOverlay"),b=o.querySelector(".privateBody");
 b.innerHTML='<div class="accountMenu"><div class="accountInfo"><strong>Sesión activa</strong><span>'+esc(S.user.email||"")+'</span></div><button class="chip accountOption" id="myBtn">▣ Mis recetas</button><button class="chip accountOption" id="addBtn">＋ Agregar receta</button><button class="chip accountOption danger" id="outBtn">↪ Cerrar sesión</button><div id="acMsg" class="privateMsg"></div></div>';
 $("#myBtn").onclick=()=>{close(o);myRecipes()};$("#addBtn").onclick=()=>{close(o);form()};$("#outBtn").onclick=signout;open(o)
}
async function signout(){const c=client();if(!c)return;const {error}=await c.auth.signOut({scope:"local"});if(error){const m=$("#acMsg");if(m){m.textContent=errText(error);m.className="privateMsg error"}return}S.user=null;S.recipes=[];S.urls.clear();updateAccount();document.querySelectorAll(".privateOverlay.show").forEach(close);toast("Sesión cerrada")}
async function load(){
 if(!S.user)return;const c=client();if(!c)return;const {data,error}=await c.from("private_recipes").select("id,user_id,name,category,ingredients,garnish,preparation,image_url,created_at").eq("user_id",S.user.id).order("created_at",{ascending:false});if(error){console.error(error);return}S.recipes=data||[];S.urls.clear();const paths=S.recipes.map(r=>r.image_url).filter(Boolean);if(paths.length){const {data:u}=await c.storage.from(BUCKET).createSignedUrls(paths,3600);(u||[]).forEach(x=>{if(x?.path&&x?.signedUrl)S.urls.set(x.path,x.signedUrl)})}if($("#myList")?.closest(".privateOverlay")?.classList.contains("show"))renderList()
}
const img=r=>r?.image_url?(S.urls.get(r.image_url)||""):"";
function myRecipes(){const o=$("#myOverlay");open(o);renderList();load()}
function renderList(){const l=$("#myList");if(!l)return;if(!S.recipes.length){l.innerHTML='<div class="privateEmpty">Todavía no tienes recetas guardadas.<br><br><button class="chip primary" id="firstAdd">＋ Agregar mi primera receta</button></div>';$("#firstAdd").onclick=form;return}l.innerHTML=S.recipes.map(r=>'<div class="privateCard" data-open="'+r.id+'"><div>'+(img(r)?'<img src="'+img(r)+'" alt="'+esc(r.name)+'">':'<div class="privateThumb" style="display:grid;place-items:center;color:var(--gold);font-size:24px">✦</div>')+'</div><div><h3>'+esc(r.name)+'</h3><p>'+esc(r.category||"Mi receta")+' · '+esc(r.ingredients)+'</p></div><div class="privateCardActions"><button class="chip" data-edit="'+r.id+'">Editar</button><button class="chip" data-del="'+r.id+'">Eliminar</button></div></div>').join("");l.querySelectorAll("[data-open]").forEach(card=>card.onclick=e=>{if(e.target.closest("button"))return;openPrivateRecipe(S.recipes.find(r=>r.id===card.dataset.open))});l.querySelectorAll("[data-edit]").forEach(b=>b.onclick=e=>{e.stopPropagation();form(S.recipes.find(r=>r.id===b.dataset.edit))});l.querySelectorAll("[data-del]").forEach(b=>b.onclick=e=>{e.stopPropagation();del(b.dataset.del)})}
function openPrivateRecipe(r){if(!r)return;const photo=img(r);$("#mimage").src=photo||"";$("#mimage").alt=r.name;$("#mnum").textContent="Mi receta";$("#mname").textContent=r.name;const parts=(r.ingredients||"No especificado.").split(/(?<![\/\d])(?=(?:\d+(?:-\d+)?(?:\/\d+)?\s*(?:oz|cup|cups|tsp|tbsp|bar spoon|shot|slice|slices|sprig|leaves?|berries|cherries)|half\b|pinch\b|dash\b|splash\b|for the|layer \d|layer 1|layer 2|layer 3))/i).map(x=>x.trim()).filter(Boolean);$("#ming").innerHTML=parts.map(x=>`<div class="ingredient">${esc(x)}</div>`).join("")||`<div class="ingredient">No especificado</div>`;$("#gsection").style.display=r.garnish?"block":"none";$("#mgarnish").textContent=r.garnish||"";$("#minst").textContent=r.preparation||"No especificada.";$("#mfav").style.display="none";$("#copy").textContent="Copiar receta";$("#copy").onclick=()=>copyPrivateRecipe(r);$("#overlay").classList.add("show")}
function copyPrivateRecipe(r){const txt=`${r.name}\n\nIngredientes:\n${r.ingredients||"No especificado"}\n\nGarnish: ${r.garnish||"No especificado"}\n\nPreparación:\n${r.preparation||"No especificada"}`;try{navigator.clipboard.writeText(txt);toast("Receta copiada")}catch(e){toast("No se pudo copiar automáticamente")}}
function form(r=null){
 if(!S.user)return auth("login");S.editId=r?.id||null;const o=$("#formOverlay"),b=o.querySelector(".privateBody");
 const cats=["Vodka","Tequila","Ron","Gin","Whiskey/Bourbon","Champagne","Martini","Margarita","Mojito","Daiquiri","Sangria","Otros"];
 b.innerHTML='<div class="privateNotice">Tu receta será privada y solo estará disponible dentro de tu cuenta.</div><form id="recipeForm" class="privateForm"><div class="privateField"><label>Nombre *</label><input id="rName" maxlength="120" required value="'+esc(r?.name||"")+'"></div><div class="privateField"><label>Categoría</label><select id="rCat">'+cats.map(c=>'<option '+(r?.category===c?"selected":"")+'>'+c+'</option>').join("")+'</select></div><div class="privateField"><label>Ingredientes *</label><textarea id="rIng" maxlength="4000" required placeholder="2 oz...&#10;1 oz...">'+esc(r?.ingredients||"")+'</textarea></div><div class="privateField"><label>Garnish</label><input id="rGar" maxlength="500" value="'+esc(r?.garnish||"")+'"></div><div class="privateField"><label>Preparación *</label><textarea id="rPrep" maxlength="5000" required>'+esc(r?.preparation||"")+'</textarea></div><div class="privateField"><label>Foto (opcional, máximo 6 MB)</label><input id="rPhoto" type="file" accept="image/jpeg,image/png,image/webp,image/gif">'+(img(r)?'<img id="rPrev" class="privatePreview" style="display:block" src="'+img(r)+'" alt="Vista previa">':'<img id="rPrev" class="privatePreview" alt="Vista previa">')+'</div><div id="rMsg" class="privateMsg"></div><div class="privateActions"><button id="saveBtn" class="chip primary" type="submit">'+(r?"Guardar cambios":"Guardar receta")+'</button><button id="cancelBtn" class="chip" type="button">Cancelar</button>'+(r?'<button id="deleteBtn" class="chip" type="button">Eliminar</button>':"")+'</div></form>';
 $("#rPhoto").onchange=e=>{const f=e.target.files?.[0];if(!f)return;if(f.size>6*1024*1024){$("#rMsg").textContent="La foto supera 6 MB.";$("#rMsg").className="privateMsg error";e.target.value="";return}const u=URL.createObjectURL(f);$("#rPrev").src=u;$("#rPrev").style.display="block"};$("#recipeForm").onsubmit=save;$("#cancelBtn").onclick=()=>close(o);if(r)$("#deleteBtn").onclick=()=>del(r.id);open(o)
}
const ext=f=>{const x=(f.type||"image/jpeg").split("/")[1]||"jpg";return x==="jpeg"?"jpg":x.replace(/[^a-z0-9]/gi,"").toLowerCase()||"jpg"};
async function save(e){
 e.preventDefault();const c=client();if(!c||!S.user)return auth("login");const msg=$("#rMsg"),btn=$("#saveBtn"),r=S.editId?S.recipes.find(x=>x.id===S.editId):null,f=$("#rPhoto").files?.[0]||null;let newPath=null;
 btn.disabled=true;btn.textContent="Guardando…";msg.textContent="";msg.className="privateMsg";
 try{const name=$("#rName").value.trim(),ingredients=$("#rIng").value.trim(),preparation=$("#rPrep").value.trim();if(!name||!ingredients||!preparation)throw Error("Completa los campos marcados con *.");if(f&&f.size>6*1024*1024)throw Error("La foto supera 6 MB.");
  if(f){newPath=S.user.id+"/"+crypto.randomUUID()+"."+ext(f);const {error}=await c.storage.from(BUCKET).upload(newPath,f,{cacheControl:"3600",contentType:f.type,upsert:false});if(error)throw error}
  const row={name,category:$("#rCat").value,ingredients,garnish:$("#rGar").value.trim()||null,preparation,image_url:newPath||r?.image_url||null};
  if(r){const {error}=await c.from("private_recipes").update(row).eq("id",r.id).eq("user_id",S.user.id);if(error)throw error;if(newPath&&r.image_url)await c.storage.from(BUCKET).remove([r.image_url])}
  else{const {error}=await c.from("private_recipes").insert({user_id:S.user.id,...row});if(error)throw error}
  await load();close($("#formOverlay"));myRecipes();toast(r?"Receta actualizada":"Receta guardada")
 }catch(x){if(newPath)await c.storage.from(BUCKET).remove([newPath]);msg.textContent=errText(x);msg.className="privateMsg error"}finally{btn.disabled=false;btn.textContent=S.editId?"Guardar cambios":"Guardar receta"}
}
async function del(id){
 const r=S.recipes.find(x=>x.id===id);if(!r||!confirm('¿Eliminar "'+r.name+'"? Esta acción no se puede deshacer.'))return;const c=client();
 try{const {error}=await c.from("private_recipes").delete().eq("id",id).eq("user_id",S.user.id);if(error)throw error;if(r.image_url)await c.storage.from(BUCKET).remove([r.image_url]);await load();close($("#formOverlay"));myRecipes();toast("Receta eliminada")}catch(x){const m=$("#rMsg");if(m){m.textContent=errText(x);m.className="privateMsg error"}else toast(errText(x))}
}
function init(){
 style();const fav=$("#favFilter");if(!fav)return;const b=document.createElement("button");b.id="accountBtn";b.className="accountBtn";b.type="button";b.setAttribute("aria-label","Cuenta");fav.insertAdjacentElement("afterend",b);const m=document.createElement("button");m.id="myRecipesBtn";m.className="myRecipesBtn";m.type="button";m.textContent="▣ Mis recetas";m.setAttribute("aria-label","Mis recetas");b.insertAdjacentElement("afterend",m);b.onclick=()=>ensure().then(account).catch(()=>auth("login"));m.onclick=()=>ensure().then(()=>{if(S.user)myRecipes();else auth("login")}).catch(()=>auth("login"));updateAccount();
 const ao=overlay("authOverlay","Cuenta"),co=overlay("accountOverlay","Mi cuenta"),mo=overlay("myOverlay","Mis recetas"),fo=overlay("formOverlay","Agregar receta");$("#overlay").addEventListener("click",()=>{$("#mfav").style.display=""});
 mo.querySelector(".privateBody").innerHTML='<div class="privateActions" style="margin-top:0;margin-bottom:14px"><button class="chip primary" id="privateAdd">＋ Agregar receta</button></div><div id="myList" class="privateList"></div>';$("#privateAdd").onclick=form;
 document.addEventListener("keydown",e=>{if(e.key==="Escape")document.querySelectorAll(".privateOverlay.show").forEach(close)});window.addEventListener("pageshow",()=>document.querySelectorAll(".privateOverlay.show").forEach(close));
 if(window.supabase?.createClient){client();ensure().catch(e=>console.warn("Cuenta no disponible:",e))}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();