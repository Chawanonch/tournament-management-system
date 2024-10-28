import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { SignerDetail } from "../../components/models/Certificate";

interface SignerDetailState {
  SignerDetails: SignerDetail[];
  loading: boolean;
  error: string | null;
}

const initialState: SignerDetailState = {
  SignerDetails: [],
  loading: false,
  error: null,
};


export const getSignerDetail = createAsyncThunk(
  "auth/fetchSignerDetail",
  async () => {
    try {
      const SignerDetail = await agent.SignerDetails.getSignerDetails();

      return SignerDetail;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateSignerDetail  = createAsyncThunk<SignerDetail, FieldValues>(
  "auth/fetchCreateAndUpdateSignerDetail",
  async (data) => {
    try {
      const SignerDetail = await agent.SignerDetails.creatAndUpdateSignerDetail({
        Id : data.signerId,
        FullName : data.fullName,
        Position : data.position,
        SignatureImageUrl : data.signatureImageUrl,
      });
      
      return SignerDetail;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeSignerDetail  = createAsyncThunk(
  "auth/fetchRemoveSignerDetail",
  async (id:number) => {
    try {
      const SignerDetail = await agent.SignerDetails.removeSignerDetail(id);
      return SignerDetail;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const signerDetailSlice = createSlice({
  name: "signerDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getSignerDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSignerDetail.fulfilled, (state, action) => {
          state.loading = false;
          state.SignerDetails = action.payload
      })
      .addCase(getSignerDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      .addCase(createAndUpdateSignerDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateSignerDetail.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.SignerDetails.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.SignerDetails[index] = updated;
          } else {
            state.SignerDetails.push(updated);
          }
      })
      .addCase(createAndUpdateSignerDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = SignerDetailSlice.actions;

export default signerDetailSlice.reducer;
