import { Command } from '../interfaces/Command'

import { info } from './info'
import { profile } from './profile'
import { battle } from './battle'

export const CommandList: Command[] = [info, profile, battle]
