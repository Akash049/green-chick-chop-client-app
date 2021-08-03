import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity,Platform, TextInput, Modal, View, ScrollView, ImageBackground, Image, Dimensions, ActivityIndicator } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Search from '../includes/Search'
import Icon from 'react-native-vector-icons/Ionicons';
import BottomMenu from '../common/BottomMenu';
import Add from '../common/Add'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeServices } from '../../Services/Home.services';
import Loader from '../common/Loader'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GoogleAutoComplete } from 'react-native-google-autocomplete';
import LocationItem from "./LocationItem";
const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;
export default function Location(props) {
    const [isLoader, setIasLoader] = React.useState(false);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [vendorsList, setVendorsList] = React.useState([]);


    const setVendorList = (data) => {
        setVendorsList(data);
        setModalVisible(true)
    }

    const setAppData = async (val) => {
        var appData = {
            vendorData: {
                location: val,
                orderData: []
            },
        }
        try {
            await AsyncStorage.removeItem('green_chick_chop_data')
            try {
                await AsyncStorage.setItem("green_chick_chop_data", JSON.stringify(appData));
                props.setNewVendor(true);
                setModalVisible(false)
                props.setLocationModalVisible(false)
            } catch (e) {
                // saving error
                alert("Something went wrong !!!")
            }
        } catch (e) {
            alert("Something went wrong !!!")
            // remove error
        }
    }

    return (
        <View style={styles.main}>
            {isLoader &&
                <Loader />
            }
            <View style={[styles.header,{marginTop: Platform.OS === 'ios' ? vh*4 : 0}]}>
                <TouchableOpacity onPress={() => props.setLocationModalVisible(false)}>
                    <Icon name="chevron-back" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ width: 80 * vw, marginTop: 20, height: vh * 80 }}>
                    <View style={{}}>
                        {/* <GooglePlacesAutocomplete
                            placeholder='Search'
                            onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
                                console.log(data, details);
                            }}
                            query={{
                                key: 'AIzaSyDfFUdxR8Y7F5Skq4Sae4QkEAkuBSvlsD0',
                                language: 'en',
                            }}
                            currentLocation={true}
                            currentLocationLabel='Current location'
                        /> */}
                        <Text style={{marginBottom:10}}>Enter your location</Text>

                        <GoogleAutoComplete apiKey="AIzaSyDfFUdxR8Y7F5Skq4Sae4QkEAkuBSvlsD0" debounce={500}>
                            {({ inputValue, handleTextChange, locationResults, fetchDetails , isSearching}) => (
                                <React.Fragment>
                                    <TextInput
                                        style={{
                                            height: 40,
                                            width: 300,
                                            borderWidth: 1,
                                            paddingHorizontal: 16,
                                            width: '100%',
                                            color:'#000'
                                        }}
                                        value={inputValue}
                                        onChangeText={handleTextChange}
                                        placeholder="Type your address...."
                                    />
                                    {isSearching && <ActivityIndicator color='#f04c4c' style={{padding:10}}/>}
                                    <ScrollView keyboardShouldPersistTaps={'always'} style={{ maxHeight: vh * 60 }}>
                                        {locationResults.map((el, i) => (
                                            <LocationItem
                                                {...el}
                                                fetchDetails={fetchDetails}
                                                key={String(i)}
                                                setIasLoader={setIasLoader}
                                                setVendorList={setVendorList}
                                            />
                                        ))}
                                    </ScrollView>
                                </React.Fragment>
                            )}
                        </GoogleAutoComplete>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(false);
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={styles.modalView}>
                                    <Text style={{fontSize:24,fontWeight:'100'}}>Select vendor :</Text>
                                    <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        {vendorsList && vendorsList.map((item, i) => {
                                            return <TouchableOpacity key={item[0]._id} onPress={() => setAppData(item[0])} style={{ borderWidth: 0.5, borderColor: '#000', width: '28%', padding: 10, backgroundColor: '#ddd',marginTop:20 }}>
                                                <Text>{item[0].address}</Text>
                                            </TouchableOpacity>
                                        })}
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        height: height,
        width: width,
        // backgroundColor: '#fff',
        position: 'relative',
    },
    header: {
        width: width,
        // height: 60,
        // backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        padding: 10,
        // flexDirection: 'row',
        // justifyContent: 'center'
    },
    modalView: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        width: vw * 90
    }
})
