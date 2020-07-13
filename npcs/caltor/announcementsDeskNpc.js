import GeneralNpc from "../generalNpc.js";
import { announcementsDialog, announcementsEmptyDialog } from "../../data/dialogs/caltor/announcementsDialog.js";
import { playerInstance } from "../../characters/adventurers/player.js";
export class AnnouncementsDeskNpc extends GeneralNpc {
    constructor({ scene, x, y, spriteParams }) {
        super({
            scene,
            name: 'Announcements',
            triggerX: x,
            triggerY: y,
            spriteParams: spriteParams,
            initDialog: announcementsDialog,
            interactionCallback: (param) => {
                if (param === 'questAccepted') {
                    this.setDialog(announcementsEmptyDialog);
                    scene.player.addQuest('boarsAtTheFields');
                    if (playerInstance.defeatedEnemies.includes('caltor/Boars 1') && playerInstance.defeatedEnemies.includes('caltor/Boars 2')) {
                        playerInstance.updateQuest('boarsAtTheFields', 'boarsKilled');
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=announcementsDeskNpc.js.map