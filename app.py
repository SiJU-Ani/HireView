from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the dataset from the corrected path
df = pd.read_csv("public/data/data_analyst_candidates.csv")

# Combine relevant fields for text similarity
def preprocess_candidate(row):
    return " ".join([
        str(row["Skills"]),
        str(row["Previous Work Experience"]),
        str(row["Projects"]),
        str(row["Education"]),
        str(row["Licenses and Certifications"])
    ])

df["combined_text"] = df.apply(preprocess_candidate, axis=1)

# Fit the TF-IDF vectorizer
vectorizer = TfidfVectorizer()
candidate_vectors = vectorizer.fit_transform(df["combined_text"])

# Instantiate FastAPI
app = FastAPI()

# CORS settings to allow React frontend to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the query schema
class QueryRequest(BaseModel):
    query: str

# Endpoint to match candidates
@app.post("/match")
def match_candidates(req: QueryRequest):
    query_vector = vectorizer.transform([req.query])
    similarity_scores = cosine_similarity(query_vector, candidate_vectors).flatten()
    top_indices = similarity_scores.argsort()[::-1][:10]

    top_matches = df.iloc[top_indices].copy()
    top_matches["Similarity (%)"] = (similarity_scores[top_indices] * 100).round(2)

    return {
        "top_matches": top_matches.to_dict(orient="records")
    }
