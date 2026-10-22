# ARCD Construtech

Site institucional estático, com visual preservado a partir de https://arcd-construtech.pages.dev/ e copy revisada em português.

## Executar localmente

`python -m http.server 8765`

## Publicar na Vercel

Importe `hygorlp-dot/arcd`, use o preset **Other**, sem comando de build nem instalação, com diretório de saída `.`. A branch de produção é `main`.

Observação: o servidor do Python não aplica `cleanUrls`, `404.html` nem os headers do `vercel.json`; abra `/projetos/casa-supreme.html` com a extensão.

## Estrutura

- `index.html`: página inicial; `projetos/casa-supreme.html`: estudo de caso; `404.html`: página de erro.
- `site.css`: folha única (antes eram 7 arquivos, mantidos na mesma ordem de cascata). Fontes DM Sans e Manrope auto-hospedadas em `assets/fonts/` (variáveis, subconjunto latin).
- `assets/img/`: versões AVIF/WebP das fotos. Os `.jpg` originais em `assets/` continuam como fallback e são usados pelo modal de projetos.
- SEO: JSON-LD (`WebSite`, `GeneralContractor`, `WebPage`, `BreadcrumbList`), `sitemap.xml`, `robots.txt` e `llms.txt`. Não marcar avaliações com `Review`/`AggregateRating`: avaliações publicadas pela própria empresa não geram estrelas no Google.
- `vercel.json`: CSP (permite o player do Instagram), `X-Frame-Options`, `Permissions-Policy` e cache de 7 dias em `/assets`.

## Contato

O formulário monta uma mensagem para o WhatsApp. O visitante revisa e envia a mensagem na plataforma. Não há banco de dados, Supabase ou armazenamento de leads.

## Conteúdo

Foram revisados títulos, serviços, projetos, etapas, perguntas frequentes, botões, metadados e privacidade. Depoimentos fictícios e nota simulada foram substituídos pelo link do perfil da empresa no Google. Dados quantitativos sem comprovação acessível foram omitidos. Imagens originais e crédito de desenvolvimento foram preservados; a sequência de obra continua identificada como ilustração gerada com IA.

## Validação

Verificados sintaxe JavaScript, carregamento de imagens, filtros, modal de projeto, etapas da construção e mensagem preparada para WhatsApp. A mensagem de teste não foi enviada.
