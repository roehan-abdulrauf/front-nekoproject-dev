import React from 'react';
import { View, TouchableOpacity, StyleSheet, } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NavBar = ({ activeScreen, navigation }) => {
  const activeIconStyle = { color: '#ff6e40' };
  const inactiveIconStyle = { color: '#444749' };
  return (

    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeMessages')}>
        <Icon name="chat-bubble" size={30} style={activeScreen === 'homeMessages' ? activeIconStyle : inactiveIconStyle} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeGroups')}>
        <Icon name="forum" size={30} style={{ marginLeft: 50, ...(activeScreen === 'homeGroups' ? activeIconStyle : inactiveIconStyle) }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ProfilScreen')}>
        <Icon name="person" size={30} style={{ marginLeft: 50, ...(activeScreen === 'profile' ? activeIconStyle : inactiveIconStyle) }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MemberScreen')} >
        <Icon name="groups" size={30} style={{ marginLeft: 50, ...(activeScreen === 'groups' ? activeIconStyle : inactiveIconStyle) }} />
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // borderRadius: 28,
    backgroundColor: '#D6D6D6',
    justifyContent: 'center',
    // elevation: 5, // Shadow on Android
    // shadowColor: '#000', // Shadow on iOS
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
  },
});

export default NavBar;
