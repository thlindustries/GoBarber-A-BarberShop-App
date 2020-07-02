import React, { useCallback, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { StatusBar, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/atoms/Input';
import Button from '../../components/atoms/Button';

import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Title,
  ProvileAvatarButton,
  ProfileAvatar,
  BackButton,
  LeaveText,
  LeaveButton,
} from './styles';

interface ProfileFormData {
  nome: string;
  email: string;
  senha_antiga: string;
  senha: string;
  confirma_senha: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const { user, updateUser, signOut } = useAuth();

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          nome: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um endereço de e-mail válido'),
          senha_antiga: Yup.string(),
          senha: Yup.string().when('senha_antiga', {
            is: (val) => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          confirma_senha: Yup.string()
            .when('senha_antiga', {
              is: (val) => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('senha'), undefined], 'Confirmação incorreta!'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { email, nome, senha_antiga, senha, confirma_senha } = data;

        const formData = {
          nome,
          email,
          ...(senha_antiga ? { senha_antiga, senha, confirma_senha } : {}),
        };

        const response = await api.put('/perfil', formData);

        updateUser(response.data);

        Alert.alert(
          'Perfil atualizado com sucesso!',
          'Suas informações já estão atualizadas.',
        );

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente!',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(async () => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar Camera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        const source = { uri: response.uri };

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api
          .patch('/usuarios/avatar', data)
          .then((apiResponse) => updateUser(apiResponse.data));
      },
    );
    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.CAMERA,
    //   {
    //     title: 'Permissão para utilizar a camera',
    //     message:
    //       'Precisamos de permissão para acessar suas fotos e camera para você poder alterar seu avatar',
    //     buttonNeutral: 'Lermbrar depois',
    //     buttonNegative: 'Negar',
    //     buttonPositive: 'Ok',
    //   },
    // );

    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {

    // } else {
    //   Alert.alert('Você precisa dar permissões de acesso à camera!');
    // }
  }, [user.id, updateUser]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <StatusBar barStyle="light-content" backgroundColor="#312e38" />
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#FFF" />
            </BackButton>
            <ProvileAvatarButton onPress={handleUpdateAvatar}>
              <ProfileAvatar source={{ uri: user.avatar_url }} />
            </ProvileAvatarButton>

            <View>
              <Title>Meu perfil</Title>
              <LeaveButton onPress={signOut}>
                <LeaveText>
                  <Icon name="log-out" size={16} />
                  Sair
                </LeaveText>
              </LeaveButton>
            </View>
            <Form initialData={user} onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="nome"
                icon="user"
                autoCapitalize="words"
                placeholder="Nome completo"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                autoCorrect={false}
                autoCapitalize="none"
                placeholder="E-mail"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              />

              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                name="senha_antiga"
                icon="lock"
                placeholder="Senha atual"
                containerStyle={{ marginTop: 16 }}
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="senha"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />

              <Input
                ref={confirmPasswordInputRef}
                secureTextEntry
                name="confirma_senha"
                icon="lock"
                placeholder="Confirmar senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
