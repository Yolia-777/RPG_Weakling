import * as Phaser from 'phaser';

export class OptionsConfig {
  public isMusicOn: boolean;

  public isEffectsOn: boolean;

  private sound: Phaser.Sound.BaseSoundManager;

  constructor() {
    this.isMusicOn = true;
    this.isEffectsOn = true;
  }

  public toggleMusic() {
    this.isMusicOn = !this.isMusicOn;
    this.sound.mute = !this.isMusicOn;
    /* this.sound['sounds'].forEach(sound => {
          if (sound.soundType === 'music') {
              this.isMusicOn ? sound.resume() : sound.pause();
          }
      }); */
  }

  /*  public toggleEffects() {
    this.isEffectsOn = !this.isEffectsOn;
    this.sound.sounds.forEach((sound) => {
      if (sound.soundType === 'effect') {
        this.isEffectsOn ? sound.resume() : sound.pause();
      }
    });
  } */

  public setSoundManager(scene: Phaser.Scene) {
    this.sound = scene.sound;
  }
}

export const optionsInstance = new OptionsConfig();
