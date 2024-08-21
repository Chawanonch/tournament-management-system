import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import tournamentSlice from './features/tournamentSlice'
import userSlice from './features/userSlice'
import teamSlice from './features/teamSlice'
import levelSlice from './features/levelSlice'
import registrationSlice from './features/registrationSlice'
import matchSlice from './features/matchSlice'

export const store = configureStore({
  reducer: {
    tournament: tournamentSlice,
    user: userSlice,
    team: teamSlice,
    level: levelSlice,
    registration: registrationSlice,
    match: matchSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;