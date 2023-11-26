import { createSlice } from '@reduxjs/toolkit'
import { add, format } from 'date-fns';

const initState = {
    datefrom: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    dateto: format(add(new Date(), {hours: 1}), "yyyy-MM-dd'T'HH:mm"),
    step: 1,
    stepUnits: "s",
}

const timeFormSlice = createSlice({
    name: 'timeForm',
    initialState: initState,
    reducers: {
        updateForm: {
            reducer: (state, action) => {
                Object.assign(state, action.payload);
            },
        },
    },
});

export const { updateForm } = timeFormSlice.actions
export const selectFormState = (state) => (state.timeForm)
export default timeFormSlice.reducer
