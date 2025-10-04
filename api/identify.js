// /api/identify.js - VERSÃO FINALÍSSIMA

const FormData = require('form-data');
const fetch = require('node-fetch'); // <-- A LINHA DA SOLUÇÃO

export default async function handler(request, response) {
  const API_KEY = process.env.PLANTNET_API_KEY;
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?lang=pt&api-key=${API_KEY}`;

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Apenas o método POST é permitido.' });
  }

  try {
    const { image: imageBase64 } = request.body;

    if (!imageBase64) {
      return response.status(400).json({ message: 'Nenhuma imagem recebida.' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    const formData = new FormData();
    formData.append('images', imageBuffer, { filename: 'plant.jpg' });
    formData.append('organs', 'auto');
    
    const plantnetResponse = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await plantnetResponse.json();
    
    if (!plantnetResponse.ok) {
        console.error('Erro retornado pela API da PlantNet:', data);
        return response.status(plantnetResponse.status).json(data);
    }

    return response.status(200).json(data);

  } catch (error) {
    console.error('Erro na função da Vercel:', error);
    return response.status(500).json({ message: 'Erro interno do servidor.' });
  }
}