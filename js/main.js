// Arranque del juego
window.addEventListener('load', ()=>{
  initUI();
  updateHUD();

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#2e7d32',
    scale: { mode: Phaser.Scale.RESIZE, width:'100%', height:'100%' },
    physics: { default:'arcade', arcade:{ gravity:{y:0} } },
    scene: MainScene
  });
});