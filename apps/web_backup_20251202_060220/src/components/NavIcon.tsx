import React from 'react';
import { StyleSheet, View } from 'react-native';
import { 
  Home, 
  User, 
  Zap, 
  Award, 
  Grid3X3, 
  BarChart3 
} from 'lucide-react-native';
import { theme } from '../theme';
import { ParamList } from './index';

type NavIconProps = {
  screenName: keyof ParamList;
  focused: boolean;
};

export function getIconForRoute(routeName: keyof ParamList): React.ComponentType<any> {
  switch (routeName) {
    case 'Home':
      return Home;
    case 'Identity':
      return User;
    case 'Impact':
      return Zap;
    case 'Profile':
      return Award;
    case 'NFTs':
      return Grid3X3;
    case 'Dashboard':
      return BarChart3;
    default:
      return Home;
  }
}

function NavIcon({ screenName, focused }: NavIconProps) {
  const Icon = getIconForRoute(screenName);
  
  return (
    <View style={styles.container}>
      <Icon
        size={20}
        color={focused ? theme.colors.primary : theme.colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NavIcon;
