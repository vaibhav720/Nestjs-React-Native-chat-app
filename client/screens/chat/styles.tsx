import { StyleSheet } from 'react-native';
import {
  COLOR_FB_PRIMARY,
  COLOR_LIGHT_GRAY,
} from '../../shared/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  message: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: COLOR_LIGHT_GRAY,
    alignSelf: 'flex-start',
  },
  friendMessage: {
    backgroundColor: COLOR_FB_PRIMARY,
    alignSelf: 'flex-end',
  },
});
