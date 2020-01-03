import Player from "../entities/player";
import Trader from "../entities/trader";

export class ShopScene extends Phaser.Scene {
    private player: Player;
    private trader: Trader;
    private opts: any;
    private itemContainers: any[];

    constructor() {
        super({key: 'Shop'});
    }

    public init({player, trader}) {
        this.player = player;
        this.trader = trader;
    }

    public preload() {
        console.log('preloading');
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
        };
        this.load.image('inventory-slot', 'assets/images/interface/inventory-slot.png');
    }

    public create() {
        console.log('creating');

        this.itemContainers = [];

        this._drawBackground();
        this._drawCloseButton();
        this._drawItems();
        this.events.on('wake', () => {
            console.log('awaken!')
            this._drawItems();
        })
    }

    private _drawBackground() {
        this.add.graphics()
            .fillStyle(this.opts.backgroundColor, this.opts.backgroundAlpha)
            .fillRect(this.opts.windowX, this.opts.windowY, this.opts.windowWidth, this.opts.windowHeight)
            .lineStyle(this.opts.borderThickness, this.opts.borderColor)
            .strokeRect(this.opts.windowX, this.opts.windowY, this.opts.windowWidth, this.opts.windowHeight)
            .setScrollFactor(0).setInteractive().setDepth(this.opts.baseDepth);
    }

    private _drawCloseButton() {
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
            this.scene.sleep('Shop');
        });
    }

    private _drawItems() {
        this.itemContainers.forEach(container => container.destroy(true, true));
        this.player.inventory.forEach((item, index) => this._drawItemContainer(item, 32, 32 + 64 * index, true));
        this.trader.inventory.forEach((item, index) => this._drawItemContainer(item, 32+360+16, 32 + 64 * index, false));
    }

    private _drawItemContainer(item: Item, x: number, y: number, toSell: boolean) {

        const containerShape = new Phaser.Geom.Rectangle(0, 0, 360, 64);
        const container = this.add.container(x, y).setInteractive(containerShape, Phaser.Geom.Rectangle.Contains);


        const slotImage = this.add.image(0, 0, 'inventory-slot').setDisplaySize(64, 64).setOrigin(0, 0);
        const itemImage = this.add.image(0, 0, item.sprite.key, item.sprite.frame).setDisplaySize(64, 64).setOrigin(0, 0);
        container.add([slotImage, itemImage]);
        if (item.quantity > 1) {
            const quantityText = this.add.text(64, 64, item.quantity.toString(), {
                color: '#000000',
                backgroundColor: '#f0d191',
                padding: {
                    left: 2
                }
            }).setOrigin(1, 1);
            container.add(quantityText);
        }
        const itemNameText = this.add.text(64, 0, item.displayName, {
            color: 'black',
            padding: {
                left: 2
            }
        });
        let price = toSell ? item.sellPrice: item.buyPrice;
        let sellText = `${price.toString()} CP`;
        if (item.quantity > 1) sellText = `${(price * item.quantity).toString()} CP (${item.quantity} X ${price} CP)`;
        const priceText = this.add.text(64,16, sellText, {
            color: 'black',
            padding: {
                left: 2
            }
        });
        container.add([itemNameText, priceText]);
        const containerFocusedGraphics = this.add.graphics()
            .lineStyle(this.opts.borderThickness, this.opts.borderColor, this.opts.borderAlpha)
            .strokeRectShape(containerShape).setVisible(false).setName('containerFocusedGraphics');
        container.add(containerFocusedGraphics);
        container.setData('focused', false);
        container.on('pointerdown', () => {
            if (!container.getData('focused')) {
                console.log('showing item info', item.displayName);
                const focusedContainer = this.itemContainers.find(itemContainer => itemContainer.getData('focused'));
                if (focusedContainer) {
                    focusedContainer.setData('focused', false);
                    focusedContainer.getByName('containerFocusedGraphics').setVisible(false);
                    focusedContainer.setDepth(this.opts.baseDepth);
                }
                container.setData('focused', true);
                containerFocusedGraphics.setVisible(true);
                container.setDepth(this.opts.baseDepth+1);
            } else {
                console.log('selling item', item.displayName);
                container.setData('focused', false);
                containerFocusedGraphics.setVisible(false);
                container.setDepth(this.opts.baseDepth);
                this._transferItem(item, toSell);
                this._drawItems();
            }
        });
        this.itemContainers.push(container);
        /* this.add.text(x + 64, y + 16, item.description, {
             color: 'black',
             wordWrap: {
                 width: 400 - 32 - 16 - 16 - 64
             },
         });*/
    }

    private _transferItem(item: Item, selling: boolean) {
        if (selling) {
            const tradersMoney = this.trader.inventory.find(item => item.itemId === 'copper-pieces');
            if (tradersMoney.quantity > item.sellPrice) {
                this.player.addItemToInventory('copper-pieces', item.sellPrice);
                this.player.removeItemFromInventory(item);
                this.trader.removeItemFromInventory(tradersMoney, item.sellPrice);
                this.trader.addItemToInventory(item.itemId);
                // Remove gold from trader
            }
        } else {
            const playerMoney = this.player.inventory.find(item => item.itemId === 'copper-pieces');
            if (playerMoney.quantity > item.buyPrice) {
                this.player.addItemToInventory(item.itemId);
                this.player.removeItemFromInventory(playerMoney, item.buyPrice);
                this.trader.addItemToInventory('copper-pieces', item.buyPrice);
                this.trader.removeItemFromInventory(item);
            }
        }

    }
}