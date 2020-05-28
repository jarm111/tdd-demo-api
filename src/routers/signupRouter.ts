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

signupRouter.post('/', async (req, res, next) => {
  const { email, password } = req.body

  const passwordHash = await bcrypt.hash(password, config.get('salt'))

  try {
    if (!validatePassword(password)) {
      const err = new Error(
        `Password too short, must be min ${passwordMinLength} characters`
      )
      err.name = 'ValidationError'
      throw err
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
    next(e)
  }
})

export default signupRouter
