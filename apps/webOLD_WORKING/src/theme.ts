import { DarkTheme } from '@react-navigation/native';

const reactNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#00FF9C',
    background: '#050B10',
    card: '#050B10',
    text: '#FFFFFF',
    border: '#30363d',
    notification: 'rgb(255, 69, 58)',
  },
};

const theme = {
  colors: {
    ...reactNavigationTheme.colors,
    disabled: 'rgb(52,50,50)',
  },
};

export { reactNavigationTheme, theme };
