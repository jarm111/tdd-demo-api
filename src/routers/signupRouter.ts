import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import config from '../utils/config'

const signupRouter = Router()
const passwordMinLength = config.get('passwordMinLength')

const validatePassword = (password: string) => {
  return password.length >= passwordMinLength
}

signupRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const passwordHash = await bcrypt.hash(password, config.get('salt'))

  try {
    if (!validatePassword(password)) {
      throw new Error(
        `Password too short, must be min ${passwordMinLength} characters`
      )
    }

    const user = new User({
      email,
      passwordHash: passwordHash,
    })

    const savedUser = await user.save()

    const payload = {
      id: savedUser._id,
      email: savedUser.email,
    }

    const token = jwt.sign(payload, config.get('secret'))

    res.status(201).json({
      token,
      email: savedUser.email,
    })
  } catch (e) {
    res.status(400).send({ error: e.message })
  }
})

export default signupRouter
