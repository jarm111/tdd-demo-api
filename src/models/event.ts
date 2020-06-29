import { createSchema, Type, typedModel } from 'ts-mongoose'
import { userSchema } from './user'

const categories = [
  'music',
  'theatre',
  'sports',
  'lectures',
  'dancing',
  'exhibitions',
  'culture',
  'other',
] as const

export const eventSchema = createSchema({
  title: Type.string({ required: true }),
  date: Type.date({ required: true }),
  description: Type.string({ required: true }),
  category: Type.string({ required: true, enum: categories }),
  user: Type.ref(Type.objectId()).to('User', userSchema),
})

eventSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  },
})

const Event = typedModel('Event', eventSchema)

export default Event
