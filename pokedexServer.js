const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const router = express.Router();

class Pokemon {
    constructor(name, id, image, types) {
        this.name = name;
        this.id = id;
        this.image = image;
        this.types = types;
    }
}

const app = express();
const portNumber = 5000; // Any port

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
let pokemonList = [];

async function fetchPokemons(){
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
      
    if (!response.ok) {
        return res.status(404).send("Pokémon not found");
    }

    const data = await response.json();
    console.log(data);
    
        pokemonList = await Promise.all(
        data.results.map(async (entry) => {
            const pokeResponse = await fetch(entry.url);
            const pokeData = await pokeResponse.json();
      
            return new Pokemon(
                pokeData.name,
                pokeData.id,
                pokeData.sprites.front_default,
                pokeData.types.map(t => t.type.name)
            );
        })
    );
    return pokemonList;
}
router.get("/", async (req, res) => {
    try {
        if (pokemonList.length === 0) {
            console.log("Fetching Pokémon list...");
            pokemonList = await fetchPokemons(); 
        }
        
        res.render("pokedex", { pokemonList });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching Pokémon data");
    }
});
router.get("/pokemon-data", async (req, res) => {
    try {
        if (pokemonList.length === 0) {
            console.log("Fetching Pokémon list...");
            pokemonList = await fetchPokemons(); 
        }

        res.json(pokemonList); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching Pokémon data");
    }
});


  // Mount the router
app.use("/", router);

// Start the server to listen on the specified port
app.listen(portNumber, () => {
    console.log(`Web server started and running at http://localhost:${portNumber}`);
});