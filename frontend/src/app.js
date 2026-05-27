// Frontend Application Logic
console.log('🚀 Monorepo Frontend app initialized.');

function greetUser() {
    const time = new Date().toLocaleTimeString();
    return `¡Hola desde el Frontend optimizado! Hora del sistema: ${time}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    const actionBtn = document.getElementById('action-btn');

    if (appContainer) {
        appContainer.textContent = 'Aplicación cargada y lista para producción.';
    }

    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            const greeting = greetUser();
            alert(greeting);
            console.log('Button clicked, greeting shown:', greeting);
        });
    }
});

// Export elements for unit testing
if (typeof module !== 'undefined') {
    module.exports = { greetUser };
}
