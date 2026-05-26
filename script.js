document.addEventListener('DOMContentLoaded', () => {
    let todosLosProyectos = [];
    let videosModalActual = [];
    let indiceVideoActual = 0;

    // Referencias del DOM
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-media-content');
    const btnClose = document.getElementById('modal-close');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('menu-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const btnReel = document.getElementById('btnReel');

    // ID de Youtube extraído de tu estructura original para el botón REEL
    const REEL_VIDEO_ID = 'nqgFi4pGKak'; 

    // Vectores SVG limpios integrados (Evita llamadas rotas a servidores externos)
    const PLAY_SVG = `<svg class="overlay-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    const LINK_SVG = `<svg class="overlay-icon" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>`;

    // 1. Lectura de Base de Datos JSON
    async function cargarProyectos() {
        try {
            const respuesta = await fetch('proyectos.json');
            if (!respuesta.ok) throw new Error('No se pudo leer el archivo proyectos.json');
            todosLosProyectos = await respuesta.json();
            renderizarSecciones();
        } catch (error) {
            console.error('Error al inicializar portafolio:', error);
        }
    }

    // 2. Distribución limpia en Grids específicos
    function renderizarSecciones() {
        const contenedores = {
            documentales: document.getElementById('grid-documentales'),
            ficcion: document.getElementById('grid-ficcion'),
            trailers: document.getElementById('grid-trailers'),
            comerciales: document.getElementById('grid-comerciales'),
            asistencia: document.getElementById('grid-asistencia'),
            videoclips: document.getElementById('grid-videoclips')
        };

        // Limpieza de seguridad
        Object.values(contenedores).forEach(c => { if(c) c.innerHTML = ''; });

        todosLosProyectos.forEach(proyecto => {
            const gridDestino = contenedores[proyecto.categoria];
            if (!gridDestino) return; 

            const card = document.createElement('div');
            card.className = 'project-card';

            // Decisión de ícono en Hover según tipo_enlace
            const iconoOverlay = proyecto.tipo_enlace === 'externo' ? LINK_SVG : PLAY_SVG;
            const listaDetalles = proyecto.detalles.map(d => `<li>${d}</li>`).join('');

            card.innerHTML = `
                <div class="project-img-container">
                    <img src="${proyecto.img}" alt="${proyecto.titulo}" class="project-img" loading="lazy">
                    <div class="project-overlay">
                        ${iconoOverlay}
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${proyecto.titulo}</h3>
                    <ul class="project-desc">
                        ${listaDetalles}
                    </ul>
                </div>
            `;

            // Asignación de acción al presionar la portada
            const imgArea = card.querySelector('.project-img-container');
            imgArea.addEventListener('click', () => {
                if (proyecto.tipo_enlace === 'externo') {
                    window.open(proyecto.link_externo, '_blank');
                } else if (proyecto.tipo_enlace === 'popup') {
                    abrirModalVideo(proyecto.videos);
                }
            });

            gridDestino.appendChild(card);
        });
    }

    // 3. Sistema lógico del Popup (Modal)
    function abrirModalVideo(videosArray) {
        if (!videosArray || videosArray.length === 0) return;
        videosModalActual = videosArray;
        indiceVideoActual = 0;
        
        cargarIframeVideo();
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita el movimiento molesto del fondo
        
        // Habilitar o apagar flechas de "swipe" lateral según volumen de videos
        if (videosModalActual.length > 1) {
            btnPrev.style.display = 'flex';
            btnNext.style.display = 'flex';
        } else {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
        }
    }

    function cargarIframeVideo() {
        const idActual = videosModalActual[indiceVideoActual];
        modalContent.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${idActual}?autoplay=1&rel=0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }

    function cerrarModal() {
        modal.classList.remove('active');
        modalContent.innerHTML = ''; // Destruye el iframe de raíz para mutear el video al instante
        document.body.style.overflow = ''; // Devuelve el scroll normal
        videosModalActual = [];
        indiceVideoActual = 0;
    }

    function transicionarVideo(direccion) {
        if (videosModalActual.length <= 1) return;
        
        if (direccion === 'next') {
            indiceVideoActual = (indiceVideoActual + 1) % videosModalActual.length;
        } else if (direccion === 'prev') {
            indiceVideoActual = (indiceVideoActual - 1 + videosModalActual.length) % videosModalActual.length;
        }
        cargarIframeVideo();
    }

    // Eventos y triggers del Modal
    btnClose.addEventListener('click', cerrarModal);
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); transicionarVideo('prev'); });
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); transicionarVideo('next'); });

    // Corrección del Bug: Cierre haciendo click en el fondo negro exterior
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Cierre mediante la tecla Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal();
    });

    // 4. Gestión Nav-Sidebar y Desplazamientos Continuos (Smooth Scroll)
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

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const anclaDestino = link.getAttribute('href');
            if (anclaDestino.startsWith('#')) {
                e.preventDefault();
                cerrarMenu();
                const seccionObjetivo = document.querySelector(anclaDestino);
                if (seccionObjetivo) {
                    seccionObjetivo.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Triggers Navbar superior (Reel)
    if (btnReel) {
        btnReel.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModalVideo([REEL_VIDEO_ID]);
        });
    }

    cargarProyectos();
});
