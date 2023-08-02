import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    profile: {},
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload
        },
    }
})


export const {setProfile} = userSlice.actions;
export default userSlice.reducer;