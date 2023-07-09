import React from 'react';
import Layout from "./components/Layout"
import { useAppDispatch, AppDispatch } from './app/store';
import { fetchBoards, fetchSelectedBoard } from './features/boardSlice';
import BoardModal from './components/BoardModal';
import Home from './components/Home';
import WarningDialog from './components/WarningDialog';
import TaskModalAdd from './components/TaskModalAdd';
import TaskModalViewEdit from './components/TaskModalViewEdit';
import WarningDialogTask from './components/WarningDialogTask';
function App() {

  const dispatch: AppDispatch = useAppDispatch();

  React.useEffect(() => {
    // On Load, fetch all my boards from API by dispatcher (fetchBoards), then select the first board from response and fetch its contents 
    // (because fetching all boards does not retreive the board's cards/tasks information) then set this board as the selected default board (dispatcher handles the selected board, fetchSelectedBoard)
    const fetchOnLoad = async () => {
      const AllBoards = await dispatch<any>(fetchBoards())
      await dispatch(fetchSelectedBoard(AllBoards.payload[0].id))
    }
    fetchOnLoad()
      }, [dispatch])

  return (
    <Layout>
      <BoardModal />
      <TaskModalAdd />
      <WarningDialogTask/>
      <TaskModalViewEdit/>
      <Home />
      <WarningDialog/>
    </Layout>
  );
}

export default App;
