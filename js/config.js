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
    }
  }
};