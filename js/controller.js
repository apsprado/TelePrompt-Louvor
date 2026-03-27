/**
 * controller.js
 * Controle de navegação via teclado e passador de slides.
 */

const Controller = {
    /**
     * Inicializa o listener de teclado.
     */
    init() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        console.log("Controller: Escuta de teclado ativada.");
    },

    /**
     * Trata os eventos de keydown para navegação.
     * @param {KeyboardEvent} e
     */
    handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'PageDown':
                e.preventDefault();
                App.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                App.prevSlide();
                break;
            default:
                break;
        }
    },
};

// Expõe globalmente
window.Controller = Controller;

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    Controller.init();
});
