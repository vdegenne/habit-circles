import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const pageValues = ['', 'login', '404'] as const
export type PageValue = typeof pageValues[number]
export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface AppStructure {
  page: PageValue;
  user?: User;
}

const slice = createSlice({
  name: 'app',
  initialState: { page: 'login' } as AppStructure,
  reducers:  {
    setPage (state, action: PayloadAction<PageValue>) {
      state.page = action.payload
    },
    setUser (state, action: PayloadAction<AppStructure['user']>) {
      state.user = action.payload
    }
  }
})



export const { setPage, setUser } = slice.actions
export default slice.reducer