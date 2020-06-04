import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import config from '../utils/config'

const loginRouter = Router()

loginRouter.post('/', async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      const err = new Error(`No such user with given email`)
      err.name = 'AuthenticationError'
      throw err
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordIsCorrect) {
      const err = new Error(`Wrong password`)
      err.name = 'AuthenticationError'
      throw err
    }

    const payload = {
      id: user._id,
      email: user.email,
    }

    const token = jwt.sign(payload, config.get('secret'))

    res.status(200).json({
      id: user._id,
      email: user.email,
      token,
    })
  } catch (error) {
    next(error)
  }
})

export default loginRouter
