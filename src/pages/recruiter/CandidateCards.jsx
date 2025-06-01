import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import './CandidateCards.css';

export default function CandidateCards() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const navigate = useNavigate();

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
      const topCandidateEmails = result.top_matches.map(candidate => candidate.Email);

      const enrichedCandidates = result.top_matches.map(match => ({
        ...match,
        similarity: match["Similarity (%)"]
      }));

      const topCandidates = enrichedCandidates.filter(c =>
        topCandidateEmails.includes(c.Email)
      );

      setFilteredCandidates(topCandidates);
    } catch (error) {
      alert("Could not fetch candidates. Is the backend running?");
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="header flex justify-between items-center mb-6">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <button className="query-button" onClick={handleFindCandidates}>Find Suitable Candidates</button>
      </div>

      {filteredCandidates.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No candidates to display.</p>
      ) : (
        <div className="card-grid">
          {filteredCandidates.map((candidate, index) => (
            <div className="card" key={index}>
              <h2>{candidate.Name}</h2>
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
