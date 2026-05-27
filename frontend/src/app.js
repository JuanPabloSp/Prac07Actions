// Frontend Application Logic
console.log('🚀 Monorepo Frontend app initialized (v1.0.1).');

function greetUser() {
    return '¡Hola desde el Frontend optimizado!';
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const appContainer = document.getElementById('app');
        const actionBtn = document.getElementById('action-btn');

        if (appContainer) {
            appContainer.textContent = 'Aplicación cargada y lista para producción.';
        }

        if (actionBtn) {
            actionBtn.addEventListener('click', () => {
                const time = new Date().toLocaleTimeString();
                const greeting = `${greetUser()} Hora del sistema: ${time}`;
                alert(greeting);
                console.log('Button clicked, greeting shown:', greeting);
            });
        }
    });
}

// Export elements for unit testing
if (typeof module !== 'undefined') {
    module.exports = { greetUser };
}
