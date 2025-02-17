import { User, GuildMember } from 'discord.js'
import { get } from 'http'

import { UserInt } from '../database/models/UserModel'

import { getUserData } from './getUserData'

import { getLevelFromExp } from './utils'

import { Fighter } from '../classes/Fighter'
import { Player } from '../classes/Player'
//import * as skills from "../classes/Skill";
//import * as weapons from "../classes/Weapon";
//import * as armors from "../classes/Armor";
//import * as spells from "../classes/Spell";
//import * as items from "../classes/Item";

export async function powerUpCheck(player: GuildMember, userint: string) {
  const user = await getUserData(userint)
  let fighter: Fighter = new Player(player, user)

  //await skillsSpellsArmsCheck(fighter, user);
  fighter.exp = user.exp
  fighter.gold = user.gold
  fighter.battleWins = user.battleWins
  fighter.raidWins = user.raidWins
  return fighter
}
/*
export async function skillsSpellsArmsCheck(fighter: Fighter, user: UserInt) {
  //  Armor Check

  if (user.equippedArmors.includes("steel_breastplate")) {
    const steel_breastplate = new armors.SteelBreastplate();
    fighter.equipArmor(steel_breastplate);
  } else if (user.equippedArmors.includes("leather_cuirass")) {
    const leather_cuirass = new armors.LeatherCuirass();
    fighter.equipArmor(leather_cuirass);
  }
  if (user.equippedArmors.includes("steel_helm")) {
    const steel_helm = new armors.SteelHelm();
    fighter.equipArmor(steel_helm);
  } else if (user.equippedArmors.includes("leather_helmet")) {
    const leather_helmet = new armors.LeatherHelmet();
    fighter.equipArmor(leather_helmet);
  }
  if (user.equippedArmors.includes("steel_greaves")) {
    const steel_greaves = new armors.SteelGreaves();
    fighter.equipArmor(steel_greaves);
  } else if (user.equippedArmors.includes("leather_boots")) {
    const leather_boots = new armors.LeatherBoots();
    fighter.equipArmor(leather_boots);
  }
  if (user.equippedArmors.includes("steel_gauntlets")) {
    const steel_gauntlets = new armors.SteelGauntlets();
    fighter.equipArmor(steel_gauntlets);
  } else if (user.equippedArmors.includes("leather_gloves")) {
    const leather_gloves = new armors.LeatherGloves();
    fighter.equipArmor(leather_gloves);
  }

  // Weapons check

  if (user.equippedWeapons.includes("heavy_crossbow")) {
    const heavy_crossbow = new weapons.HeavyCrossbow();
    fighter.equipWeapon(heavy_crossbow);
  } else if (user.equippedWeapons.includes("hand_crossbow")) {
    const hand_crossbow = new weapons.HandCrossbow();
    fighter.equipWeapon(hand_crossbow);
  }
  if (user.equippedWeapons.includes("steel_greataxe")) {
    const steel_greataxe = new weapons.SteelGreataxe();
    fighter.equipWeapon(steel_greataxe);
  } else if (user.equippedWeapons.includes("steel_mace")) {
    const steel_mace = new weapons.SteelMace();
    fighter.equipWeapon(steel_mace);
  }
  if (user.equippedWeapons.includes("musket_rifle")) {
    const musket_rifle = new weapons.MusketRifle();
    fighter.equipWeapon(musket_rifle);
  } else if (user.equippedWeapons.includes("musket_pistol")) {
    const musket_pistol = new weapons.MusketPistol();
    fighter.equipWeapon(musket_pistol);
  }
  if (user.equippedWeapons.includes("steel_longsword")) {
    const steel_longsword = new weapons.SteelLongsword();
    fighter.equipWeapon(steel_longsword);
  } else if (user.equippedWeapons.includes("steel_dagger")) {
    const steel_dagger = new weapons.SteelDagger();
    fighter.equipWeapon(steel_dagger);
  }

  // Item Check

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

  // Spell check

  if (user.spell == "fireball") {
    const fireball = new spells.Fireball();
    fireball.setOwner(fighter);
  }
  if (user.spell == "heal") {
    const heal = new spells.Heal();
    heal.setOwner(fighter);
  }
  if (user.spell == "divine_intervention") {
    const divine_intervention = new spells.DivineIntervention();
    divine_intervention.setOwner(fighter);
  }
  if (user.spell == "feeblemind") {
    const feeblemind = new spells.Feeblemind();
    feeblemind.setOwner(fighter);
  }

  // Skill Check

  if (user.skill == "combat_tactics") {
    fighter.skill = new skills.CombatTactics();
  }
  if (user.skill == "stun_attack") {
    fighter.skill = new skills.StunAttack();
  }
  if (user.skill == "demoralize") {
    fighter.skill = new skills.Demoralize();
  }
  if (user.skill == "disarm") {
    fighter.skill = new skills.Disarm();
  }
}
  */
