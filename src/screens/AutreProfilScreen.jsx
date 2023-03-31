import { Menu, MenuOptions, MenuTrigger, MenuProvider } from 'react-native-popup-menu';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Logout } from '../components/utile/Logout.js';
import { useRoute } from '@react-navigation/native';

const AutreProfilScreen = ({ navigation }) => {

  const route = useRoute();
  const { user } = route.params;

  const logoutUser = () => {
    Alert.alert(
      'Confirmation de déconnexion',
      'Vous êtes sur le point de vous déconnecter.',
      [
        {
          text: 'Annuler',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: () => {
            Logout(user.token)
            setUser(null);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            'Vous ne serez pas déconnecté.',
          ),
      },
    );
  }

  return (
    <MenuProvider>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.headerTitle}>NekoChat</Text>
        </TouchableOpacity>
        <Menu style={styles.menuOptions}>
          <MenuTrigger>
            <Image source={require('../images/menu_icon.png')} style={styles.menuIcon} />
          </MenuTrigger>
          <MenuOptions>
            <TouchableOpacity onPress={() => navigation.navigate('ProfilScreen')}>
              <Text style={styles.menuOption}><Icon name="person" size={15} />Mon profil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MemberScreen')}>
              <Text style={styles.menuOption}><Icon name="group" size={15} />Member</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logoutUser}>
              <Text style={styles.menuOption}><Icon name="logout" size={15} />Deconnexion</Text>
            </TouchableOpacity>
          </MenuOptions>
        </Menu>
      </View>
      <Text style={styles.screenName}>Profil utilisateur</Text>
      <View style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, }} />}
          <Button title="changer l'image" onPress={pickImage} /> */}
        </View>
        <View style={styles.formContainer}>
          <Image source={require("../assets/icons8-saitama-250.png")} style={styles.profileImg} />
          <Text>Pseudo :</Text>
          <Text style={styles.input}>{user.pseudo}</Text>
          <Text>Email :</Text>
          <Text style={styles.input}>{user.mail}</Text>
          <Text>bio :</Text>
          {user.bio ? (
            <Text style={styles.input}>{user.bio}</Text>

          ) :
            <Text style={styles.input}>Salut! J'utilise Neko Chat.</Text>
          }
        </View>
      </View>
    </MenuProvider>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ff6e40',
    height: 100,
    paddingTop: 30,
    // paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    // zIndex: 1,
  },
  menuOptions: {
    zIndex: 1, elevation: 1
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  screenName: {
    color: '#ff6e40',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  menuIcon: {
    width: 20,
    height: 20,
  },
  menuOption: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0, elevation: 0
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImg: {
    position: "relative", left: 80,
    width: '50%',
    height: '25%',
    margin: 0,
    borderRadius: 80,
    marginBottom: 10,
    marginTop: 10
  },
  formContainer: {
    marginBottom: 30,
    width: '90%',
    zIndex: 0, elevation: 0
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    height: 50,
    padding: 12,
    margin: 10,
    border: 0,
    padding: 0,
    zIndex: 1,
    backgroundColor: 'white',
    borderBottom: '2px solid #eee',
    fontSize: 14,
    lineHeight: 30
  },
  button: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FF6E40',
    // borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AutreProfilScreen;