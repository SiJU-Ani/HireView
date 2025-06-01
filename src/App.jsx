import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { CandidateProvider } from './context/CandidateContext';
import LandingPage from './pages/LandingPage';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import AddJob from './pages/recruiter/AddJob';
import JobDetails from './pages/candidate/JobDetails';
import ResultsDashboard from './pages/shared/ResultsDashboard';
import CandidateCards from './pages/recruiter/CandidateCards';


function App() {
  return (
    <JobProvider>
      <CandidateProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/add-job" element={<AddJob />} />
              <Route path="/candidate" element={<CandidateDashboard />} />
              <Route path="/candidate/job/:id" element={<JobDetails />} />
              <Route path="/results/:id" element={<ResultsDashboard />} />
              <Route path="/recruiter/candidate-cards" element={<CandidateCards />} />
            </Routes>
          </div>
        </Router>
      </CandidateProvider>
    </JobProvider>
  );
}

export default App;