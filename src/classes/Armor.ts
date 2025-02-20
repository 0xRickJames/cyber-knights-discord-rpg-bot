import { EmbedBuilder } from 'discord.js'

import { Base } from './Base'
import { Player } from './Player'

import { formatPercent, inlineCode, SILVER } from '../modules/utils'

// Abstract armor class to be used to increase Fighter's armor attribute. To add
// your own armor, extend Armor class and change the attributes to your liking.

export abstract class Armor extends Base {
  // References Player who owns this armor
  owner?: Player
  // Armor image
  imageUrl?: string
  // Armor value, price, and level requirements
  defense = 5
  level = 0
  price = 5 * (this.defense * 100)
  levelReq = 0

  // EmbedBuilder that represents Armor
  show() {
    const defenseRate = formatPercent(this.defense)

    const embed = new EmbedBuilder()
      .setTitle('Armor')
      .setColor(SILVER)
      .addFields(
        { name: 'Name', value: this.name, inline: true },
        { name: 'Level', value: inlineCode(this.level), inline: true },
        { name: 'Defense', value: inlineCode(defenseRate), inline: true }
      )

    if (this.imageUrl) embed.setThumbnail(this.imageUrl)

    return embed
  }
}

// Tier 1 Armor

export class LeatherCuirass extends Armor {
  name = 'Leather Cuirass'
  id = 'leather_cuirass'
  level = 1
  defense = 0.12
  levelReq = 6
}
export class LeatherPauldrons extends Armor {
  name = 'Leather Pauldrons'
  id = 'leather_pauldrons'
  level = 1
  defense = 0.08
  levelReq = 6
}
export class LeatherGreaves extends Armor {
  name = 'Leather Greaves'
  id = 'leather_greaves'
  level = 1
  defense = 0.05
  levelReq = 6
}

// Tier 2 Armor

export class SteelCuirass extends Armor {
  name = 'Steel Cuirass'
  id = 'steel_cuirass'
  level = 2
  defense = 0.24
  levelReq = 11
}
export class SteelPauldrons extends Armor {
  name = 'Steel Pauldrons'
  id = 'steel_pauldrons'
  level = 2
  defense = 0.16
  levelReq = 11
}
export class SteelGreaves extends Armor {
  name = 'Steel Greaves'
  id = 'steel_greaves'
  level = 2
  defense = 0.1
  levelReq = 11
}

// Tier 3 Armor

export class DragonscaleCuirass extends Armor {
  name = 'Dragonscale Cuirass'
  id = 'dragonscale_cuirass'
  level = 3
  defense = 0.36
  levelReq = 16
}
export class DragonscalePauldrons extends Armor {
  name = 'Dragonscale Pauldrons'
  id = 'dragonscale_pauldrons'
  level = 3
  defense = 0.24
  levelReq = 16
}
export class DragonscaleGreaves extends Armor {
  name = 'Dragonscale Greaves'
  id = 'dragonscale_greaves'
  level = 3
  defense = 0.15
  levelReq = 16
}

// Tier 4 Armor

export class DiamondCuirass extends Armor {
  name = 'Diamond Cuirass'
  id = 'diamond_cuirass'
  level = 4
  defense = 0.48
  levelReq = 21
}
export class DiamondPauldrons extends Armor {
  name = 'Diamond Pauldrons'
  id = 'diamond_pauldrons'
  level = 4
  defense = 0.32
  levelReq = 21
}
export class DiamondGreaves extends Armor {
  name = 'Diamond Greaves'
  id = 'diamond_greaves'
  level = 4
  defense = 0.2
  levelReq = 21
}
