import requests
import app
from models import db, Pokemon, UserMon

URL = "https://pogoapi.net/api/v1/"
HASH_LINK = "api_hashes.json"
NAME_LINK = "pokemon_names.json"

# def check_api_hash(route):
#     "Check the API hash against the one stored in app to ensure up to date information"
#     res = requests.get(f"{URL}{HASH_LINK}")
#     curr_hash = res.json()
#     return (app.API_HASH == curr_hash[route]['hash_sha256'])
    

def populate_pokemon():
    "Add pokemon in the table"
    res = requests.get(f"{URL}{NAME_LINK}")
    list = res.json()
    for mon in list:
        pokemon = Pokemon(id = list[mon]['id'], name = list[mon]['name'])
        db.session.add(pokemon)
        db.session.commit()
    app.ADDED = True
    print("added pokemon")

