// /api/identify.js

export default async function handler(request, response) {
  // Pega a chave da API da variável de ambiente segura
  const API_KEY = process.env.PLANTNET_API_KEY;
  const API_URL = `https://my-api.plantnet.org/v2/identify/all?lang=pt&api-key=${API_KEY}`;

  console.log('Função iniciada. Tentando identificar planta...');

  // Verifica se a chave da API foi carregada
  if (!API_KEY) {
    console.error('ERRO: A variável de ambiente PLANTNET_API_KEY não foi encontrada.');
    return response.status(500).json({ message: 'Erro de configuração no servidor.' });
  }

  try {
    const plantnetResponse = await fetch(API_URL, {
      method: 'POST',
      body: request.body,
      headers: {
        'Content-Type': request.headers['content-type']
      },
    });

    // Se a resposta da PlantNet não for OK (ex: erro 401, 403, 500)
    if (!plantnetResponse.ok) {
      const errorText = await plantnetResponse.text();
      console.error('Erro da API da PlantNet:', errorText);
      // Retorna uma resposta de erro, mas sem detalhes para o usuário final
      return response.status(plantnetResponse.status).json({ message: 'A API externa retornou um erro.' });
    }

    const data = await plantnetResponse.json();
    console.log('Resposta da PlantNet recebida com sucesso.');
    
    // Envia a resposta da PlantNet de volta para o nosso app
    return response.status(200).json(data);

  } catch (error) {
    console.error('Erro geral na função:', error);
    return response.status(500).json({ message: 'Erro no servidor ao identificar a planta.' });
  }
}