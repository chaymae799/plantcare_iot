import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50', // Green
    accent: '#FFC107', // Amber
    background: '#F5F5F5', // Light background
    surface: '#FFFFFF', // White surface
    text: '#000000', // Black text
    disabled: '#BDBDBD', // Disabled color
    placeholder: '#BDBDBD', // Placeholder color
    backdrop: '#000000', // Backdrop color
    notification: '#FF4081', // Notification color
  },
  roundness: 4,
  fonts: {
    regular: {
      fontFamily: 'Roboto-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Roboto-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: 'normal',
    },
  },
};

export default theme;