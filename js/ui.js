// ====== JOYSTICK ======
let moveVec = {x:0,y:0};
let joyActive = false;
let wantAttack = false, wantSkill = null;
const pressedKeys = new Set();
const movementKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space']);

window.addEventListener('keydown', event => {
  if (movementKeys.has(event.code)) event.preventDefault();
  pressedKeys.add(event.code);
}, true);

window.addEventListener('keyup', event => {
  if (movementKeys.has(event.code)) event.preventDefault();
  pressedKeys.delete(event.code);
}, true);

function isPressed(...keys){
  return keys.some(key => pressedKeys.has(key));
}

function initUI(){
  const joy = document.getElementById('joystick');
  const stick = document.getElementById('stick');

  function joyMove(cx,cy){
    const r = joy.getBoundingClientRect();
    let dx = cx-(r.left+r.width/2), dy = cy-(r.top+r.height/2);
    const dist = Math.min(Math.hypot(dx,dy),45), ang = Math.atan2(dy,dx);
    const nx = Math.cos(ang)*dist, ny = Math.sin(ang)*dist;
    stick.style.transform = `translate(${nx}px,${ny}px)`;
    moveVec.x = nx/45; moveVec.y = ny/45;
  }
  function joyEnd(){ joyActive=false; moveVec={x:0,y:0}; stick.style.transform='translate(0,0)'; }

  joy.addEventListener('pointerdown',e=>{
    e.preventDefault();
    joyActive=true;
    joy.setPointerCapture(e.pointerId);
    joyMove(e.clientX,e.clientY);
  });
  joy.addEventListener('pointermove',e=>{
    if(!joyActive) return;
    e.preventDefault();
    joyMove(e.clientX,e.clientY);
  });
  joy.addEventListener('pointerup',joyEnd);
  joy.addEventListener('pointercancel',joyEnd);

  bindBtn('atkBtn', ()=>wantAttack=true);
  bindBtn('skill1', ()=>wantSkill='skill1');
  bindBtn('skill2', ()=>wantSkill='skill2');
  bindBtn('skill3', ()=>wantSkill='skill3');
}

function bindBtn(id, cb){
  const el = document.getElementById(id);
  el.addEventListener('touchstart',e=>{e.preventDefault(); cb();});
  el.addEventListener('mousedown',()=>cb());
}

// ====== HUD ======
function updateHUD(){
  document.getElementById('lvl').textContent = 'Nivel '+player.level;
  document.getElementById('gold').textContent = 'Oro: '+player.gold;
  document.getElementById('hpFill').style.width = (player.hp/player.maxHp*100)+'%';
  document.getElementById('mpFill').style.width = (player.mp/player.maxMp*100)+'%';
  document.getElementById('xpFill').style.width = (player.xp/player.xpNext*100)+'%';
}
