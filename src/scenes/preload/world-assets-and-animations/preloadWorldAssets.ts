import * as Phaser from 'phaser';
import { createWeaklingAnimations, preloadWeaklingAssets } from './preloadAndCreateWeaklingWorldAnimations';
import { createWorldCharactersAnimations, preloadWorldCharactersAssets } from './preloadAndCreateWorldCharacters';
import { createCreatureAnimations, preloadCreaturesAssets } from './preloadAndCreateCreaturesAnimations';
import { tilesetConfig } from '../../../config/constants';

export function preloadWorldAssets(scene: Phaser.Scene) {
  preloadDoorsAssets(scene);
  preloadWeaklingAssets(scene);
  preloadWorldCharactersAssets(scene);
  preloadCreaturesAssets(scene);

  scene.load.spritesheet('shadow-1', 'assets/images-extruded/characters/world-map/shadows/shadow-1.png', tilesetConfig);
  scene.load.spritesheet('fire', 'assets/images-extruded/animations/fire.png', tilesetConfig);
}

export function createWorldAnimations(scene: Phaser.Scene) {
  createDoorsAnimations(scene);
  createWeaklingAnimations(scene, 'jeremy-green');
  createWorldCharactersAnimations(scene);
  createCreatureAnimations(scene);
}

function preloadDoorsAssets(scene: Phaser.Scene) {
  scene.load.spritesheet('doors2', 'assets/images-extruded/tilesets/doors2.png', {
    frameWidth: 32,
    frameHeight: 96,
    margin: 1,
    spacing: 2,
  });
}

function createDoorsAnimations(scene: Phaser.Scene) {
  scene.anims.create({
    key: 'open_door',
    frames: scene.anims.generateFrameNames('doors2', { start: 6, end: 8 }),
    frameRate: 10,
    repeat: 0,
  });
}
