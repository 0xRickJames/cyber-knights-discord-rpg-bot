import { EmbedBuilder } from 'discord.js'

import { Base } from './Base'
import { Player } from './Player'

import { inlineCode, SILVER } from '../modules/utils'

// Abstract weapon class to be used to increase Fighter's attack attribute. To
// add your own weapon, extend Weapon class and change the attributes to your
// liking.

export abstract class Weapon extends Base {
  // References Player who owns this weapon
  owner?: Player
  // Weapon image
  imageUrl?: string

  // Attack attribute to be added when player equip this weapon
  attack = 5
  level = 0
  price = 5 * (this.attack * 100)
  levelReq = 0

  // EmbedBuilder that represents Weapon
  show() {
    const embed = new EmbedBuilder()
      .setTitle('Weapon')
      .setColor(SILVER)
      .addFields(
        { name: 'Name', value: this.name, inline: true },
        { name: 'Level', value: inlineCode(this.level), inline: true },
        { name: 'Attack', value: inlineCode(this.attack), inline: true }
      )

    if (this.imageUrl) embed.setThumbnail(this.imageUrl)

    return embed
  }
}

// Tier 1 weapons

export class IronSword extends Weapon {
  name = 'Iron Sword'
  id = 'iron_sword'
  level = 1
  attack = 0.05
  levelReq = 6
}
export class IronMace extends Weapon {
  name = 'Iron Mace'
  id = 'iron_mace'
  level = 1
  attack = 0.08
  levelReq = 6
}
export class IronGreataxe extends Weapon {
  name = 'Iron Greataxe'
  id = 'iron_greataxe'
  level = 1
  attack = 0.12
  levelReq = 6
}

// Tier 2 weapons

export class BronzeSword extends Weapon {
  name = 'Bronze Sword'
  id = 'bronze_sword'
  level = 2
  attack = 0.1
  levelReq = 11
}
export class BronzeMace extends Weapon {
  name = 'Bronze Mace'
  id = 'bronze_mace'
  level = 2
  attack = 0.16
  levelReq = 11
}
export class BronzeGreataxe extends Weapon {
  name = 'Bronze Greataxe'
  id = 'bronze_greataxe'
  level = 2
  attack = 0.24
  levelReq = 11
}

// Tier 3 weapons

export class Gold_Sword extends Weapon {
  name = 'Gold Sword'
  id = 'gold_sword'
  level = 3
  attack = 0.15
  levelReq = 16
}
export class Gold_Mace extends Weapon {
  name = 'Gold Mace'
  id = 'gold_mace'
  level = 3
  attack = 0.24
  levelReq = 16
}
export class Gold_Greataxe extends Weapon {
  name = 'Gold Greataxe'
  id = 'gold_greataxe'
  level = 3
  attack = 0.36
  levelReq = 16
}

// Tier 4 weapons

export class MithrilSword extends Weapon {
  name = 'Mithril Sword'
  id = 'mithril_sword'
  level = 4
  attack = 0.2
  levelReq = 21
}
export class MithrilMace extends Weapon {
  name = 'Mithril Mace'
  id = 'mithril_mace'
  level = 4
  attack = 0.32
  levelReq = 21
}
export class MithrilGreataxe extends Weapon {
  name = 'Mithril Greataxe'
  id = 'mithril_greataxe'
  level = 4
  attack = 0.48
  levelReq = 21
}
