import React from 'react';
import { useParams } from 'react-router-dom';
import CVBuilderWizard from '../components/CVBuilder/CVBuilderWizard';

const CVBuilderPage = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <CVBuilderWizard cvId={id} />
    </div>
  );
};

export default CVBuilderPage;
