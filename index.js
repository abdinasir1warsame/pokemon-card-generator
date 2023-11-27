$(document).ready(function () {
  let pokemonImageUrl = '';

  function fetchPokemonData(pokemon) {
    $.ajax({
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        pokemonImageUrl = data.sprites.other['official-artwork'].front_default;
        updatePokemonCard(data);
        fetchPokemonSpecies(data.species.url, data); // Pass Pokémon data along for the additional info
      },
      error: function () {
        alert('Pokémon not found. Please check the name and try again.');
      },
    });
  }

  function fetchPokemonSpecies(speciesUrl, pokemonData) {
    $.ajax({
      url: speciesUrl,
      method: 'GET',
      dataType: 'json',
      success: function (speciesData) {
        updateAdditionalPokemonInfo(speciesData, pokemonData);
      },
      error: function () {
        console.error('Error fetching Pokémon species data.');
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

  function updateAdditionalPokemonInfo(speciesData, pokemonData) {
    let flavorTexts = new Set();
    speciesData.flavor_text_entries.forEach((entry) => {
      if (entry.language.name === 'en' && flavorTexts.size < 4) {
        flavorTexts.add(entry.flavor_text);
      }
    });

    let flavorTextsHtml = '';
    flavorTexts.forEach((text) => {
      flavorTextsHtml += `<p>${text}</p>`;
    });

    const profileContent = `
            <div class="profile-content">
                <div class="bio-titles">
                    <img src="${pokemonImageUrl}" alt="Pokémon Profile Image" class="profile-image" />
                    <h3 >Pokémon Bio</h3>
                </div>
                <div class="bio-description">${flavorTextsHtml}</div>
            </div>
        `;

    const pokemonInfo = `
            <section id="pokemon-info">
                <div class="info-section">
                    <article class="info-card">
                        <h3>Physical Attributes</h3>
                        <p>Height: ${
                          pokemonData.height * 0.1
                        } meters</p> <p> Weight: ${
      pokemonData.weight * 0.1
    }kg</p>
                    </article>
                    <article class="info-card">
                        <h3>Training Insights</h3>
                        <p>Base Experience: ${pokemonData.base_experience}</p>
                    </article>
                    <article class="info-card">
                        <h3>Battle Stats</h3>
                        <p>HP: ${
                          pokemonData.stats[0].base_stat
                        }</p> <p> Attack: ${
      pokemonData.stats[1].base_stat
    }</p> <p> Defense: ${pokemonData.stats[2].base_stat}</p>
                    </article>
                </div>
            </section>
        `;

    $('#pokemon-added-info').empty().append(profileContent).append(pokemonInfo);
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
                    <div class="pokemon-stats" id="pokemon-stats"></div>
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

  // Fetch Pikachu as the default Pokémon on page load
  fetchPokemonData(25);
});
