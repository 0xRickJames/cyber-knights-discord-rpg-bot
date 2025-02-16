import { Document, model, Schema } from 'mongoose'

export interface UserInt extends Document {
  id: string
  exp: number
  gold: number
  equippedArmors: String[]
  equippedWeapons: String[]
  equippedItems: String[]
  equippedClothes: String[]
  skill: string
  spell: string
  battleWins: number
  raidWins: number
  walletAddress?: string
}

export const User = new Schema({
  id: String,
  exp: Number,
  gold: Number,
  equippedArmors: Array,
  equippedWeapons: Array,
  equippedItems: Array,
  equippedClothes: Array,
  skill: String,
  spell: String,
  battleWins: Number,
  raidWins: Number,
  walletAddress: { type: String, unique: true, sparse: true },
})

export default model<UserInt>('user', User)
