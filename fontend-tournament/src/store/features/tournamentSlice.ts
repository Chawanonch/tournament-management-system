import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Tournament } from "../../components/models/Tournament";

interface TournamentState {
  tournaments: Tournament[];
  loading: boolean;
  error: string | null;
}

const initialState: TournamentState = {
  tournaments: [],
  loading: false,
  error: null,
};


export const getTournament = createAsyncThunk(
  "auth/fetchTournament",
  async () => {
    try {
      const Tournament = await agent.Tournaments.getTournaments();

      return Tournament;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateTournament  = createAsyncThunk<Tournament, FieldValues>(
  "auth/fetchCreateAndUpdateTournament",
  async (data) => {
    try {
      const Tournament = await agent.Tournaments.creatAndUpdateTournament({
        Id : data.id,
        Name : data.name,
        StartDate: data.startDate,
        EndDate: data.endDate,
        ListLevels: data.listLevels && data.listLevels.map((item:number) => ({
          LevelId: item
        })),
        Prizes: data.prizes && data.prizes.map((prize:any) => ({
          Rank: prize.rank,
          Price: Number(prize.price)
        })),
        GameImageUrl: data.image
      });

      return Tournament;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const statusHideTournament = createAsyncThunk(
  "auth/fetchStatusHideTournament",
  async (id:number) => {
    try {
      const Tournament = await agent.Tournaments.statusHideTournament(id);
      return Tournament;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const statusHideTournaments = createAsyncThunk(
  "auth/fetchStatusHideTournaments",
  async (year:number) => {
    try {
      const Tournament = await agent.Tournaments.statusHideTournaments(year);
      return Tournament;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeTournament  = createAsyncThunk(
  "auth/fetchRemoveTournament",
  async (id:number) => {
    try {
      const Tournament = await agent.Tournaments.removeTournament(id);
      return Tournament;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const tournamentSlice = createSlice({
  name: "Tournament",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTournament.fulfilled, (state, action) => {
          state.loading = false;
          state.tournaments = action.payload
      })
      .addCase(getTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      .addCase(createAndUpdateTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateTournament.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.tournaments.findIndex(x => x.id === updated?.id);
        
          if (index !== -1) {
            state.tournaments[index] = updated;
          } else {
            state.tournaments.push(updated);
          }
      })
      .addCase(createAndUpdateTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = TournamentSlice.actions;

export default tournamentSlice.reducer;
