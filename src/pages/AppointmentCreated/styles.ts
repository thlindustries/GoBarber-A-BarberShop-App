import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;

  align-items: center;
  justify-content: center;

  padding: 0 24px;
`;

export const Title = styled.Text`
  font-size: 32px;
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  text-align: center;
  margin-top: 48px;
`;
export const Description = styled.Text`
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  color: #999591;
  margin-top: 16px;
`;
export const OkButton = styled(RectButton)`
  background: #ff9000;
  justify-content: center;
  align-items: center;
  margin-top: 24px;

  border-radius: 10px;
  padding: 12px 24px;
`;
export const OkButtonText = styled.Text`
  color: #312e38;
  font-size: 18px;
  font-family: 'RobotoSlab-Medium';
`;
