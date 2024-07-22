import chromadb
from utils import query_raven
from api_specification_main.services.WeatherForecastAPIs_service import get_v1forecast

chroma_client = chromadb.PersistentClient(path="agenticprotocol/vectordb")

des1 = f'''
"""
Requires the latitude and longitude.
Set current_weather to True to get the weather.
Set hourly or daily based on preference.
"""
'''

doc1 = f'''
Function:
get_v1forecast(latitude: float, longitude: float, hourly: Optional[List[str]] = None, daily: Optional[List[str]] = None, current_weather: Optional[bool] = None, temperature_unit: Optional[str] = None, wind_speed_unit: Optional[str] = None, timeformat: Optional[str] = None, timezone: Optional[str] = None, past_days: Optional[int] = None, api_config_override: Optional[api_specification_main.api_config.APIConfig] = None) -> Dict[str, Any]
''' + des1

des2 = f'''
"""
Joke categories. Supports: Any, Misc, Programming, Dark, Pun, Spooky, Christmas.
"""
'''

doc2 = f'''
Function:
def give_joke(category : str):
''' + des2


collection = chroma_client.get_or_create_collection(name="marketplace")
collection.add(
    documents=[doc1, doc2],
    metadatas=[{"description": des1, "type": "native"}, {"description": des2, "type": "native"}],
    ids=[str(hash(doc1)), str(hash(doc2))]
)

user_query = "Hey how is the current weather and windspeed in New York?"

results = collection.query(
    query_texts=[user_query], 
    n_results=2, # how many results to return
    include=["embeddings", "metadatas", "documents", "distances"]
    # include=["documents"]
)
print(results["distances"])
prompt = ""
for items in results["documents"]:
    for item in items:
        prompt += str(item) + "\n"

prompt = prompt + f'''User Query: {user_query}<human_end>'''
print(prompt)

for item in results["metadatas"]:
    print(item[0]["description"])

# You are a senior software engineer.  You check whether a user query should be matched to a function call, you should also check the description of the function, not just based on the name of the function.  Your answer is concise and always either "Yes" or "No".


# call = query_raven(prompt)
# print (call)
# print()
# print(eval(call))


# print(collection.count())
