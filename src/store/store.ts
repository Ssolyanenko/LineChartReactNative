import { configureStore } from '@reduxjs/toolkit';
import populationReducers from "./slices/populationSlice";

const store = configureStore({
  reducer: {
    population: populationReducers,
  },
});

export default store;
