import bcrypt from 'bcrypt'
import { User } from '../testData/user.testData'
import config from '../../utils/config'

const hashPasswords = async (users: readonly User[]) => {
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(
        user.password,
        config.get('salt')
      )
      return {
        email: user.email,
        passwordHash: hashedPassword,
      }
    })
  )
  return hashedUsers
}

export default hashPasswords
