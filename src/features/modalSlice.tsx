import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ModalInitialState {
    addNewBoardToggle: boolean;
    editBoardToggle: boolean;
    deleteBoardToggle: boolean;
    addTasksToggle: boolean;
    editTasksToggle: boolean;
    deleteTasksToggle: boolean;
  
  }

const initialState: ModalInitialState = {
    addNewBoardToggle: false,
    editBoardToggle: false,
    deleteBoardToggle: false,
    addTasksToggle: false,
    editTasksToggle: false,
    deleteTasksToggle: false,
    
}


export const modalSlice = createSlice({
    name: 'modal_slice',
    initialState,
    reducers: {
        toggleCreateBoard: (state, action) => {
            state.addNewBoardToggle = action.payload;
        },
        toggleEditBoard: (state, action) => {
            state.editBoardToggle = action.payload
        }
  
    },
    
});
  

export const { toggleCreateBoard, toggleEditBoard } = modalSlice.actions;
export default modalSlice.reducer;

