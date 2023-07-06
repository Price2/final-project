import React from 'react';
import Layout from "./components/Layout"
import { useAppDispatch, AppDispatch } from './app/store';
import { fetchBoards } from './features/boardSlice';
import BoardModal from './components/BoardModal';
import Home from './components/Home';
import WarningDialog from './components/WarningDialog';

function App() {

  const dispatch: AppDispatch = useAppDispatch();

  React.useEffect(() => {
           dispatch(fetchBoards())
      }, [dispatch])

  return (
    <Layout>
      <BoardModal />
      <Home />
      <WarningDialog/>
    </Layout>
  );
}

export default App;
