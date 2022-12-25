import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import iconsSet from '../../../docs/icons.json'
import { Habit } from '../../objects/Habit.js'

export type Icon = {id: number, n: string}
export interface DataState {
  // icons: Icon[],
  habits?: Habit[]
}

const slice = createSlice({
  name: 'data',
  initialState: {} as DataState,
  reducers: {
    setHabits (state, action: PayloadAction<DataState['habits']>) {
      state.habits = action.payload
    }
  }
})


export const { setHabits } = slice.actions
export default slice.reducer