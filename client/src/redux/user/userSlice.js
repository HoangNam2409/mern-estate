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
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
} = userReducer.actions;

export default userReducer.reducer;
