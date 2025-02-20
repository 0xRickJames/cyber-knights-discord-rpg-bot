import { EmbedBuilder } from 'discord.js'
import { oneLine } from 'common-tags'

import { Base } from './Base'
import { Fighter } from './Fighter'

import {
  formatPercent,
  getRandomArmorIndex,
  getRandomSkillIndex,
  getRandomWeaponIndex,
  GREEN,
  inlineCode,
  random,
  RED,
} from '../modules/utils'

/**
 * Skill is used in the battle which the player will experience boost or any
 * kind of advantage during battle.
 *
 * ```typescript
 * // example Skill which does double damage when intercept.
 * export class Rage extends Skill {
 *   name = "Rage";
 *   id = "rage";
 *   description = "Does double damage";
 *
 *   use(p1: Fighter, p2: Fighter) {
 *     p1.attack *= 2;
 *
 *     const embed = new EmbedBuilder()
 *       .setTitle("Skill interception")
 *       .setColor(GREEN)
 *       .setDescription(
 *         oneLine`${p1.name} uses **${this.name} Skill** and increases their
 *         strength to ${inlineCode(p1.attack)}!`
 *       )
 *
 *     if (this.imageUrl)
 *       embed.setThumbnail(this.imageUrl);
 *
 *     return embed;
 *   }
 *
 *   // this has to be overriden to prevent from skill's side effect leak to the
 *   // next round
 *   close(p1: Fighter, p2: Fighter) {
 *     p1.attack /= 2;
 *   }
 * }
 * ```
 * */
export abstract class Skill extends Base {
  abstract description: string // Skill description
  level = 0
  imageUrl?: string // Image to represent this skill
  price = 10 * this.level
  levelReq = 0
  /**
   * Mutates fighter's attributes during battle
   * @returns {EmbedBuilder} The embed will be shown during battle.
   * */
  abstract use(player: Fighter, opponent: Fighter): EmbedBuilder

  // Clean up or remove any attribute changes before next round
  abstract close(player: Fighter, opponent: Fighter): void

  // EmbedBuilder that represents Skill
  show() {
    const embed = new EmbedBuilder()
      .setTitle('Skill')
      .setColor(GREEN)
      .addFields(
        { name: 'Name', value: this.name },
        {
          name: 'Level',
          value: inlineCode(this.level),
          inline: true,
        },
        { name: 'Description', value: this.description }
      )

    if (this.imageUrl) {
      embed.setThumbnail(this.imageUrl)
    }

    return embed
  }
}

// Tier 1 skills

export class NoviceDisarm extends Skill {
  name = 'Novice Disarm'
  id = 'novice_disarm'
  level = 1
  levelReq = 6
  description =
    'Removes a weapon from opponent and decreases their attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01

    if (p2.equippedWeapons.length > 0) {
      var randomWeaponIndex = getRandomWeaponIndex(p2.equippedWeapons)
      var randomWeapon = p2.equippedWeapons[randomWeaponIndex]
      p2.attack -= p2.equippedWeapons[randomWeaponIndex].attack
      p2.equippedWeapons.splice(randomWeaponIndex, 1)
      p2.strength -= effectiveness
      p1.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and disarms ${p2.name} of their ${randomWeapon.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p1.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to disarm ${p2.name}, but ${p2.name} already has no weapons!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.strength += effectiveness
    p1.strength -= effectiveness
  }
}

export class NoviceSunder extends Skill {
  name = 'Novice Sunder'
  id = 'novice_sunder'
  level = 1
  levelReq = 6
  description =
    'Removes a piece of armor from opponent and decreases their defense, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    if (p2.equippedArmors.length > 0) {
      var randomArmorIndex = getRandomArmorIndex(p2.equippedArmors)
      var randomArmor = p2.equippedArmors[randomArmorIndex]
      p2.defense -= p2.equippedArmors[randomArmorIndex].defense
      p2.equippedArmors.splice(randomArmorIndex, 1)
      p2.endurance -= effectiveness
      p1.endurance += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and sunders ${p2.name}'s of ${randomArmor.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.endurance -= effectiveness
      p1.endurance += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to sunder ${p2.name} armor, but ${p2.name} already has none!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.endurance += effectiveness
    p1.endurance -= effectiveness
  }
}

export class NoviceDemoralize extends Skill {
  name = 'Novice Demoralize'
  id = 'novice_demoralize'
  level = 1
  levelReq = 6
  description =
    'Removes a skill from opponent and decreases their defense and attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    if (p2.skills.length > 0) {
      var randomSkillIndex = getRandomSkillIndex(p2.skills)
      var randomSkill = p2.skills[randomSkillIndex]
      p2.skills.splice(randomSkillIndex, 1)
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and ${p2.name} can no longer use ${randomSkill.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** but ${p2.name} is already absolutely demoralized!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    p2.strength += effectiveness
    p2.endurance += effectiveness
    p1.strength -= effectiveness
    p2.strength -= effectiveness
  }
}
/*
export class NoviceDemoralize extends Skill {
  name = 'Novice Demoralize'
  id = 'novice_demoralize'
  price = 75
  levelReq = 3
  description = "Removes an opponent's skill"
  imageUrl = 'https://nme-bot-images.vercel.app/images/skills/demoralize.png'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const no_skill = new NoSkill()

    if (p2.skill != null && p2.skill.id != 'no_skill') {
      const old_skill = p2.skill.name
      p2.skill = no_skill

      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(GREEN)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}**! Now ${p2.name} cannot use ${old_skill}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else if (p2.skill && p2.skill.id == 'no_skill') {
      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}**, but ${p2.name} is already Demoralized! `
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}**, but ${p2.name} has no skill! `
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close() {
    //pass
  }
}
  */
// Tier 2 skills

export class ExpertDisarm extends Skill {
  name = 'Expert Disarm'
  id = 'expert_disarm'
  level = 2
  levelReq = 11
  description =
    'Removes a weapon from opponent and decreases their attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    if (p2.equippedWeapons.length > 0) {
      var randomWeaponIndex = getRandomWeaponIndex(p2.equippedWeapons)
      var randomWeapon = p2.equippedWeapons[randomWeaponIndex]
      p2.attack -= p2.equippedWeapons[randomWeaponIndex].attack
      p2.equippedWeapons.splice(randomWeaponIndex, 1)
      p2.strength -= effectiveness
      p1.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and disarms ${p2.name} of their ${randomWeapon.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p1.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to disarm ${p2.name}, but ${p2.name} already has no weapons!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.strength += effectiveness
    p1.strength -= effectiveness
  }
}

export class ExpertSunder extends Skill {
  name = 'Expert Sunder'
  id = 'expert_sunder'
  level = 2
  levelReq = 11
  description =
    'Removes a piece of armor from opponent and decreases their defense, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    if (p2.equippedArmors.length > 0) {
      var randomArmorIndex = getRandomArmorIndex(p2.equippedArmors)
      var randomArmor = p2.equippedArmors[randomArmorIndex]
      p2.defense -= p2.equippedArmors[randomArmorIndex].defense
      p2.equippedArmors.splice(randomArmorIndex, 1)
      p2.endurance -= effectiveness
      p1.endurance += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and sunders ${p2.name}'s of ${randomArmor.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.endurance -= effectiveness
      p1.endurance += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to sunder ${p2.name} armor, but ${p2.name} already has none!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    4
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.endurance += effectiveness
    p1.endurance -= effectiveness
  }
}

export class ExpertDemoralize extends Skill {
  name = 'Expert Demoralize'
  id = 'expert_demoralize'
  level = 2
  levelReq = 11
  description =
    'Removes a skill from opponent and decreases their defense and attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    if (p2.skills.length > 0) {
      var randomSkillIndex = getRandomSkillIndex(p2.skills)
      var randomSkill = p2.skills[randomSkillIndex]
      p2.skills.splice(randomSkillIndex, 1)
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and ${p2.name} can no longer use ${randomSkill.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** but ${p2.name} is already absolutely demoralized!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    p2.strength += effectiveness
    p2.endurance += effectiveness
    p1.strength -= effectiveness
    p2.strength -= effectiveness
  }
}
// Tier 3 skills

export class MasterDisarm extends Skill {
  name = 'Master Disarm'
  id = 'master_disarm'
  level = 3
  levelReq = 16
  description =
    'Removes a weapon from opponent and decreases their attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    if (p2.equippedWeapons.length > 0) {
      var randomWeaponIndex = getRandomWeaponIndex(p2.equippedWeapons)
      var randomWeapon = p2.equippedWeapons[randomWeaponIndex]
      p2.attack -= p2.equippedWeapons[randomWeaponIndex].attack
      p2.equippedWeapons.splice(randomWeaponIndex, 1)
      p2.strength -= effectiveness
      p1.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and disarms ${p2.name} of their ${randomWeapon.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p1.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to disarm ${p2.name}, but ${p2.name} already has no weapons!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.strength += effectiveness
    p1.strength -= effectiveness
  }
}

export class MasterSunder extends Skill {
  name = 'Master Sunder'
  id = 'master_sunder'
  level = 3
  levelReq = 16
  description =
    'Removes a piece of armor from opponent and decreases their defense, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    if (p2.equippedArmors.length > 0) {
      var randomArmorIndex = getRandomArmorIndex(p2.equippedArmors)
      var randomArmor = p2.equippedArmors[randomArmorIndex]
      p2.defense -= p2.equippedArmors[randomArmorIndex].defense
      p2.equippedArmors.splice(randomArmorIndex, 1)
      p2.endurance -= effectiveness
      p1.endurance += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and sunders ${p2.name}'s of ${randomArmor.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.endurance -= effectiveness
      p1.endurance += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to sunder ${p2.name} armor, but ${p2.name} already has none!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.endurance += effectiveness
    p1.endurance -= effectiveness
  }
}

export class MasterDemoralize extends Skill {
  name = 'Master Demoralize'
  id = 'master_demoralize'
  level = 3
  levelReq = 16
  description =
    'Removes a skill from opponent and decreases their defense and attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    if (p2.skills.length > 0) {
      var randomSkillIndex = getRandomSkillIndex(p2.skills)
      var randomSkill = p2.skills[randomSkillIndex]
      p2.skills.splice(randomSkillIndex, 1)
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and ${p2.name} can no longer use ${randomSkill.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** but ${p2.name} is already absolutely demoralized!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    p2.strength += effectiveness
    p2.endurance += effectiveness
    p1.strength -= effectiveness
    p2.strength -= effectiveness
  }
}

// Tier 4 skills

export class GodlyDisarm extends Skill {
  name = 'Godly Disarm'
  id = 'godly_disarm'
  level = 4
  levelReq = 21
  description =
    'Removes a weapon from opponent and decreases their attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    if (p2.equippedWeapons.length > 0) {
      var randomWeaponIndex = getRandomWeaponIndex(p2.equippedWeapons)
      var randomWeapon = p2.equippedWeapons[randomWeaponIndex]
      p2.attack -= p2.equippedWeapons[randomWeaponIndex].attack
      p2.equippedWeapons.splice(randomWeaponIndex, 1)
      p2.strength -= effectiveness
      p1.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and disarms ${p2.name} of their ${randomWeapon.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p1.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Disarm Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to disarm ${p2.name}, but ${p2.name} already has no weapons!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.strength += effectiveness
    p1.strength -= effectiveness
  }
}

export class GodlySunder extends Skill {
  name = 'Godly Sunder'
  id = 'godly_sunder'
  level = 4
  levelReq = 21
  description =
    'Removes a piece of armor from opponent and decreases their defense, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    if (p2.equippedArmors.length > 0) {
      var randomArmorIndex = getRandomArmorIndex(p2.equippedArmors)
      var randomArmor = p2.equippedArmors[randomArmorIndex]
      p2.defense -= p2.equippedArmors[randomArmorIndex].defense
      p2.equippedArmors.splice(randomArmorIndex, 1)
      p2.endurance -= effectiveness
      p1.endurance += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and sunders ${p2.name}'s of ${randomArmor.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.endurance -= effectiveness
      p1.endurance += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Sunder Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and tries to sunder ${p2.name} armor, but ${p2.name} already has none!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = (this.level * 10 + p1.finesse) * 0.01
    p2.endurance += effectiveness
    p1.endurance -= effectiveness
  }
}

export class GodlyDemoralize extends Skill {
  name = 'Godly Demoralize'
  id = 'godly_demoralize'
  level = 4
  levelReq = 21
  description =
    'Removes a skill from opponent and decreases their defense and attack, while increasing yours'
  fighters: any
  playerDiedText: any
  onFighterDead: any
  msg: any

  use(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    if (p2.skills.length > 0) {
      var randomSkillIndex = getRandomSkillIndex(p2.skills)
      var randomSkill = p2.skills[randomSkillIndex]
      p2.skills.splice(randomSkillIndex, 1)
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness

      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** and ${p2.name} can no longer use ${randomSkill.name}!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    } else {
      p2.strength -= effectiveness
      p2.endurance -= effectiveness
      p1.strength += effectiveness
      p2.strength += effectiveness
      const embed = new EmbedBuilder()
        .setTitle('Demoralize Activated!')
        .setColor(RED)
        .setDescription(
          oneLine`${p1.name} uses **${this.name}** but ${p2.name} is already absolutely demoralized!`
        )

      if (this.imageUrl) embed.setThumbnail(this.imageUrl)

      return embed
    }
  }

  close(p1: Fighter, p2: Fighter) {
    const effectiveness = ((this.level * 10 + p1.finesse) / 2) * 0.01
    p2.strength += effectiveness
    p2.endurance += effectiveness
    p1.strength -= effectiveness
    p2.strength -= effectiveness
  }
}
export class NoSkill extends Skill {
  name = 'No Skill'
  id = 'no_skill'
  description = 'Lack of a skill'
  imageUrl = 'https://nme-bot-images.vercel.app/images/skills/no_skill.png'

  use(p1: Fighter, p2: Fighter) {
    const embed = new EmbedBuilder()
      .setTitle('Skill Fail!')
      .setColor(RED)
      .setDescription(oneLine`${p1.name} cannot use their skill!`)

    if (this.imageUrl) embed.setThumbnail(this.imageUrl)

    return embed
  }

  close(p1: Fighter, p2: Fighter) {
    //pass
  }
}
