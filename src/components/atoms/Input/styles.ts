import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Tooltip from '../Tooltip';

interface ContainerProps {
  focus: boolean;
  hasError: boolean;
}

interface TooltipProps {
  title: string;
  icon: string;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;

  border-radius: 10px;
  margin-bottom: 8px;

  justify-content: center;
  align-items: center;
  flex-direction: row;

  border-width: 2px;
  border-color: #232129;

  ${(props) =>
    props.hasError &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.focus &&
    css`
      border-color: #ff9000;
    `}
`;
export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;

export const Error = styled(Tooltip) <TooltipProps>``;
