import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePciker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';

import api from '../../services/api';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Title,
  Calendar,
  OpenDatePickerButton,
  OpenDatePickerText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
  CreateAppointmentButtonText,
  CreateAppoitmentButton,
} from './styles';
import { useAuth } from '../../hooks/auth';

interface RouteParams {
  providerId: string;
}

export interface Prestador {
  id: string;
  nome: string;
  avatar_url: string;
}

interface DayAvailability {
  hora: number;
  disponibilidade: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack, navigate } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [providers, setProviders] = useState<Prestador[]>([]);
  const [dayAvailability, setDayAvailability] = useState<DayAvailability[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  useEffect(() => {
    api.get('/prestadores').then((response) => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`/prestadores/${selectedProvider}/disponibilidade-dia`, {
        params: {
          dia: selectedDate.getDate(),
          mes: selectedDate.getMonth() + 1,
          ano: selectedDate.getFullYear(),
        },
      })
      .then((response) => {
        setDayAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const toggleShowCalendar = useCallback(() => {
    setShowDatePicker((state) => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);

        if (date) {
          setSelectedDate(date);
        }
      }
    },
    [],
  );

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);
      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.post('/agendamentos', {
        id_prestador: routeParams.providerId,
        data: date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      Alert.alert('Erro ao criar agendamento', err.message);
    }
  }, [selectedHour, selectedDate, routeParams, navigate]);

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hora }) => hora < 12)
      .map(({ hora, disponibilidade }) => {
        return {
          hora,
          horaFormatada: format(new Date().setHours(hora), 'HH:00'),
          disponibilidade,
        };
      });
  }, [dayAvailability]);

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hora }) => hora >= 12)
      .map(({ hora, disponibilidade }) => {
        return {
          hora,
          horaFormatada: format(new Date().setHours(hora), 'HH:00'),
          disponibilidade,
        };
      });
  }, [dayAvailability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>
        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={(prestador) => prestador.id}
            renderItem={({ item: prestador }) => (
              <ProviderContainer
                onPress={() => {
                  handleSelectProvider(prestador.id);
                }}
                selected={prestador.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: prestador.avatar_url }} />
                <ProviderName selected={prestador.id === selectedProvider}>
                  {prestador.nome}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Calendar>
          <Title>Escolha a data</Title>
          <OpenDatePickerButton onPress={toggleShowCalendar}>
            <OpenDatePickerText>Selecionar outra data</OpenDatePickerText>
          </OpenDatePickerButton>
          {showDatePicker && (
            <DateTimePciker
              mode="date"
              is24Hour
              display="calendar"
              textColor="#f4ede8"
              onChange={handleDateChanged}
              value={selectedDate}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(
                ({ hora, horaFormatada, disponibilidade }) => (
                  <Hour
                    enabled={disponibilidade}
                    selected={selectedHour === hora}
                    available={disponibilidade}
                    key={horaFormatada}
                    onPress={() => handleSelectHour(hora)}
                  >
                    <HourText selected={selectedHour === hora}>
                      {horaFormatada}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ hora, horaFormatada, disponibilidade }) => (
                  <Hour
                    enabled={disponibilidade}
                    selected={selectedHour === hora}
                    available={disponibilidade}
                    key={horaFormatada}
                    onPress={() => handleSelectHour(hora)}
                  >
                    <HourText selected={selectedHour === hora}>
                      {horaFormatada}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
        <CreateAppoitmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppoitmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
