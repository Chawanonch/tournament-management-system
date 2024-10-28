import { Competition, CompetitionList } from './../../components/models/Competition';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { AllDetail } from '../../components/models/AllDetail';

interface CompetitionState {
  Competitions: Competition[];
  CompetitionList: CompetitionList[];
  AllDetails: AllDetail[];
  loading: boolean;
  error: string | null;
}

const initialState: CompetitionState = {
  Competitions: [],
  CompetitionList: [],
  AllDetails: [],
  loading: false,
  error: null,
};


export const getCompetition = createAsyncThunk(
  "auth/fetchCompetition",
  async () => {
    try {
      const Competition = await agent.Competitions.getCompetitions();
      const CompetitionList = await agent.Competitions.getCompetitionsList();
      const AllDetails = await agent.AllDetail.getAllDetails();

      return {Competition,CompetitionList,AllDetails};
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const createAndUpdateAllDetail  = createAsyncThunk<AllDetail, FieldValues>(
  "auth/fetchCreateAndUpdateAllDetail ",
  async (data) => {
    try {
      const AllDetail = await agent.AllDetail.creatAndUpdateAllDetail({
        Id : data.idlinkDetail,
        LinkDetail : data.linkDetail,
      });
      
      return AllDetail;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const removeAllDetail  = createAsyncThunk(
  "auth/fetchRemoveAllDetail",
  async (id:number) => {
    try {
      const AllDetail = await agent.AllDetail.removeAllDetail(id);
      return AllDetail;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const createAndUpdateCompetition  = createAsyncThunk<Competition, FieldValues>(
  "auth/fetchCreateAndUpdateCompetition",
  async (data) => {
    try {
      const Competition = await agent.Competitions.creatAndUpdateCompetition({
        Id : data.competitionId,
        Name : data.name,
      });
      
      return Competition;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const createAndUpdateCompetitionList  = createAsyncThunk<CompetitionList, FieldValues>(
    "auth/fetchCreateAndUpdateCompetitionList ",
    async (data) => {
      try {
        const Competition = await agent.Competitions.creatAndUpdateCompetitionList({
          Id : data.competitionListId,
          DateTimeYear : data.dateTimeYear,
          CompetitionId : data.competitionId,
          Details : data.details && data.details.map((item:any) => ({
            Name: item.name,
            Text: item.text,
          })),
        });
        
        return Competition;
      } catch (error) {
        console.log("error", error);
      }
    }
  );
export const removeCompetition  = createAsyncThunk(
  "auth/fetchRemoveCompetition",
  async (id:number) => {
    try {
      const Competition = await agent.Competitions.removeCompetition(id);
      return Competition;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const removeCompetitionList  = createAsyncThunk(
  "auth/fetchRemoveCompetitionList",
  async (id:number) => {
    try {
      const Competition = await agent.Competitions.removeCompetitionList(id);
      return Competition;
    } catch (error) {
      console.log("error", error);
    }
  }
);
//#endregion


export const competitionSlice = createSlice({
  name: "competition",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

    //#region get All
      .addCase(getCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompetition.fulfilled, (state, action) => {
          state.loading = false;
          state.Competitions = action.payload?.Competition
          state.CompetitionList = action.payload?.CompetitionList
          state.AllDetails = action.payload?.AllDetails
      })
      .addCase(getCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      //#endregion

      .addCase(createAndUpdateCompetition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateCompetition.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.Competitions.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.Competitions[index] = updated;
          } else {
            state.Competitions.push(updated);
          }
      })
      .addCase(createAndUpdateCompetition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(createAndUpdateCompetitionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateCompetitionList.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.CompetitionList.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.CompetitionList[index] = updated;
          } else {
            state.CompetitionList.push(updated);
          }
      })
      .addCase(createAndUpdateCompetitionList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(createAndUpdateAllDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateAllDetail.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.AllDetails.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.AllDetails[index] = updated;
          } else {
            state.AllDetails.push(updated);
          }
      })
      .addCase(createAndUpdateAllDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = CompetitionSlice.actions;

export default competitionSlice.reducer;
