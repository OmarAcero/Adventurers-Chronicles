// Definición de habilidades del jugador
const skills = {
  skill1:{ name:'Golpe Feroz', unlockLvl:2, mpCost:10, cd:2000, ready:true, learned:false },
  skill2:{ name:'Cura',        unlockLvl:3, mpCost:15, cd:5000, ready:true, learned:false },
  skill3:{ name:'Onda Mágica', unlockLvl:5, mpCost:20, cd:4000, ready:true, learned:false }
};

// Cooldown visual del botón de habilidad
function startCooldown(id, ms){
  const btn = document.getElementById(id);
  const cd = document.createElement('div'); cd.className='cd';
  btn.appendChild(cd);
  let remain = ms/1000; cd.textContent = remain.toFixed(0);
  const iv = setInterval(()=>{ remain-=1; cd.textContent=remain.toFixed(0); if(remain<=0) clearInterval(iv); },1000);
  setTimeout(()=>{ skills[id].ready=true; cd.remove(); }, ms);
}