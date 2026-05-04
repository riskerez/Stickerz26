let currentPage = "grupos";
let editMode = {};

// NORMALIZAÇÃO
function normalize(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// DADOS
const grupos = {
  A: ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
  B: ["Canadá", "Bósnia", "Catar", "Suíça"],
  C: ["Brasil", "Marrocos", "Haiti", "Escócia"],
  D: ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
  E: ["Alemanha", "Curaçao", "Costa do Marfim", "Equador"],
  F: ["Holanda", "Japão", "Suécia", "Tunísia"],
  G: ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
  H: ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
  I: ["França", "Senegal", "Iraque", "Noruega"],
  J: ["Argentina", "Argélia", "Áustria", "Jordânia"],
  K: ["Portugal", "Congo", "Uzbequistão", "Colômbia"],
  L: ["Inglaterra", "Croácia", "Gana", "Panamá"]
};

// SIGLA + PAGINA
const info = {
  "México": { sigla: "MEX", page: 8 },
  "África do Sul": { sigla: "RSA", page: 10 },
  "Coreia do Sul": { sigla: "KOR", page: 12 },
  "República Tcheca": { sigla: "CZE", page: 14 },
  "Canadá": { sigla: "CAN", page: 16 },
  "Bósnia": { sigla: "BIH", page: 18 },
  "Catar": { sigla: "QAT", page: 20 },
  "Suíça": { sigla: "SUI", page: 22 },
  "Brasil": { sigla: "BRA", page: 24 },
  "Marrocos": { sigla: "MAR", page: 26 },
  "Haiti": { sigla: "HAI", page: 28 },
  "Escócia": { sigla: "SCO", page: 30 },
  "Estados Unidos": { sigla: "USA", page: 32 },
  "Paraguai": { sigla: "PAR", page: 34 },
  "Austrália": { sigla: "AUS", page: 36 },
  "Turquia": { sigla: "TUR", page: 38 },
  "Alemanha": { sigla: "GER", page: 40 },
  "Curaçao": { sigla: "CUW", page: 42 },
  "Costa do Marfim": { sigla: "CIV", page: 44 },
  "Equador": { sigla: "ECU", page: 46 },
  "Holanda": { sigla: "NED", page: 48 },
  "Japão": { sigla: "JPN", page: 50 },
  "Suécia": { sigla: "SWE", page: 52 },
  "Tunísia": { sigla: "TUN", page: 54 },
  "Bélgica": { sigla: "BEL", page: 58 },
  "Egito": { sigla: "EGY", page: 60 },
  "Irã": { sigla: "IRN", page: 62 },
  "Nova Zelândia": { sigla: "NZL", page: 64 },
  "Espanha": { sigla: "ESP", page: 66 },
  "Cabo Verde": { sigla: "CPV", page: 68 },
  "Arábia Saudita": { sigla: "KSA", page: 70 },
  "Uruguai": { sigla: "URU", page: 72 },
  "França": { sigla: "FRA", page: 74 },
  "Senegal": { sigla: "SEN", page: 76 },
  "Iraque": { sigla: "IRQ", page: 78 },
  "Noruega": { sigla: "NOR", page: 80 },
  "Argentina": { sigla: "ARG", page: 82 },
  "Argélia": { sigla: "ALG", page: 84 },
  "Áustria": { sigla: "AUT", page: 86 },
  "Jordânia": { sigla: "JOR", page: 88 },
  "Portugal": { sigla: "POR", page: 90 },
  "Congo": { sigla: "COD", page: 92 },
  "Uzbequistão": { sigla: "UZB", page: 94 },
  "Colômbia": { sigla: "COL", page: 96 },
  "Inglaterra": { sigla: "ENG", page: 98 },
  "Croácia": { sigla: "CRO", page: 100 },
  "Gana": { sigla: "GHA", page: 102 },
  "Panamá": { sigla: "PAN", page: 104 }
};

// STORAGE
function getData() {
  return JSON.parse(localStorage.getItem("stickers")) || {};
}

function saveData(data) {
  localStorage.setItem("stickers", JSON.stringify(data));
}

// CONTADOR
function updateGlobalCounter() {
  const data = getData();
  let total = 0, owned = 0;

  Object.values(grupos).flat().forEach(team => {
    total += 20;
    owned += (data[team] || []).length;
  });

  total += 9 + 14;
  owned += (data["copa"] || []).length;
  owned += (data["coca"] || []).length;

  document.getElementById("globalCounter").innerText =
    `Álbum: ${owned}/${total} (${total - owned} faltando)`;
}

// TOGGLE
function toggle(team, number) {
  if (!editMode[team]) return;

  let data = getData();
  if (!data[team]) data[team] = [];

  if (data[team].includes(number)) {
    data[team] = data[team].filter(n => n !== number);
  } else {
    data[team].push(number);
  }

  saveData(data);
  render();
}

// EDIT
function toggleEdit(team) {
  editMode[team] = !editMode[team];
  render();
}

// UI
const app = document.getElementById("app");

function createStickers(team, total, start = 1) {
  const saved = getData()[team] || [];
  let html = "";
  let complete = saved.length === total;

  for (let i = start; i < start + total; i++) {
    const owned = saved.includes(i);
    html += `<button class="sticker ${owned ? 'owned' : ''} ${complete ? 'complete-opacity' : ''}" onclick="toggle('${team}', ${i})">${i}</button>`;
  }

  let percent = (saved.length / total) * 100;

  html += `
    <div class="progress">
      <div class="progress-bar" style="width:${percent}%"></div>
    </div>
    <small>${saved.length}/${total}</small>
  `;

  return html;
}

// RENDER GRUPOS (igual já estava)
function renderGrupos(filter="") {
  app.innerHTML = "";
  const normalizedFilter = normalize(filter);

  for (let g in grupos) {
    let groupContent = "";

    grupos[g].forEach(team => {
      const i = info[team];
      const search = normalize(team + " " + i.sigla);

      if (normalizedFilter && !search.includes(normalizedFilter)) return;

      const isEditing = editMode[team];

      groupContent += `
        <div class="mb-3">
          <h6 class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
            <div class="team-info">
              <span class="team-name">${team} (${i.sigla})</span>
              <span class="page">Página ${i.page}</span>
            </div>
            <button class="btn btn-sm ${isEditing ? 'btn-danger' : 'btn-dark'}"
              onclick="toggleEdit('${team}')">
              ${isEditing ? "Parar" : "Editar"}
            </button>
          </h6>

          ${createStickers(team, 20)}
        </div>
      `;
    });

    if (groupContent) {
      app.innerHTML += `
        <div class="team-card grupo-${g}">
          <h4>Grupo ${g}</h4>
          ${groupContent}
        </div>
      `;
    }
  }
}

function renderInicio() {
  const isEditing = editMode["copa"];

  app.innerHTML = `
    <div class="team-card inicio">
      <h6 class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div class="team-info">
          <span class="team-name">Copa do Mundo (FWC)</span>
          <span class="page">Página 1</span>
        </div>
        <button class="btn btn-sm ${isEditing ? 'btn-danger' : 'btn-dark'}"
          onclick="toggleEdit('copa')">
          ${isEditing ? "Parar" : "Editar"}
        </button>
      </h6>

      ${createStickers("copa", 9, 0)}
    </div>
  `;
}

function renderExtras() {
  const isEditing = editMode["coca"];

  app.innerHTML = `
    <div class="team-card extras">
      <h6 class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div class="team-info">
          <span class="team-name">Coca-Cola (CC)</span>
          <span class="page">Página 112</span>
        </div>
        <button class="btn btn-sm ${isEditing ? 'btn-danger' : 'btn-dark'}"
          onclick="toggleEdit('coca')">
          ${isEditing ? "Parar" : "Editar"}
        </button>
      </h6>

      ${createStickers("coca", 14)}
    </div>
  `;
}

// CONTROLE
function render() {
  const filter = document.getElementById("searchInput").value;

  if (currentPage === "inicio") renderInicio();
  if (currentPage === "grupos") renderGrupos(filter);
  if (currentPage === "extras") renderExtras();

  updateGlobalCounter();
}

function setPage(page) {
  currentPage = page;
  render();
}

document.getElementById("searchInput").addEventListener("input", render);
render();
