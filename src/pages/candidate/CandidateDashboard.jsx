import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Briefcase } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useCandidates } from '../../context/CandidateContext';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const CandidateDashboard = () => {
  const { jobs } = useJobs();
  const { applications } = useCandidates();
  const navigate = useNavigate();
  
  // Filter applications for the current candidate (in a real app, we'd use authentication)
  const myApplications = applications;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Candidate Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-teal-700"
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
        {myApplications.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myApplications.map((application) => {
                const job = jobs.find(j => j.id === application.jobId);
                return (
                  <Card key={application.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-semibold text-teal-700">{job?.title || 'Unknown position'}</h3>
                        <Badge 
                          variant={
                            application.status === 'pending' ? 'outline' : 
                            application.status === 'selected' ? 'success' : 'error'
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">
                        Applied on {application.createdAt.toLocaleDateString()}
                      </p>
                      {application.status !== 'pending' && (
                        <div className="p-3 rounded-md bg-gray-100">
                          <p className="font-medium text-gray-800">
                            {application.status === 'selected' 
                              ? 'Congratulations! You have been selected for this position.'
                              : 'Thank you for your interest. We have selected other candidates for this position.'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t border-gray-100">
                      {application.status !== 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/results/${application.jobId}`)}
                          className="w-full"
                        >
                          View Results
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const hasApplied = myApplications.some(app => app.jobId === job.id);
              
              return (
                <Card 
                  key={job.id} 
                  className={`transform transition-all duration-300 hover:shadow-lg ${
                    !hasApplied ? 'hover:-translate-y-1 cursor-pointer' : ''
                  }`}
                  onClick={() => !hasApplied && navigate(`/candidate/job/${job.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="h-5 w-5 text-teal-600" />
                      <h3 className="text-xl font-semibold text-teal-700">{job.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                      Posted on {job.createdAt.toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">{keyword}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t border-gray-100">
                    {hasApplied ? (
                      <span className="text-sm font-medium text-teal-600">
                        You've already applied
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/candidate/job/${job.id}`)}
                      >
                        Apply Now
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CandidateDashboard;