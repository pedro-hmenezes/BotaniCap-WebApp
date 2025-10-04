// /api/identify.js
import FormData from 'form-data';

export default async function handler(request, response) {
  const API_KEY = process.env.PLANTNET_API_KEY;
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?lang=pt&api-key=${API_KEY}`;

  if (!API_KEY) {
    return response.status(500).json({ message: 'Chave da API não configurada.' });
  }

  try {
    // 1. cria um novo 'envelope' (FormData) no servidor
    const formData = new FormData();
    
    // 2. adiciona a imagem (que vem no corpo da requisição) ao envelope
    //    o Vercel da o corpo como um buffer, que podemos usar diretamente
    formData.append('images', request.body, {
      filename: 'plant.jpg',
      contentType: request.headers['content-type'],
    });

    // 3. adiciona o outro campo necessário
    formData.append('organs', 'auto');

    // 4. envia o envelope completo para a PlantNet
    const plantnetResponse = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await plantnetResponse.json();
    return response.status(200).json(data);

  } catch (error) {
    console.error('Erro na função serverless:', error);
    return response.status(500).json({ message: 'Erro no servidor ao identificar a planta.' });
  }
}