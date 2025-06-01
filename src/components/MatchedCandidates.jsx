// src/components/MatchedCandidates.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Button from './ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import Badge from './ui/Badge';

const MatchedCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  useEffect(() => {
    fetch('/data/data_analyst_candidates.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setCandidates(results.data);
            setFilteredCandidates(results.data);
          }
        });
      });
  }, []);

  const handleFindCandidates = async () => {
    const query = prompt("Please enter the job description or query:");
    if (!query) return;

    try {
      const response = await fetch('http://localhost:8000/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      const enrichedCandidates = result.top_matches.map(match => ({
        ...match,
        similarity: match["Score"] ? (match["Score"] * 100).toFixed(2) : "N/A"
      }));

      setFilteredCandidates(enrichedCandidates);
    } catch (error) {
      alert("Could not fetch candidates. Is the backend running?");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div>
      <div className="mb-6 text-right">
        <Button onClick={handleFindCandidates}>Find Suitable Candidates</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-xl font-semibold text-blue-900">{candidate.Name}</h2>
              {candidate.similarity && (
                <Badge variant="success">Match: {candidate.similarity}%</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-gray-700">
              <p><strong>Email:</strong> {candidate.Email}</p>
              <p><strong>Phone:</strong> {candidate["Phone Number"]}</p>
              <p><strong>Skills:</strong> {candidate.Skills}</p>
              <p><strong>Experience:</strong> {candidate["Previous Work Experience"]}</p>
              <p><strong>Projects:</strong> {candidate.Projects}</p>
              <p><strong>Education:</strong> {candidate.Education}</p>
              <p><strong>Certifications:</strong> {candidate["Licenses and Certifications"]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MatchedCandidates;
