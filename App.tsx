import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

import {useGetPopulationDataQuery} from './src/store/services/populationAPI';
import {NavigationContainer} from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { Root } from "./src/Root";

function App(): JSX.Element {

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <Root />
        </Provider>
      </NativeBaseProvider>

  );
}

export default App;
