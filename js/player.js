// Estado y datos del jugador
const player = {
  hp:100, maxHp:100, mp:50, maxMp:50, level:1, xp:0, xpNext:20,
  gold:0, speed:180, attack:25,
  name:'Novato', job:'Novato'
};

// Lógica de subir de nivel
function levelUp() {
  player.xp -= player.xpNext;
  player.level++;
  player.xpNext = Math.floor(player.xpNext * 1.5);
  player.maxHp += 20; player.hp = player.maxHp;
  player.maxMp += 10; player.mp = player.maxMp;
  player.attack += 5;
}