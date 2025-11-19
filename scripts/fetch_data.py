import csv
import json
import random
import urllib.request
from pathlib import Path

# URL for the raw CSV file
# Using a known reliable source or the one found. 
# If this fails, we will fallback to synthetic data.
DATASET_URL = "https://raw.githubusercontent.com/Ankit152/IMDB-sentiment-analysis/master/IMDB-Dataset.csv"

OUTPUT_FILE = Path("data/real_world_sentiment.jsonl")

def download_and_process():
    print(f"Downloading dataset from {DATASET_URL}...")
    try:
        with urllib.request.urlopen(DATASET_URL) as response:
            content = response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to download: {e}")
        return

    print("Processing CSV data...")
    csv_reader = csv.DictReader(content.splitlines())
    
    # Read all rows
    rows = list(csv_reader)
    print(f"Total rows found: {len(rows)}")
    
    # Sample 100 rows
    sample_size = min(100, len(rows))
    sampled_rows = random.sample(rows, sample_size)
    
    print(f"Sampling {sample_size} rows...")
    
    # Convert to JSONL
    with OUTPUT_FILE.open("w", encoding="utf-8") as f:
        for i, row in enumerate(sampled_rows):
            # Map CSV columns to our format
            # CSV usually has 'review' and 'sentiment'
            text = row.get('review', row.get('text', ''))
            label = row.get('sentiment', row.get('label', ''))
            
            if not text or not label:
                continue
                
            record = {
                "id": i + 1,
                "text": text[:1000], # Truncate very long reviews
                "label": label
            }
            f.write(json.dumps(record) + "\n")
            
    print(f"Saved {sample_size} records to {OUTPUT_FILE}")

if __name__ == "__main__":
    download_and_process()
