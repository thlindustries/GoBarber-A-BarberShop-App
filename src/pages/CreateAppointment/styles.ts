import styled from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Platform, FlatList } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import { Prestador } from './index';

interface ProviderContainerProps {
  selected: boolean;
}

interface ProviderNameProps {
  selected: boolean;
}

interface HourProps {
  available: boolean;
  selected: boolean;
}

interface HourTextProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  padding-top: ${Platform.OS !== 'android' ? getStatusBarHeight() + 24 : 12}px;

  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  color: #f4ede8;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<Prestador>)`
  padding: 32px 24px;
`;

export const ProviderContainer = styled(RectButton) <ProviderContainerProps>`
  background: ${(props) => (props.selected ? '#ff9000' : '#3e3b47')};

  flex-direction: row;
  margin-right: 16px;
  padding: 8px 12px;
  align-items: center;

  border-radius: 10px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text<ProviderNameProps>`
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  color: ${(props) => (props.selected ? '#232129' : '#f4ede8')};
`;

export const Calendar = styled.View``;

export const Title = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 0 24px 24px;
  font-size: 24px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  background: #ff9000;
  height: 46px;
  border-radius: 10px;

  align-items: center;
  justify-content: center;

  margin: 0 24px;
`;

export const OpenDatePickerText = styled.Text`
  font-family: 'RobotSlab-Medium';
  font-size: 16px;
  color: #232129;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: { paddingHorizontal: 24 },
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

export const Hour = styled(RectButton) <HourProps>`
  padding: 12px;
  border-radius: 10px;
  margin-right: 8px;

  background: ${(props) => (props.selected ? '#ff9000' : '#3e3b47')};
  opacity: ${(props) => (props.available ? 100 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
  color: ${(props) => (props.selected ? '#232129' : '#f4ede8')};
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;

export const Content = styled.ScrollView`
  flex: 1;
`;

export const CreateAppoitmentButton = styled(RectButton)`
  height: 50px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px 24px;
`;
export const CreateAppointmentButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #232129;
`;
