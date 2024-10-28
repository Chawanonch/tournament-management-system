import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../components/api/agent";
import { FieldValues } from "react-hook-form";
import { Registration, RegistrationCompete } from "../../components/models/Registration";

interface RegistrationState {
  registrations: Registration[];
  registrationCompetes: RegistrationCompete[];
  loading: boolean;
  error: string | null;
}

const initialState: RegistrationState = {
  registrations: [],
  registrationCompetes: [],
  loading: false,
  error: null,
};


export const getRegistration = createAsyncThunk(
  "auth/fetchRegistration",
  async () => {
    try {
      const registration = await agent.Registrations.getRegistrations();
      const registrationCompetes = await agent.Registrations.getRegistrationCompetes();

      return {registration,registrationCompetes}
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const createAndUpdateRegistration  = createAsyncThunk<Registration, FieldValues>(
  "auth/fetchCreateAndUpdateRegistration",
  async (data) => {
    try {
      const Registration = await agent.Registrations.registrations({
        Id : data.id,
        TournamentId : data.tournamentId,
        TeamId : data.teamId,
        TeamName : data.teamName,
      });
      
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const checkInRegistration  = createAsyncThunk(
    "auth/fetchCheckInRegistration",
    async (id:number) => {
      try {
        const Registration = await agent.Registrations.checkInRegistration(id);
        return Registration;
      } catch (error) {
        console.log("error", error);
      }
    }
);
export const checkInAllRegistrations  = createAsyncThunk(
  "auth/fetchcheckInAllRegistrations",
  async (id:number) => {
    try {
      const Registration = await agent.Registrations.checkInAllRegistrations(id);
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const cancelCheckInAllRegistrations  = createAsyncThunk(
  "auth/fetchcancelCheckInAllRegistrations",
  async (id:number) => {
    try {
      const Registration = await agent.Registrations.cancelCheckInAllRegistrations(id);
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const removeRegistration  = createAsyncThunk(
  "auth/fetchRemoveRegistration",
  async (id:number) => {
    try {
      const Registration = await agent.Registrations.removeRegistration(id);
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);


export const createAndUpdateRegistrationCompete  = createAsyncThunk<RegistrationCompete, FieldValues>(
  "auth/fetchCreateAndUpdateRegistrationCompete",
  async (data) => {
    try {
      const Registration = await agent.Registrations.registrationCompetes({
        Id : data.id,
        CompeteId : data.CompeteId,
        TeamId : data.teamId,
        TeamName : data.teamName,
      });
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const checkInRegistrationCompete  = createAsyncThunk(
    "auth/fetchCheckInRegistrationCompete",
    async (id:number) => {
      try {
        const Registration = await agent.Registrations.checkInRegistrationCompete(id);
        return Registration;
      } catch (error) {
        console.log("error", error);
      }
    }
);
export const checkInAllRegistrationCompetes  = createAsyncThunk(
  "auth/fetchcheckInAllRegistrationCompetes",
  async (id:number) => {
    try {
      const Registration = await agent.Registrations.checkInAllRegistrationCompetes(id);
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const cancelCheckInAllRegistrationCompetes  = createAsyncThunk(
  "auth/fetchcancelCheckInAllRegistrationCompetes",
  async (id:number) => {
    try {
      const Registration = await agent.Registrations.cancelCheckInAllRegistrationCompetes(id);
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);
export const removeRegistrationCompete  = createAsyncThunk(
  "auth/fetchRemoveRegistrationCompete",
  async (id:number) => {
    try {
      const Registration = await agent.Registrations.removeRegistrationCompete(id);
      return Registration;
    } catch (error) {
      console.log("error", error);
    }
  }
);

export const registrationSlice = createSlice({
  name: "Registration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRegistration.fulfilled, (state, action) => {
          state.loading = false;
          state.registrations = action.payload?.registration
          state.registrationCompetes = action.payload?.registrationCompetes
      })
      .addCase(getRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(createAndUpdateRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateRegistration.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.registrations.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.registrations[index] = updated;
          } else {
            state.registrations.push(updated);
          }
      })

      .addCase(createAndUpdateRegistrationCompete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })

      .addCase(createAndUpdateRegistrationCompete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAndUpdateRegistrationCompete.fulfilled, (state, action) => {
          state.loading = false;
          const updated = action.payload;
          const index = state.registrationCompetes.findIndex(x => x.id === updated.id);
        
          if (index !== -1) {
            state.registrationCompetes[index] = updated;
          } else {
            state.registrationCompetes.push(updated);
          }
      })

      .addCase(createAndUpdateRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
    }
});

// export const {} = RegistrationSlice.actions;

export default registrationSlice.reducer;
