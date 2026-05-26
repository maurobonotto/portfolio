document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const modal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');

    async function cargarProyectos() {
        const respuesta = await fetch('proyectos.json');
        const proyectos = await respuesta.json();
        renderizar(proyectos);
    }

    function renderizar(proyectos) {
        grid.innerHTML = '';
        proyectos.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const tieneVideo = p.videos && p.videos.length > 0;
            const icono = tieneVideo ? '▶' : '🔗';

            card.innerHTML = `
                <img src="${p.img}" alt="${p.titulo}">
                <div class="overlay">
                    <span class="icon">${icono}</span>
                </div>
            `;
            
            card.addEventListener('click', () => abrirModal(p));
            grid.appendChild(card);
        });
    }

    function abrirModal(p) {
        modal.classList.add('active');
        // Lógica de carga de video o enlace externo
    }

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Cerrar al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    cargarProyectos();
});
