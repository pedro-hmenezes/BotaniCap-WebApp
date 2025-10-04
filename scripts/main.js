// /scripts/main.js - VERSÃO FINAL COM COMPRESSÃO DE IMAGEM

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

// FUNÇÃO ATUALIZADA com a lógica de compressão
async function handleImage(file) {
    // Mostra a interface de carregamento imediatamente
    uploadArea.classList.add('hidden');
    historyContainer.classList.add('hidden');
    resultCard.classList.add('hidden');
    resultArea.classList.remove('hidden');
    imagePreview.classList.add('hidden'); // Esconde a imagem até ser processada
    loader.classList.remove('hidden');

    console.log(`Tamanho original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    // Opções de compressão
    const options = {
      maxSizeMB: 1,          // Tamanho máximo do arquivo em MB
      maxWidthOrHeight: 1024,  // Redimensiona a imagem para no máximo 1024px de largura ou altura
      useWebWorker: true,
      fileType: 'image/jpeg'
    }

    try {
        // Chama a biblioteca de compressão
        const compressedFile = await imageCompression(file, options);
        console.log(`Tamanho comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

        // O resto do código continua como antes, mas usando o 'compressedFile'
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden'); // Mostra a imagem comprimida
            identifyPlant(file, e.target.result); // Continua o fluxo de identificação
        };
        reader.readAsDataURL(compressedFile);

    } catch (error) {
       console.error('Erro na compressão:', error);
       alert('Ocorreu um erro ao processar a imagem. Tente novamente.');
       resetUI();
    }
}

async function identifyPlant(file, imageSrc) {
    try {
        const response = await fetch('/api/identify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageSrc }),
        });
        if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);
        const data = await response.json();
        displayResults(data, imageSrc);
    } catch (error) {
        console.error('Erro ao chamar a função de identificação:', error);
        alert('Ocorreu um erro ao processar a identificação.');
        resetUI();
    }
}

// ... (O resto do arquivo 'main.js' continua exatamente o mesmo) ...
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
        identificationHistory.push({ imageSrc, commonName, scientificName, score });
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
        historyCard.innerHTML = `<img src="${item.imageSrc}" alt="Foto de ${item.commonName}"><div class="history-card-info"><strong>${item.commonName}</strong><em>${item.scientificName}</em><p>Confiança: ${item.score}%</p></div>`;
        historyContainer.appendChild(historyCard);
    }
}
(() => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
})();