type MyEvent = Readonly<{
  title: string
  date: string
  description: string
  category: string
}>

const events: ReadonlyArray<MyEvent> = [
  {
    title: 'My event one',
    date: '2020-05-18',
    description: 'Welcome to my fun event one',
    category: 'music',
  },
  {
    title: 'My event two',
    date: '2020-05-19',
    description: 'Welcome to my fun event two',
    category: 'sports',
  },
  {
    title: 'My event three',
    date: '2020-05-20',
    description: 'Welcome to my fun event three',
    category: 'theatre',
  },
]

export default events
