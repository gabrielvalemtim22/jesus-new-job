# Jesus New Job — Comunicação Visual

Site da **Jesus New Job**, empresa de comunicação visual em São Paulo: fachadas, letreiros, luminosos e coberturas.

📞 (11) 98289-5825 · [WhatsApp](https://wa.me/5511982895825)

## Estrutura

```
index.html      página única (HTML + CSS + JS, sem build)
images/         fotos dos trabalhos (WebP)
favicon.svg     ícone do site
vercel.json     cache das imagens e cabeçalhos
robots.txt      / sitemap.xml  — SEO
```

O formulário de orçamento não usa servidor: ele monta a mensagem e abre o WhatsApp com o texto pronto.

## Como editar

- **Textos e telefone:** edite direto no `index.html`.
- **Trabalhos da galeria:** coloque a foto em `images/` (formato `.webp`) e adicione uma linha na lista `projects` no fim do `index.html`:
  ```js
  {name:'Nome do cliente',image:'nome-do-arquivo',category:'fachadas',label:'Tipo de trabalho',position:'50% 30%'},
  ```
  `category` pode ser `fachadas` ou `coberturas`. Atualize também o número no botão "Todos os trabalhos".

## Publicação

O repositório está ligado à Vercel: todo `git push` na branch `main` publica o site automaticamente.

Para ver localmente, basta abrir o `index.html` no navegador.
