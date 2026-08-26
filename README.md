# Photobooth

Um photobooth desenvolvido com React e Vite que permite tirar fotos diretamente pelo navegador, escolher diferentes layouts e gerar uma sequência de fotos para download.

## Preview

![Photobooth Preview](./public/preview.png)

## Sobre o projeto

O Photobooth foi desenvolvido como um projeto para praticar desenvolvimento com React, criação de componentes, estilização com CSS e utilização da câmera do navegador.

A aplicação possui uma interface simples e moderna, permitindo que o usuário escolha o formato da sequência de fotos antes de começar.

## Funcionalidades

* Acesso à câmera diretamente pelo navegador
* Captura de fotos
* Contagem regressiva para as fotos
* Escolha de diferentes layouts
* Visualização da sequência de fotos
* Download do resultado final
* Navegação entre as páginas da aplicação
* Interface responsiva

## Layouts disponíveis

| Layout   | Fotos   |
| -------- | ------- |
| Layout A | 3 fotos |
| Layout B | 4 fotos |
| Layout C | 5 fotos |
| Layout D | 6 fotos |
| Layout E | 7 fotos |

## Tecnologias

* React
* JavaScript
* Vite
* CSS
* HTML
* API de câmera do navegador

## Estrutura do projeto

```text
src/
├── app/
│   ├── App.jsx
│   └── main.jsx
│
├── components/
│   ├── Landing.jsx
│   ├── NavBar.jsx
│   └── Photobooth.jsx
│
├── hooks/
│   └── useCamera.js
│
└── style/
    ├── App.css
    ├── Landing.css
    ├── NavBar.css
    └── Photobooth.css
```

## Como executar

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/photobooth.git
```

Entre na pasta do projeto:

```bash
cd photobooth
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev
```

Depois, acesse o endereço disponibilizado pelo Vite no navegador.

## Permissão da câmera

Para utilizar o Photobooth, é necessário permitir que o navegador tenha acesso à câmera do dispositivo.

A aplicação utiliza a câmera através das APIs disponíveis no navegador.

## Objetivo

O projeto foi criado com o objetivo de praticar:

* Desenvolvimento com React
* Componentização
* Hooks personalizados
* Gerenciamento de estados
* Acesso à câmera com JavaScript
* Manipulação de imagens
* Estilização com CSS
* Desenvolvimento de interfaces modernas

## Status

Projeto desenvolvido para fins de estudo e prática de desenvolvimento web.

## Autor

Jorge Falcão
