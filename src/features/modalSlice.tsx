import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ModalInitialState {
    addNewBoard: boolean;
    editBoard: boolean;
    deleteBoard: boolean;
    addTasks: boolean;
    editTasks: boolean;
    deleteTasks: boolean;
  
  }

const initialState: ModalInitialState = {
    addNewBoard: false,
    editBoard: false,
    deleteBoard: false,
    addTasks: false,
    editTasks: false,
    deleteTasks: false,
    
}


export const modalSlice = createSlice({
    name: 'modal_slice',
    initialState,
    reducers: {
        toggleAddBoard: (state, action) => {
            state.addNewBoard = action.payload
     }
  
    },
    
});
  

export const { toggleAddBoard } = modalSlice.actions;
export default modalSlice.reducer;

