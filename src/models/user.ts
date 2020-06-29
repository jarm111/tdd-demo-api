import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose'
import 'ts-mongoose/plugin'
import uniqueValidator from 'mongoose-unique-validator'

const emailRegex = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/
const validateEmail = (email: string) => emailRegex.test(email)

export const userSchema = createSchema({
  email: Type.string({
    required: true,
    unique: true,
    index: true,
    validate: [validateEmail, 'Invalid email address format'],
  }),
  passwordHash: Type.string({ required: true }),
})

export type UserProps = ExtractProps<typeof userSchema>

userSchema.plugin(uniqueValidator)

const User = typedModel('User', userSchema)

export default User
