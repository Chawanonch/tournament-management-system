import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Level } from "../../components/models/Level";

interface LevelState {
  levels: Level[];
  loading: boolean;
  error: string | null;
}

const initialState: LevelState = {
  levels: [],
  loading: false,
  error: null,
};


export const getLevel = createAsyncThunk(
  "auth/fetchLevel",
  async () => {
    try {
      const Level = await agent.Levels.getLevels();

      return Level;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateLevel  = createAsyncThunk<Level, FieldValues>(
  "auth/fetchCreateAndUpdateLevel",
  async (data) => {
    try {
      const Level = await agent.Levels.creatAndUpdateLevel({
        Id : data.id,
        Name : data.name,
      });
      
      return Level;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeLevel  = createAsyncThunk(
  "auth/fetchRemoveLevel",
  async (id:number) => {
    try {
      const Level = await agent.Levels.removeLevel(id);
      return Level;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const levelSlice = createSlice({
  name: "Level",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLevel.fulfilled, (state, action) => {
          state.loading = false;
          state.levels = action.payload
      })
      .addCase(getLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      .addCase(createAndUpdateLevel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateLevel.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.levels.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.levels[index] = updated;
          } else {
            state.levels.push(updated);
          }
      })
      .addCase(createAndUpdateLevel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = LevelSlice.actions;

export default levelSlice.reducer;
