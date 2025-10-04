// /api/identify.js
import FormData from 'form-data';

export default async function handler(request, response) {
  const API_KEY = process.env.PLANTNET_API_KEY;
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?lang=pt&api-key=${API_KEY}`;

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Apenas o método POST é permitido.' });
  }

  try {
    // 1. Recebe o JSON e extrai a string Base64 da imagem
    const { image: imageBase64 } = request.body;

    // 2. Converte a string Base64 de volta para um formato binário (Buffer)
    //    Primeiro, remove o prefixo "data:image/jpeg;base64,"
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // 3. Cria o "envelope" FormData
    const formData = new FormData();
    formData.append('images', imageBuffer, 'plant.jpg'); // Usa o Buffer da imagem
    formData.append('organs', 'auto');
    
    // 4. Envia o envelope para a PlantNet
    const plantnetResponse = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!plantnetResponse.ok) {
        const errorText = await plantnetResponse.text();
        console.error('Erro da API da PlantNet:', errorText);
        return response.status(plantnetResponse.status).json({ message: 'A API externa retornou um erro.' });
    }

    const data = await plantnetResponse.json();
    return response.status(200).json(data);

  } catch (error) {
    console.error('Erro na função serverless:', error);
    return response.status(500).json({ message: 'Erro no servidor ao identificar a planta.' });
  }
}