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

export const eventSchema = createSchema({
  title: Type.string({ required: true }),
  date: Type.date({ required: true }),
  description: Type.string({ required: true }),
  category: Type.string({ required: true, enum: categories }),
})

const Event = typedModel('Event', eventSchema)

export default Event
