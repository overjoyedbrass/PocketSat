import { createSlice } from '@reduxjs/toolkit'

const initState = {
    datefrom: "",
    dateto: "",
    step: 1,
    lat: 48,
    lng: 17,
    alt: 20,
    objectId: "",
}

const formInputSlice = createSlice({
    name: 'formInput',
    initialState: initState,
    reducers: {
        updateFormInput: {
            reducer: (state, action) => {
                Object.assign(state, action.payload);
            },
        },
    },
});

export const { updateFormInput } = formInputSlice.actions
export const selectFormState = (state) => (state.formInput)
export default formInputSlice.reducer
