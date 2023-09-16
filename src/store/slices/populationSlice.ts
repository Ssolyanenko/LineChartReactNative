
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
interface PopulationData { //make types
  "ID State": string;
  "ID Year": number;
  Population: number;
  "Slug State": string;
  State: string;
  Year: string;
}

interface InitialState {
  data: PopulationData[];
  years: number[];
  populations: number[];
  locations: string[];
  isLoading: boolean;
  error: null | string;
}

const initialState:InitialState = {
  data: [],
  years:[],
  populations: [],
  locations:[],
  isLoading: false,
  error: null,
};

export const fetchData = createAsyncThunk('population/fetchData', async () => {
  try {
    const response = await fetch(
      'https://datausa.io/api/data?drilldowns=State&measures=Population'
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}); //fetch data

//work with new data
const populationSlice = createSlice({
  name: 'population',
  initialState,
  reducers: {
    setData: (state:InitialState, action) => {
      state.data = action.payload;
    },
    setError: (state:InitialState, action) => {
      state.error = action.payload;
    },
    setLoading: (state:InitialState, action) => {
      state.isLoading = action.payload;
    },
    setYears: (state:InitialState, action) => {
      state.years = action.payload.reverse();
    },
    setPopulations: (state:InitialState, action) => {
      state.populations = action.payload.reverse();
    },
    setLocations: (state:InitialState, action) => {
      state.locations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state:InitialState) => {
        state.isLoading = true;
      })
      .addCase(fetchData.fulfilled, (state:any, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchData.rejected, (state:any, action:any) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { setYears,setPopulations,setLocations } = populationSlice.actions; //export reducers

export default populationSlice.reducer;
