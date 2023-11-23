import { createSlice } from '@reduxjs/toolkit'

const initState = {
    observatoryName: "",
    lat: 48,
    lng: 17,
    alt: 20,
}

const locationFormSlice = createSlice({
    name: 'locationForm',
    initialState: initState,
    reducers: {
        updateForm: {
            reducer: (state, action) => {
                Object.assign(state, action.payload);
            },
        },
    },
});

export const { updateForm } = locationFormSlice.actions
export const selectFormState = (state) => (state.locationForm)
export default locationFormSlice.reducer
