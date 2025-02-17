import { MersenneTwister19937, Random } from 'random-js'
//import { Armor } from "./Armor";
//import { Weapon } from "./Weapon";

export const BLUE = '#0000FF'
export const RED = '#FF0000'
export const GREEN = '#008000'
export const GOLD = '#ffd700'
export const BROWN = '#c66a10'
export const SILVER = '#c0c0c0'
export const GREEN_CIRLE = '🟢'
export const RED_CIRCLE = '🔴'

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export const random = new Random(MersenneTwister19937.autoSeed())

export function formatPercent(num: number) {
  return `${(num * 100).toFixed(1)}%`
}

export function inlineCode(str: string | number) {
  return `\`${str}\``
}

export function bold(str: string | number) {
  return `**${str}**`
}

export function isEven(num: number) {
  return num % 2 === 0
}
/*
export function getRandomWeaponIndex(arr: Weapon[]) {

  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  //const item = arr[randomIndex];

  return randomIndex;
}
export function getRandomArmorIndex(arr: Armor[]) {

  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  //const item = arr[randomIndex];

  return randomIndex;
}
*/
export function getLevelFromExp(exp: number): number {
  return Math.floor((-1 + Math.sqrt(1 + (8 * exp) / 100)) / 2) + 1
}
