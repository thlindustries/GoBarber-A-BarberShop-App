import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;

  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const ProfileAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;

  align-self: center;
`;

export const ProvileAvatarButton = styled.TouchableOpacity`
  height: 200px;
  width: 200px;

  align-items: center;
  justify-content: center;
  margin-top: 128px;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 24px;
  margin-top: 32px;
`;

export const LeaveText = styled.Text`
  text-align: center;
  color: #c53030;

  margin-bottom: 10px;
`;

export const LeaveButton = styled.TouchableOpacity``;
