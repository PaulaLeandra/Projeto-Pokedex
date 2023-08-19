

const pokeApi = {}
const pokeApiCity = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.weight = pokeDetail.weight
    pokemon.base_experience = pokeDetail.base_experience

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.abilities = pokeDetail.abilities.map((a) => a.ability.name);
    pokemon.moves = pokeDetail.moves.map((m) => m.move.name);


    pokeDetail.stats.map((stat) => {
        pokeStats = {
            base_stat: stat.base_stat,
            name: stat.stat.name
        }

        pokemon.stats.push(pokeStats)
    })

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokeApiCity.getPokemonsCity(pokeDetail.id).then((pokemonCitys = []) => {
        pokemonCitys.map((map) => {
            [chance] = map.version_details.map((c) => c.max_chance)
            pokeCity = {
                city: map.location_area.name,
                chance: chance
            }
    
            pokemon.citys.push(pokeCity)
        })
    })

    return pokemon
}



pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApiCity.getPokemonsCity = (id = 0) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/encounters`

    return fetch(url)
    .then((response) => response.json())
}