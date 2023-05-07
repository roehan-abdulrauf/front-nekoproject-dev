import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios, { isCancel, AxiosError } from 'axios';
import IP_ADRESS from '../components/utile/env';

const MailValidation = ({ navigation }) => {
  
  axios.post(`https://2852-2a02-8428-eb8a-e101-15d-25ec-cfaa-a750.ngrok-free.app/api/users/mailVerified`)
  .then((response) => {
    const mailVerified = response.data
    console.log(mailVerified);
    console.log(2);
    showMessage();
  })
  .catch((error) => {
    console.log(error.response.status);
    setErrorMessage(error.response.data.message);
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../images/logo.png')} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Félicitations !</Text>
        <Text style={styles.description}>Votre adresse mail a été vérifiée avec succès.</Text>
        <Text style={styles.description}>Vous pouvez à présent vous connecter sur notre app mobile.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  // imageContainer: {
  //   marginBottom: 50,
  // },
  image: {
    width: 250,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default MailValidation;
