import os
import json
import faiss
import numpy as np
import pytesseract
from PIL import Image
import sys
import io

# Ensure UTF-8 encoding for stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def enhance_image(image):
    # Convert to grayscale
    grayscale = image.convert('L')
    # Increase contrast
    enhanced = grayscale.point(lambda x: 0 if x < 128 else 255, '1')
    return enhanced

def extract_text(image_path):
    try:
        # Open the image
        image = Image.open(image_path)
        # Enhance image for better OCR
        enhanced_image = enhance_image(image)
        # Configure pytesseract
        custom_config = r'--oem 3 --psm 6'
        # Extract text
        text = pytesseract.image_to_string(enhanced_image, config=custom_config)
        return text.strip()
    except Exception as e:
        print(f"Error processing image: {str(e)}", file=sys.stderr)
        return ""

def read_file_content(file_path):
    import PyPDF2
    import mammoth

    file_extension = os.path.splitext(file_path)[1].lower()
    content = ""
    if file_extension == ".txt":
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
    elif file_extension == ".pdf":
        # Implement PDF reading logic here
        pass
    elif file_extension in [".docx", ".doc"]:
        # Implement DOCX reading logic here
        pass
    elif file_extension == ".pdf":
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            content = ""
            for page in reader.pages:
                content += page.extract_text() + "\n"
    elif file_extension in [".docx", ".doc"]:
        with open(file_path, 'rb') as file:
            result = mammoth.extract_raw_text(file)
            content = result.value
    return content


def chunk_text(text, max_chunk_size=1000, overlap_size=100):
    chunks = []
    start_index = 0
    while start_index < len(text):
        end_index = min(start_index + max_chunk_size, len(text))
        if end_index < len(text):
            possible_break_points = [
                text.rfind(". ", end_index),
                text.rfind("\n", end_index),
                text.rfind(". \n", end_index)
            ]
            end_index = max([bp for bp in possible_break_points if bp > start_index], default=end_index)
        chunks.append(text[start_index:end_index])
        start_index = end_index - overlap_size
    return chunks

def store_embeddings(embeddings, metadata):
    index = faiss.IndexFlatL2(embeddings.shape[1])  # Create a FAISS index
    index.add(embeddings)  # Add embeddings to the index
    # Save metadata for each embedding
    with open('metadata.json', 'w') as f:
        json.dump(metadata, f)


def convert_query_to_embedding(query):
    # Placeholder for actual embedding logic
    return np.random.rand(1, 128).astype('float32')  # Example: random embedding


    # Create a FAISS index for retrieval
    index = faiss.IndexFlatL2(query_embedding.shape[1])  

    distances, indices = index.search(query_embedding, k=5)  # Retrieve top 5 nearest neighbors

    with open('metadata.json', 'r') as f:
        metadata = json.load(f)
    results = [metadata[i] for i in indices[0]]  # Retrieve metadata for the nearest neighbors

    return results


if __name__ == "__main__":
    # Example usage
    pass
