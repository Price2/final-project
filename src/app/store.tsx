import { configureStore } from '@reduxjs/toolkit'
import board from '../features/boardSlice'
import { useDispatch } from "react-redux";
import modal from '../features/modalSlice';

export const store = configureStore({
  reducer: {
    boards: board,
    modals: modal
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
