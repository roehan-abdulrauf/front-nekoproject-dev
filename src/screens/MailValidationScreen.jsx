import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios, { isCancel, AxiosError } from 'axios';
import IP_ADRESS from '../components/utile/env';
import { useAuth } from '../components/utile/AuthContext';

const MailValidation = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [user, setUser] = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [succesMessage, setSuccesMessage] = useState('');

  const route = useRoute();
  const email = route.params?.email;
  const password = route.params?.password;
  const verificationCode = route.params?.verificationCode;

  const handleValidation = async () => {
    if (verificationCode === code) {
      // Logique de vérification du code envoyé par MAIL
      const mailVerifiedresponse = await axios.put(`http://${IP_ADRESS}:5000/api/users/mailVerified`, {
        mail: email,
      })
      console.log(mailVerifiedresponse);
      if (mailVerifiedresponse.status === 200) {
        try {
          const loginresponse = await axios.post(`http://${IP_ADRESS}:5000/api/users/login`, {
            mail: email,
            password: password,
          })
          if (loginresponse.status === 200) {
            setSuccesMessage('Votre mail est vérifié avec succès.');
            setTimeout(() => {
              setUser({
                ...loginresponse.data,
                idToken: loginresponse.data.token
              });
            }, 3000);
          } else {
            setErrorMessage(loginresponse.data.message)
          };
        } catch (error) {
          console.log(error);
          setErrorMessage(error.response.data.message)
        }
      } else {
        setErrorMessage(mailVerifiedresponse.data.message);
      };
    } else {
      setErrorMessage('Le code de vérification est incorrect.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.errorMessage}>
        {errorMessage}
      </Text>
      <Text style={styles.succesMessage}>
        {succesMessage}
      </Text>
      <Text style={styles.title}>Vérification de l'adresse mail</Text>
      <Text style={styles.subtitle}>Un code de vérification a été envoyé à votre adresse mail. Veuillez saisir le code ci-dessous :</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCode}
        value={code}
        placeholder="Code de vérification"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleValidation}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    height: 50,
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorMessage: {
    marginBottom: 30,
    color: 'red',
    textAlign: 'center',
  },
  succesMessage: {
    marginBottom: 30,
    color: 'green',
    textAlign: 'center',
  },
});

export default MailValidation;
