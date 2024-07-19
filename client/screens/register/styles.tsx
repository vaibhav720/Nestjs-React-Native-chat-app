import {StyleSheet} from 'react-native';
import {
  COLOR_FB_PRIMARY,
  COLOR_FB_SECONDARY,
  COLOR_WHITE,
} from '../../shared/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_FB_PRIMARY,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formContainer: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  facebookText: {
    fontSize: 56,
    fontWeight: '700',
    color: COLOR_WHITE,
    marginBottom: 32,
  },
  registerButtonContainer: {
    marginTop: 16,
    width: '100%',
  },
  registerButton: {
    backgroundColor: COLOR_FB_SECONDARY,
    height: 48,
    borderRadius: 0,
    marginTop: 4,
    width: '100%',
  },
  registerButtonText: {
    paddingTop: 8,
    fontSize: 24,
  },
  signUpText: {
    color: COLOR_WHITE,
    fontSize: 16,
  },
});
