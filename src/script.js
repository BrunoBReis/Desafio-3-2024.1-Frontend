// Seleciona os elementos do HTML
const uf = document.getElementById("uf");
const municipiosTableBody = document.querySelector("#municipiosTable tbody");

// Função para validar a resposta da requisição
function validateResponse(response) {
  if (!response.ok) {
    throw new Error(`Erro HTTP! status: ${response.status}`);
  }
  return response.json();
}

// Função para adicionar os estados no select
const addStates = (states) => {
  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.sigla;
    option.innerText = state.nome;
    uf.appendChild(option);
  });
};

// Função para processar os dados recebidos da API (estados)
const fetchData = (data) => {
  addStates(data);
};

// Função para buscar os estados na API
const fetchStates = () => {
  const url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";
  fetch(url)
    .then(validateResponse)
    .then(fetchData)
    .catch((error) => {
      console.error("Erro na requisição", error);
    });
};

fetchStates();

// Função para preencher a tabela com os municípios
const populateMunicipiosTable = (municipios) => {
  // Limpa as linhas existentes na tabela
  municipiosTableBody.innerHTML = "";

  // Itera sobre o array de municípios em passos de 3 (para criar 3 colunas por linha)
  for (let i = 0; i < municipios.length; i += 3) {
    const row = document.createElement("tr");

    // Cria três células para cada linha
    for (let j = 0; j < 3; j++) {
      let municipioAtual = i + j;
      const cell = document.createElement("td");
      // Verifica se existe um município no índice atual
      if (municipios[municipioAtual]) {
        cell.innerText = municipios[municipioAtual].nome;
      } else {
        // Caso não exista, deixa a célula vazia
        cell.innerText = "";
      }
      row.appendChild(cell);
    }

    // Adiciona a linha criada no corpo da tabela
    municipiosTableBody.appendChild(row);
  }
};

// Função para buscar os municípios na API para a UF selecionada
const fetchMunicipios = () => {
  // Verifica se a UF foi selecionada; se não, limpa a tabela e interrompe a execução
  if (!uf.value) {
    municipiosTableBody.innerHTML = "";
    return;
  }
  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.value}/municipios`;
  fetch(url)
    .then(validateResponse)
    .then(populateMunicipiosTable)
    .catch((error) => {console.error("Erro na requisição", error);
    });
};

// Quando o valor do select de UF mudar, chama a função fetchMunicipios
uf.addEventListener("change", fetchMunicipios);
