const chk = document.getElementById('chk')

chk.addEventListener('change', () => {
    document.body.classList.toggle('dark')
})

const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;
var pokemonLista = {};
let numeroPokemon = 0;
tipoPokemon = '';


var modal = document.getElementById("pokemonModal");
var contentModal = document.getElementById("modal-content");
var close = document.getElementsByClassName("close")[0];


close.onclick = function() {
    modal.style.display = "none";
    contentModal.classList.remove(tipoPokemon); 
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        contentModal.classList.remove(tipoPokemon); 
    }
}

function pokemonModalOPen(pokemonNumber){
    numeroPokemon = pokemonNumber;
    var poke = pokemonLista.find(p => p.number == pokemonNumber);
    if(poke != null){
        tipoPokemon = poke.type;
        modal.style.display = "block";
        contentModal.classList.add(poke.type); 
        contentModal.innerHTML += `<ol class="stats">
                                            ${poke.stats.map((stat) => `<li>${stat.name}:  ${stat.base_stat}</li>`).join('')}
                                        </ol>`
        contentModal.innerHTML = ""
        contentModal.innerHTML += `<main class="tab-modal">
                                            <h3>${poke.name}</h3>
                                            <img src="${poke.photo}">
                                            <ol class="stats-modal">
                                                ${poke.types.map((type) => `<li class="${type+"-modal"}">${type}</li>`).join('')}
                                            </ol>
                                            </br>
                                            <div class="status">
                                                <input id="tab1" type="radio" name="tabs">
                                                <label for="tab1">Movimentos</label>
                                                <input id="tab2" type="radio" name="tabs" checked>
                                                <label for="tab2">Status</label>
                                             
                                        
                                                <section id="content1">
                                                    <ol class="movimentos-modal">
                                                        ${poke.moves.map((move) => `<li> | ${move} | </li>`).join('')}
                                                    </ol>
                                                </section>
                                                <section id="content2">
                                                    <ol>
                                                        ${poke.stats.map((stat) => `<li class="stats-progress"><span class="stat-name">${stat.name}:</span><div class="progress-hp"><progress value="${stat.base_stat}" max="100" style="--progressColor: ${corProgressBar(stat.base_stat)};"></progress><span style="margin-left: 10px">${stat.base_stat}</span></div></li> `).join('')}
                                                    </ol>
                                                </section>
                                                <section id="content3">
                                                    <ol>
                                                        ${poke.citys.map((city) => `<li class="cidades"><span>${city.city}:</span> <span>${city.chance}%</span></li>`).join('')}
                                                    </ol>
                                                </section>
                                            </div>
                                        </main>`
    }
}

function corProgressBar(hp) {
    if(hp < 40){
        return 'red'
    }else if(hp > 40 && hp < 75){
        return 'orange'
    }else{
        return 'green'
    }
}

function convertPokemonToLi(pokemon) {
    // console.log(pokemon);
    return `
        <li onclick="pokemonModalOPen(${pokemon.number})" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            

            <div class="detail">
                <span class="name">${pokemon.name}</span>
                

                <img src="${pokemon.photo}"
                    alt="${pokemon.name}">
                
                <ol class="stats-modal">
                    ${pokemon.types.map((type) => `<li class="${type+"-modal"}">${type}</li>`).join('')}
                </ol>
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonLista = pokemons;
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})