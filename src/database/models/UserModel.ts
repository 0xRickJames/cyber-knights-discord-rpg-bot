import { Document, model, Schema } from 'mongoose'

export interface Achievement {
  title: string
  description: string
}

export interface UserInt extends Document {
  id: string
  exp: number
  gold: number
  equippedArmors: string[]
  equippedWeapons: string[]
  equippedItems: string[]
  skill: string[]
  spell: string[]
  class: string
  battleWins: number
  raidWins: number
  achievements: Achievement[]
  walletAddress?: string
}

export const User = new Schema({
  id: String,
  exp: Number,
  gold: Number,
  equippedArmors: [String],
  equippedWeapons: [String],
  equippedItems: [String],
  skill: [String],
  spell: [String],
  class: String,
  battleWins: Number,
  raidWins: Number,
  achievements: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  walletAddress: { type: String, unique: true, sparse: true },
})

export default model<UserInt>('user', User)
