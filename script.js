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
    const sidebarReel = document.getElementById('sidebarReel');
    const sidebarContacto = document.getElementById('sidebarContacto');

    let proyectoActual = null;
    let indiceVideoActual = 0;
    let currentPlayer = null;
    let progressInterval = null;

    const reelProyecto = {
        tipo_enlace: 'popup',
        videos: ['i9Gemrs27vk']
    };

    async function cargarProyectos() {
        try {
            const respuesta = await fetch('proyectos.json');
            if (!respuesta.ok) throw new Error('Error al cargar proyectos.json');
            todosLosProyectos = await respuesta.json();
            generarSecciones();
        } catch (error) {
            console.error('Error:', error);
            portfolioContainer.innerHTML = '<p>Error al cargar proyectos.</p>';
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
        
        tituloHTML = tituloHTML.replace(/ - Co-editor/g, '<span class="coeditor"> - Co-editor</span>');
        
        const indexEdicion = detalles.findIndex(d => d.includes("Edición + animación"));
        if (indexEdicion !== -1) {
            detalles.splice(indexEdicion, 1);
            tituloHTML += '<span class="coeditor"> - Edición + animación</span>';
        }
        
        const lineasDetalle = detalles.map(linea => `<p class="project-detail-line">${linea}</p>`).join('');
        
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        
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
        if (currentPlayer && currentPlayer.destroy) currentPlayer.destroy();
        if (progressInterval) clearInterval(progressInterval);
        currentPlayer = null;
        proyectoActual = null;
        indiceVideoActual = 0;
    }

    function actualizarModal() {
        if (!proyectoActual || !proyectoActual.videos || proyectoActual.videos.length === 0) return;
        
        const videos = proyectoActual.videos;
        const videoId = videos[indiceVideoActual];
        const plataforma = proyectoActual.plataforma || 'youtube';
        
        // Construir estructura con controles personalizados
        modalContent.innerHTML = `
            <div class="iframe-container">
                <div class="video-wrapper" id="video-wrapper"></div>
                <div class="custom-controls">
                    <button class="custom-play-pause" id="custom-play-pause">❚❚</button>
                    <div class="progress-bar-container" id="progress-bar-container">
                        <div class="progress-bar" id="progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        const wrapper = document.getElementById('video-wrapper');
        
        if (plataforma === 'vimeo') {
            // Vimeo: iframe simple sin controles
            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=0&title=0&byline=0&portrait=0`;
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            wrapper.appendChild(iframe);
            
            // Botón personalizado para Vimeo (sin barra de progreso)
            const playPauseBtn = document.getElementById('custom-play-pause');
            document.getElementById('progress-bar-container').style.display = 'none';
            playPauseBtn.addEventListener('click', () => {
                // Vimeo no permite control directo sin API, recargamos con play
                iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=0&title=0&byline=0&portrait=0`;
            });
        } else {
            // YouTube: usar API para controles personalizados y sin botón central
            // Destruir player anterior si existe
            if (currentPlayer && currentPlayer.destroy) currentPlayer.destroy();
            
            // Crear contenedor para API de YouTube
            const playerDiv = document.createElement('div');
            playerDiv.id = 'youtube-api-player';
            playerDiv.style.width = '100%';
            playerDiv.style.height = '100%';
            wrapper.appendChild(playerDiv);
            
            // Cargar API si no está
            if (typeof YT === 'undefined') {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
            }
            
            // Función de inicialización
            window.onYouTubeIframeAPIReady = () => {
                currentPlayer = new YT.Player('youtube-api-player', {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        disablekb: 1,
                        modestbranding: 1,
                        rel: 0
                    },
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });
            };
            
            // Si ya está cargada, ejecutar directamente
            if (typeof YT !== 'undefined' && YT.loaded) {
                window.onYouTubeIframeAPIReady();
            }
        }
        
        function onPlayerReady(event) {
            const playPauseBtn = document.getElementById('custom-play-pause');
            const progressContainer = document.getElementById('progress-bar-container');
            const progressBar = document.getElementById('progress-bar');
            
            playPauseBtn.addEventListener('click', () => {
                if (currentPlayer.getPlayerState() === 1) {
                    currentPlayer.pauseVideo();
                    playPauseBtn.textContent = '►';
                } else {
                    currentPlayer.playVideo();
                    playPauseBtn.textContent = '❚❚';
                }
            });
            
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = clickX / rect.width;
                const duration = currentPlayer.getDuration();
                currentPlayer.seekTo(percent * duration, true);
            });
            
            startProgressUpdates();
        }
        
        function onPlayerStateChange(event) {
            const playPauseBtn = document.getElementById('custom-play-pause');
            const progressBar = document.getElementById('progress-bar');
            if (event.data === YT.PlayerState.PLAYING) {
                playPauseBtn.textContent = '❚❚';
                startProgressUpdates();
            } else if (event.data === YT.PlayerState.PAUSED) {
                playPauseBtn.textContent = '►';
                if (progressInterval) clearInterval(progressInterval);
            } else if (event.data === YT.PlayerState.ENDED) {
                playPauseBtn.textContent = '►';
                if (progressInterval) clearInterval(progressInterval);
                if (progressBar) progressBar.style.width = '0%';
            }
        }
        
        function startProgressUpdates() {
            if (progressInterval) clearInterval(progressInterval);
            progressInterval = setInterval(() => {
                if (currentPlayer && currentPlayer.getCurrentTime) {
                    const current = currentPlayer.getCurrentTime();
                    const duration = currentPlayer.getDuration();
                    if (duration && !isNaN(duration)) {
                        const percent = (current / duration) * 100;
                        const progressBar = document.getElementById('progress-bar');
                        if (progressBar) progressBar.style.width = percent + '%';
                    }
                }
            }, 500);
        }
        
        // Mostrar flechas si hay múltiples videos
        if (videos.length > 1) {
            btnPrev.style.display = 'flex';
            btnNext.style.display = 'flex';
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
        } else {
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
    modal.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) cerrarModal(); });
    menuToggle.addEventListener('click', alternarMenu);
    if (overlay) overlay.addEventListener('click', cerrarMenu);
    
    sidebarLinks.forEach(link => {
        if (link.id === 'sidebarReel' || link.id === 'sidebarContacto') return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                scrollASeccion(href.substring(1));
            }
        });
    });
    
    if (sidebarReel) sidebarReel.addEventListener('click', (e) => { e.preventDefault(); abrirReel(); cerrarMenu(); });
    if (sidebarContacto) sidebarContacto.addEventListener('click', (e) => { e.preventDefault(); scrollASeccion('contacto'); });
    if (btnReel) btnReel.addEventListener('click', (e) => { e.preventDefault(); abrirReel(); });
    
    cargarProyectos();
});
