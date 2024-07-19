import React, { Dispatch, SetStateAction } from 'react';
import { TextInput } from 'react-native-paper';
import {
  COLOR_FB_SECONDARY,
  COLOR_LIGHT_GRAY,
  COLOR_WHITE,
} from '../constants/colors';

interface IInputProps {
  mode?: 'flat' | 'outlined';
  placeholder?: string;
  secure?: boolean;
  value: string;
  onChangeText: Dispatch<SetStateAction<string>>;
  mb?: number;
}

const Input = ({
  mode = 'flat',
  placeholder = '',
  secure = false,
  value,
  onChangeText,
  mb,
}: IInputProps) => {
  return (
    <TextInput
      mode={mode}
      outlineStyle={
        mode === 'outlined' && {
          borderRadius: 16,
          borderColor: COLOR_LIGHT_GRAY,
        }
      }
      style={{
        backgroundColor: mode === 'flat' ? COLOR_WHITE : COLOR_LIGHT_GRAY,
        width: '100%',
        marginBottom: mb || 0,
      }}
      placeholder={placeholder}
      placeholderTextColor={COLOR_FB_SECONDARY}
      secureTextEntry={secure}
      value={value}
      onChangeText={onChangeText}
      accessibilityLabelledBy={undefined}
      accessibilityLanguage={undefined}
      autoCapitalize="none"
    />
  );
};

export default Input;
