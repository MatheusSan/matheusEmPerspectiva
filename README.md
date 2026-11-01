# Matheus em Perspectiva

Site estático de blog de relatos e reflexões, com estrutura em HTML, CSS, JavaScript e JSON. O conteúdo é alimentado por `data/reports.json`, permitindo atualizar e expandir os relatos sem reescrever o HTML principal.

## Como visualizar

Abra a pasta do projeto em um servidor local, por exemplo:

```bash
cd c:\vscode\matheusEmPerspectiva
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

## Como alimentar os relatos

Edite o arquivo:

```text
data/reports.json
```

Adicione novos objetos no array `reports` seguindo o formato dos exemplos já existentes.

## Estrutura

- `index.html` – layout principal
- `styles.css` – design responsivo e visual moderno
- `script.js` – renderização dos dados e modal de detalhes
- `data/reports.json` – banco de dados inicial em JSON
