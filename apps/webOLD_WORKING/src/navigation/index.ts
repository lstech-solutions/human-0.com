import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

export type ParamList = {
  Home: undefined;
  Identity: undefined;
  Impact: undefined;
  Profile: undefined;
  NFTs: undefined;
  Dashboard: undefined;
};

export const RootTab = createBottomTabNavigator<ParamList>();
export const RootDrawer = createDrawerNavigator<ParamList>();
