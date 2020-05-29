import { Router } from 'express'
import User from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../utils/config'

const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  const payload = {
    id: user?._id,
    email: user?.email,
  }

  const token = jwt.sign(payload, config.get('secret'))

  res.status(200).json({
    id: user?._id,
    token,
  })
})

export default loginRouter
