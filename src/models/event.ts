import { createSchema, Type, typedModel } from 'ts-mongoose'

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

const eventSchema = createSchema({
  title: Type.string({ required: true }),
  date: Type.date({ required: true }),
  description: Type.string({ required: true }),
  category: Type.string({ required: true, enum: categories }),
})

export default typedModel('Event', eventSchema)
