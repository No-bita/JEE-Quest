
import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import PracticeInterface from '@/components/PracticeInterface';

const Practice: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  
  return (
    <>
      <NavBar />
      <PracticeInterface />
    </>
  );
};

export default Practice;
