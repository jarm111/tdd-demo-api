import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose'
import 'ts-mongoose/plugin'
import uniqueValidator from 'mongoose-unique-validator'
import { eventSchema } from './event'

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
  ownEvents: Type.array().of(
    Type.ref(Type.objectId()).to('Event', eventSchema)
  ),
  favoriteEvents: Type.array().of(
    Type.ref(Type.objectId()).to('Event', eventSchema)
  ),
})

export type UserProps = ExtractProps<typeof userSchema>

userSchema.plugin(uniqueValidator)

const User = typedModel('User', userSchema)

User.find().populateTs('ownEvents')
User.find().populateTs('favoriteEvents')

export default User
