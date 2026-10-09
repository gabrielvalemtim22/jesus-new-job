# Jesus New Job — Comunicação Visual

Site da **Jesus New Job**: fachadas em ACM, letras caixa, luminosos, painéis de LED, adesivação e coberturas em São Paulo e região.

📞 (11) 98289-5825 · [WhatsApp](https://wa.me/5511982895825) · [Instagram @jesus.new.job](https://www.instagram.com/jesus.new.job/)

## Estrutura

```
index.html                 página (HTML puro, sem build)
assets/css/style.css       estilos e animações
assets/js/main.js          interações: intro, deck de fotos, filtros, lightbox, vídeo, formulário
assets/img/brand/          logo, ícones e imagem de compartilhamento (og.jpg)
assets/img/work/           fotos dos projetos (1200px, usadas no lightbox)
assets/img/work/thumb/     miniaturas (720px, usadas nas grades)
assets/video/              vídeo dos bastidores + capa
vercel.json                cache e cabeçalhos
```

O formulário de orçamento não usa servidor: ele monta a mensagem e abre o WhatsApp com o texto pronto.

## Adicionar um projeto ao portfólio

1. Gere as duas versões da foto (precisa do `ffmpeg`):
   ```bash
   ffmpeg -i foto.jpg -vf "scale='min(1200,iw)':-2" -quality 80 assets/img/work/nome-do-projeto.webp
   ffmpeg -i foto.jpg -vf "scale=720:-2" -quality 74 assets/img/work/thumb/nome-do-projeto.webp
   ```
2. No `index.html`, copie um bloco `<button class="work-card" …>` da seção **PORTFÓLIO**, troque os caminhos das imagens, o nome e a descrição.
3. Em `data-cat`, use `fachadas`, `letreiros`, `coberturas` ou `interiores`, e atualize os números nos botões de filtro.

## Publicação

O repositório está ligado à Vercel: todo `git push` na branch `main` publica o site automaticamente em https://jesus-new-job-nu.vercel.app
