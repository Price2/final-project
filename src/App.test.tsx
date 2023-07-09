import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';


//=====User interaction test to test when all boards are loaded, click on a board that contains lists and check the list if it exists======

// const BoardsApp = () => {
//   return (<Provider store={store}>
//     <App />
//   </Provider>
//   )
// }
// test('renders learn react link', async () => {
//   render(BoardsApp());
//   const initialLoad = await waitFor(() => screen.getByText(/test withlists/i));
//   fireEvent.click(initialLoad)
//   const listsRendered = await waitFor(() => screen.getByText(/newlistwithouttasks/i));
//   expect(initialLoad).toBeInTheDocument();
//   expect(listsRendered).toBeInTheDocument();
// });
//====================================================================================================================

import boardReducer, {
  RootObject,
  fetchBoards,
  fetchSelectedBoard,
  
} from "./features/boardSlice";

import initialState from "./features/boardSlice"


  it("Should be able to fetch all boards and select first board as default selected", async () => {
    // Saving previous state
    const previousBoardsState = store.getState().boards;

    // Dispatching the action to fetch all boards, then select the first board from all boards, fetch its contents and set it as the selected board (all from dispatch)

    const AllBoards = await store.dispatch<any>(fetchBoards());
    const selectedBoard = await store.dispatch(fetchSelectedBoard(AllBoards.payload[0].id));

    // Receiving the board selected from response 
    const boardSelected = selectedBoard.payload;
    const state = store.getState().boards;

    // Comparing the board selected from response with the store's selected board and comparing lists lengths
    expect(boardSelected).toEqual(state.selectedBoard[0]);
    expect(boardSelected.lists.length).toEqual(state.selectedBoard[0].lists.length);
  });