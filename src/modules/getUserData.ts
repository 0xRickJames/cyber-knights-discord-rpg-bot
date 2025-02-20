import UserModel, { UserInt } from '../database/models/UserModel'

export const getUserData = async (userId: string): Promise<UserInt> => {
  const userData =
    (await UserModel.findOne({ id: userId })) ||
    (await UserModel.create({
      id: userId,
      exp: 0,
      gold: 0,
      equippedArmors: [],
      equippedWeapons: [],
      equippedClothes: [],
      skills: [],
      spells: [],
      class: 'commoner',
      battleWins: 0,
      raidWins: 0,
      achievements: [],
    }))
  return userData
}
