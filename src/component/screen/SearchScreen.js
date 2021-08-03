import React, { Component, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, Alert, View, TextInput, Platform, BackHandler, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeServices } from '../../Services/Home.services';

const { width, height } = Dimensions.get('window');

const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;
const homeServices = new HomeServices()

export default function SearchScreen({ navigation }) {

    const [searchedText, setSearchedText] = useState([]);
    const [itemList, setItemList] = useState([]);
    const inputRef = useRef(null);
    const touchRef = useRef(null);
    const [value, setValue] = useState('');
    const [viewDropdown, setViewDropdown] = useState(false);

    useEffect(() => {
        // console.log(itemList);
        // setSearchedText(itemList)
        // if(inputRef.current.isFocused()){
        //     alert(inputRef.current.isFocused())
        // }

        // setSearchedText(itemList);
        getCategoryDetailItem()
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    const getCategoryDetailItem = () => {
        homeServices.getCategoryDetailItemList().then(
            (data) => {
                // alert("data, data", data)
                setSearchedText(data.result.result)
                setItemList(data.result.result)
                // setIasLoader(false);
                // setPaginationDetail(data.data.pagination)
            },
            (error) => {
                console.log("error.response.status", error);
            }
        );
    }

    const backAction = () => {
        // alert(viewDropdown)
        // return () => backHandler.remove();
    };

    const blurAction = () => {
        setViewDropdown(false)
        // setShouldScroll(true)
    }

    const focusAction = () => {
        // setShouldScroll(false)
        setSearchedText(itemList)
        setViewDropdown(true)
    }

    const onChangeText = (text) => {
        var temp = itemList;
        var tempArray = [];
        setValue(text);
        setViewDropdown(true);
        temp.map((item, i) => {
            var str = item.name.toLowerCase();
            if (str.search(text.toLowerCase()) !== -1) {
                tempArray.push(item)
            }
        })
        setSearchedText(tempArray)
    }

    const optionClicked = (item) => {
        navigation.navigate('ProductView', {
            itemDetail: {
                name: item.name,
                packaging_type: item.packaging_type,
                multi_package: item.multi_package ? item.multi_package : [],
                multi_price: item.multi_price ? item.multi_price : [],
                price: item.price,
                _id: item._id,
                image_url: item.image_url[0],
                description: item.description,
                page: 'Home'
            },
        });
    }

    return (
        <>
            <View style={[styles.header, { marginTop: Platform.OS === 'ios' ? vh * 6 : vh * 2 }]}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Icon name="chevron-back" style={{ fontSize: RFPercentage(4), color: '#000' }} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={{ fontSize: RFPercentage(2.5), fontWeight: 'bold' }}>Home</Text>
                    </View>
                </View>
            </View>
            <View keyboardShouldPersistTaps={'always'} style={{ padding: 20, width: '100%', position: 'relative'}}>
                <View style={styles.inputBox}>
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, { height: Platform.OS === 'ios' ? 50 : 50 }]}
                        placeholder={"Search for food item"}
                        onChangeText={text => onChangeText(text)}
                        value={value}
                        onBlur={() => blurAction()}
                        onFocus={() => focusAction()}
                        returnKeyType="done"
                        autoFocus={true}
                    />
                    <View style={{ justifyContent: 'center', position: 'absolute', right: 20, height: '100%', marginTop: 10 }}>
                        <Icon name="search" style={{ fontSize: 4 * vh, color: '#aaa' }} />
                    </View>
                </View>
                {viewDropdown &&
                    <View style={styles.dropdown}>
                        <ScrollView keyboardShouldPersistTaps={'always'} style={{ flex: 1 }}>
                            <View style={{ width: '100%' }}>
                                {searchedText.map((item, i) => {
                                    return (
                                        <TouchableOpacity ref={touchRef} onPress={() => optionClicked(item)} style={styles.touch}>
                                            <Text>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </ScrollView>
                    </View>
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    inputBox: {
        padding: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        flexDirection: 'row',
        position: 'relative',
    },
    input: {
        fontSize: RFPercentage(3),
        borderColor: '#ccc',
        borderRadius: 20,
        width: '100%',
        color:'#000'
    },
    dropdown: {
        width: '100%',
        // backgroundColor:'#fff',
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        maxHeight: vh * 100,
    },
    touch: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        padding: 10,
        // backgroundColor:'#ddd'
    }
})
