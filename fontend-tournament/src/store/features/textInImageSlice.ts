import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { TextInImage } from "../../components/models/Certificate";

interface TextInImageState {
  TextInImages: TextInImage[];
  loading: boolean;
  error: string | null;
}

const initialState: TextInImageState = {
  TextInImages: [],
  loading: false,
  error: null,
};


export const getTextInImage = createAsyncThunk(
  "auth/fetchTextInImage",
  async () => {
    try {
      const TextInImage = await agent.TextInImages.getTextInImages();

      return TextInImage;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateTextInImage  = createAsyncThunk<TextInImage, FieldValues>(
  "auth/fetchCreateAndUpdateTextInImage",
  async (data) => {
    try {
      const TextInImage = await agent.TextInImages.creatAndUpdateTextInImage({
        Id : data.textInImageId,
        Text : data.nameText,
      });
      
      return TextInImage;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeTextInImage  = createAsyncThunk(
  "auth/fetchRemoveTextInImage",
  async (id:number) => {
    try {
      const TextInImage = await agent.TextInImages.removeTextInImage(id);
      return TextInImage;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const textInImageSlice = createSlice({
  name: "textInImage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getTextInImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTextInImage.fulfilled, (state, action) => {
          state.loading = false;
          state.TextInImages = action.payload
      })
      .addCase(getTextInImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      .addCase(createAndUpdateTextInImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateTextInImage.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.TextInImages.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.TextInImages[index] = updated;
          } else {
            state.TextInImages.push(updated);
          }
      })
      .addCase(createAndUpdateTextInImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = TextInImageSlice.actions;

export default textInImageSlice.reducer;
