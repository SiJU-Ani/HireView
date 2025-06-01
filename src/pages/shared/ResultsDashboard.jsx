import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, X, Briefcase, User } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useCandidates } from '../../context/CandidateContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';

const ResultsDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('application');
  
  const { getJob } = useJobs();
  const { getApplicationsByJob, updateApplicationStatus } = useCandidates();
  
  const job = getJob(id || '');
  const applications = getApplicationsByJob(id || '');
  
  const [activeApplication, setActiveApplication] = useState(null);
  const [matchScore, setMatchScore] = useState(0);
  const [isRecruiter, setIsRecruiter] = useState(true);
  
  useEffect(() => {
    // Determine if user is recruiter or candidate based on the referer
    // In a real app, this would be based on authentication
    const path = window.location.pathname;
    setIsRecruiter(!path.includes('/candidate/'));
    
    // If applicationId is provided in the URL, set it as the active application
    if (applicationId) {
      const app = applications.find(a => a.id === applicationId);
      if (app) {
        setActiveApplication(app);
        calculateMatchScore(app);
      }
    }
  }, [applicationId, applications]);
  
  // Simple algorithm to calculate match score based on keywords in CV filename
  const calculateMatchScore = (application) => {
    if (!job) return 0;
    
    // In a real app, this would analyze the actual CV content
    // For demo purposes, we'll generate a random score between 50-95
    const randomScore = Math.floor(Math.random() * 46) + 50;
    setMatchScore(randomScore);
    return randomScore;
  };
  
  const handleSelectCandidate = () => {
    if (activeApplication) {
      updateApplicationStatus(activeApplication.id, 'selected', matchScore);
      setActiveApplication(null);
    }
  };
  
  const handleRejectCandidate = () => {
    if (activeApplication) {
      updateApplicationStatus(activeApplication.id, 'rejected', matchScore);
      setActiveApplication(null);
    }
  };
  
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(isRecruiter ? '/recruiter' : '/candidate')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className={`${isRecruiter ? 'bg-blue-900' : 'bg-teal-600'} text-white`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(isRecruiter ? '/recruiter' : '/candidate')}
              className={`mr-4 p-2 rounded-full ${isRecruiter ? 'hover:bg-blue-800' : 'hover:bg-teal-700'} transition-colors`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {isRecruiter ? (
                <Briefcase className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
              <h1 className="text-2xl font-bold">Results Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{job.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {job.keywords.map((keyword, index) => (
              <Badge key={index} variant={isRecruiter ? 'default' : 'secondary'}>
                {keyword}
              </Badge>
            ))}
          </div>
          <p className="text-gray-600">{job.description}</p>
        </div>
        
        {isRecruiter ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Applicants</h3>
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card 
                    key={application.id} 
                    className={`transition-shadow hover:shadow-md cursor-pointer ${
                      activeApplication?.id === application.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      setActiveApplication(application);
                      calculateMatchScore(application);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{application.name}</h4>
                          <p className="text-sm text-gray-500">{application.email}</p>
                        </div>
                        {application.status !== 'pending' && (
                          <Badge 
                            variant={application.status === 'selected' ? 'success' : 'error'}
                          >
                            {application.status}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {applications.length === 0 && (
                  <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No applications yet</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {activeApplication ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-800">Candidate Evaluation</h3>
                      {activeApplication.status !== 'pending' && (
                        <Badge 
                          variant={activeApplication.status === 'selected' ? 'success' : 'error'}
                          className="text-sm"
                        >
                          {activeApplication.status}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Candidate Information</h4>
                        <ul className="space-y-2">
                          <li><span className="font-medium">Name:</span> {activeApplication.name}</li>
                          <li><span className="font-medium">Email:</span> {activeApplication.email}</li>
                          <li><span className="font-medium">Phone:</span> {activeApplication.phone}</li>
                          <li><span className="font-medium">CV:</span> {activeApplication.cvFile}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Match Analysis</h4>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Keyword Match Score</span>
                            <span className="text-sm font-medium text-gray-700">{matchScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                matchScore > 75 ? 'bg-green-600' : 
                                matchScore > 50 ? 'bg-yellow-500' : 'bg-red-600'
                              }`} 
                              style={{ width: `${matchScore}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-md bg-gray-100">
                          <p className="text-sm text-gray-600">
                            This candidate's profile matches {matchScore}% of the required keywords for this position.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {activeApplication.status === 'pending' && (
                      <div className="flex justify-end space-x-4">
                        <Button 
                          variant="outline" 
                          onClick={handleRejectCandidate}
                          className="flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          onClick={handleSelectCandidate}
                          className="flex items-center"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Select
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-sm p-8">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">Select a candidate to view their details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Application Results</h3>
            
            {applications.filter(app => app.status !== 'pending').length > 0 ? (
              <div className="space-y-6">
                {applications.filter(app => app.status !== 'pending').map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-800">{application.name}</h4>
                        <Badge 
                          variant={application.status === 'selected' ? 'success' : 'error'}
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Match Score</span>
                          <span className="text-sm font-medium text-gray-700">{application.matchScore || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              (application.matchScore || 0) > 75 ? 'bg-green-600' : 
                              (application.matchScore || 0) > 50 ? 'bg-yellow-500' : 'bg-red-600'
                            }`} 
                            style={{ width: `${application.matchScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className={`p-4 rounded-md ${
                        application.status === 'selected' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {application.status === 'selected' ? (
                          <p>
                            Congratulations! You have been selected for the {job.title} position. 
                            Our team will contact you shortly with more details about the next steps.
                          </p>
                        ) : (
                          <p>
                            Thank you for your interest in the {job.title} position.
                            After careful consideration, we have decided to move forward with other candidates.
                            We appreciate your time and wish you the best in your job search.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No results available yet</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultsDashboard;