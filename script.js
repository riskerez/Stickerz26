let currentPage = "grupos";
let editMode = {};

// =====================
// NORMALIZAÇÃO (BUSCA INTELIGENTE)
// =====================

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// =====================
// DADOS
// =====================

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

// =====================
// STORAGE
// =====================

function getData() {
  return JSON.parse(localStorage.getItem("stickers")) || {};
}

function saveData(data) {
  localStorage.setItem("stickers", JSON.stringify(data));
}

// =====================
// TOGGLE
// =====================

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

// =====================
// EDITAR
// =====================

function toggleEdit(team) {
  editMode[team] = !editMode[team];
  render();
}

// =====================
// UI
// =====================

const app = document.getElementById("app");

function createStickers(team, total, start = 1) {
  const saved = getData()[team] || [];
  let html = "";

  for (let i = start; i < start + total; i++) {
    const owned = saved.includes(i);
    html += `<button class="sticker ${owned ? 'owned' : ''}" onclick="toggle('${team}', ${i})">${i}</button>`;
  }

  let percent = (saved.length / total) * 100;

  html += `
    <div class="progress">
      <div class="progress-bar bg-success" style="width:${percent}%"></div>
    </div>
    <small>${saved.length}/${total}</small>
  `;

  return html;
}

// =====================
// PÁGINAS
// =====================

function renderInicio() {
  const isEditing = editMode["copa"];

  app.innerHTML = `
    <div class="team-card inicio">
      <h4 class="d-flex justify-content-between align-items-center">
        Copa do Mundo
        <button class="btn btn-sm ${isEditing ? 'btn-danger' : 'btn-primary'}"
          onclick="toggleEdit('copa')">
          ${isEditing ? "Parar" : "Editar"}
        </button>
      </h4>

      ${createStickers("copa", 9, 0)}
    </div>
  `;
}

function renderGrupos(filter="") {
  app.innerHTML = "";

  const normalizedFilter = normalize(filter);

  for (let g in grupos) {
    let groupContent = "";

    grupos[g].forEach(team => {
      const normalizedTeam = normalize(team);

      if (normalizedFilter && !normalizedTeam.includes(normalizedFilter)) return;

      const isEditing = editMode[team];

      groupContent += `
        <div class="mb-3">
          <h6 class="d-flex justify-content-between align-items-center">
            ${team}
            <button class="btn btn-sm ${isEditing ? 'btn-danger' : 'btn-primary'}"
              onclick="toggleEdit('${team}')">
              ${isEditing ? "Parar" : "Editar"}
            </button>
          </h6>

          ${createStickers(team, 20)}
        </div>
      `;
    });

    // 🔥 Só renderiza grupo se tiver resultado
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

function renderExtras() {
  const isEditingCoca = editMode["coca"];

  app.innerHTML = `
    <div class="team-card extras">
      <h4 class="d-flex justify-content-between align-items-center">
        Coca-Cola
        <button class="btn btn-sm ${isEditingCoca ? 'btn-danger' : 'btn-primary'}"
          onclick="toggleEdit('coca')">
          ${isEditingCoca ? "Parar" : "Editar"}
        </button>
      </h4>

      ${createStickers("coca", 14)}
    </div>
  `;
}

// =====================
// CONTROLE
// =====================

function render() {
  const filter = document.getElementById("searchInput").value;

  if (currentPage === "inicio") renderInicio();
  if (currentPage === "grupos") renderGrupos(filter);
  if (currentPage === "extras") renderExtras();
}

function setPage(page) {
  currentPage = page;
  render();
}

// =====================
// BUSCA
// =====================

document.getElementById("searchInput").addEventListener("input", render);

// =====================
// START
// =====================

render();