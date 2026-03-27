/**
 * parser.js
 * Responsável por ler e processar os arquivos de texto das músicas.
 */

class LyricParser {
    /**
     * Busca o arquivo de texto bruto no caminho especificado e realiza o parsing.
     * @param {string} filepath Caminho para o arquivo .txt
     */
    static async fetchAndParse(filepath) {
        try {
            // Constrói URL absoluta a partir da base da página
            const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
            const fullUrl = baseUrl + filepath;
            const encodedUrl = encodeURI(fullUrl);

            console.log("Parser: Tentando carregar:", encodedUrl);

            const response = await fetch(encodedUrl);
            console.log("Parser: Status da resposta:", response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const text = await response.text();
            console.log("Parser: Texto bruto recebido, tamanho:", text.length);
            return this.parseText(text);
        } catch (error) {
            console.error("Parser: Falha ao buscar letra:", error.message);
            console.error("Parser: Filepath original:", filepath);
            return null;
        }
    }

    /**
     * Realiza o parsing de um texto bruto, extraindo metadados e dividindo as estrofes.
     * @param {string} rawText Texto bruto da música
     */
    static parseText(rawText) {
        // Normaliza as quebras de linha para focar no padrão \n
        const normalizedText = rawText.replace(/\r\n/g, '\n');
        
        // Divide o texto em blocos separados por linha em dupla (ou mais)
        const blocks = normalizedText.split(/\n\s*\n/);
        
        let title = "Título Desconhecido";
        let author = "Autor Desconhecido";
        let slides = [];

        // O primeiro bloco geralmente contém os metadados
        if (blocks.length > 0) {
            const firstBlockLines = blocks[0].split('\n');
            let isMetadataBlock = false;

            firstBlockLines.forEach(line => {
                if (line.toLowerCase().startsWith('título:') || line.toLowerCase().startsWith('titulo:')) {
                    title = line.substring(7).trim();
                    isMetadataBlock = true;
                } else if (line.toLowerCase().startsWith('autor:')) {
                    author = line.substring(6).trim();
                    isMetadataBlock = true;
                }
            });

            // Se o primeiro bloco foi de metadados, ignora ele como slide de letra
            if (isMetadataBlock) {
                blocks.shift();
            }

            // O restante dos blocos são os slides, adicionamos filtrando os vazios
            blocks.forEach(block => {
                const cleanBlock = block.trim();
                if (cleanBlock.length > 0) {
                    slides.push(cleanBlock);
                }
            });
        }

        return {
            title,
            author,
            slides
        };
    }
}

// Expõe globalmente
window.LyricParser = LyricParser;
