const btnUpload = document.getElementById('btn-upload');
const fileInput = document.getElementById('file-input');
const btnNewPhoto = document.getElementById('btn-new-photo');

const uploadArea = document.getElementById('upload-area');
const resultArea = document.getElementById('result-area'); //resultado
const historyContainer = document.getElementById('history-container'); //histórico
const imagePreview = document.getElementById('image-preview');
const loader = document.getElementById('loader');
const resultCard = document.getElementById('result-card');

const plantCommonName = document.getElementById('plant-common-name'); // h2
const plantScientificName = document.getElementById('plant-scientific-name'); // h4
const plantScore = document.getElementById('plant-score');

// variavel para guardar o historico da sessão
let identificationHistory = [];


btnUpload.addEventListener('click', () => fileInput.click());
btnNewPhoto.addEventListener('click', resetUI);

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) handleImage(file);
});


function handleImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        
        uploadArea.classList.add('hidden');
        historyContainer.classList.add('hidden'); // esconde historico ao identificar
        resultCard.classList.add('hidden');
        resultArea.classList.remove('hidden');
        imagePreview.classList.remove('hidden');
        loader.classList.remove('hidden');

        identifyPlant(file, e.target.result); // passa a imagem (file) e sua visualização (em base64)
    };
    reader.readAsDataURL(file);
}

async function identifyPlant(file, imageSrc) { // imageSrc é a nossa string Base64
    try {
        // A URL continua a mesma, apontando para a nossa função
        const response = await fetch('/api/identify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Agora enviamos JSON
            },
            // Enviamos um objeto JSON contendo a imagem como texto Base64
            body: JSON.stringify({ image: imageSrc }),
        });

        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.statusText}`);
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
        
        // primeiro nome comum, se existir. senão, usa o cientifico.
        const commonName = bestResult.species.commonNames.length > 0 ? bestResult.species.commonNames[0] : 'Nome não encontrado';
        const scientificName = bestResult.species.scientificNameWithoutAuthor;

        plantCommonName.textContent = commonName;
        plantScientificName.textContent = scientificName;
        plantScore.textContent = `Confiança: ${score}%`;
        
        // adiciona ao histórico
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

//reseta a interface para o estado inicial
function resetUI() {
    uploadArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    
    // mostra o historico de volta
    renderHistory();
    historyContainer.classList.remove('hidden');

    // limpa o input de arquivo para permitir selecionar a mesma foto novamente
    fileInput.value = '';
}

//renderiza o historico de cards
function renderHistory() {
    historyContainer.innerHTML = ''; // limpa o container antes de renderizar

    if (identificationHistory.length > 0) {
        const title = document.createElement('h3');
        title.textContent = 'Identificações Recentes';
        title.style.textAlign = 'center';
        title.style.width = '100%';
        historyContainer.appendChild(title);
    }

    // itera pelo histórico de tras para frente para mostrar o mais recente primeiro
    for (let i = identificationHistory.length - 1; i >= 0; i--) {
        const item = identificationHistory[i];
        
        // cria o HTML do card de histórico
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


// função para pegar o ano atual no rodape
(() => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
})();