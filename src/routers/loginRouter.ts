import { Router } from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../utils/config'

const loginRouter = Router()

loginRouter.post('/', async (req, res, next) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  try {
    if (!user) {
      const err = new Error(`Wrong credentials`)
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
      token,
    })
  } catch (error) {
    next(error)
  }
})

export default loginRouter
