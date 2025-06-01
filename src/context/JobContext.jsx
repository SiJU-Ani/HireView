import React, { createContext, useState, useContext } from 'react';

const JobContext = createContext(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([
    {
      id: '1',
      title: 'Frontend Developer',
      description: 'We are looking for a talented Frontend Developer to join our team. The ideal candidate should have experience with React, TypeScript, and modern CSS frameworks.',
      keywords: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'UX Designer',
      description: 'Join our design team to create beautiful and functional user interfaces. You should have a strong portfolio and experience with Figma.',
      keywords: ['UX', 'UI', 'Figma', 'Design', 'Prototyping'],
      createdAt: new Date(),
    },
  ]);

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setJobs([...jobs, newJob]);
  };

  const getJob = (id) => {
    return jobs.find(job => job.id === id);
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, getJob }}>
      {children}
    </JobContext.Provider>
  );
};