export default async function handler(request, response) {
  // pega a chave da API da variavel de ambiente segura que configuramos na Vercel
  const API_KEY = process.env.PLANTNET_API_KEY;
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?lang=pt&api-key=${API_KEY}`;

  try {
    // Rrecebe a imagem que o frontend enviou e a reenvia para a PlantNet
    const plantnetResponse = await fetch(API_URL, {
      method: 'POST',
      body: request.body, // Reenvia o corpo da requisição
      headers: {
        // copiar o tipo de conteúdo original da imagem
        'Content-Type': request.headers['content-type']
      },
    });

    const data = await plantnetResponse.json();
    // envia a resposta da PlantNet de volta para o nosso app
    response.status(200).json(data);

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: 'Erro no servidor ao identificar a planta.' });
  }
}