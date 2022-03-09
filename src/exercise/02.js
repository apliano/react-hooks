// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue,
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [name, setName] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    return defaultValue
  })

  const prevKey = React.useRef(key)

  React.useEffect(() => {
    if (key !== prevKey.current) {
      window.localStorage.removeItem(prevKey.current)
      prevKey.current = key
    }
    window.localStorage.setItem(key, serialize(name))
  }, [key, name, serialize])

  return [name, setName]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  const [name, setName] = useLocalStorageState('name', initialName)

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
