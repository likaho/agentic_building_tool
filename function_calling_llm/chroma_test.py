from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
import chromadb

# Define your documents as a list of dictionaries
documents = [
    {"text": "This is the first document."},
    {"text": "This is the second document with some content."},
]

documents = [Document(page_content=doc["text"]) for doc in documents]

# Create an embedding model (optional)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Create a Chroma client with your collection name and data directory
client = Chroma.from_documents(
    documents=documents, embedding=embeddings, collection_name="my_collection", persist_directory="vectordb"
)

# Persist the data to disk
client.persist()



