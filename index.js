$(document).ready(function () {
  let pokemonImageUrl = ''; // Global variable to store the Pokémon image URL

  function fetchPokemonData(pokemon) {
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        pokemonImageUrl = data.sprites.other['official-artwork'].front_default;
        updatePokemonCard(data);
      },
      error: function () {
        alert('Pokémon not found. Please check the name and try again.');
      },
    });
  }

  function updatePokemonCard(data) {
    $('#pokemon-card img').attr('src', pokemonImageUrl);
    $('#pokemon-name').text(data.name);
    $('#pokemon-stats').empty();
    data.stats.forEach((stat) => {
      $('#pokemon-stats').append(`<p>${stat.stat.name}: ${stat.base_stat}</p>`);
    });
  }

  // Append the search box to #search-section
  const searchBoxRender = `
        <form id="search-form">
            <input type="text" id="search-input" placeholder="Search for Pokémon..." aria-label="Search Pokémon" />
            <button type="submit" id="search-button">Search</button>
        </form>
    `;
  $('#search-section').append(searchBoxRender);

  // Append the card structure to #interactive-area
  const cardRender = `
        <div class="card-container">
            <div class="card" id="pokemon-card">
                <div class="card-content front">
                    <img class="pokemon-image" src="https://via.placeholder.com/150" alt="Random Pokémon" />
                    <h2 id="pokemon-name">Pokémon Name</h2>
                </div>
                <div class="card-content back">
                    <h2>Pokémon Details</h2>
                    <div id="pokemon-stats"></div>
                </div>
            </div>
        </div>
        <button id="generate-button">Generate Random Pokémon</button>
    `;
  $('#interactive-area').append(cardRender);

  // Event listener for the generate button
  $('#generate-button').click(function () {
    const randomPokemonId = Math.floor(Math.random() * 898) + 1;
    fetchPokemonData(randomPokemonId);
  });

  // Event listener for the search form
  $('#search-form').submit(function (event) {
    event.preventDefault();
    const searchedPokemon = $('#search-input').val().toLowerCase();
    if (searchedPokemon) {
      fetchPokemonData(searchedPokemon);
    }
  });
});
