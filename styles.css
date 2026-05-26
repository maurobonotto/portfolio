document.addEventListener('DOMContentLoaded', () => {
    let todosLosProyectos = [];
    let proyectosFiltrados = [];
    let indiceActual = 0;

    const grid = document.getElementById('projects-grid');
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

    async function cargarProyectos() {
        try {
            const respuesta = await fetch('proyectos.json');
            if (!respuesta.ok) throw new Error('Error al cargar la base de datos JSON');
            todosLosProyectos = await respuesta.json();
            filtrarProyectos('todos');
        } catch (error) {
            console.error('Error crítico:', error);
        }
    }

    function filtrarProyectos(categoria) {
        proyectosFiltrados = categoria === 'todos' 
            ? todosLosProyectos 
            : todosLosProyectos.filter(p => p.categoria === categoria);
        renderizarGrid();
    }

    function renderizarGrid() {
        grid.innerHTML = '';
        proyectosFiltrados.forEach((proyecto, indice) => {
            const card = document.createElement('div');
            card.className = `project-card ${proyecto.categoria === 'asistencia' ? 'title-shorten' : ''}`;
            
            const lineasDetalle = proyecto.detalles.map(linea => `<p class="project-detail-line">${linea}</p>`).join('');

            card.innerHTML = `
                <div class="image-wrapper" data-index="${indice}">
                    <img src="${proyecto.img}" alt="${proyecto.titulo}" loading="lazy">
                    ${proyecto.tipo_enlace !== 'estatico' ? '<div class="play-overlay"></div>' : ''}
                </div>
                <h3 class="project-title">${proyecto.titulo}</h3>
                <div class="project-details">${lineasDetalle}</div>
            `;

            card.querySelector('.image-wrapper').addEventListener('click', () => {
                ejecutarAccionProyecto(proyecto, indice);
            });

            grid.appendChild(card);
        });
    }

    function ejecutarAccionProyecto(proyecto, indice) {
        if (proyecto.tipo_enlace === 'externo') {
            window.open(proyecto.url_externa, '_blank');
        } else if (proyecto.tipo_enlace === 'popup' || proyecto.tipo_enlace === 'carrusel') {
            indiceActual = indice;
            abrirModal(proyecto);
        }
    }

    function abrirModal(proyecto) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        actualizarContenidoModal(proyecto);
    }

    function cerrarModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalContent.innerHTML = ''; 
    }

    function actualizarContenidoModal(proyecto) {
        modalContent.innerHTML = '';
        btnPrev.style.display = proyectosFiltrados.length > 1 ? 'block' : 'none';
        btnNext.style.display = proyectosFiltrados.length > 1 ? 'block' : 'none';

        if (proyecto.videos && proyecto.videos.length > 0) {
            const idPrincipal = proyecto.videos[0];
            const restoVideos = proyecto.videos.slice(1).join(',');
            const playlistQuery = restoVideos ? `&playlist=${restoVideos}` : '';
            
            modalContent.innerHTML = `
                <div class="iframe-container">
                    <iframe src="https://www.youtube.com/embed/${idPrincipal}?autoplay=1${playlistQuery}&rel=0" 
                            allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>`;
        }
    }

    function navegarModal(direccion) {
        if (proyectosFiltrados.length <= 1) return;
        indiceActual = direccion === 'next' 
            ? (indiceActual + 1) % proyectosFiltrados.length 
            : (indiceActual - 1 + proyectosFiltrados.length) % proyectosFiltrados.length;
        
        const siguienteProyecto = proyectosFiltrados[indiceActual];
        if (siguienteProyecto.tipo_enlace === 'externo' || siguienteProyecto.tipo_enlace === 'estatico') {
            navegarModal(direccion);
        } else {
            actualizarContenidoModal(siguienteProyecto);
        }
    }

    function alternarMenu() {
        menuToggle.classList.toggle('open');
        sidebar.classList.toggle('active');
        if(overlay) overlay.classList.toggle('active');
    }

    function cerrarMenu() {
        menuToggle.classList.remove('open');
        sidebar.classList.remove('active');
        if(overlay) overlay.classList.remove('active');
    }

    menuToggle.addEventListener('click', alternarMenu);
    if(overlay) overlay.addEventListener('click', cerrarMenu);
    btnClose.addEventListener('click', cerrarModal);
    btnPrev.addEventListener('click', () => navegarModal('prev'));
    btnNext.addEventListener('click', () => navegarModal('next'));

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal();
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filtrarProyectos(link.getAttribute('data-category'));
            cerrarMenu();
            document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
        });
    });

    if(btnReel) {
        btnReel.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal({tipo_enlace: 'popup', videos: ['glywlnkOWK4']});
        });
    }

    cargarProyectos();
});
