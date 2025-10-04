// /api/identify.js - Versão definitiva para Vercel

const FormData = require('form-data');

export default async function handler(request, response) {
  // A Vercel já converte o corpo da requisição para JSON automaticamente para nós
  const { image: imageBase64 } = request.body;

  // Verificação para garantir que a imagem foi recebida
  if (!imageBase64) {
    return response.status(400).json({ message: 'Nenhuma imagem recebida no corpo da requisição.' });
  }

  // Pega a chave da API das variáveis de ambiente da Vercel
  const API_KEY = process.env.PLANTNET_API_KEY;
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?lang=pt&api-key=${API_KEY}`;
  
  try {
    // Converte o texto Base64 de volta para uma imagem binária (Buffer)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Cria o "envelope" multipart/form-data que a PlantNet espera
    const formData = new FormData();
    formData.append('images', imageBuffer, { filename: 'plant.jpg' });
    formData.append('organs', 'auto');
    
    // Envia a requisição formatada corretamente para a PlantNet
    const plantnetResponse = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await plantnetResponse.json();
    
    // Retorna a resposta da PlantNet para o nosso frontend
    return response.status(200).json(data);

  } catch (error) {
    console.error('Erro na função da Vercel:', error);
    return response.status(500).json({ message: 'Erro interno do servidor ao processar a imagem.' });
  }
}