import React, {useEffect, useState, useContext } from 'react'
import { View, Text } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function MenuButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkToken = async() => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      console.log('Status :',isLoggedIn);
    } else {
      setIsLoggedIn(false);
      console.log('Status :',isLoggedIn);
    }
  }
  useEffect(() => {
    checkToken();
  }, [isLoggedIn]);

    const navigation = useNavigation();
    console.log('isLogged', isLoggedIn);

    if (isLoggedIn === false) {
         return navigation.navigate('Home');;
    }

    const actions = [
        {
          text: "Modify",
          name: "ModifyProfilScreen",
          position: 2
        },
        {
          text: "Profile",
          icon: require("./images/plus.png"),
          name: "ProfilScreen",
          position: 1
        },
        {
          text: "Home",
          name: "Home",
          position: 3
        },
        {
          text: "Logout",
          name: "LogoutScreen",
          position: 4
        }
      ];
  return (
    <View style={{}}>
    {isLoggedIn  &&
        <FloatingAction
            actions={actions}
            onPressItem={name => {
                if ( name === 'Logout' ) {
                    userLogout();
                    return navigation.navigate('Home');

                };
                return navigation.navigate(`${name}`);
            }}
        />
      }
    </View>
  )
}

export default MenuButton