import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './CandidateCards.css';
import Button from '../../components/ui/Button';

export default function CandidateCards() {
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
            console.log("Parsed CSV Data:", results.data); // Debug
            setCandidates(results.data);
            setFilteredCandidates(results.data);
          }
        });
      })
      .catch(error => {
        console.error("Error loading CSV:", error);
      });
  }, []);

  const handleFindCandidates = async () => {
    const query = prompt("Please enter the job description or query:");
    if (!query) return;

    try {
      const response = await fetch('http://localhost:8000/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      const enrichedCandidates = result.top_matches.map(match => ({
        ...match,
        similarity: match["Similarity (%)"]
      }));

      setFilteredCandidates(enrichedCandidates);
    } catch (error) {
      alert("Could not fetch candidates. Is the backend running?");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-center">
        <Button onClick={handleFindCandidates}>Find Suitable Candidates</Button>
      </div>

      {filteredCandidates.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No candidates to display.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate, index) => (
            <div className="bg-white p-4 rounded shadow" key={index}>
              <h2 className="text-xl font-bold">{candidate.Name}</h2>
              <p><strong>Similarity:</strong> {candidate.similarity || "N/A"}%</p>
              <p><strong>Email:</strong> {candidate.Email}</p>
              <p><strong>Phone:</strong> {candidate["Phone Number"]}</p>
              <p><strong>Address:</strong> {candidate.Address}</p>
              <p><strong>Skills:</strong> {candidate.Skills}</p>
              <p><strong>Experience:</strong> {candidate["Previous Work Experience"]}</p>
              <p><strong>Projects:</strong> {candidate.Projects}</p>
              <p><strong>Education:</strong> {candidate.Education}</p>
              <p><strong>Certifications:</strong> {candidate["Licenses and Certifications"]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
