import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Team } from "../../components/models/Team";

interface TeamState {
  teams: Team[];
  teamByUser: Team[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  teamByUser: [],
  loading: false,
  error: null,
};


export const getTeams = createAsyncThunk(
  "auth/fetchTeam",
  async () => {
    try {
      const Team = await agent.Teams.getTeams();

      return Team;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const getTeamByUser = createAsyncThunk(
  "auth/fetchTeamByUser",
  async () => {
    try {
      const Team = await agent.Teams.getTeamByUser();

      return Team;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateTeam  = createAsyncThunk<Team, FieldValues>(
  "auth/fetchCreateAndUpdateTeam",
  async (data) => {
    try {

      const Team = await agent.Teams.creatAndUpdateTeam({
        Id : data.id,
        SchoolName : data.schoolName,
        ListMembers : data.listMembers.map((member:any) => ({
          Name: member.name,
          Position: member.position
        })),
        LevelId : data.levelId
      });
      
      return Team;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeTeam  = createAsyncThunk(
  "auth/fetchRemoveTeam",
  async (id:number) => {
    try {
      const Team = await agent.Teams.removeTeam(id);
      return Team;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const teamSlice = createSlice({
  name: "Team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
          state.loading = false;
          state.teams = action.payload
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      
      .addCase(createAndUpdateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateTeam.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.teams.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.teams[index] = updated;
          } else {
            state.teams.push(updated);
          }
      })
      .addCase(createAndUpdateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(getTeamByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeamByUser.fulfilled, (state, action) => {
          state.loading = false;
          state.teamByUser = action.payload
      })
      .addCase(getTeamByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = TeamSlice.actions;

export default teamSlice.reducer;
