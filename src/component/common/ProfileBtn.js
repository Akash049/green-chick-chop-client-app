import React from 'react'
import { StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;

export default function ProfileBtn({ icon, text,screen, navigation }) {
    const btnAction = (nav) => {
        navigation.navigate(nav)
    }
    return (
        <View style={styles.main}>
            <TouchableOpacity onPress={()=>btnAction(screen)} style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{flexDirection:'row'}}>
                    <View style={styles.container}>
                        {icon}
                    </View>
                    <View style={styles.container2}>
                        <Text>{text}</Text>
                    </View>
                </View>
                <Icon name="keyboard-arrow-right" style={{ fontSize: RFPercentage(5), color: '#f04c4c' }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 20,
        padding: 7,
        borderColor: '#ddd'
    },
    container: {
        justifyContent: 'center',
        marginLeft:5
    },
    container2: {
        justifyContent: 'center',
        marginLeft:10
    }
})
