import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
};

const userReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },

        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        signUpStart: (state) => {
            state.loading = true;
        },

        signUpSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },

        signUpFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        updateUserStart: (state) => {
            state.loading = true;
        },

        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },

        updateUserFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        deleteUserStart: (state) => {
            state.loading = true;
        },

        deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
<<<<<<< HEAD
=======

        signOutUserStart: (state) => {
            state.loading = true;
        },

        signOutUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

        signOutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
>>>>>>> 54845a7 (add sign out functionality)
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    signUpStart,
    signUpSuccess,
    signUpFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
<<<<<<< HEAD
=======
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
>>>>>>> 54845a7 (add sign out functionality)
} = userReducer.actions;

export default userReducer.reducer;
