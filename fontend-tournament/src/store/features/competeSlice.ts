import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Compete } from "../../components/models/Compete";

interface CompeteState {
  Competes: Compete[];
  loading: boolean;
  error: string | null;
}

const initialState: CompeteState = {
  Competes: [],
  loading: false,
  error: null,
};


export const getCompete = createAsyncThunk(
  "auth/fetchCompete",
  async () => {
    try {
      const Compete = await agent.Competes.getCompetes();

      return Compete;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateCompete  = createAsyncThunk<Compete, FieldValues>(
  "auth/fetchCreateAndUpdateCompete",
  async (data) => {
    try {
      const Compete = await agent.Competes.creatAndUpdateCompete({
        Id : data.id,
        Name : data.name,
        StartDate: data.startDate,
        EndDate: data.endDate,
        CompetitionListId: data.competitionListId,
        listLevelCompetes: data.listLevels && data.listLevels.map((item:number) => ({
            LevelId: item
        })),
      });

      return Compete;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const statusHideCompete = createAsyncThunk(
  "auth/fetchStatusHideCompete",
  async (id:number) => {
    try {
      const Compete = await agent.Competes.statusHideCompete(id);
      return Compete;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const statusHideCompetes = createAsyncThunk(
  "auth/fetchStatusHideCompetes",
  async (year:number) => {
    try {
      const Compete = await agent.Competes.statusHideCompetes(year);
      return Compete;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const removeCompete  = createAsyncThunk(
  "auth/fetchRemoveCompete",
  async (id:number) => {
    try {
      const Compete = await agent.Competes.removeCompete(id);
      return Compete;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const competeSlice = createSlice({
  name: "compete",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getCompete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompete.fulfilled, (state, action) => {
          state.loading = false;
          state.Competes = action.payload
      })
      .addCase(getCompete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      .addCase(createAndUpdateCompete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateCompete.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.Competes.findIndex(x => x.id === updated?.id);
        
          if (index !== -1) {
            state.Competes[index] = updated;
          } else {
            state.Competes.push(updated);
          }
      })
      .addCase(createAndUpdateCompete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = CompeteSlice.actions;

export default competeSlice.reducer;
