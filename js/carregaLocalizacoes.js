/**************************************************************************************************
 * Objetivo: Exibir os personagens da API The Simpsons API
 * Data: 05/11/2025
 * Autor: Vinycios Navarro
 * Versão: 1.0
 * URL da API: https://thesimpsonsapi.com/api/locations
 *************************************************************************************************/

let paginaAtual = 1;


function setCreateCard(localizacoes) {
    const container = document.getElementById("cardLocalizacoes");


    localizacoes.forEach((localizacao) => {
        const card = document.createElement("div");
        card.classList.add("caixa_localizacao");


        const imgURL = localizacao.image_path
            ? `https://cdn.thesimpsonsapi.com/500${localizacao.image_path}`
            : "https://via.placeholder.com/150?text=Sem+Imagem";

        const curtidos = JSON.parse(localStorage.getItem("curtidos")) || [];
        const isCurtido = curtidos.includes(localizacao.id);

        card.innerHTML = `
    <button class="btn-curtir ${isCurtido ? "curtido" : ""}" data-id="${localizacao.id}">
        ${isCurtido ? "❤️ Curtido" : "🤍 Curtir"}
      </button>
      <figure class="caixa_imagem">
        <img src="${imgURL}" alt="${localizacao.name}" title="${localizacao.name}">
      </figure>
      <h2 class="caixa_titulo">${localizacao.name}</h2>
      <div class="caixa_texto">
        <p><strong>Cidade:</strong> ${localizacao.town || "Desconhecida"}</p>
        <p><strong>Tipo de local:</strong> ${localizacao.use || "Desconhecido"}</p>
      </div>
    `;

        container.appendChild(card);
    });

    document.querySelectorAll(".btn-curtir").forEach((btn) => {
        btn.addEventListener("click", () => {
            const localizacaoId = parseInt(btn.getAttribute("data-id"));
            let curtidos = JSON.parse(localStorage.getItem("curtidos")) || [];

            if (curtidos.includes(localizacaoId)) {

                curtidos = curtidos.filter((id) => id !== localizacaoId);
                btn.classList.remove("curtido");
                btn.innerHTML = "🤍 Curtir";
            } else {

                curtidos.push(localizacaoId);
                btn.classList.add("curtido");
                btn.innerHTML = "❤️ Curtido";
            }


            localStorage.setItem("curtidos", JSON.stringify(curtidos));
        });
    });

}


async function getDadosLocalizacaoAPI(pagina = 1) {
    try {
        const response = await fetch(`https://thesimpsonsapi.com/api/locations?page=${pagina}`);
        const dados = await response.json();

        if (dados.results) {
            setCreateCard(dados.results);

            const btn = document.getElementById("btnVerMaisLocalizacoes");
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


document.getElementById("btnVerMaisLocalizacoes").addEventListener("click", () => {
    paginaAtual++;
    getDadosLocalizacaoAPI(paginaAtual);
});



window.addEventListener("load", getDadosLocalizacaoAPI);
