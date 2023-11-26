let pokemonImageUrl = '';

function fetchRandomPokemonImage() {
  const randomPokemonId = Math.floor(Math.random() * 898) + 1;

  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      pokemonImageUrl = data.sprites.other['official-artwork'].front_default;
      updatePokemonCard(data);
    },
    error: function (err) {
      console.error('Error:', err);
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

$(document).ready(function () {
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

  fetchRandomPokemonImage();

  $('#generate-button').click(function () {
    fetchRandomPokemonImage();
  });
});
