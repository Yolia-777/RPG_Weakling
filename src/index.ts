import * as Phaser from 'phaser';

import {
  DEBUG, GAME_H, GAME_W, GAME_ZOOM,
} from './config/constants';
import PreloadScene from './scenes/preload/preload';
import CaltorScene from './scenes/locations/caltor/caltor';
import HouseScene from './scenes/locations/caltor/house';
import VillageScene from './scenes/locations/village/village';
import TraderOverlayScene from './scenes/overlays/item-manupulators/traderOverlayScene';
import HargkakhsCaveScene from './scenes/locations/village/hargkakhsCave';
import CharacterPickerScene from './scenes/overlays/characterPicker';
import BattleScene from './scenes/battle/battle';
import DialogScene from './scenes/overlays/dialog';
import TavernScene from './scenes/locations/caltor/tavern';
import InventoryOverlayScene from './scenes/overlays/item-manupulators/inventoryOverlayScene';
import HermitsTowerScene from './scenes/locations/caltor/hermitsTower';
import MainMenuScene from './scenes/intro-and-main-menu/mainMenu';
import WeaklingsCaveScene from './scenes/locations/village/weaklingsCave';
import EldersCaveScene from './scenes/locations/village/eldersCave';
import IntroScene from './scenes/intro-and-main-menu/intro';
import DungeonScene from './scenes/locations/dungeon/dungeon';
import OptionsScene from './scenes/intro-and-main-menu/options';
import BetweenVillageAndDungeonScene from './scenes/locations/roads/betweenVillageAndDungeon';
import BetweenVillageAndCaltorScene from './scenes/locations/roads/betweenVillageAndCaltor';
import NahkhasCaveScene from './scenes/locations/village/nahkhasCave';
import QuestLogScene from './scenes/overlays/questLog';
import CryptScene from './scenes/locations/caltor/crypt';
import BackCaveScene from './scenes/locations/village/backCave';
import GreatPlainsScene from './scenes/locations/roads/greatPlains';
import BooksStoreScene from './scenes/locations/caltor/booksStore';
import AlchemyStandScene from './scenes/overlays/item-manupulators/alchemyStandOverlay';
import ContainerOverlayScene from './scenes/overlays/item-manupulators/containerOverlayScene';
import DungeonLevel1Scene from './scenes/locations/dungeon/dungeonLevel1';
import AchievementsScene from './scenes/overlays/achievements';
import AllItemsScene from './scenes/overlays/all-items';
import LevelUpScreenScene from './scenes/overlays/level-up-screen';
import HoneywoodScene from './scenes/locations/honeywood/honeywood';
// import { TestPreloadScene } from './scenes/not-used/perf-test';

export const LOCATION_SCENES = [BetweenVillageAndDungeonScene,
  BetweenVillageAndCaltorScene,
  DungeonScene,
  DungeonLevel1Scene,
  HoneywoodScene,
  CaltorScene, HouseScene, TavernScene, HermitsTowerScene, CryptScene, BooksStoreScene,
  VillageScene, HargkakhsCaveScene, NahkhasCaveScene, WeaklingsCaveScene, EldersCaveScene, BackCaveScene,
  GreatPlainsScene] as any[];

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Weakling!!',

  type: Phaser.AUTO,

  width: GAME_W,
  height: GAME_H,

  zoom: GAME_ZOOM,

  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG,
    },
  },

  render: {
    pixelArt: true,
  },

  parent: 'game',
  backgroundColor: '#000000',
  scene: [/* TestPreloadScene, */PreloadScene,
    MainMenuScene,
    OptionsScene,
    IntroScene,
    ...LOCATION_SCENES,
    CharacterPickerScene, TraderOverlayScene, BattleScene, DialogScene, InventoryOverlayScene,
    QuestLogScene, AchievementsScene, LevelUpScreenScene, AllItemsScene, AlchemyStandScene, ContainerOverlayScene,
  ],
};

export const game = new Phaser.Game(gameConfig);

document.getElementById('game')
  ?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  }, false);