import React from 'react';
import { Platform } from 'react-native';
import { ParamList, RootDrawer, RootTab } from './index';
import NavIcon from '../components/NavIcon';

// Import screens - we'll create these next
import HomeScreen from '../features/home/HomeScreen';
import IdentityScreen from '../../app/identity';
import ImpactScreen from '../../app/impact';
import ProfileScreen from '../../app/profile';
import NFTsScreen from '../features/nfts/NFTsScreen';
import DashboardScreen from '../../app/dashboard';

const screens = [
  {
    name: 'Home',
    component: HomeScreen,
  },
  {
    name: 'Identity',
    component: IdentityScreen,
  },
  {
    name: 'Impact',
    component: ImpactScreen,
  },
  {
    name: 'Profile',
    component: ProfileScreen,
  },
  {
    name: 'NFTs',
    component: NFTsScreen,
  },
  {
    name: 'Dashboard',
    component: DashboardScreen,
  },
] as const;

const RootNavigator = () => {
  if (Platform.OS === 'web') {
    return (
      <RootDrawer.Navigator
        screenOptions={{
          header: () => null, // Hide drawer header
          drawerType: 'permanent', // Drawer as a fixed sidebar
        }}
      >
        {screens.map(screen => (
          <RootDrawer.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              // Add custom icons to drawer items
              drawerIcon: ({ focused }) => (
                <NavIcon screenName={screen.name} focused={focused} />
              ),
            }}
          />
        ))}
      </RootDrawer.Navigator>
    );
  }

  return (
    <RootTab.Navigator
      screenOptions={{
        header: () => null, // We'll add custom header later
        tabBarLabel: () => null, // Hide tab bar labels
      }}
    >
      {screens.map(screen => (
        <RootTab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            // Add custom icons to tab bar items
            tabBarIcon: ({ focused }) => (
              <NavIcon screenName={screen.name} focused={focused} />
            ),
          }}
        />
      ))}
    </RootTab.Navigator>
  );
};

export default RootNavigator;
