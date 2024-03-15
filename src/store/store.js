import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { ephemeridesApi } from '../api/ephemerides'
import timeFormReducer from './formInput/timeForm'
import locationFormReducer from './formInput/locationForm'
import objectFormReducer from './formInput/objectForm'
import fovFormReducer from "./formInput/fovForm";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [ephemeridesApi.reducerPath]: ephemeridesApi.reducer,
    timeForm: timeFormReducer,
    locationForm: locationFormReducer,
    objectForm: objectFormReducer,
    fovForm: fovFormReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ephemeridesApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)