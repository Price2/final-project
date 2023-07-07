import React from 'react';
import Layout from "./components/Layout"
import { useAppDispatch, AppDispatch } from './app/store';
import { fetchBoards, fetchSelectedBoard } from './features/boardSlice';
import BoardModal from './components/BoardModal';
import Home from './components/Home';
import WarningDialog from './components/WarningDialog';
import TaskModalAdd from './components/TaskModalAdd';
function App() {

  const dispatch: AppDispatch = useAppDispatch();

  React.useEffect(() => {
    const fetchOnLoad = async () => {
      const AllBoards = await dispatch<any>(fetchBoards())
      const setSelectedBoard = await dispatch(fetchSelectedBoard(AllBoards.payload[0].id))
    }
    fetchOnLoad()
      }, [dispatch])

  return (
    <Layout>
      <BoardModal />
      <TaskModalAdd/>
      <Home />
      <WarningDialog/>
    </Layout>
  );
}

export default App;
