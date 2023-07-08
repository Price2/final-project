import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"


export interface ModeInitialState {
    mode: string
}


const initialState: ModeInitialState = {
   mode: "light-mode"

}


export const modeSlice = createSlice({
    name: 'mode_slice',
    initialState,
    reducers: {
        toggleMode: (state, action) => {
            state.mode = action.payload;
        },

    },

});


export const { toggleMode } = modeSlice.actions;
export default modeSlice.reducer;

