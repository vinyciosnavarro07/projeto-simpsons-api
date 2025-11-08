/**************************************************************************************************
 * Objetivo: Exibir os personagens da API The Simpsons API
 * Data: 05/11/2025
 * Autor: Vinycios Navarro
 * Versão: 1.0
 * URL da API: https://thesimpsonsapi.com/api/episodes
 *************************************************************************************************/

async function traduzirTexto(texto) {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt`);
    const data = await response.json();
    return data.responseData.translatedText || texto;
}

let paginaAtual = 1;

function setCreateCard(episodios) {
    const container = document.getElementById("cardEpisodios");


    episodios.forEach((epsodio) => {
        const card = document.createElement("div");
        card.classList.add("caixa_episodios");


        const imgURL = epsodio.image_path
            ? `https://cdn.thesimpsonsapi.com/500${epsodio.image_path}`
            : "https://via.placeholder.com/150?text=Sem+Imagem";

        const curtidos = JSON.parse(localStorage.getItem("curtidos")) || [];
        const isCurtido = curtidos.includes(epsodio.id);


        card.innerHTML = `
    <button class="btn-curtir ${isCurtido ? "curtido" : ""}" data-id="${epsodio.id}">
        ${isCurtido ? "❤️ Curtido" : "🤍 Curtir"}
      </button>
      <figure class="caixa_imagem">
        <img src="${imgURL}" alt="${epsodio.name}" title="${epsodio.name}">
      </figure>
      <h2 class="caixa_titulo">${epsodio.name}</h2>
      <div class="caixa_texto">
        <p><strong>Numero:</strong> ${epsodio.episode_number}</p>
        <p><strong>Temporada:</strong> ${epsodio.season}</p>
      </div>
    `;

        container.appendChild(card);
    });

    document.querySelectorAll(".btn-curtir").forEach((btn) => {
        btn.addEventListener("click", () => {
            const epsodioId = parseInt(btn.getAttribute("data-id"));
            let curtidos = JSON.parse(localStorage.getItem("curtidos")) || [];

            if (curtidos.includes(epsodioId)) {

                curtidos = curtidos.filter((id) => id !== epsodioId);
                btn.classList.remove("curtido");
                btn.innerHTML = "🤍 Curtir";
            } else {

                curtidos.push(epsodioId);
                btn.classList.add("curtido");
                btn.innerHTML = "❤️ Curtido";
            }


            localStorage.setItem("curtidos", JSON.stringify(curtidos));
        });
    });
}


async function getDadosEpisodiosAPI(pagina = 1) {
    try {
        const response = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${pagina}`);
        const dados = await response.json();

        if (dados.results) {
            setCreateCard(dados.results);

            const btn = document.getElementById("btnVerMaisEpisodios");
            if (dados.next) {
                btn.style.display = "block";
            } else {
                btn.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Erro ao buscar personagens:", error);
    }
}


document.getElementById("btnVerMaisEpisodios").addEventListener("click", () => {
    paginaAtual++;
    getDadosEpisodiosAPI(paginaAtual);
});



window.addEventListener("load", getDadosEpisodiosAPI);
