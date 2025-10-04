# BotaniCap — Web App

![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Licença](https://img.shields.io/badge/licença-MIT-blue)
![Tecnologias](https://img.shields.io/badge/tecnologias-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20PWA-orange)

> Link para a aplicação: **https://botani-cap-web-app.vercel.app/**

## 🎯 Objetivo

O **BotaniCap** é um projeto acadêmico desenvolvido para aplicar e aprofundar conhecimentos em tecnologias web modernas, incluindo o desenvolvimento de **Progressive Web Apps (PWA)**, consumo de APIs externas de forma segura e o deploy de aplicações em plataformas como a Vercel.

## 💻 Sobre o código

O projeto foi construído utilizando as tecnologias base da web, sem o uso de frameworks complexos, para focar nos fundamentos.

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**

Você pode copiar, modificar e utilizar o código livremente, mas lembre-se de **dar os créditos**.

## ✨ Funcionalidades

* 📸 **Identificação por Foto:** Permite que o usuário tire uma foto ou escolha uma da galeria para identificar espécies de plantas.
* 🔐 **Chamada de API Segura:** Utiliza uma **Serverless Function** (na Vercel) como uma "ponte" para a API da PlantNet. Isso garante que a chave da API nunca seja exposta no código do navegador.
* 📲 **Instalável (PWA):** O aplicativo pode ser instalado na tela inicial de dispositivos móveis, funcionando como um app nativo.
* 📴 **Funcionamento Offline:** Graças ao **Service Worker**, a interface principal do aplicativo carrega e funciona mesmo sem conexão com a internet.
* 📜 **Histórico de Sessão:** As identificações feitas são salvas em um histórico temporário, visível até que a página seja recarregada.

## 🌿 API Utilizada

O projeto utiliza a **[PlantNet API](https://my.plantnet.org/)** para obter dados de identificação de plantas a partir de uma imagem.

## 🚀 Como usar o Web App

1.  Acesse o link da aplicação.
2.  Clique no botão **"Identificar Planta"**.
3.  Tire uma foto ou escolha uma imagem de planta da sua galeria.
4.  Aguarde o resultado. O aplicativo exibirá o nome comum e científico mais provável, junto com a porcentagem de confiança.
5.  Para fazer uma nova identificação, clique em **"Identificar Outra Planta"**. As identificações anteriores aparecerão na seção "Identificações Recentes".

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Feito com ❤️ por **[SEU NOME AQUI]**.
