// ⚠️ IMPORTANTE: Reemplaza esta URL con la que te dé Google Apps Script al implementarlo.
const URL_GOOGLE_SCRIPT = 'https://script.google.com/macros/s/AKfycbxXcxVeNWr586E9zHOwWrVni4ueIfYhhBMK6WbVw3Y_8vgVl7SNEx0T4uSQArZXMowi8A/exec';

document.getElementById('formularioCredenciales').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('btnEnviar');
    const mensaje = document.getElementById('mensaje');
    const form = e.target;
    
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    mensaje.textContent = '';

    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    // Validar peso (10MB)
    if (file && file.size > 10 * 1024 * 1024) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'El archivo supera los 10MB. Por favor, sube una imagen más pequeña.';
        btn.disabled = false;
        btn.textContent = 'Enviar';
        return;
    }

    // Convertir imagen a Base64 para enviarla por JSON
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64String = event.target.result;
        
        const payload = {
            correo: form.correo.value,
            incluir_soporte: form.incluir_soporte.checked ? 'Sí' : 'No',
            razon_social: form.razon_social.value,
            tipo_documento: form.tipo_documento.value,
            numero_documento: form.numero_documento.value,
            lugar_expedicion: form.lugar_expedicion.value,
            nombre_completo: form.nombre_completo.value,
            cargo: form.cargo.value,
            firma_base64: base64String,
            firma_nombre: file.name
        };

        enviarDatos(payload, btn, mensaje, form);
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        enviarDatos({}, btn, mensaje, form); 
    }
});

function enviarDatos(payload, btn, mensaje, form) {
    fetch(URL_GOOGLE_SCRIPT, {
        method: 'POST',
        // Usamos text/plain para evitar problemas de CORS con Google Apps Script
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.result === 'success') {
            // 🚀 REDIRECCIÓN A LA PÁGINA DE ÉXITO
            window.location.href = 'exito.html';
        } else {
            throw new Error(data.error || 'Error desconocido en el servidor');
        }
    })
    .catch(error => {
        mensaje.style.color = 'red';
        mensaje.textContent = '❌ Error al enviar: ' + error.message;
        btn.disabled = false;
        btn.textContent = 'Enviar';
    });
}
