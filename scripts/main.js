// /scripts/main.js - VERSÃO FINAL

// --- 1. SELEÇÃO DOS ELEMENTOS DO HTML --- //
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

// ESTA É A VERSÃO CORRETA DA FUNÇÃO, QUE USA BASE64
async function identifyPlant(file, imageSrc) {
    try {
        const response = await fetch('/api/identify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageSrc }),
        });

        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        displayResults(data, imageSrc);

    } catch (error) {
        console.error('Erro ao chamar a função de identificação:', error);
        alert('Ocorreu um erro ao processar a identificação.');
        resetUI();
    }
}

function displayResults(data, imageSrc) {
    loader.classList.add('hidden');

    if (data.results && data.results.length > 0) {
        const bestResult = data.results[0];
        const score = (bestResult.score * 100).toFixed(1);
        
        const commonName = bestResult.species.commonNames.length > 0 ? bestResult.species.commonNames[0] : 'Nome comum não encontrado';
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