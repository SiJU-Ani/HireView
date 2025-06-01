import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Badge from '../../components/ui/Badge';

const AddJob = () => {
  const { addJob } = useJobs();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [errors, setErrors] = useState({});

  const handleAddKeyword = () => {
    if (keyword.trim()) {
      if (!keywords.includes(keyword.trim())) {
        setKeywords([...keywords, keyword.trim()]);
      }
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Job description is required';
    }
    
    if (keywords.length === 0) {
      newErrors.keywords = 'At least one keyword is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addJob({
        title,
        description,
        keywords
      });
      
      navigate('/recruiter');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/recruiter')}
              className="mr-4 p-2 rounded-full hover:bg-blue-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">Add New Job</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <Input
              label="Job Title"
              placeholder="e.g., Senior Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />
            
            <TextArea
              label="Job Description"
              placeholder="Describe the job responsibilities, requirements, and other details..."
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords
              </label>
              <div className="flex">
                <Input
                  placeholder="e.g., React, TypeScript, Frontend"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="mb-0"
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  type="button" 
                  onClick={handleAddKeyword}
                  className="ml-2"
                  disabled={!keyword.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.keywords && <p className="mt-1 text-sm text-red-600">{errors.keywords}</p>}
              
              {keywords.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {keywords.map((kw, index) => (
                    <div key={index} className="group relative">
                      <Badge variant="default" className="pr-6">
                        {kw}
                        <button 
                          type="button"
                          onClick={() => handleRemoveKeyword(index)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/recruiter')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Job
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddJob;