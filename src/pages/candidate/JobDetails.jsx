import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useCandidates } from '../../context/CandidateContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob } = useJobs();
  const { addApplication } = useCandidates();

  const job = getJob(id || '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/candidate')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!education.trim()) newErrors.education = 'Education is required';
    if (!file) {
      newErrors.file = 'CV is required';
    } else if (file.type !== 'application/pdf') {
      newErrors.file = 'Please upload a PDF file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      addApplication({
        jobId: job.id,
        name,
        email,
        phone,
        address,
        education,
        cvFile: file,
      });

      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full p-8 text-center">
          <CardContent className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for applying to "{job.title}". We will review your application and get back to you shortly.
            </p>
            <Button onClick={() => navigate('/candidate')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/candidate')}
              className="mr-4 p-2 rounded-full hover:bg-teal-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">Job Details</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-teal-700">{job.title}</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Posted on {job.createdAt.toLocaleDateString()}
              </p>
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{job.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {job.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Apply for this Position</h2>

              <form onSubmit={handleSubmit}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                />

                <Input
                  label="Address"
                  placeholder="123 Main St, City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  error={errors.address}
                />

                <Input
                  label="Education"
                  placeholder="B.Tech in Computer Science"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  error={errors.education}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload CV (PDF only)
                  </label>
                  <div className="flex">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  {errors.file && (
                    <p className="mt-1 text-xs text-red-500">{errors.file}</p>
                  )}
                  {file && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/candidate')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="secondary">
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
