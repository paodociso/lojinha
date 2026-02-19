// ============================================
// CONFIGURAÇÕES GLOBAIS - PÃO DO CISO
// ============================================

window.config = {
    whatsappVendedor:  '5511976799866',
    chavePix:          'paodociso@gmail.com',
    nomeLoja:          'PÃO DO CISO',
    taxaEntregaPadrao: 8.00,
    tempoNotificacao:  3000,
    urlPlanilha:       'https://script.google.com/macros/s/AKfycbzjMJHJ7awYSo-T9TrhF2ByutCxl8Rjt6_c80ivuWCaBqhIz9KoVLA8IMO7JiwmQTl1QQ/exec',
    versao:            '2.0.0',

    // ✅ Flag de debug — mude para true localmente para ver console.logs
    // Em produção mantenha false para silenciar logs
    DEBUG: false
};

// Wrapper global de log — use log() no lugar de console.log()
// Só imprime quando config.DEBUG === true
window.log = function(...args) {
    if (window.config?.DEBUG) {
        console.log(...args);
    }
};
