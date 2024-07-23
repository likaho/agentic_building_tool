from flask import Flask, request, jsonify
from openapiutils import  get_function_details, create_function_call, generate_open_api_services, remove_openapi_files, clean_url, generate_hash
import requests
import os
import json
from dotenv import load_dotenv
from flask_cors import CORS
import chromadb

load_dotenv()
chroma_db_path = os.getenv("CHROMA_DB_PATH")
collection_name = os.getenv("COLLECTION_NAME")

app = Flask(__name__)
CORS(app)

def delete_agent_or_chatflow(type: str, id: str):
  chroma_client = chromadb.PersistentClient(path=chroma_db_path)
  collection = chroma_client.get_or_create_collection(name=collection_name)
  results = collection.get(ids=[id])
  if len(results["ids"]) > 0:
    collection.delete(ids=[id])
    return jsonify({'id': id,'Success': f'{type} has been deleted'}), 204
  else:
    return jsonify({'id': id,'Error': f'{type} not found'}), 404

def create_agent_or_chatflow(type: str):
  if not request.is_json:
     return jsonify({'error': 'Request body must be JSON'}), 400
  else:
    name = request.json['name'].strip()
    description = request.json['description']  #e.g. Fetches weather data from the Open-Meteo API for the given latitude and longitude.
    query_type = request.json['query_type'] #e.g. str
    query_description = request.json['query_description'] #e.g. The name of the city.
    return_type = request.json['return_type'] #e.g. str
    return_description = request.json['return_description'] #e.g. The weather forecast.
    id = request.json['id']

    chroma_client = chromadb.PersistentClient(path=chroma_db_path)
    function_name = f"def {name}(query):"
    function_doc = \
    f'''
    Function:
    {function_name}
        """
        {description}

        Args:
        query ({query_type}): {query_description}

        Returns:
        {return_type}: {return_description}
        """
    '''
    hash = str(generate_hash(function_doc))
    doc_metadata = {"function_name": function_name, "hash": hash, "type": type}

    collection = chroma_client.get_or_create_collection(name=collection_name)
    collection.upsert(
        ids=[id],
        documents=[function_doc],
        metadatas=[doc_metadata]
    )

    return jsonify({'id': id,'Success': f'{type} has been created'}), 200

@app.route('/api/v1/agent', methods=['POST'])
def create_agent():
  return create_agent_or_chatflow("agent")
   
@app.route('/api/v1/chatflow', methods=['POST'])
def create_chatflow():
  return create_agent_or_chatflow("chatflow")

@app.route('/api/v1/agent/<id>', methods=['DELETE'])
def delete_agent(id: str):
  return delete_agent_or_chatflow("agent", id)

@app.route('/api/v1/chatflow/<id>', methods=['DELETE'])
def delete_chatflow(id: str):
  return delete_agent_or_chatflow("chatflow", id)

def chat_completion(user_query: str, chatId: str):
  # Forward a user query to a LLM  to Galadriel network
  json_body = {"question":user_query, "chatId": chatId }
  llm_url = os.getenv("GALADRIEL_URL")
  response = requests.post(llm_url, json = json_body)  
  return response

@app.route('/api/v1/prediction/123', methods=['POST'])
def useService():
  if not request.is_json:
     return jsonify({'error': 'Request body must be JSON'}), 400
  
  user_query = request.json['question']
  chatId = request.json['chatId']
  function_details = get_function_details(user_query)
  function_call = create_function_call(user_query, function_details["documents"])
  if "no_op" in function_call or "default" in function_call:
      print("no_op")
      response = chat_completion(user_query, chatId)      
      return response.json()
  else :
      # check if the parameters are valid
      print(f"function_call: {function_call}")
      id = function_details["ids"][0][0]
      marketplace_url = f"{os.getenv("MARKETPLACE_URL")}/{id}/"
      payload = json.dumps({"question":user_query, "chatId": str(chatId) })
      response = requests.post(marketplace_url, data=payload, headers={'Content-Type': 'application/json'})
      return response.json()
     
if __name__ == '__main__':
  app.run(debug=True)
