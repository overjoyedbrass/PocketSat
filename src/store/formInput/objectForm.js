import { createSlice } from '@reduxjs/toolkit'

const initState = {
    objectId: "",
    tle: "",
    customTLE: false,
    tleError: false,
}

const objectFormSlice = createSlice({
    name: 'objectForm',
    initialState: initState,
    reducers: {
        updateForm: {
            reducer: (state, action) => {
                Object.assign(state, action.payload);
            },
        },
    },
});

export const { updateForm } = objectFormSlice.actions;
export const selectFormState = (state) => (state.objectForm);
export default objectFormSlice.reducer;
