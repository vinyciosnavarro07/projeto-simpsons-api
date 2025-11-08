/**************************************************************************************************
 * Objetivo: Exibir os personagens da API The Simpsons API
 * Data: 05/11/2025
 * Autor: Vinycios Navarro
 * Versão: 1.0
 * URL da API: https://thesimpsonsapi.com/api/characters
 *************************************************************************************************/


let paginaAtual = 1; 


function setCreateCard(personagens) {
  const container = document.getElementById("cardPersonagens");

  personagens.forEach((personagem) => {
    const card = document.createElement("div");
    card.classList.add("caixa_personagem");

    
    const imgURL = personagem.portrait_path
      ? `https://cdn.thesimpsonsapi.com/500${personagem.portrait_path}`
      : "https://via.placeholder.com/150?text=Sem+Imagem";

    
    const curtidos = JSON.parse(localStorage.getItem("curtidos")) || [];
    const isCurtido = curtidos.includes(personagem.id);

    
    card.innerHTML = `
     <button class="btn-curtir ${isCurtido ? "curtido" : ""}" data-id="${personagem.id}">
        ${isCurtido ? "❤️ Curtido" : "🤍 Curtir"}
      </button>
      <figure class="caixa_imagem">
        <img src="${imgURL}" alt="${personagem.name}" title="${personagem.name}">
      </figure>
      <h2 class="caixa_titulo">${personagem.name}</h2>
      <div class="caixa_texto">
        <p><strong>Ocupação:</strong> ${personagem.occupation}</p>
        <p><strong>Idade:</strong> ${personagem.age || "Desconhecida"}</p>
        <p><strong>Frase:</strong> "${personagem.phrases[1] || "Sem frase"}"</p>
      </div>
    `;

    container.appendChild(card);
  });

  
  document.querySelectorAll(".btn-curtir").forEach((btn) => {
    btn.addEventListener("click", () => {
      const personagemId = parseInt(btn.getAttribute("data-id"));
      let curtidos = JSON.parse(localStorage.getItem("curtidos")) || [];

      if (curtidos.includes(personagemId)) {
        
        curtidos = curtidos.filter((id) => id !== personagemId);
        btn.classList.remove("curtido");
        btn.innerHTML = "🤍 Curtir";
      } else {
        
        curtidos.push(personagemId);
        btn.classList.add("curtido");
        btn.innerHTML = "❤️ Curtido";
      }

      
      localStorage.setItem("curtidos", JSON.stringify(curtidos));
    });
  });
}



async function getDadosPersonagensAPI(pagina = 1) {
  try {
    const response = await fetch(`https://thesimpsonsapi.com/api/characters?page=${pagina}`);
    const dados = await response.json();

    if (dados.results) {
      setCreateCard(dados.results);
      
      const btn = document.getElementById("btnVerMaisPersonagens");
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


document.getElementById("btnVerMaisPersonagens").addEventListener("click", () => {
  paginaAtual++;
  getDadosPersonagensAPI(paginaAtual);
});



window.addEventListener("load", getDadosPersonagensAPI);
