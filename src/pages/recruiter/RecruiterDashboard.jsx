import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Briefcase, User, LogOut } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useCandidates } from '../../context/CandidateContext';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const RecruiterDashboard = () => {
  const { jobs } = useJobs();
  const { applications } = useCandidates();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-blue-800"
                onClick={() => navigate('/')}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-x-4">
            <button
              className={`px-4 py-2 font-medium rounded-md transition-colors ${
                activeTab === 'jobs' 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('jobs')}
            >
              Job Listings ({jobs.length})
            </button>
            <Button onClick={() => navigate('/recruiter/candidate-cards')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Applications
          </Button>
          </div>
          
          <Button onClick={() => navigate('/recruiter/add-job')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Job
          </Button>
        </div>

        {activeTab === 'jobs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-blue-900">{job.title}</h2>
                  <p className="text-sm text-gray-500">
                    Posted on {job.createdAt.toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.keywords.map((keyword, index) => (
                      <Badge key={index} variant="default">{keyword}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t border-gray-100">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {applications.filter(app => app.jobId === job.id).length} applications
                    </span>
                    <Link to={`/results/${job.id}`}>
                      <Button variant="outline" size="sm">
                        View Results
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => {
              const job = jobs.find(j => j.id === application.jobId);
              return (
                <Card key={application.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-blue-900">{application.name}</h2>
                      {application.status !== 'pending' && (
                        <Badge 
                          variant={application.status === 'selected' ? 'success' : 'error'}
                        >
                          {application.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Applied for: {job?.title || 'Unknown position'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><span className="font-medium">Email:</span> {application.email}</p>
                      <p><span className="font-medium">Phone:</span> {application.phone}</p>
                      <p><span className="font-medium">CV:</span> {application.cvFile}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t border-gray-100">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Applied on {application.createdAt.toLocaleDateString()}
                      </span>
                      {application.status === 'pending' ? (
                        <Link to={`/results/${application.jobId}?application=${application.id}`}>
                          <Button variant="secondary" size="sm">
                            Match
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-sm font-medium">
                          {application.matchScore ? `Match score: ${application.matchScore}%` : ''}
                        </span>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecruiterDashboard;