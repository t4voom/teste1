# Aynebrenda · diário de frente pro mar

Site-portfólio pessoal de fotos, no estilo diário (polaroids, letra de mão, fita adesiva) misturado com um tema de oceano: a página começa no céu, desce pelo mar e termina no fundo do mar.

## O que tem
- **Abertura:** o nome dela e uma pilha de polaroids. Ao tocar na pilha, a foto de cima vai para o fim.
- **Bilhete:** um recadinho num papel pautado, com a tartaruga da tatuagem dela.
- **Diário de bordo:** as 4 fotos com legendas. Um barquinho desce por uma rota conforme a página é rolada.
- **Fundo do mar:** uma tartaruga nadando e bolhas subindo.
- **Foto ampliada:** abre ao clicar numa polaroid. Dá pra passar as fotos pelas setas, pelo teclado ou deslizando no celular.

Feito com HTML, CSS e JavaScript puros, sem dependências. Quem configura o aparelho para reduzir movimento vê o site sem as animações.

## Estrutura
```
index.html
css/style.css
js/main.js
images/      fotos (.jpg + .webp, sem metadados)
assets/      ícone da tartaruga
```

## Rodar localmente
```bash
python3 -m http.server 8000
```
Depois abra http://localhost:8000.

## Publicar no GitHub Pages
No repositório: **Settings → Pages → Build and deployment → Deploy from a branch**. Escolha a branch e a pasta `/ (root)`.

## Trocar textos ou fotos
- **Textos:** ficam todos no `index.html`.
- **Fotos novas:** coloque na pasta `images/` e copie um bloco `<article class="entrada">`. Depois adicione a foto na lista `FOTOS` em `js/main.js`, para ela aparecer na foto ampliada.
