# 🚀 A Aventura da Tabuada - 3.º Ano

Website lúdico e interativo para a aprendizagem e prática da **tabuada (1, 2, 3, 4, 5, 6 e 10)**, adaptado aos conteúdos programáticos de matemática do **3.º ano do 1.º Ciclo do Ensino Básico** em Portugal (crianças de 8 anos).

Com ilustrações, a mascote **Robô Pipas**, efeitos sonoros nativos (*Web Audio API*), síntese de voz em português de Portugal e feedback imediato a cada resposta!

---

## 🎮 Funcionalidades Principais

- **Aprender a Tabuada (Conteúdo Adaptado)**:
  - Exploração visual das tabuadas permitidas: **1, 2, 3, 4, 5, 6 e 10**.
  - **Grelha visual manipulável**: visualização de linhas e colunas com maçãs, estrelas, foguetões, peixes ou joaninhas.
  - **Adição repetida**: explicação do cálculo (ex.: $3 \times 4 = 4 + 4 + 4 = 12$).
  - **Saltos na Reta Numérica**: visualização dos múltiplos em saltos contínuos.
  - **O Super Truque do Pipas**: regras mnemónicas para cada tabuada (o espelho do 1, o dobro do 2, o triplo do 3, o dobro do dobro do 4, o relógio do 5, o dobro do 3 para o 6 e a magia do zero para o 10).
  - **Áudio**: leitura em voz alta das operações em português de Portugal.

- **Jogos com Feedback Imediato**:
  - **Jogo 1: Correspondência (Ligar Pares)**: Liga as contas aos resultados corretos com cartões táteis e confetes.
  - **Jogo 2: Verdadeiro ou Falso (Detetive dos Números)**: Analisa a igualdade proposta e recebe feedback e explicação imediata do resultado.
  - **Jogo 3: Escolha Múltipla (Quiz das Estrelas)**: 4 opções de resposta com realce imediato da resposta certa e explicação passo a passo.
  - **Desafio Bónus: Corrida Rápida**: Teste contrarrelógio de 45 segundos para treinar agilidade.
  - **Galeria de Troféus**: 6 medalhas colecionáveis guardadas no navegador (*localStorage*).

---

## 🌐 Como Publicar no GitHub e Ativar o GitHub Pages

O projeto já está configurado com `base: './'` no Vite e inclui o ficheiro de automação `.github/workflows/deploy.yml` para publicação automática no **GitHub Pages**!

### Passo 1: Criar um Repositório no GitHub
1. Entra na tua conta no [GitHub](https://github.com/) e clica em **New repository** (Novo repositório).
2. Dá um nome ao repositório (por exemplo: `tabuada-3ano`).
3. Escolhe se queres que seja **Public** (Público) e clica em **Create repository**.

### Passo 2: Enviar o Código para o GitHub
No teu computador/terminal na pasta do projeto:

```bash
# 1. Iniciar o repositório git local (se ainda não tiver sido iniciado)
git init

# 2. Adicionar todos os ficheiros
git add .

# 3. Criar o primeiro commit
git commit -m "Publicação inicial do website da Tabuada 3.º Ano"

# 4. Definir a branch principal
git branch -M main

# 5. Ligar ao teu repositório remoto no GitHub (substitui pelo teu link do GitHub)
git remote add origin https://github.com/O-TEU-UTILIZADOR/tabuada-3ano.git

# 6. Enviar o código
git push -u origin main
```

### Passo 3: Ativar o GitHub Pages (Automático!)
1. No teu repositório no GitHub, vai ao separador **Settings** (Definições).
2. No menu lateral esquerdo, clica em **Pages**.
3. Na secção **Build and deployment** -> **Source**, seleciona:
   - **GitHub Actions**
4. Pronto! O GitHub irá executar automaticamente a compilação e o teu website ficará online em poucos segundos no endereço:
   - `https://O-TEU-UTILIZADOR.github.io/tabuada-3ano/`

---

## 💻 Desenvolvimento Local

Para executar o projeto no teu computador:

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

# Compilar para produção (cria a pasta /dist)
npm run build
```

---

## 🛠️ Tecnologias Utilizadas

- **React 19 & TypeScript**
- **Vite 8** (configurado para caminhos relativos no GitHub Pages)
- **Tailwind CSS v4**
- **Web Audio API** (efeitos sonoros sintetizados nativos, sem ficheiros externos)
- **Web Speech API** (síntese de voz em português)
- **Canvas Confetti** & **Lucide React**
