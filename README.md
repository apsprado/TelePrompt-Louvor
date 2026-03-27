# 🎤 TelePrompt Louvor

## 📌 Visão Geral

O **TelePrompt Louvor** é uma aplicação web leve desenvolvida em **HTML, CSS e JavaScript**, projetada para exibir letras de músicas em formato de teleprompter durante cultos ou apresentações musicais.

O sistema permite navegação por **estrofes (slides)** utilizando dispositivos físicos como **pedal controlador MIDI** ou **passador de slides**, além de controles manuais na interface.

---

## 🎯 Objetivos

* Facilitar a exibição de letras para equipes de louvor
* Permitir navegação fluida e sem interrupções
* Oferecer alta legibilidade (customização de fonte, cores e tamanho)
* Suporte a controle externo (MIDI / passador de slide)
* Simplicidade operacional (uso offline e local)

---

## 🧱 Arquitetura da Solução

### Stack Tecnológica

* **Frontend:** HTML5 + CSS3 + JavaScript (Vanilla)
* **Execução:** Navegador Web (Chrome recomendado)
* **Integrações:**

  * Web MIDI API (para pedal MIDI)
  * Eventos de teclado (para passador de slide)

---

## 📂 Estrutura do Projeto

```
teleprompt/
│
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── parser.js
│   ├── controller.js
│   └── midi.js
│
├── config/
│   └── settings.json
│
├── musicas/
│   ├── 01 - Musica.txt
│   ├── 02 - Outra Musica.txt
│
└── README.md
```

---

## 📄 Formato dos Arquivos de Música

As músicas devem estar em arquivos `.txt`, com o seguinte padrão:

```
Título: Nome da Música
Autor: Nome do Autor

Primeira estrofe da música
continuação da estrofe

Segunda estrofe da música

Terceira estrofe
```

### 🔹 Regras

* Linhas em branco definem **quebra de estrofe (slide)**
* Primeiras linhas são metadados (Título e Autor)
* Cada estrofe será exibida como um slide independente

---

## 🖥️ Funcionalidades

### 🎵 Exibição de Músicas

* Exibição de uma estrofe por vez (modo slide)
* Indicação de:

  * Título
  * Autor
* Ao final:

  * Exibe: **"FIM DA MÚSICA"** (em vermelho e menor tamanho)

---

### 🎮 Navegação

#### Entrada de Controle

* Pedal MIDI (via Web MIDI API)
* Passador de slide (teclas → ← ou PageUp/PageDown)
* Botões na interface

#### Ações

| Ação              | Comportamento              |
| ----------------- | -------------------------- |
| Avançar           | Próxima estrofe            |
| Retroceder        | Estrofe anterior           |
| Última estrofe    | Mostra "FIM DA MÚSICA"     |
| Após fim          | Avança para próxima música |
| Antes da primeira | Volta para música anterior |

---

### ⚙️ Configurações

Menu de configurações acessível na interface:

* 🎨 Cor de fundo
* 🔤 Cor da fonte
* 🔠 Tipo de fonte
* 🔎 Tamanho da fonte
* 💾 Persistência via `localStorage`

---

### 📁 Origem das Músicas

Suporte para:

* 📂 Pasta local (`/musicas`)
* ☁️ Integração com Google Drive (via LINK)

---

## 🔌 Integração com MIDI

Utilizando **Web MIDI API**:

* Mapear sinais MIDI para:

  * Avançar slide
  * Retroceder slide

---

## 🚀 Como Executar

### 🔧 Requisitos

* Navegador moderno (Chrome recomendado)
* Permissão para uso de MIDI (se aplicável)

## 🧠 Lógica de Funcionamento

### Fluxo Principal

1. Carregar lista de músicas
2. Selecionar primeira música
3. Fazer parsing do arquivo TXT:

   * Separar metadados
   * Separar estrofes por quebra de linha
4. Renderizar primeira estrofe
5. Aguardar eventos de navegação

---

## 🧪 Testes

### Casos de Teste

* ✔ Navegação entre estrofes
* ✔ Mudança entre músicas
* ✔ Exibição correta de "FIM DA MÚSICA"
* ✔ Leitura correta de arquivos TXT
* ✔ Persistência das configurações
* ✔ Entrada via teclado
* ✔ Entrada via MIDI

---

## 🔒 Considerações Técnicas

* Uso offline (sem backend)
* Segurança baseada no sandbox do navegador
* Web MIDI requer HTTPS em produção

