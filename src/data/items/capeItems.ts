import { backpackSlotNames, containerSlotNames } from './itemSlots';
import { ItemData } from '../../types/my-types';

const capeItems: { [key: string]: ItemData } = {
  'invisibility-cape': {
    itemId: 'invisibility-cape',
    displayName: 'Invisibility cloak',
    description: 'Once per battle allows you to become invisible for your enemies',
    possibleSlots: ['cape', ...backpackSlotNames, ...containerSlotNames],
    sprite: { texture: 'icons', frame: 'icons/clothes/capes/purple-cape' },
    stackable: false,
    modified: false,
    specifics: {
      skills: ['invisibility'],
      additionalCharacteristics: [
        { magicResistance: 2 },
      ],
      size: ['xs', 's', 'm', 'l', 'xl', 'xxxl'],
    },
    sellPrice: 30,
    buyPrice: 60,
  },
};

export default capeItems;
