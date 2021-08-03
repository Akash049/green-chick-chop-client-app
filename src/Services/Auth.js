

export const authServices = {
    userLogin,
    forgetPassword
};

function userLogin(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    console.log('requestOptions', requestOptions);
    return fetch("https://vendor.greenchickchopindia.com:3000/chop/user/login", requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function forgetPassword(payload) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    console.log('requestOptions', requestOptions);
    return fetch("https://vendor.greenchickchopindia.com:3000/chop/user/forgot-password", requestOptions)
        .then(handleResponse)
        .then(user => {
            return user;
        });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                // logout();
            }

            const error = (data) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}