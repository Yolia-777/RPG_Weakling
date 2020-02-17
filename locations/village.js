import { elderFirstTimeDialog, elderSecondTimeDialog } from "../dialogs/village/elderGreetingDialog.js";
import { nahkhaAfterGoodsObtainedDialog, nahkhaAfterTheElderDialog, nahkhaBeforeTheElderDialog } from "../dialogs/village/nahkhaDialog.js";
import { hargkakhAfterGoodsObtainedDialog, hargkakhFirstDialog, hargkakhSecondTryDialog } from "../dialogs/village/hargkakhDialog.js";
import { elderInstance } from "../characters/adventurers/elder.js";
import Npc from "../entities/npc.js";
import { GeneralLocation } from "./generalLocation.js";
export class VillageScene extends GeneralLocation {
    constructor() {
        super({ key: 'Village' });
    }
    preload() {
        this.preparePlugins();
    }
    init() {
    }
    create() {
        this.prepareMap('village');
        const elder = new Npc({
            scene: this,
            mapObjectName: 'Elder',
            texture: 'stranger',
            frame: 1,
            initDialog: elderFirstTimeDialog,
            interactionCallback: (param) => {
                elder.setDialog(elderSecondTimeDialog, (param) => {
                    if (param === 'readyToGo') {
                        elder.image.destroy(true);
                        this.player.party.push(elderInstance);
                    }
                });
                nahkha.setDialog(nahkhaAfterTheElderDialog, (param) => {
                    if (param === 'basketsObtained') {
                        nahkha.setDialog(nahkhaAfterGoodsObtainedDialog);
                        this.player.addItemToInventory('basket', 10);
                    }
                });
            }
        });
        const nahkha = new Npc({
            scene: this,
            mapObjectName: 'Nahkha',
            texture: 'trader',
            frame: 1,
            initDialog: nahkhaBeforeTheElderDialog
        });
        const hargkakh = new Npc({
            scene: this,
            mapObjectName: 'Hargkakh',
            texture: 'stranger',
            frame: 1,
            initDialog: hargkakhFirstDialog,
            interactionCallback: (param) => {
                if (param === 'pickupFailure') {
                    this.player.addItemToInventory('copper-key').specifics.opens = 'hargkakhsChest';
                    hargkakh.setDialog(hargkakhSecondTryDialog, (param) => {
                        if (param === 'mineralsObtained') {
                            hargkakh.setDialog(hargkakhAfterGoodsObtainedDialog);
                            this.player.addItemToInventory('minerals', 10);
                        }
                    });
                }
                if (param === 'mineralsObtained') {
                    hargkakh.setDialog(hargkakhAfterGoodsObtainedDialog);
                    this.player.addItemToInventory('minerals', 10);
                }
            }
        });
    }
    update() {
        this.updatePlayer();
    }
}
//# sourceMappingURL=village.js.map