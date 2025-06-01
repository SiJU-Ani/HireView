import React, { createContext, useState, useContext } from 'react';

const CandidateContext = createContext(undefined);

export const useCandidates = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidateProvider');
  }
  return context;
};

export const CandidateProvider = ({ children }) => {
  const [applications, setApplications] = useState([
    {
      id: '1',
      jobId: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      cvFile: 'John_Doe_CV.pdf',
      createdAt: new Date(),
      status: 'pending'
    },
    {
      id: '2',
      jobId: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      cvFile: 'Jane_Smith_CV.pdf',
      createdAt: new Date(),
      status: 'pending'
    },
  ]);

  const addApplication = (application) => {
    const newApplication = {
      ...application,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending',
    };
    setApplications([...applications, newApplication]);
  };

  const updateApplicationStatus = (id, status, matchScore) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status, matchScore } : app
    ));
  };

  const getApplicationsByJob = (jobId) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const getApplicationById = (id) => {
    return applications.find(app => app.id === id);
  };

  return (
    <CandidateContext.Provider value={{ 
      applications, 
      addApplication, 
      updateApplicationStatus, 
      getApplicationsByJob,
      getApplicationById
    }}>
      {children}
    </CandidateContext.Provider>
  );
};