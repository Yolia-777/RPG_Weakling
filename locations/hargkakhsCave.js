import { GeneralLocation } from "./generalLocation.js";
export class HargkakhsCaveScene extends GeneralLocation {
    constructor() {
        super({ key: 'HargkakhsCave' });
    }
    preload() {
        this.preparePlugins();
    }
    init() {
    }
    create() {
        this.prepareMap('hargkakhsCave', 304, 128);
        this.layers.find(layer => layer.layer.name === 'EmptyChest').setVisible(false);
        this.chest = this.createTrigger({
            objectName: 'Chest',
            offsetX: 304,
            offsetY: 128,
            callback: () => {
                const key = this.player.inventory.find(item => { var _a; return ((_a = item.specifics) === null || _a === void 0 ? void 0 : _a.opens) === 'hargkakhsChest'; });
                if (key) {
                    this.layers.find(layer => layer.layer.name === 'EmptyChest').setVisible(true);
                    this.player.addItemToInventory('fancy-belt');
                    this.player.addItemToInventory('work-gloves');
                    this.player.removeItemFromInventory(key);
                    this.chest.destroy(true);
                }
            }
        });
    }
    update() {
        this.updatePlayer();
    }
}
//# sourceMappingURL=hargkakhsCave.js.map