// /scripts/main.js (Versão com Proxy)

// --- 1. SELEÇÃO DOS ELEMENTOS DO HTML E CONSTANTES --- //
const btnUpload = document.getElementById('btn-upload');
const fileInput = document.getElementById('file-input');
const btnNewPhoto = document.getElementById('btn-new-photo');

const uploadArea = document.getElementById('upload-area');
const resultArea = document.getElementById('result-area');
const historyContainer = document.getElementById('history-container');
const imagePreview = document.getElementById('image-preview');
const loader = document.getElementById('loader');
const resultCard = document.getElementById('result-card');

const plantCommonName = document.getElementById('plant-common-name');
const plantScientificName = document.getElementById('plant-scientific-name');
const plantScore = document.getElementById('plant-score');

let identificationHistory = [];

// !! IMPORTANTE !! Cole sua chave da API da PlantNet aqui
const API_KEY = 'SUA_CHAVE_AQUI'; 
const PROXY_URL = 'https://corsproxy.io/?';
const API_URL = `${PROXY_URL}https://my-api.plantnet.org/v2/identify/all?lang=pt&api-key=${API_KEY}`;


// --- 2. LÓGICA DE EVENTOS --- //
btnUpload.addEventListener('click', () => fileInput.click());
btnNewPhoto.addEventListener('click', resetUI);

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) handleImage(file);
});


// --- 3. FUNÇÕES PRINCIPAIS --- //
function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        
        uploadArea.classList.add('hidden');
        historyContainer.classList.add('hidden');
        resultCard.classList.add('hidden');
        resultArea.classList.remove('hidden');
        imagePreview.classList.remove('hidden');
        loader.classList.remove('hidden');

        identifyPlant(file, e.target.result);
    };
    reader.readAsDataURL(file);
}

async function identifyPlant(file, imageSrc) {
    const formData = new FormData();
    formData.append('images', file);
    formData.append('organs', 'auto');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Erro da API: ${response.statusText}`);
        }

        const data = await response.json();
        displayResults(data, imageSrc);

    } catch (error) {
        console.error('Erro na chamada da API:', error);
        alert('Não foi possível se conectar à API. Verifique sua conexão.');
        resetUI();
    }
}

function displayResults(data, imageSrc) {
    loader.classList.add('hidden');

    if (data.results && data.results.length > 0) {
        const bestResult = data.results[0];
        const score = (bestResult.score * 100).toFixed(1);
        
        const commonName = bestResult.species.commonNames.length > 0 ? bestResult.species.commonNames[0] : 'Nome não encontrado';
        const scientificName = bestResult.species.scientificNameWithoutAuthor;

        plantCommonName.textContent = commonName;
        plantScientificName.textContent = scientificName;
        plantScore.textContent = `Confiança: ${score}%`;
        
        identificationHistory.push({
            imageSrc: imageSrc,
            commonName: commonName,
            scientificName: scientificName,
            score: score
        });
        
        resultCard.classList.remove('hidden');
    } else {
        alert('Não foi possível identificar a planta. Tente outra foto.');
        resetUI();
    }
}

function resetUI() {
    uploadArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    
    renderHistory();
    historyContainer.classList.remove('hidden');

    fileInput.value = '';
}

function renderHistory() {
    historyContainer.innerHTML = '';

    if (identificationHistory.length > 0) {
        const title = document.createElement('h3');
        title.textContent = 'Identificações Recentes';
        title.style.textAlign = 'center';
        title.style.width = '100%';
        historyContainer.appendChild(title);
    }

    for (let i = identificationHistory.length - 1; i >= 0; i--) {
        const item = identificationHistory[i];
        
        const historyCard = document.createElement('div');
        historyCard.className = 'history-card';
        historyCard.innerHTML = `
            <img src="${item.imageSrc}" alt="Foto de ${item.commonName}">
            <div class="history-card-info">
                <strong>${item.commonName}</strong>
                <em>${item.scientificName}</em>
                <p>Confiança: ${item.score}%</p>
            </div>
        `;
        historyContainer.appendChild(historyCard);
    }
}

// Lógica do Rodapé
(() => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
})();