export type User = Readonly<{
  email: string
  password: string
}>

const users: ReadonlyArray<User> = [
  {
    email: 'simon.says@hi.com',
    password: 'youneverguess',
  },
  {
    email: 'foo.bar@baz.com',
    password: 'p@ssw0rt991',
  },
]

export const newUser: User = {
  email: 'john.doe@qmail.com',
  password: 'qwerty1234',
}

export default users
