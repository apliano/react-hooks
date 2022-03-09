// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [state, setState] = React.useState({status: 'idle', pokemon: null})

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: 'pending', pokemon: null})
    fetchAndSetPokemon(pokemonName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonName])

  async function fetchAndSetPokemon(pokemonName) {
    try {
      const pokemonData = await fetchPokemon(pokemonName)
      setState({status: 'resolved', pokemon: pokemonData})
    } catch (e) {
      setState({error: e, status: 'rejected'})
    }
  }

  switch (state.status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    case 'rejected':
      throw state.error
    default:
      throw new Error('Unknown state')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

export default App
