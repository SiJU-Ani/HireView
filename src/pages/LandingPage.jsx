import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, User } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 animate-fade-in">
          Talent Connect
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Connecting exceptional talent with outstanding opportunities.
          Choose your path to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card 
          className="group transform transition-all duration-300 hover:scale-105"
          onClick={() => navigate('/recruiter')}
        >
          <CardContent className="p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
              <Briefcase className="w-8 h-8 text-blue-900" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-900 mb-3">Recruiter</h2>
            <p className="text-gray-600 text-center">
              Post job opportunities, review applications, and find the perfect candidates for your team.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="group transform transition-all duration-300 hover:scale-105"
          onClick={() => navigate('/candidate')}
        >
          <CardContent className="p-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-colors">
              <User className="w-8 h-8 text-teal-700" />
            </div>
            <h2 className="text-2xl font-semibold text-teal-700 mb-3">Candidate</h2>
            <p className="text-gray-600 text-center">
              Discover exciting opportunities, apply with ease, and track your application status.
            </p>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Talent Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;