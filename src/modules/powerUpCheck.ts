import { User, GuildMember } from 'discord.js'
import { get } from 'http'

import { UserInt } from '../database/models/UserModel'

import { getUserData } from './getUserData'

import { getLevelFromExp } from './utils'

import { Fighter } from '../classes/Fighter'
import { Player } from '../classes/Player'
import * as armors from '../classes/Armor'
import * as weapons from '../classes/Weapon'
import * as skills from '../classes/Skill'
import * as spells from '../classes/Spell'
//import * as items from "../classes/Item";

export async function powerUpCheck(player: GuildMember, userint: string) {
  const user = await getUserData(userint)
  let fighter: Fighter = new Player(player, user)

  await skillsSpellsArmsCheck(fighter, user)
  fighter.exp = user.exp
  fighter.gold = user.gold
  fighter.battleWins = user.battleWins
  fighter.raidWins = user.raidWins
  return fighter
}

export async function skillsSpellsArmsCheck(fighter: Fighter, user: UserInt) {
  //  Armor Check

  if (user.equippedArmors.includes('dragonscale_cuirass')) {
    const dragonscale_cuirass = new armors.DragonscaleCuirass()
    fighter.equipArmor(dragonscale_cuirass)
  } else if (user.equippedArmors.includes('steel_cuirass')) {
    const steel_cuirass = new armors.SteelCuirass()
    fighter.equipArmor(steel_cuirass)
  } else if (user.equippedArmors.includes('leather_cuirass')) {
    const leather_cuirass = new armors.LeatherCuirass()
    fighter.equipArmor(leather_cuirass)
  }
  if (user.equippedArmors.includes('dragonscale_pauldrons')) {
    const dragonscale_pauldrons = new armors.DragonscalePauldrons()
    fighter.equipArmor(dragonscale_pauldrons)
  } else if (user.equippedArmors.includes('steel_pauldrons')) {
    const steel_pauldrons = new armors.SteelPauldrons()
    fighter.equipArmor(steel_pauldrons)
  } else if (user.equippedArmors.includes('leather_pauldrons')) {
    const leather_pauldrons = new armors.LeatherPauldrons()
    fighter.equipArmor(leather_pauldrons)
  }
  if (user.equippedArmors.includes('dragonscale_greaves')) {
    const dragonscale_greaves = new armors.DragonscaleGreaves()
    fighter.equipArmor(dragonscale_greaves)
  } else if (user.equippedArmors.includes('steel_greaves')) {
    const steel_greaves = new armors.SteelGreaves()
    fighter.equipArmor(steel_greaves)
  } else if (user.equippedArmors.includes('leather_greaves')) {
    const leather_greaves = new armors.LeatherGreaves()
    fighter.equipArmor(leather_greaves)
  }

  // Weapons check

  if (user.equippedWeapons.includes('mithril_sword')) {
    const mithril_sword = new weapons.MithrilSword()
    fighter.equipWeapon(mithril_sword)
  } else if (user.equippedWeapons.includes('bronze_sword')) {
    const bronze_sword = new weapons.BronzeSword()
    fighter.equipWeapon(bronze_sword)
  } else if (user.equippedWeapons.includes('iron_sword')) {
    const iron_sword = new weapons.IronSword()
    fighter.equipWeapon(iron_sword)
  }
  if (user.equippedWeapons.includes('mithril_mace')) {
    const mithril_mace = new weapons.MithrilMace()
    fighter.equipWeapon(mithril_mace)
  } else if (user.equippedWeapons.includes('bronze_mace')) {
    const bronze_mace = new weapons.BronzeMace()
    fighter.equipWeapon(bronze_mace)
  } else if (user.equippedWeapons.includes('iron_mace')) {
    const iron_mace = new weapons.IronMace()
    fighter.equipWeapon(iron_mace)
  }
  if (user.equippedWeapons.includes('mithril_greataxe')) {
    const mithril_greataxe = new weapons.MithrilGreataxe()
    fighter.equipWeapon(mithril_greataxe)
  } else if (user.equippedWeapons.includes('bronze_greataxe')) {
    const bronze_greataxe = new weapons.BronzeGreataxe()
    fighter.equipWeapon(bronze_greataxe)
  } else if (user.equippedWeapons.includes('iron_greataxe')) {
    const iron_greataxe = new weapons.IronGreataxe()
    fighter.equipWeapon(iron_greataxe)
  }

  // Skills Check

  if (user.skills.includes('master_disarm')) {
    const master_disarm = new skills.MasterDisarm()
    fighter.addSkill(master_disarm)
  } else if (user.skills.includes('expert_disarm')) {
    const expert_disarm = new skills.ExpertDisarm()
    fighter.addSkill(expert_disarm)
  } else if (user.skills.includes('novice_disarm')) {
    const novice_disarm = new skills.NoviceDisarm()
    fighter.addSkill(novice_disarm)
  }
  if (user.skills.includes('master_sunder')) {
    const master_sunder = new skills.MasterSunder()
    fighter.addSkill(master_sunder)
  } else if (user.skills.includes('expert_sunder')) {
    const expert_sunder = new skills.ExpertSunder()
    fighter.addSkill(expert_sunder)
  } else if (user.skills.includes('novice_sunder')) {
    const novice_sunder = new skills.NoviceSunder()
    fighter.addSkill(novice_sunder)
  }
  if (user.skills.includes('master_demoralize')) {
    const master_demoralize = new skills.MasterDemoralize()
    fighter.addSkill(master_demoralize)
  } else if (user.skills.includes('expert_demoralize')) {
    const expert_demoralize = new skills.ExpertDemoralize()
    fighter.addSkill(expert_demoralize)
  } else if (user.skills.includes('novice_demoralize')) {
    const novice_demoralize = new skills.NoviceDemoralize()
    fighter.addSkill(novice_demoralize)
  }

  // Spell check

  if (user.spells.includes('supreme_fireball')) {
    const supreme_fireball = new spells.SupremeFireball()
    fighter.addSpell(supreme_fireball)
  } else if (user.spells.includes('greater_fireball')) {
    const greater_fireball = new spells.GreaterFireball()
    fighter.addSpell(greater_fireball)
  } else if (user.spells.includes('lesser_fireball')) {
    const lesser_fireball = new spells.LesserFireball()
    fighter.addSpell(lesser_fireball)
  }
  if (user.spells.includes('supreme_mending')) {
    const supreme_mending = new spells.SupremeMending()
    fighter.addSpell(supreme_mending)
  } else if (user.spells.includes('greater_mending')) {
    const greater_mending = new spells.GreaterMending()
    fighter.addSpell(greater_mending)
  } else if (user.spells.includes('lesser_mending')) {
    const lesser_mending = new spells.LesserMending()
    fighter.addSpell(lesser_mending)
  }
  if (user.spells.includes('supreme_drain')) {
    const supreme_drain = new spells.SupremeDrain()
    fighter.addSpell(supreme_drain)
  } else if (user.spells.includes('greater_drain')) {
    const greater_drain = new spells.GreaterDrain()
    fighter.addSpell(greater_drain)
  } else if (user.spells.includes('lesser_drain')) {
    const lesser_drain = new spells.LesserDrain()
    fighter.addSpell(lesser_drain)
  }

  // Item Check
  /*
  if (user.equippedItems.includes("holy_water")) {
    const holy_water = new items.HolyWater();
    fighter.equipItem(holy_water);
  }
  if (user.equippedItems.includes("life_totem")) {
    const life_totem = new items.LifeTotem();
    fighter.equipItem(life_totem);
  }
  if (user.equippedItems.includes("regen_ring")) {
    const regen_ring = new items.RegenRing();
    fighter.equipItem(regen_ring);
  }
  if (user.equippedItems.includes("poison_vial")) {
    const poison_vial = new items.PoisonVial();
    fighter.equipItem(poison_vial);
  }


    
  */
}
