import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { HomeImage } from "../../components/models/HomeImages";

interface HomeImageState {
  HomeImages: HomeImage[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeImageState = {
  HomeImages: [],
  loading: false,
  error: null,
};


export const getHomeImage = createAsyncThunk(
  "auth/fetchHomeImage",
  async () => {
    try {
      const HomeImage = await agent.HomeImages.getHomeImages();

      return HomeImage;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateHomeImage  = createAsyncThunk<HomeImage, FieldValues>(
  "auth/fetchCreateAndUpdateHomeImage",
  async (data) => {
    try {
      const HomeImage = await agent.HomeImages.creatAndUpdateHomeImage({
        Id: data.id,
        Text: data.text,
      },data.images);
      
      return HomeImage;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeHomeImage  = createAsyncThunk(
  "auth/fetchRemoveHomeImage",
  async (id:number) => {
    try {
      const HomeImage = await agent.HomeImages.removeHomeImage(id);
      return HomeImage;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const homeImageSlice = createSlice({
  name: "homeImage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getHomeImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeImage.fulfilled, (state, action) => {
          state.loading = false;
          state.HomeImages = action.payload
      })
      .addCase(getHomeImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(createAndUpdateHomeImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateHomeImage.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.HomeImages.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.HomeImages[index] = updated;
          } else {
            state.HomeImages.push(updated);
          }
      })
      .addCase(createAndUpdateHomeImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = HomeImageSlice.actions;

export default homeImageSlice.reducer;
