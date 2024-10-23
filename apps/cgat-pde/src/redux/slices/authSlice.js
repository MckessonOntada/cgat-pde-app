import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    userInfo: {
        userId: null,
        username: null,
        email: null,
        isLoggedIn: false,
        organization: null,
        treatmentCenter: null,
    },
    accessMatrix: {
        roles: [],
        permissions: [],
    },
    token: null,
}

const authSlice = createSlice({
    name: 'auth-slice',
    initialState,
    reducers: {
        login: (state, action) => {
            const { userInfo, token, accessMatrix } = action.payload;
            try {
                sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
                sessionStorage.setItem('accessMatrix', JSON.stringify(userInfo));
                sessionStorage.setItem('token', token);

                return action.payload;
            } catch (error) {
            }
        },
        logout: (state) => {
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('accessMatrix');
            return initialState;
        },
    }
})

export const {
    login, logout
} = authSlice.actions;

export default authSlice.reducer;