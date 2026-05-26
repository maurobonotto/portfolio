document.addEventListener('DOMContentLoaded', () => {
    let todosLosProyectos = [];
    let videosProyectoActual = [];
    let indiceVideoActual = 0;

    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-media-content');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const btnClose = document.getElementById('modal-close');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('menu-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const btnReel = document.getElementById('btnReel');

    async function cargarProyectos() {
        try {
            const respuesta = await fetch('proyectos.json');
            if (!respuesta.ok) throw new Error('Error al cargar la base de datos JSON');
            todosLosProyectos = await respuesta.json();
            renderizerPortafolio();
        } catch (error) {
            console.error('Error crítico:', error);
        }
    }

    function renderizerPortafolio() {
        const grids = {
            documentales: document.getElementById('grid-documentales'),
            ficcion: document.getElementById('grid-ficcion'),
            trailers: document.getElementById('grid-trailers'),
            comerciales: document.getElementById('grid-comerciales'),
            asistencia: document.getElementById('grid-asistencia'),
            videoclips: document.getElementById('grid-videoclips')
        };

        // Vaciar grillas antes de inyectar
        Object.values(grids).forEach(g => { if (g) g.innerHTML = ''; });

        todosLosProyectos.forEach(proyecto => {
            const gridDestino = grids[proyecto.categoria];
            if (!gridDestino) return;

            const card = document.createElement('div');
            card.className = 'project-card';

            // Seleccionar SVG: Play o Enlace externo
            let iconoSVG = '';
            if (proyecto.tipo_enlace === 'popup') {
                iconoSVG = `<svg class="icon-action" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
            } else if (proyecto.tipo_enlace === 'externo') {
                iconoSVG = `<svg class="icon-action" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`;
            }

            const listaDetalles = proyecto.detalles.map(d => `<li>${d}</li>`).join('');
            
            // Achicar fuente para "Anda Calabaza"
            const esAndaCalabaza = proyecto.titulo.toLowerCase().includes('anda calabaza');
            const claseTitulo = esAndaCalabaza ? 'project-title title-small' : 'project-title';

            card.innerHTML = `
                <div class="project-thumbnail-wrapper">
                    <img src="${proyecto.img}" alt="${proyecto.titulo}" loading="lazy">
                    <div class="project-overlay">
                        ${iconoSVG}
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="${claseTitulo}">${proyecto.titulo}</h3>
                    <ul class="project-details">
                        ${listaDetalles}
                    </ul>
                </div>
            `;

            // Asignación de clics
            const wrapper = card.querySelector('.project-thumbnail-wrapper');
            wrapper.addEventListener('click', () => manejarAccionProyecto(proyecto));

            gridDestino.appendChild(card);
        });

        // Mostrar solo las secciones que tengan contenido
        Object.keys(grids).forEach(cat => {
            const section = document.getElementById(cat);
            if (section) {
                const tieneProyectos = todosLosProyectos.some(p => p.categoria === cat);
                section.style.display = tieneProyectos ? 'block' : 'none';
            }
        });
    }

    // Modal y Comportamientos de Click
    function manejarAccionProyecto(proyecto) {
        if (proyecto.tipo_enlace === 'externo') {
            window.open(proyecto.link_externo, '_blank');
        } else if (proyecto.tipo_enlace === 'popup') {
            if (proyecto.videos && proyecto.videos.length > 0) {
                videosProyectoActual = proyecto.videos;
                indiceVideoActual = 0;
                abrirModal();
            }
        }
    }

    function abrirModal() {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        actualizarVideoModal();
    }

    function cerrarModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        modalContent.innerHTML = ''; // Detiene el audio
    }

    function actualizarVideoModal() {
        const idVideo = videosProyectoActual[indiceVideoActual];
        modalContent.innerHTML = `
            <iframe src="https://www.youtube.com/embed/${idVideo}?autoplay=1&rel=0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
            </iframe>
        `;

        // Activa/Desactiva flechas si hay múltiples videos en el array
        if (videosProyectoActual.length > 1) {
            btnPrev.style.display = 'flex';
            btnNext.style.display = 'flex';
        } else {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
        }
    }

    function navegarModal(direccion) {
        if (direccion === 'next') {
            indiceVideoActual = (indiceVideoActual + 1) % videosProyectoActual.length;
        } else {
            indiceVideoActual = (indiceVideoActual - 1 + videosProyectoActual.length) % videosProyectoActual.length;
        }
        actualizarVideoModal();
    }

    // Navegación Sidebar Menú Hamburguesa
    function alternarMenu() {
        menuToggle.classList.toggle('open');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    function cerrarMenu() {
        menuToggle.classList.remove('open');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    menuToggle.addEventListener('click', alternarMenu);
    overlay.addEventListener('click', cerrarMenu);
    
    // Controles Modal Cierre y Navegación
    modalBackdrop.addEventListener('click', cerrarModal);
    btnClose.addEventListener('click', cerrarModal);
    btnPrev.addEventListener('click', () => navegarModal('prev'));
    btnNext.addEventListener('click', () => navegarModal('next'));

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            cerrarModal();
        }
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                cerrarMenu();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Clic en la palabra "Reel" de la cabecera
    if (btnReel) {
        btnReel.addEventListener('click', (e) => {
            e.preventDefault();
            // Llama a "El Farmer" como video Reel por defecto, podés cambiar este ID.
            videosProyectoActual = ["glywlnkOWK4"]; 
            indiceVideoActual = 0;
            abrirModal();
        });
    }

    cargarProyectos();
});
