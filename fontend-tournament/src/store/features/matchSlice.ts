import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Match } from "../../components/models/Match";

interface MatchState {
  matchs: Match[];
  loading: boolean;
  error: string | null;
}

const initialState: MatchState = {
  matchs: [],
  loading: false,
  error: null,
};

export const getMatch = createAsyncThunk("auth/fetchMatch", async () => {
  try {
    const Match = await agent.Matchs.getMatchs();

    return Match;
  } catch (error) {
    console.log("error", error);
  }
});

export const randomMatch = createAsyncThunk<Match, FieldValues>(
  "auth/fetchRandomMatch",
  async (data) => {
    try {
      const Match = await agent.Matchs.randomMatchs({
        tournamentId: data.tournamentId,
        notOneRound: data.notOneRound,
      });

      return Match;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const updateMatch = createAsyncThunk<Match, FieldValues>(
  "auth/fetchUpdateMatch",
  async (data) => {
    try {
      const Match = await agent.Matchs.updateMatch({
        matchId: data.matchId,
        winningTeamId: data.winningTeamId,
      });

      return Match;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const resetTeamsAndDeleteMatches = createAsyncThunk(
  "auth/fetchresetTeamsAndDeleteMatches",
  async (id: number) => {
    try {
      const Match = await agent.Matchs.resetTeamsAndDeleteMatches(id);
      return Match;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const resetMatchesByRound = createAsyncThunk<Match, FieldValues>(
  "auth/fetchresetResetMatchesByRound",
  async (data) => {
    try {
      const Match = await agent.Matchs.resetMatchesForRound({
        tournamentId: data.tournamentId,
        round: data.round,
      });

      return Match;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const removeMatch = createAsyncThunk(
  "auth/fetchRemoveMatch",
  async (id: number) => {
    try {
      const Match = await agent.Matchs.removeMatch(id);
      return Match;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion

export const matchSlice = createSlice({
  name: "Match",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      //#region get All
      .addCase(getMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.matchs = action.payload;
      })
      .addCase(getMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      .addCase(randomMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(randomMatch.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.matchs.findIndex((x) => x.id === updated.id);

        if (index !== -1) {
          state.matchs[index] = updated;
        } else {
          state.matchs.push(updated);
        }
      })
      .addCase(randomMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(updateMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.matchs.findIndex((x) => x.id === updated.id);

        if (index !== -1) {
          state.matchs[index] = updated;
        } else {
          state.matchs.push(updated);
        }
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  },
});

// export const {} = MatchSlice.actions;

export default matchSlice.reducer;
