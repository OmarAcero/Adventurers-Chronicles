class MainScene extends Phaser.Scene {
  constructor(){ super('main'); }

  preload(){
    const s = GAME_CONFIG.sprites.hero;
    if (s.path) {
      // CAMINO REAL: carga tu spritesheet PNG
      this.load.spritesheet('hero', s.path, {
        frameWidth: s.frameWidth,
        frameHeight: s.frameHeight
      });
    } else {
      // CAMINO DE PRUEBA: genera un spritesheet dibujado por código
      this.createTestSpritesheet();
    }
  }

  // Genera un "personaje" de prueba con frames para animar (mientras no tengas PNG)
  createTestSpritesheet(){
    const fw=64, fh=64, cols=4, rows=4;
    const g = this.make.graphics({x:0,y:0,add:false});
    const dirColors = [0xf5deb3, 0xe6c88f, 0xf5deb3, 0xd9b877]; // tono por dirección
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const ox=c*fw, oy=r*fh;
        // cuerpo
        g.fillStyle(dirColors[r],1);
        g.fillRect(ox+22, oy+18, 20, 30);
        // cabeza
        g.fillStyle(0xffe0bd,1);
        g.fillCircle(ox+32, oy+14, 9);
        // "piernas" que alternan para simular caminar
        g.fillStyle(0x5d4037,1);
        const step = (c%2===0)? 0 : 4;
        g.fillRect(ox+24, oy+46, 6, 12+step);
        g.fillRect(ox+34, oy+46, 6, 12-step);
      }
    }
    g.generateTexture('hero', fw*cols, fh*rows);
    g.destroy();
  }

  create(){
    this.add.grid(0,0, GAME_CONFIG.worldWidth, GAME_CONFIG.worldHeight,
      GAME_CONFIG.tileSize, GAME_CONFIG.tileSize, 0x2e7d32, 1, 0x256428, 0.4).setOrigin(0);

    // ====== CREAR ANIMACIONES ======
    this.createHeroAnimations();

    // HÉROE como sprite animado
    this.hero = this.physics.add.sprite(500,500,'hero',0);
    this.hero.setCollideWorldBounds(true);
    this.hero.body.setSize(28,30).setOffset(18,20);
    this.hero.lastDir = 'down';

    this.physics.world.setBounds(0,0,GAME_CONFIG.worldWidth,GAME_CONFIG.worldHeight);
    this.cameras.main.startFollow(this.hero,true,0.1,0.1)
      .setBounds(0,0,GAME_CONFIG.worldWidth,GAME_CONFIG.worldHeight);

    this.monsters = this.physics.add.group();
    for(let i=0;i<GAME_CONFIG.monsterCount;i++) this.spawnMonster();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ONE,TWO,THREE');

    this.time.addEvent({delay:1000, loop:true, callback:()=>{
      if(player.mp<player.maxMp){ player.mp=Math.min(player.maxMp,player.mp+3); updateHUD(); }
    }});
  }

  // ====== DEFINIR ANIMACIONES DE CAMINAR ======
  createHeroAnimations(){
    const s = GAME_CONFIG.sprites.hero;
    const fpr = s.framesPerRow;
    const mk = (key, row) => {
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers('hero', {
          start: row*fpr, end: row*fpr + fpr - 1
        }),
        frameRate: 8,
        repeat: -1
      });
    };
    mk('walk-down',  s.rows.down);
    mk('walk-left',  s.rows.left);
    mk('walk-right', s.rows.right);
    mk('walk-up',    s.rows.up);
  }

  spawnMonster(){
    const t = MONSTER_TYPES.slime;
    const x = Phaser.Math.Between(200,GAME_CONFIG.worldWidth-200);
    const y = Phaser.Math.Between(200,GAME_CONFIG.worldHeight-200);
    const m = this.add.circle(x,y,t.radius,t.color).setStrokeStyle(2,t.stroke);
    this.physics.add.existing(m);
    m.hp=t.hp; m.maxHp=t.hp; m.xpReward=t.xpReward; m.goldReward=t.goldReward;
    this.monsters.add(m); return m;
  }

  floatText(x,y,txt,color='#fff'){
    const t=this.add.text(x,y,txt,{fontSize:'18px',color,fontStyle:'bold'}).setOrigin(0.5);
    this.tweens.add({targets:t,y:y-40,alpha:0,duration:700,onComplete:()=>t.destroy()});
  }

  damageMonster(m,dmg,color='#ffeb3b'){
    m.hp-=dmg;
    this.floatText(m.x,m.y-20,dmg,color);
    this.tweens.add({targets:m,scaleX:1.3,scaleY:0.7,duration:80,yoyo:true});
    if(m.hp<=0) this.killMonster(m);
  }

  attack(){
    let hit=false;
    // efecto visual de ataque (arco frente al héroe)
    const off = {down:[0,40], up:[0,-40], left:[-40,0], right:[40,0]}[this.hero.lastDir];
    const slash = this.add.circle(this.hero.x+off[0], this.hero.y+off[1], 25, 0xffffff, 0.4);
    this.tweens.add({targets:slash, alpha:0, scale:1.5, duration:200, onComplete:()=>slash.destroy()});

    this.monsters.getChildren().forEach(m=>{
      if(Phaser.Math.Distance.Between(this.hero.x,this.hero.y,m.x,m.y)<70){
        hit=true; this.damageMonster(m,player.attack);
      }
    });
  }

  useSkill(id){
    const s=skills[id];
    if(!s.learned || !s.ready || player.mp<s.mpCost) return;
    player.mp-=s.mpCost; s.ready=false;
    startCooldown(id, s.cd);

    if(id==='skill1'){
      this.monsters.getChildren().forEach(m=>{
        if(Phaser.Math.Distance.Between(this.hero.x,this.hero.y,m.x,m.y)<90)
          this.damageMonster(m, player.attack*2.5, '#e91e63');
      });
      const fx=this.add.circle(this.hero.x,this.hero.y,20,0x9b59b6,0.6);
      this.tweens.add({targets:fx,radius:90,alpha:0,duration:400,onComplete:()=>fx.destroy()});
    }
    if(id==='skill2'){
      player.hp=Math.min(player.maxHp,player.hp+50);
      this.floatText(this.hero.x,this.hero.y-40,'+50 HP','#2ecc71');
      const fx=this.add.circle(this.hero.x,this.hero.y,15,0x2ecc71,0.5);
      this.tweens.add({targets:fx,radius:60,alpha:0,duration:600,onComplete:()=>fx.destroy()});
    }
    if(id==='skill3'){
      const fx=this.add.circle(this.hero.x,this.hero.y,10,0x3498db,0.5);
      this.tweens.add({targets:fx,radius:180,alpha:0,duration:500,onComplete:()=>fx.destroy()});
      this.monsters.getChildren().forEach(m=>{
        if(Phaser.Math.Distance.Between(this.hero.x,this.hero.y,m.x,m.y)<180)
          this.damageMonster(m, player.attack*1.5, '#3498db');
      });
    }
    updateHUD();
  }

  killMonster(m){
    player.xp+=m.xpReward; player.gold+=m.goldReward;
    this.floatText(m.x,m.y-40,'+'+m.xpReward+' XP','#4fc3f7');
    const loot=this.add.circle(m.x,m.y,6,0xffd700).setStrokeStyle(1,0x8a6d00);
    this.tweens.add({targets:loot,y:m.y-15,duration:300,yoyo:true,repeat:2,
      onComplete:()=>this.tweens.add({targets:loot,alpha:0,duration:400,onComplete:()=>loot.destroy()})});
    m.destroy(); this.checkLevelUp(); updateHUD();
    this.time.delayedCall(GAME_CONFIG.respawnDelay,()=>this.spawnMonster());
  }

  checkLevelUp(){
    while(player.xp>=player.xpNext){
      levelUp();
      this.floatText(this.hero.x,this.hero.y-50,'¡NIVEL '+player.level+'!','#00e676');
      this.checkNewSkills();
    }
  }

  checkNewSkills(){
    for(const id in skills){
      const s=skills[id];
      if(!s.learned && player.level>=s.unlockLvl){
        s.learned=true;
        document.getElementById(id).style.display='block';
        this.floatText(this.hero.x,this.hero.y-80,'¡Nueva habilidad: '+s.name+'!','#ffd700');
      }
    }
  }

  update(){
    let vx=moveVec.x, vy=moveVec.y;
    if(this.cursors.left.isDown||this.keys.A.isDown) vx=-1;
    if(this.cursors.right.isDown||this.keys.D.isDown) vx=1;
    if(this.cursors.up.isDown||this.keys.W.isDown) vy=-1;
    if(this.cursors.down.isDown||this.keys.S.isDown) vy=1;
    const len=Math.hypot(vx,vy)||1;
    this.hero.body.setVelocity(vx/len*player.speed, vy/len*player.speed);

    // ====== ANIMACIÓN SEGÚN MOVIMIENTO ======
    if(vx!==0 || vy!==0){
      // decidir dirección dominante
      if(Math.abs(vx) > Math.abs(vy)){
        this.hero.lastDir = vx<0 ? 'left' : 'right';
      } else {
        this.hero.lastDir = vy<0 ? 'up' : 'down';
      }
      this.hero.anims.play('walk-'+this.hero.lastDir, true);
    } else {
      this.hero.anims.stop();
    }

    if(wantAttack||Phaser.Input.Keyboard.JustDown(this.keys.SPACE)){ this.attack(); wantAttack=false; }
    if(wantSkill){ this.useSkill(wantSkill); wantSkill=null; }
    if(Phaser.Input.Keyboard.JustDown(this.keys.ONE)) this.useSkill('skill1');
    if(Phaser.Input.Keyboard.JustDown(this.keys.TWO)) this.useSkill('skill2');
    if(Phaser.Input.Keyboard.JustDown(this.keys.THREE)) this.useSkill('skill3');
  }
}