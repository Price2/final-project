import React from 'react';
import Layout from "./components/Layout"
import { useAppDispatch, AppDispatch } from './app/store';
import { fetchBoards } from './features/boardSlice';

function App() {

  const dispatch: AppDispatch = useAppDispatch();

  React.useEffect(() => {
           dispatch(fetchBoards())
      }, [dispatch])

  return (
    <Layout />
  );
}

export default App;
