import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {Root} from '../Root';
import MainScreen from '../screens/MainScreen';

const FullNavigation = createNativeStackNavigator();
export const AppStack = () => {
  return (
    <FullNavigation.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#003459',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <FullNavigation.Screen
        name="mainScreen"
        component={MainScreen}
        options={{
          title: 'Here you can see statistic',
        }}
      />
      <FullNavigation.Screen
        name="Root"
        component={Root}
      />
    </FullNavigation.Navigator>
  );
};
