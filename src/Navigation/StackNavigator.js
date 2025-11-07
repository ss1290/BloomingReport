import { createStackNavigator } from '@react-navigation/stack';
import FarmerProfileScreen from '../Screens/FarmerProfileScreen';
import LandDetailsScreen from '../Screens/LandDetailsScreen';
import CropDetailsScreen from '../Screens/CropDetailsScreen';
import FloweringDetailsScreen from '../Screens/FloweringDetailsScreen';
import BeekeepingScoreScreen from '../Screens/BeekeepingScoreScreen';

const Stack = createStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="FarmerProfile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FarmerProfile" component={FarmerProfileScreen} />
      <Stack.Screen name="LandDetails" component={LandDetailsScreen} />
      <Stack.Screen name="CropDetails" component={CropDetailsScreen} />
      <Stack.Screen
        name="FloweringDetails"
        component={FloweringDetailsScreen}
      />
      <Stack.Screen name="BeekeepingScore" component={BeekeepingScoreScreen} />
    </Stack.Navigator>
  );
};
export default StackNavigator;
