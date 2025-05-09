function displayPokeDex(pokemonList){

    let display = "<div>";
    
    pokemonList.forEach(pokemon => {
        display += `<div class='cards'>`;
        display += `<strong>${pokemon.name}</strong><br>`
        display += `${pokemon.id}<br>`;
        display += `${pokemon.types}<br>`;
        display += `</div>0`;
    });
    display += "</div>";
    document.getElementById("display").innerHTML = display;
    
}


window.addEventListener("DOMContentLoaded", () => { // Can be revised???
    fetch("/pokemon-data")
        .then(res => res.json())
        .then(pokemons => {
            displayPokeDex(pokemons);
        })
        .catch(err => console.error("Failed to load Pokémon data", err));
});