document.addEventListener('DOMContentLoaded', () => {
    let todosLosProyectos = [];

    const portfolioContainer = document.getElementById('portfolio');
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

    let proyectoActual = null;
    let indiceVideoActual = 0;

    const reelProyecto = {
        tipo_enlace: 'popup',
        videos: ['glywlNkOWK4']
    };

    async function cargarProyectos() {
        try {
            const respuesta = await fetch('proyectos.json');
            if (!respuesta.ok) throw new Error('Error al cargar proyectos.json');
            todosLosProyectos = await respuesta.json();
            generarSecciones();
        } catch (error) {
            console.error('Error:', error);
            portfolioContainer.innerHTML = '<p>Error al cargar los proyectos. Verifica la consola.</p>';
        }
    }

    function generarSecciones() {
        const ordenCategorias = ['documentales', 'ficcion', 'trailers', 'comerciales', 'asistencia', 'videoclips'];
        const categoriasExistentes = [...new Set(todosLosProyectos.map(p => p.categoria))];
        const categoriasOrdenadas = ordenCategorias.filter(cat => categoriasExistentes.includes(cat));
        
        portfolioContainer.innerHTML = '';
        
        categoriasOrdenadas.forEach(categoria => {
            const proyectosCat = todosLosProyectos.filter(p => p.categoria === categoria);
            if (proyectosCat.length === 0) return;
            
            const section = document.createElement('section');
            section.id = categoria;
            section.className = 'category-section';
            
            const titulo = document.createElement('h2');
            titulo.className = 'category-title';
            let nombreCategoria = categoria.toUpperCase();
            if (categoria === 'asistencia') nombreCategoria = 'ASISTENCIA DE EDICIÓN';
            titulo.textContent = nombreCategoria;
            section.appendChild(titulo);
            
            const grid = document.createElement('div');
            grid.className = 'projects-grid';
            
            proyectosCat.forEach(proyecto => {
                const card = crearCard(proyecto);
                grid.appendChild(card);
            });
            
            section.appendChild(grid);
            portfolioContainer.appendChild(section);
        });
    }

    function crearCard(proyecto) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        let detalles = [...proyecto.detalles];
        let tituloHTML = proyecto.titulo;
        
        // Reemplazar " - Co-editor" por span con cursiva
        tituloHTML = tituloHTML.replace(/ - Co-editor/g, '<span class="coeditor"> - Co-editor</span>');
        
        // Mover "Edición + animación" desde detalles al título
        const indexEdicion = detalles.findIndex(d => d.includes("Edición + animación"));
        if (indexEdicion !== -1) {
            detalles.splice(indexEdicion, 1);
            tituloHTML += '<span class="coeditor"> - Edición + animación</span>';
        }
        
        const lineasDetalle = detalles.map(linea => `<p class="project-detail-line">${linea}</p>`).join('');
        
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        imageWrapper.setAttribute('data-id', proyecto.id);
        
        const img = document.createElement('img');
        img.src = proyecto.img;
        img.alt = proyecto.titulo;
        img.loading = 'lazy';
        imageWrapper.appendChild(img);
        
        if (proyecto.tipo_enlace !== 'estatico') {
            const overlayPlay = document.createElement('div');
            overlayPlay.className = 'play-overlay';
            imageWrapper.appendChild(overlayPlay);
            
            if (proyecto.tipo_enlace === 'externo') {
                imageWrapper.classList.add('link-externo');
            }
            
            imageWrapper.addEventListener('click', () => {
                ejecutarAccion(proyecto);
            });
        } else {
            imageWrapper.style.cursor = 'default';
        }
        
        const title = document.createElement('h3');
        title.className = 'project-title';
        title.innerHTML = tituloHTML;
        
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'project-details';
        detailsDiv.innerHTML = lineasDetalle;
        
        card.appendChild(imageWrapper);
        card.appendChild(title);
        card.appendChild(detailsDiv);
        
        return card;
    }

    function ejecutarAccion(proyecto) {
        if (proyecto.tipo_enlace === 'externo') {
            window.open(proyecto.url_externa, '_blank');
        } else if (proyecto.tipo_enlace === 'popup' || proyecto.tipo_enlace === 'carrusel') {
            proyectoActual = proyecto;
            indiceVideoActual = 0;
            abrirModal();
        }
    }

    function abrirModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        actualizarModal();
    }

    function cerrarModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalContent.innerHTML = '';
        proyectoActual = null;
        indiceVideoActual = 0;
    }

    function actualizarModal() {
        if (!proyectoActual || !proyectoActual.videos || proyectoActual.videos.length === 0) return;
        
        const videos = proyectoActual.videos;
        const videoId = videos[indiceVideoActual];
        
        modalContent.innerHTML = `
            <div class="iframe-container">
                <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                        allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
        
        if (videos.length > 1) {
            btnPrev.style.display = 'block';
            btnNext.style.display = 'block';
        } else {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
        }
    }

    function navegarVideo(direccion) {
        if (!proyectoActual || !proyectoActual.videos) return;
        const videos = proyectoActual.videos;
        if (videos.length <= 1) return;
        
        if (direccion === 'next') {
            indiceVideoActual = (indiceVideoActual + 1) % videos.length;
        } else if (direccion === 'prev') {
            indiceVideoActual = (indiceVideoActual - 1 + videos.length) % videos.length;
        }
        actualizarModal();
    }

    function abrirReel() {
        proyectoActual = reelProyecto;
        indiceVideoActual = 0;
        abrirModal();
    }

    function scrollASeccion(id) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth' });
            cerrarMenu();
        }
    }

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

    btnClose.addEventListener('click', cerrarModal);
    btnPrev.addEventListener('click', () => navegarVideo('prev'));
    btnNext.addEventListener('click', () => navegarVideo('next'));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal();
    });
    
    menuToggle.addEventListener('click', alternarMenu);
    if (overlay) overlay.addEventListener('click', cerrarMenu);
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                scrollASeccion(targetId);
            }
        });
    });
    
    if (btnReel) {
        btnReel.addEventListener('click', (e) => {
            e.preventDefault();
            abrirReel();
        });
    }
    
    cargarProyectos();
});
