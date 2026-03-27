/**
 * midi.js
 * Integração com Web MIDI API para controle via pedal MIDI.
 */

const MidiController = {
    midiAccess: null,

    /**
     * Inicializa a conexão MIDI.
     */
    async init() {
        if (!navigator.requestMIDIAccess) {
            console.warn("MIDI: Web MIDI API não suportada neste navegador.");
            return;
        }

        try {
            this.midiAccess = await navigator.requestMIDIAccess();
            console.log("MIDI: Acesso concedido.");
            this.bindInputs();

            // Reagir a dispositivos conectados/desconectados
            this.midiAccess.onstatechange = (e) => {
                console.log(`MIDI: Dispositivo ${e.port.name} - ${e.port.state}`);
                this.bindInputs();
            };
        } catch (error) {
            console.error("MIDI: Falha ao obter acesso.", error);
        }
    },

    /**
     * Conecta os listeners a todas as entradas MIDI disponíveis.
     */
    bindInputs() {
        if (!this.midiAccess) return;

        const inputs = this.midiAccess.inputs;
        inputs.forEach((input) => {
            input.onmidimessage = (msg) => this.handleMidiMessage(msg);
            console.log(`MIDI: Conectado à entrada "${input.name}"`);
        });
    },

    /**
     * Trata mensagens MIDI recebidas.
     * Note On (status 144) com velocity > 0 são mapeados:
     *   - Notas pares (ex: 60, 62) → Avançar
     *   - Notas ímpares (ex: 61, 63) → Retroceder
     *
     * Para pedais simples (CC), Control Change (status 176):
     *   - Valor > 64 → Avançar
     *   - Valor <= 64 → Retroceder
     *
     * @param {MIDIMessageEvent} msg
     */
    handleMidiMessage(msg) {
        const [status, data1, data2] = msg.data;
        const command = status & 0xf0; // Extrai o comando (ignora canal)

        // Note On
        if (command === 0x90 && data2 > 0) {
            if (data1 % 2 === 0) {
                App.nextSlide();
            } else {
                App.prevSlide();
            }
        }

        // Control Change (pedais de expressão/sustain)
        if (command === 0xb0) {
            if (data2 > 64) {
                App.nextSlide();
            } else {
                App.prevSlide();
            }
        }
    },
};

// Expõe globalmente
window.MidiController = MidiController;

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    MidiController.init();
});
