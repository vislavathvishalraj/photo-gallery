
import { useEffect, useReducer } from 'react'

function favouritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const photoId = action.payload

      if (state.includes(photoId)) {
        return state.filter((id) => id !== photoId)
      }

      return [...state, photoId]
    }

    case 'LOAD':
      return action.payload

    default:
      return state
  }
}

function getInitialFavourites() {
  try {
    const saved = localStorage.getItem('favourites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function useFavourites() {
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    getInitialFavourites
  )

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])

  function toggleFavourite(photoId) {
    dispatch({ type: 'TOGGLE', payload: photoId })
  }

  return { favourites, toggleFavourite }
}

export default useFavourites
