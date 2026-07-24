const GAME_CONFIG = {
  worldWidth: 4000,
  worldHeight: 4000,
  tileSize: 64,
  monsterCount: 12,
  respawnDelay: 2000,

  // Configuración de sprites (AJUSTA cuando metas tus PNG reales)
  sprites: {
    hero: {
      // Cuando tengas tu PNG, pon aquí la ruta:
      // path: 'assets/sprites/characters/novato_hombre.png',
      path: null,          // null = usa sprite de prueba dibujado por código
      frameWidth: 64,      // ancho de cada frame
      frameHeight: 64,     // alto de cada frame
      framesPerRow: 4,     // cuántos frames por dirección
      // Orden de filas en el spritesheet:
      rows: { down:0, left:1, right:2, up:3 }
    },
    // DEMO: poses estáticas (una imagen por dirección, sin frames de caminar)
    heroDemo: {
      down:  'assets/sprites/characters/demo/hero_down.png',
      left:  'assets/sprites/characters/demo/hero_left.png',
      right: 'assets/sprites/characters/demo/hero_right.png',
      up:    'assets/sprites/characters/demo/hero_up.png'
    },
    monsterDemo: {
      slime:  'assets/sprites/monsters/demo/slime.png',
      goblin: 'assets/sprites/monsters/demo/goblin.png'
    }
  }
};