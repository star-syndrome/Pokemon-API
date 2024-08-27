let currentPage = 1;
const limit = 20; // Jumlah Pokémon per halaman

// Function to fetch Pokémon list with pagination
function fetchPokemon(page) {
	const offset = (page - 1) * limit;
	$.ajax({
		url: `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
		method: "GET",
		dataType: "json",
	})
		.done((response) => {
			let text = "";
			$.each(response.results, (key, val) => {
				text += /*html*/ `
                    <div class="card m-2 text-center border border-3 border-dark rounded-5">
                        <img
                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${
															offset + key + 1
														}.png"
                            class="card-img-top"
                            alt="${val.name}">
                        <div class="card-body text-capitalize">
                            <h4 id="namePoke">${val.name}</h4>
                            <button
                                type="button"
                                class="btn btn-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                                onclick="getPokemonDetails('${val.url}')">
                                Details
                            </button>
                        </div>
                    </div>`;
			});
			$("#pokemonCards").html(text);

			// Update pagination controls
			$("#pagination").html(/*html*/ `
                <button class="btn btn-primary ms-2 mb-3" onclick="prevPage()" ${
									currentPage === 1 ? "disabled" : ""
								}>Previous</button>
                <span class="fw-bold fs-5"> Page ${currentPage} </span>
                <button class="btn btn-primary me-2 mb-3" onclick="nextPage()">Next</button>
            `);
		})
		.fail((err) => {
			console.error("Error fetching Pokémon list: ", err);
		});
}

// Function for "Next" button
function nextPage() {
	currentPage++;
	fetchPokemon(currentPage);
}

// Function for "Previous" button
function prevPage() {
	if (currentPage > 1) {
		currentPage--;
		fetchPokemon(currentPage);
	}
}

// Initial fetch
fetchPokemon(currentPage);

// Fetch Pokémon details for modal
function getPokemonDetails(url) {
	$.ajax({
		url: url,
		method: "GET",
		dataType: "json",
	})
		.done((response) => {
			const abilities = response.abilities
				.map(
					(
						ability
					) => `<span class="text-bg-info badge rounded-pill text-capitalize">
                        ${ability.ability.name}
                    </span>`
				)
				.join(" ");

			const types = response.types
				.map(
					(
						type
					) => `<span class="text-bg-warning badge rounded-pill text-capitalize">
                        ${type.type.name}
                    </span>`
				)
				.join(" ");

			const maxStat = Math.max(...response.stats.map((stat) => stat.base_stat));
			const stats = response.stats
				.map(
					(stat) => /*html*/ `
                            <tr>
                                <td class="fw-bold">${stat.stat.name}</td>
                                <td>
                                    <div class="progress" style="height: 20px;">
                                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${
																					(stat.base_stat / maxStat) * 100
																				}%">
                                            ${stat.base_stat}
                                        </div>
                                    </div>
                                </td>
                            </tr>`
				)
				.join("");

			let text = /*html*/ `
                <div class="container text-center text-capitalize">
                    <h2>${response.name}</h2>
                    <img src="${
											response.sprites.other.home.front_default
										}" width="200px">
                    
                    <div class="container m-auto">    
                        <div class="row m-auto fw-bold">
                            <div class="p-1 bg-info col-sm-6 rounded-3">Abilities</div>
                            <div class="p-1 bg-warning col-sm-6 rounded-3">Types</div>
                        </div>
                    </div>

                    <div class="container m-auto"> 
                        <div class="row m-auto small">
                            <div class="p-2 col-sm-6">${abilities}</div>
                            <div class="p-2 col-sm-6">${types}</div>
                        </div>
                    </div>

                    <br>

                    <ul class="nav nav-tabs bg-light">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="tab" href="#info">Info</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#stats">Stats</a>
                        </li>
                    </ul>

                    <br>

                    <div class="tab-content text-center">
                        <div class="tab-pane container active" id="info">
                            <table class="table table-striped table-hover table-bordered table-info">
                                <tbody>
                                    <tr><td class="fw-bold">Height</td><td><span class="badge ${
																			response.height > 50
																				? "bg-danger"
																				: "bg-success"
																		}">${response.height}</td></tr>
                                    <tr><td class="fw-bold">Weight</td><td><span class="badge ${
																			response.weight > 500
																				? "bg-danger"
																				: "bg-success"
																		}">${response.weight}</td></tr>
                                    <tr><td class="fw-bold">Base Experience</td><td><span class="badge ${
																			response.base_experience > 200
																				? "bg-danger"
																				: "bg-success"
																		}">${response.base_experience}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="tab-pane container fade" id="stats">
                            <table class="table table-striped table-hover table-primary">
                                <tbody>${stats}</tbody>
                            </table>    
                        </div>
                    </div>
                </div>
            `;

			$("#pokemonBodies").html(text);
		})
		.fail((err) => {
			console.error("Error fetching Pokémon details:", err);
		});
}

// Searching Pokemon
function searchPokemon(search) {
	$(".card").each(function () {
		let pokeName = $(this).find("h4").text().toLowerCase();
		if (pokeName.includes(search.toLowerCase())) {
			$(this).show();
		} else {
			$(this).hide();
		}
	});
}

$("#searchItem").on("input", function () {
	let search = $(this).val().trim();
	searchPokemon(search);
});
