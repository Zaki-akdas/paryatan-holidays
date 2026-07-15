import { createContext } from 'react'
export const TripCustomizerContext = createContext<{ openTripCustomizer: () => void }>({ openTripCustomizer: () => {} })
