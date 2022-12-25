import { configureStore, getDefaultMiddleware, Store } from '@reduxjs/toolkit';
import appReducer from './slices/app.js'
import dataReducer from './slices/data.js'


export const store = configureStore({
  reducer: {
    app: appReducer,
    data: dataReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})


export type RootState = ReturnType<typeof store.getState>;