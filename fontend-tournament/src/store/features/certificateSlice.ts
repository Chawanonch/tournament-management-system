import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Certificate } from "../../components/models/Certificate";

interface CertificateState {
  Certificates: Certificate[];
  loading: boolean;
  error: string | null;
}

const initialState: CertificateState = {
  Certificates: [],
  loading: false,
  error: null,
};


export const getCertificate = createAsyncThunk(
  "auth/fetchCertificate",
  async () => {
    try {
      const Certificate = await agent.Certificates.getCertificates();

      return Certificate;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const createAndUpdateCertificateOne  = createAsyncThunk<Certificate, FieldValues>(
  "auth/fetchCreateAndUpdateCertificateOne",
  async (data) => {
    try {
      const Certificate = await agent.Certificates.creatAndUpdateCertificateOne({
        Id : data.certificateId,
        Name : data.name,
        Rank : data.rank,
        TeamId : data.teamId,
        TextInImageId : data.textInImageId,
        ListSignerDetails : data.listSignerDetails && data.listSignerDetails.map((item:any) => ({
          SignerDetailId: item,
        })),
      });
      
      return Certificate;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const createAndUpdateCertificate  = createAsyncThunk<Certificate, FieldValues>(
  "auth/fetchCreateAndUpdateCertificate",
  async (data) => {
    try {
      const Certificate = await agent.Certificates.creatAndUpdateCertificate({
        CertificateRequests: data.listCertificates && data.listCertificates.map((item:any) => ({
          Name : item.name,
          Rank : item.rank,
          TeamId : item.teamId,
        })),
        TextInImageId : data.textInImageId,
        ListSignerDetails : data.listSignerDetails && data.listSignerDetails.map((item:any) => ({
          SignerDetailId: item,
        })),
      });
      
      return Certificate;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const removeCertificate  = createAsyncThunk(
  "auth/fetchRemoveCertificate",
  async (id:number) => {
    try {
      const Certificate = await agent.Certificates.removeCertificate(id);
      return Certificate;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const certificateSlice = createSlice({
  name: "Certificate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCertificate.fulfilled, (state, action) => {
          state.loading = false;
          state.Certificates = action.payload
      })
      .addCase(getCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion
      .addCase(createAndUpdateCertificateOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateCertificateOne.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.Certificates.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.Certificates[index] = updated;
          } else {
            state.Certificates.push(updated);
          }
      })
      .addCase(createAndUpdateCertificateOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(createAndUpdateCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateCertificate.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.Certificates.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.Certificates[index] = updated;
          } else {
            state.Certificates.push(updated);
          }
      })
      .addCase(createAndUpdateCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = CertificateSlice.actions;

export default certificateSlice.reducer;
