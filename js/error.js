function goHome() {
    // Animación de salida antes de redirigir
    const container = document.querySelector('.error-container');
    const button = document.querySelector('.home-button');
    
    // Deshabilitar botón para evitar múltiples clics
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirigiendo...';
    
    // Animación de salida
    container.style.animation = 'none';
    container.style.transition = 'all 0.5s ease';
    container.style.transform = 'translateY(50px) scale(0.95)';
    container.style.opacity = '0';
    
    // Redirigir después de la animación
    setTimeout(() => {
        try {
            // Intentar redirigir al inicio
            window.location.href = 'index.html';
        } catch (error) {
            // Si falla, intentar métodos alternativos
            fallbackRedirect();
        }
    }, 500);
}

function fallbackRedirect() {
    // Métodos alternativos de redirección
    try {
        // Método 1: location.replace
        window.location.replace('index.html');
    } catch (e1) {
        try {
            // Método 2: asignación directa
            window.location = 'index.html';
        } catch (e2) {
            try {
                // Método 3: usar href del objeto location
                document.location.href = 'index.html';
            } catch (e3) {
                // Método 4: recargar completamente
                location.reload();
            }
        }
    }
}

// Detectar error específico si viene en la URL
function detectErrorFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const errorType = urlParams.get('error');
    
    const messages = {
        '404': 'La página que buscas parece haberse escondido. ¡Como cuando jugamos al escondite!',
        '500': 'El servidor está tomando un descanso. Como nosotros después de un largo día juntos.',
        'network': 'Parece que perdimos la conexión. Como a veces perdemos el hilo de nuestra conversación.',
        'password': 'La contraseña no era la correcta. Pero mi amor por ti siempre lo es.',
        'default': 'Algo inesperado pasó. Como cuando te conocí, ¡fue la mejor sorpresa!'
    };
    
    const message = messages[errorType] || messages['default'];
    const errorTextElement = document.getElementById('errorText');
    
    if (errorTextElement && message) {
        errorTextElement.textContent = message;
        
        // Re-animar el texto nuevo
        const text = errorTextElement.textContent;
        errorTextElement.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = (index * 0.03) + 's';
            errorTextElement.appendChild(span);
        });
    }
}

// Función para recargar la página
function retryPage() {
    const button = document.querySelector('.home-button');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Intentando de nuevo...';
    button.disabled = true;
    
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Agregar funcionalidad de teclado
document.addEventListener('keydown', function(event) {
    // Escape para ir al inicio
    if (event.key === 'Escape') {
        goHome();
    }
    
    // R para recargar
    if (event.key === 'r' || event.key === 'R') {
        retryPage();
    }
});

// Detectar si es offline
window.addEventListener('offline', function() {
    const errorTextElement = document.getElementById('errorText');
    if (errorTextElement) {
        errorTextElement.textContent = 'Parece que estás offline. Como esos momentos en que solo existimos tú y yo.';
    }
});

// Detectar cuando vuelve online
window.addEventListener('online', function() {
    const button = document.querySelector('.home-button');
    if (button) {
        button.innerHTML = '<i class="fas fa-wifi"></i> ¡Conexión restaurada! Volver al inicio';
        button.onclick = goHome;
    }
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    detectErrorFromURL();
    
    // Mostrar sugerencia específica según el error
    const urlParams = new URLSearchParams(window.location.search);
    const errorType = urlParams.get('error');
    
    if (errorType === 'network') {
        const tip = document.querySelector('.error-tip p');
        if (tip) {
            tip.textContent = 'Verifica tu conexión a internet. A veces, como el amor, solo necesita un momento para reconectar.';
        }
    }
    
    // Efecto de brillo intermitente en el título
    const title = document.querySelector('h1');
    setInterval(() => {
        title.style.textShadow = '0 0 30px rgba(255, 107, 139, 0.6)';
        setTimeout(() => {
            title.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)';
        }, 800);
    }, 3000);
});