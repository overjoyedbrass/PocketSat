import { createSlice } from '@reduxjs/toolkit'

const initState = {
    ra: 0.0,
    dec: 0.0,
    width: 0.0,
    height: 0.0,
    mag: 0.0,
}

const fovFormSlice = createSlice({
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

export const { updateForm } = fovFormSlice.actions;
export const selectFormState = (state) => (state.objectForm);
export default fovFormSlice.reducer;
