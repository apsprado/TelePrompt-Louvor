/**
 * app.js
 * Gerenciador principal da aplicação TelePrompt Louvor.
 * Responsável pela inicialização, renderização de slides e configurações.
 */

const App = {
    // Estado global da aplicação
    state: {
        songList: [],       // Lista de caminhos dos arquivos de música
        currentSongIndex: 0,
        currentSlideIndex: 0,
        currentSong: null,  // Objeto { title, author, slides[] }
    },

    // Referências aos elementos do DOM
    dom: {
        songTitle: null,
        songAuthor: null,
        slideContent: null,
        endMessage: null,
        settingsModal: null,
        btnOpenSettings: null,
        btnCloseSettings: null,
        bgColorPicker: null,
        fontColorPicker: null,
        fontSizeRange: null,
        controlsContainer: null,
    },

    /**
     * Inicializa a aplicação.
     */
    async init() {
        this.cacheDom();
        this.loadSettings();
        this.setupSettingsListeners();
        this.setupControlButtons();

        // Carregar a lista de músicas a partir de um índice ou pasta
        await this.loadSongList();

        if (this.state.songList.length > 0) {
            await this.loadSong(0);
        } else {
            this.dom.slideContent.textContent = "Nenhuma música encontrada.";
        }
    },

    /**
     * Cacheia as referências do DOM.
     */
    cacheDom() {
        this.dom.songTitle = document.getElementById('song-title');
        this.dom.songAuthor = document.getElementById('song-author');
        this.dom.slideContent = document.getElementById('slide-content');
        this.dom.endMessage = document.getElementById('end-message');
        this.dom.settingsModal = document.getElementById('settings-modal');
        this.dom.btnOpenSettings = document.getElementById('btn-open-settings');
        this.dom.btnCloseSettings = document.getElementById('btn-close-settings');
        this.dom.bgColorPicker = document.getElementById('bg-color-picker');
        this.dom.fontColorPicker = document.getElementById('font-color-picker');
        this.dom.fontSizeRange = document.getElementById('font-size-range');
        this.dom.controlsContainer = document.getElementById('controls');
    },

    /**
     * Carrega a lista de músicas.
     * Para uso offline/estático, definimos um array manual.
     * Pode ser substituído por leitura de diretório ou integração com Google Drive.
     */
    async loadSongList() {
        // Lista estática de músicas — adicione novos caminhos conforme necessário
        this.state.songList = [
            'musicas/01 - Exemplo.txt',
        ];
    },

    /**
     * Carrega uma música pelo índice na lista.
     * @param {number} index Índice na songList
     */
    async loadSong(index) {
        if (index < 0 || index >= this.state.songList.length) return;

        this.state.currentSongIndex = index;
        this.state.currentSlideIndex = 0;

        const filepath = this.state.songList[index];
        const songData = await LyricParser.fetchAndParse(filepath);

        if (songData) {
            this.state.currentSong = songData;
            this.dom.songTitle.textContent = songData.title;
            this.dom.songAuthor.textContent = songData.author;
            this.renderSlide();
        } else {
            this.dom.slideContent.textContent = "Erro ao carregar música.";
        }
    },

    /**
     * Renderiza o slide atual na tela.
     */
    renderSlide() {
        const song = this.state.currentSong;
        if (!song) return;

        const slideIndex = this.state.currentSlideIndex;

        // Esconde a mensagem de fim por padrão
        this.dom.endMessage.style.display = 'none';
        this.dom.slideContent.style.opacity = '0';

        setTimeout(() => {
            if (slideIndex >= song.slides.length) {
                // Última posição: mostra "FIM DA MÚSICA"
                this.dom.slideContent.textContent = '';
                this.dom.endMessage.style.display = 'block';
            } else {
                this.dom.slideContent.textContent = song.slides[slideIndex];
            }
            this.dom.slideContent.style.opacity = '1';
        }, 150); // Pequena transição suave
    },

    /**
     * Avança para o próximo slide ou próxima música.
     */
    nextSlide() {
        const song = this.state.currentSong;
        if (!song) return;

        if (this.state.currentSlideIndex > song.slides.length - 1) {
            // Já está na tela de "FIM", avança para próxima música
            if (this.state.currentSongIndex < this.state.songList.length - 1) {
                this.loadSong(this.state.currentSongIndex + 1);
            }
        } else {
            this.state.currentSlideIndex++;
            this.renderSlide();
        }
    },

    /**
     * Retrocede para o slide anterior ou música anterior.
     */
    prevSlide() {
        if (this.state.currentSlideIndex > 0) {
            this.state.currentSlideIndex--;
            this.renderSlide();
        } else {
            // Já está no primeiro slide, volta para música anterior
            if (this.state.currentSongIndex > 0) {
                this.loadSong(this.state.currentSongIndex - 1);
            }
        }
    },

    // ===================== CONFIGURAÇÕES =====================

    /**
     * Configura os listeners do modal de configurações.
     */
    setupSettingsListeners() {
        this.dom.btnOpenSettings.addEventListener('click', () => {
            this.dom.settingsModal.style.display = 'flex';
        });

        this.dom.btnCloseSettings.addEventListener('click', () => {
            this.dom.settingsModal.style.display = 'none';
        });

        this.dom.bgColorPicker.addEventListener('input', (e) => {
            this.applySetting('--bg-color', e.target.value);
            this.saveSetting('bgColor', e.target.value);
        });

        this.dom.fontColorPicker.addEventListener('input', (e) => {
            this.applySetting('--font-color', e.target.value);
            this.saveSetting('fontColor', e.target.value);
        });

        this.dom.fontSizeRange.addEventListener('input', (e) => {
            const val = e.target.value + 'vw';
            this.applySetting('--font-size', val);
            this.saveSetting('fontSize', val);
        });
    },

    /**
     * Aplica uma variável CSS globalmente.
     */
    applySetting(cssVar, value) {
        document.documentElement.style.setProperty(cssVar, value);
    },

    /**
     * Salva uma configuração no localStorage.
     */
    saveSetting(key, value) {
        const settings = JSON.parse(localStorage.getItem('telePromptSettings') || '{}');
        settings[key] = value;
        localStorage.setItem('telePromptSettings', JSON.stringify(settings));
    },

    /**
     * Carrega configurações do localStorage e aplica.
     */
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('telePromptSettings') || '{}');

        if (settings.bgColor) {
            this.applySetting('--bg-color', settings.bgColor);
            this.dom.bgColorPicker && (this.dom.bgColorPicker.value = settings.bgColor);
        }
        if (settings.fontColor) {
            this.applySetting('--font-color', settings.fontColor);
            this.dom.fontColorPicker && (this.dom.fontColorPicker.value = settings.fontColor);
        }
        if (settings.fontSize) {
            this.applySetting('--font-size', settings.fontSize);
            if (this.dom.fontSizeRange) {
                this.dom.fontSizeRange.value = parseFloat(settings.fontSize);
            }
        }
    },

    // ===================== CONTROLES NA TELA =====================

    /**
     * Cria botões de navegação na interface.
     */
    setupControlButtons() {
        const btnPrev = document.createElement('button');
        btnPrev.textContent = '◀ Anterior';
        btnPrev.id = 'btn-prev';
        btnPrev.addEventListener('click', () => this.prevSlide());

        const btnNext = document.createElement('button');
        btnNext.textContent = 'Próximo ▶';
        btnNext.id = 'btn-next';
        btnNext.addEventListener('click', () => this.nextSlide());

        this.dom.controlsContainer.appendChild(btnPrev);
        this.dom.controlsContainer.appendChild(btnNext);
    },
};

// Expõe globalmente para que controller.js e midi.js possam acessar
window.App = App;

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
