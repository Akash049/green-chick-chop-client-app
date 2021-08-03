import axios from 'react-native-axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = 'https://vendor.greenchickchopindia.com:3000/'

var getData = async () => {
    try {
        const value = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
        if (value !== null) {
            return value
        }
    } catch (e) {
        // error reading value
    }
}

var getAppData = async () => {
    try {
        const value = await AsyncStorage.getItem('green_chick_chop_data')
        if (value !== null) {
            return value
        }
    } catch (e) {
        // error reading value
    }
}

export class HomeServices {

    constructor() {
        axios.interceptors.request.use(
            function (config) {
                let token = getData()
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            },
            (error) => {
                console.log("error.response.status", error);
                return error;
            }
        );
    }

    async getAppData() {
        try {
            const value = await AsyncStorage.getItem('green_chick_chop_data')
            if (value !== null) {
                return JSON.parse(value)
            }
        } catch (e) {
            // error reading value
        }
    }

    async getAllCategoryList() {
        try {
            const value = await AsyncStorage.getItem('green_chick_chop_data')
            if (value !== null) {
                var appData = JSON.parse(value);
                var vendorId = appData.vendorData && appData.vendorData.location && appData.vendorData.location.user_id ? appData.vendorData.location.user_id._id : "";
                return axios
                    .get(`${baseUrl}chop/item/item-category/${vendorId}`)
                    .then((res) => res.data);
            }
        } catch (e) {
            // error reading value
        }
    }
    async getCategoryDetailItemList() {
        try {
            const value = await AsyncStorage.getItem('green_chick_chop_data')
            if (value !== null) {
                var appData = JSON.parse(value);
                var vendorId = appData.vendorData && appData.vendorData.location && appData.vendorData.location.user_id ? appData.vendorData.location.user_id._id : "";
                return axios
                    .get(`${baseUrl}chop/item/item-detail/${vendorId}`)
                    .then((res) => res.data);
            }
        } catch (e) {
            // error reading value
        }

    }

    getVendorList(payload) {
        return axios
            .post(`${baseUrl}chop/user/selected-vendor`, payload)
            .then((res) => res.data);

    }

    async getUserDetails() {
        var myHeaders = new Headers();
        try {
            var token = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            myHeaders.append("Authorization", "Bearer " + token);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            return fetch("https://vendor.greenchickchopindia.com:3000/chop/user", requestOptions)
                .then(response => response.text())
                .then(user => {
                    return user;
                });
        } catch (e) {
            // error reading value
        }

    }

    async setOrderDetails(item) {
        try {
            var value = await AsyncStorage.getItem('green_chick_chop_data');
            value = await JSON.parse(value);
            if (value.vendorData !== null) {
                try {
                    await AsyncStorage.setItem("green_chick_chop_data", JSON.stringify(item));
                    return "success";
                } catch (e) {
                    // saving error
                }
            }
        } catch (e) {
            // error reading value
        }
    }

    async getOrderDetails() {
        try {
            var value = await AsyncStorage.getItem('green_chick_chop_data');
            value = await JSON.parse(value);
            if (value !== null) {
                return value;
            }
        } catch (e) {
            // error reading value
        }
    }

    async setUserAddress(payload) {
        console.log(payload)
        var myHeaders = new Headers();
        try {
            var token = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: 'follow'
            };
            return fetch(`${baseUrl}chop/customer/add-address`, requestOptions)
                .then(function (response) {
                    return response.json();
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    throw error;
                });
        } catch (e) {
            console.log(e)
            // error reading value
        }
    }

    async getUserAddress() {
        var myHeaders = new Headers();
        try {
            var token = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            myHeaders.append("Authorization", "Bearer " + token);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            return fetch(`${baseUrl}chop/customer/get-address`, requestOptions)
                .then(function (response) {
                    return response.json();
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    throw error;
                });
        } catch (e) {
            // error reading value
        }
    }

    async getTimeSlot() {
        var myHeaders = new Headers();
        try {
            var token = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            myHeaders.append("Authorization", "Bearer " + token);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            return fetch(`${baseUrl}chop/deliverytimeslots`, requestOptions)
                .then(function (response) {
                    return response.json();
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    throw error;
                });
        } catch (e) {
            // error reading value
        }
    }

    async buyItem(payload, id) {
        var myHeaders = new Headers();
        try {
            var token = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json");
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: 'follow'
            };
            return fetch(`${baseUrl}chop/customerorder/add/${id}`, requestOptions)
                .then(function (response) {
                    return response.json();
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    throw error;
                });
        } catch (e) {
            console.log(e)
            // error reading value
        }
    }

    async getOrdersDatas() {
        var myHeaders = new Headers();
        try {
            var token = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            myHeaders.append("Authorization", "Bearer " + token);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            return fetch(`${baseUrl}chop/customerorder/order-detail`, requestOptions)
                .then(function (response) {
                    return response.json();
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    throw error;
                });
        } catch (e) {
            // error reading value
        }
    }

    async updateUserDetails(payload) {
        var myHeaders = new Headers();
        try {
            var token = await AsyncStorage.getItem('green_chick_chop_access_bearer_token')
            myHeaders.append("Authorization", "Bearer " + token);
            myHeaders.append("Content-Type", "application/json"); 
           var requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: JSON.stringify(payload),
                redirect: 'follow'
            };
            return fetch(`${baseUrl}chop/user`, requestOptions)
                .then(function (response) {
                    return response.json();
                })
                .catch(function (error) {
                    console.log('There has been a problem with your fetch operation: ' + error.message);
                    // ADD THIS THROW error
                    throw error;
                });
        } catch (e) {
            console.log(e)
            // error reading value
        }
    }


}