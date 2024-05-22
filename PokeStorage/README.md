Title:
Poke-store

URL:
https://springboard-poke-store.onrender.com

Details:
A place to keep a record of Pokemon, their IV and CP for players of Pokemon GO.  When users log in, they can choose Pokemon from a list to add to their storage for future reference.  Later iterations will include search functions based on IV, move sets, types, and viability rating for online play.

Flow:
Users login, or sign up, and navigate to the "all pokemon" page.  From here they can "add" a pokemon to their storage, setting the IV and CP.  On the users home page, they are presented with a list of their pokemon, sorted in descending order by CP.  These can be edited or deleted.

Technology Stack:
- Python
- WTForms
- Jinja
- Flask
- Flask-SQLAlchemy
- FLask-Bcrypt

Capstone 1
Pokemon Go Tool

Goal:
Provide a tool for Pokemon Go users to make data-driven decisions within the game.  Allow users to store information about the pokemon they currently have, allowing for easier team building decisions, and faster comparisons.  Provide counter recommendations, given a particular opponent.

Demographic:
Pokemon Go players who play at a more-than-casual level.  Players who are looking for external tools to simplify their decision making, but players who don’t have the time or patience to learn or memorize the information necessary for high level play.  Players who want to play better.

API:
https://pogoapi.net/
PoGo API

Necessary API Routes:
/api/v1/pokemon_types.json - Retrieve type data
/api/v1/type_effectiveness.json - Retrieve type effectiveness’
/api/v1/api_hashes.json - check hash for updates/changes

Details:
Users will need an account to store data about their specific collection, the data on the monsters from the API should be fetched and stored locally to speed up the searches.  Users page will show the pokemon they currently have saved within the program.  A separate page can be made for counter recommendations.  The name of the opponent can be typed in, with autocomplete similar to the fruit search app created in a previous assignment.  This will pull up a page with the name of the monster, the types, and recommended counters based on types and effectiveness.  The option of highlighting recommendations based on what the user has registered in the program could be added as well.

There would be a need to hash the user’s password for protection, but that is the only piece of sensitive information.

Views:
/user - Show user page with pokemon list
/login, /signup - login/signup pages with required forms
/user/pokemon/details - Show details on given pokemon, ability to edit, delete
/pokemon - display all 
/user/pokemon/add - page to customize adding pokemon to user list
—--
/counters - Find raid counters, input box to type in name of boss
