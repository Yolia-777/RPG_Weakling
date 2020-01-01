import Player from "../entities/player";

export class ShopScene extends Phaser.Scene {
    private player: Player;
    private trader: any;
    private opts : any;
    constructor() {
        super({key: 'Shop'});
    }
    public init(player: Player, trader) {
        this.player = player;
        this.trader = trader;
    }

    public preload() {
        console.log('preloading')
        this.opts = {
            backgroundColor: 0xf0d191,
            backgroundAlpha: 1,
            windowX: 16,
            windowY: 16,
            windowWidth: 32 * 24,
            windowHeight: 32 * 19,

            borderThickness: 3,
            borderColor: 0x907748,
            borderAlpha: 1,
            
            baseDepth: 0,

            closeButtonColor: 'darkgoldenrod',
            closeButtonHoverColor: 'red',

            textColor: 'white',
            letterAppearanceDelay: 10
        }
    }

    public create() {
        console.log('creating');

        this._drawBackground();
        this._drawCloseButton();
    }
    
    private _drawBackground() {
        this.add.graphics()
            .fillStyle(this.opts.backgroundColor, this.opts.backgroundAlpha)
            .fillRect(this.opts.windowX, this.opts.windowY, this.opts.windowWidth, this.opts.windowHeight)
            .lineStyle(this.opts.borderThickness, this.opts.borderColor)
            .strokeRect(this.opts.windowX, this.opts.windowY, this.opts.windowWidth, this.opts.windowHeight)
            .setScrollFactor(0).setInteractive().setDepth(this.opts.baseDepth);
    }
    
    private _drawCloseButton(){
        const closeButtonX = this.opts.windowX + this.opts.windowWidth - 20;
        const closeButtonY = this.opts.windowY;
        const graphics = this.add.graphics()
            .lineStyle(this.opts.borderThickness, this.opts.borderColor, this.opts.borderAlpha)
            .strokeRect(closeButtonX, closeButtonY, 20, 20).setScrollFactor(0).setDepth(this.opts.baseDepth);

        const closeBtn = this.add.text(closeButtonX, closeButtonY, 'X', {
            font: 'bold 16px Arial',
            fill: this.opts.closeButtonColor,
            fixedWidth: 20,
            fixedHeight: 20,
            align: 'center'
        }).setScrollFactor(0).setDepth(this.opts.baseDepth).setInteractive();

        closeBtn.on('pointerover', () => closeBtn.setColor(this.opts.closeButtonHoverColor));
        closeBtn.on('pointerout', () => closeBtn.setColor(this.opts.closeButtonColor));
        closeBtn.on('pointerdown', () => {
            this.scene.resume('WorldMap');
            this.scene.remove('Shop');
        });
    }

}