import {AppStack} from './navigation/AppStack';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export const Root = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer independent={true}>
        <AppStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
