import {Player, playerInstance} from "../entities/player";
import Trader from "../entities/trader";
import {OverlayScene} from "./overlayScene.js";

export class ShopScene extends OverlayScene {
    private player: Player;
    private trader: Trader;
    private playerItemContainers: Phaser.GameObjects.Container;
    private traderItemContainers: Phaser.GameObjects.Container;

    constructor() {
        super({key: 'Shop'});
    }

    public init({player, trader}) {
        this.player = player;
        this.trader = trader;
    }

    public preload() {
        this.load.image('inventory-slot', 'assets/images/interface/inventory-slot.png');
    }

    public create() {
        this.prepareOverlay('WorldMap');
        this._drawItems();
        this.events.on('wake', () => {
            console.log('awaken!');
            this._drawItems();
        })
    }

    private _drawItems() {
        if (this.traderItemContainers && this.playerItemContainers) {
            this.playerItemContainers.destroy(true);
            this.traderItemContainers.destroy(true);
        }
        this.playerItemContainers = this.add.container(32, 32).setDepth(this.opts.baseDepth);
        this.traderItemContainers = this.add.container(32 + 360 + 16, 32).setDepth(this.opts.baseDepth);

        const playerItemContainersShape = new Phaser.Geom.Rectangle(0, 0, 360, this.player.inventory.length * 64);
        const traderItemContainersShape = new Phaser.Geom.Rectangle(0, 0, 360, this.trader.inventory.length * 64);
        this.playerItemContainers.setInteractive(playerItemContainersShape, Phaser.Geom.Rectangle.Contains);
        this.traderItemContainers.setInteractive(traderItemContainersShape, Phaser.Geom.Rectangle.Contains);

        this.player.inventory.forEach((item, index) => this._drawItemContainer(item, 0, 64 * index, true));
        this.trader.inventory.forEach((item, index) => this._drawItemContainer(item, 0, 64 * index, false));
        this.input.setTopOnly(false);
        const playerOverflow = Phaser.Math.Clamp((this.player.inventory.length - 9) * 64, 0, (this.player.inventory.length - 9) * 64);
        const traderOverflow = Phaser.Math.Clamp((this.trader.inventory.length - 9) * 64, 0, (this.trader.inventory.length - 9) * 64);

        this.playerItemContainers.on('wheel', function (pointer, deltaX, deltaY, deltaZ) {
            this.y -= deltaY * 5;
            this.y = Phaser.Math.Clamp(this.y, 32 - playerOverflow, 32);
        });
        this.traderItemContainers.on('wheel', function (pointer, deltaX, deltaY, deltaZ) {
            this.y -= deltaY * 5;
            this.y = Phaser.Math.Clamp(this.y, 32 - traderOverflow, 32);
        });
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
        let price = toSell ? item.sellPrice : item.buyPrice;
        let sellText = `${price.toString()} CP`;
        if (item.quantity > 1) sellText = `${(price * item.quantity).toString()} CP (${item.quantity} X ${price} CP)`;
        const priceText = this.add.text(64, 16, sellText, {
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
                let focusedContainer = this.playerItemContainers.getAll().find(itemContainer => itemContainer.getData('focused')) as Phaser.GameObjects.Container;
                if (!focusedContainer) focusedContainer = this.traderItemContainers.getAll().find(itemContainer => itemContainer.getData('focused')) as Phaser.GameObjects.Container;
                if (focusedContainer) {
                    focusedContainer.setData('focused', false);
                    (focusedContainer.getByName('containerFocusedGraphics') as Phaser.GameObjects.Container).setVisible(false);
                    focusedContainer.setDepth(this.opts.baseDepth);
                }
                container.setData('focused', true);
                containerFocusedGraphics.setVisible(true);
                container.setDepth(this.opts.baseDepth + 1);
            } else {
                console.log('selling item', item.displayName);
                container.setData('focused', false);
                containerFocusedGraphics.setVisible(false);
                container.setDepth(this.opts.baseDepth);
                this._transferItem(item, toSell);
                this._drawItems();
            }
        });
        toSell ? this.playerItemContainers.add(container) : this.traderItemContainers.add(container);
    }

    private _transferItem(item: Item, selling: boolean) {
        if (selling) {
            const tradersMoney = this.trader.inventory.find(item => item.itemId === 'copper-pieces');
            if (tradersMoney.quantity > item.sellPrice) {
                this.player.addItemToInventory('copper-pieces', item.sellPrice);
                this.player.removeItemFromInventory(item);
                this.trader.removeItemFromInventory(tradersMoney, item.sellPrice);
                this.trader.addItemToInventory(item.itemId);
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