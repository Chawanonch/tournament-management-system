import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import tournamentSlice from './features/tournamentSlice'
import userSlice from './features/userSlice'
import teamSlice from './features/teamSlice'
import levelSlice from './features/levelSlice'
import registrationSlice from './features/registrationSlice'
import matchSlice from './features/matchSlice'
import certificateSlice from './features/certificateSlice'
import competitionSlice from './features/competitionSlice'
import competeSlice from './features/competeSlice'
import textInImageSlice from './features/textInImageSlice'
import signerSlice from './features/signerSlice'

export const store = configureStore({
  reducer: {
    tournament: tournamentSlice,
    user: userSlice,
    team: teamSlice,
    level: levelSlice,
    registration: registrationSlice,
    match: matchSlice,
    certificate: certificateSlice,
    competition: competitionSlice,
    compete: competeSlice,
    textInImage: textInImageSlice,
    signer: signerSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;