import * as React from 'react';
import { View, Text } from 'react-native';

export default function ModifyProfilScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => navigation.navigate('Profil')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Profil</Text>
        </View>
    );
}

