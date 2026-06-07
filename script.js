document.addEventListener('DOMContentLoaded', () => {
    let todosLosProyectos = [];
    let idiomaActual = 'es';

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
    const toggleSlider = document.getElementById('toggle-slider');

    let proyectoActual = null;
    let indiceVideoActual = 0;

    const reelProyecto = {
        tipo_enlace: 'popup',
        videos: ['i9Gemrs27vk']
    };

    const traducciones = {
        es: {
            doc: 'DOCUMENTALES',
            fic: 'FICCIÓN',
            tra: 'TRAILERS',
            cor: 'COMERCIALES',
            asi: 'ASISTENCIA DE EDICIÓN',
            vid: 'VIDEOCLIPS',
            red: 'REDES SOCIALES',
            con: 'CONTACTO',
            contact_title: 'CONTACTO',
            reel: 'REEL',
            contacto_nav: 'Contacto'
        },
        en: {
            doc: 'DOCUMENTARIES',
            fic: 'FICTION',
            tra: 'TRAILERS',
            cor: 'CORPORATE',
            asi: 'EDITING ASSISTANCE',
            vid: 'MUSIC VIDEOS',
            red: 'SOCIAL MEDIA',
            con: 'CONTACT',
            contact_title: 'CONTACT',
            reel: 'REEL',
            contacto_nav: 'Contact'
        }
    };

    // ========== DICCIONARIO DE TRADUCCIÓN DE ROLES ==========
    const rolTraducciones = {
        es: {
            'Edición': 'Edición',
            'Co-edición': 'Co-edición',
            'Asistencia de edición': 'Asistencia de edición',
            'Edición + Guion de montaje': 'Edición + Guion de montaje',
            'Co-edición + Guion de montaje': 'Co-edición + Guion de montaje',
            'Edición + Animaciones AFX': 'Edición + Animaciones AFX',
            'Edición + Asistencia de dirección': 'Edición + Asistencia de dirección'
        },
        en: {
            'Edición': 'Lead Editor',
            'Co-edición': 'Co-editor',
            'Asistencia de edición': 'Assistant Editor',
            'Edición + Guion de montaje': 'Lead Editor + Story Editor',
            'Co-edición + Guion de montaje': 'Co-editor + Story Editor',
            'Edición + Animaciones AFX': 'Lead Editor + AFX Animation',
            'Edición + Asistencia de dirección': 'Lead Editor + Assistant Director'
        }
    };

    // ========== TRADUCCIÓN DE DETALLES ==========
    function traducirDetalle(texto, idioma) {
        if (idioma === 'es') return texto;

        const reglas = [
            // TELEFE
            [/Telefe Noticias \(Telefe - (\d{4} a \d{4})\)/i, 'Telefe News (Telefe Channel, Argentina - $1)'],
            [/Telefe - (\d{4} a \d{4})/i, 'Telefe Channel, Argentina - $1'],
            [/\(Telefe\)/i, '(Telefe Channel, Argentina)'],

            // TRAILERS
            ['Trailer para largometraje documental', 'Trailer for Documentary Feature'],
            ['Trailer para largometraje de ficción', 'Trailer for Fiction Feature'],
            ['Trailer para serie documental', 'Trailer for Documentary Series'],
            ['Trailer para cortometraje', 'Trailer for Short Film'],
            ['Trailer para película documental', 'Trailer for Documentary Feature'],
            ['Trailer para serie web infantil', 'Trailer for Kids Web Series'],

            // FRASES CON NÚMEROS
            [/Episodio piloto: Plásticos - (\d+) min\.?/i, 'Pilot Episode: Plastics - $1 min'],
            [/Documental publicitario - (\d+) min\.?/i, 'Commercial Documentary - $1 min'],
            [/Película para televisión - (\d+) min\.?/i, 'TV Movie - $1 min'],
            [/Cortometraje - (\d+) min\.?/i, 'Short Film - $1 min'],
            [/Proyecto 360° - (\d+) min\.?/i, '360° Screening - $1 min'],
            [/Instructivos - (\d+) videos x (\d+)min\.?/i, 'Tutorials - $1 videos x $2 min'],
            [/Documental Web - (\d+) caps\. x (\d+)min/i, 'Web Documentary - $1 eps. x $2 min'],
            [/Serie Web - (\d+) caps\. x (\d+) min\.?/i, 'Web Series - $1 eps. x $2 min'],
            [/Serie documental - (\d+) caps\. x (\d+) min\.?/i, 'Documentary Series - $1 eps. x $2 min'],
            [/Serie web infantil - (\d+) caps\. x ([\d\-]+) min\.?/i, 'Kids Web Series - $1 eps. x $2 min'],

            // OTRAS FRASES
            ['Institucional para proyección en evento', 'Corporate Video for Event Screening'],
            ['Notas e informes especiales para:', 'Special reports and news segments for:'],
            ['Notas periodísticas e informes especiales para:', 'Special reports and news segments for:'],
            
            // ===== NUEVAS REGLAS PARA REDES SOCIALES =====
            ['Adaptación de la serie en formato vertical corto.', 'Series adaptation in short vertical format.'],
            ['E-commerce unboxing.', 'E-commerce unboxing.'],
            ['Compilado de otros trabajos relevantes para redes.', 'Compilation of other relevant work for social media.'],
            ['Reeles sobre la participación de la franquicia en eventos.', 'Reels about the franchise\'s presence at events.'],
            ['Marca: Plim Plim - Spiritum Entertainment', 'Brand: Plim Plim - Spiritum Entertainment'],
            ['Plataforma: Snips / YouTube Shorts.', 'Platform: Snips / YouTube Shorts.'],
            ['Plataforma: Instagram / TikTok / YouTube Shorts', 'Platform: Instagram / TikTok / YouTube Shorts'],
            ['Plataforma: Mercado Libre Clips.', 'Platform: Mercado Libre Clips.'],
            ['Plataforma: Instagram / TikTok / LinkedIn', 'Platform: Instagram / TikTok / LinkedIn'],
            // ===== FIN NUEVAS REGLAS =====
            
            ['Sala Inmersiva del CCK', 'Immersive Room - CCK (Argentina)'],
            ['Turismo - Ciudad de Buenos Aires', 'Tourism - Buenos Aires City'],
            ['Largometraje documental', 'Documentary Feature'],
            ['Largometraje de ficción', 'Fiction Feature'],
            ['Película documental', 'Documentary Feature'],
            ['Serie web infantil', 'Kids Web Series'],
            ['Serie documental', 'Documentary Series'],
            ['Documental Web', 'Web Documentary'],
            ['Proyecto 360°', '360° Screening'],
            ['Brenda y Mauro Bonotto', 'Brenda & Mauro Bonotto'],
            ['Edición + animación', 'Editing + Animation'],
            ['Asistente de edición', 'Assistant Editor'],
            ['Editor principal', 'Lead Editor'],
            ['Documental publicitario', 'Commercial Documentary'],
            ['Película para televisión', 'TV Movie'],
            ['Instructivos', 'Tutorials'],
            ['Visualizador', 'Visualizer'],
            ['Videoclip', 'Music Video'],
            ['Cortometraje', 'Short Film'],

            // CANALES
            ['Canal Encuentro', 'Encuentro Channel, Argentina'],
            ['Canal ACUA Mayor', 'ACUA Mayor Channel, Argentina'],
            ['Canal 9', 'Channel 9, Argentina'],
            ['Canal 26', 'Channel 26, Argentina'],
            ['C5N', 'C5N Channel, Argentina'],

            // AÑOS
            [/(\d{4}) a (\d{4})/i, '$1 to $2'],
            [/(\d{4}) a /i, '$1 to '],
            [/ a (\d{4})/i, ' to $1'],

            // UNIDADES
            ['caps\\.', 'eps.'],
            ['min\\.', 'min'],
            [/(\d+)min/i, '$1 min'],
        ];

        let resultado = texto;
        for (let [buscar, reemplazar] of reglas) {
            if (typeof buscar === 'string') {
                const escapado = buscar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(escapado, 'gi');
                resultado = resultado.replace(regex, reemplazar);
            } else if (buscar instanceof RegExp) {
                resultado = resultado.replace(buscar, reemplazar);
            }
        }
        resultado = resultado.replace(/\s+/g, ' ').trim();
        return resultado;
    }

   function traducirTitulo(titulo, idioma) {
        if (idioma === 'es') {
            if (titulo === 'HOMENAJE A LEONARDO FAVIO (2022)') {
                return 'HOMENAJE INMERSIVO A LEONARDO FAVIO (2022)';
            }
            return titulo;
        }
        
        const traduccionesTitulo = {
            'VARIOS': 'MISCELLANY',
            'PLIM PLIM - EVENTOS': 'PLIM PLIM - EVENTS',
            'INFORMES PERIODÍSTICOS': 'NEWS REPORTS',
            'HOMENAJE A LEONARDO FAVIO (2022)': 'IMMERSIVE HOMAGE TO LEONARDO FAVIO (2022)',
            'HOMENAJE INMERSIVO A LEONARDO FAVIO (2022)': 'IMMERSIVE HOMAGE TO LEONARDO FAVIO (2022)',
        };
        
        if (traduccionesTitulo[titulo]) {
            return traduccionesTitulo[titulo];
        }
        
        let nuevo = titulo;
        nuevo = nuevo.replace(' - Co-editor', '');
        nuevo = nuevo.replace('Edición + animación', 'Editing + Animation');
        return nuevo.trim();
    }

    function aplicarTraduccionInterfaz() {
        document.querySelectorAll('.sidebar-link[data-key]').forEach(link => {
            const key = link.getAttribute('data-key');
            if (traducciones[idiomaActual][key]) {
                link.textContent = traducciones[idiomaActual][key];
            }
        });
        const contactTitle = document.querySelector('[data-key="contact_title"]');
        if (contactTitle) contactTitle.textContent = traducciones[idiomaActual].contact_title;
        const navReel = document.getElementById('btnReel');
        const navContacto = document.querySelector('.nav-links a[href="#contacto"]');
        if (navReel) navReel.textContent = traducciones[idiomaActual].reel;
        if (navContacto) navContacto.textContent = traducciones[idiomaActual].contacto_nav;
    }

    function cambiarIdioma(idioma) {
        idiomaActual = idioma;
        localStorage.setItem('lang', idioma);
        if (idioma === 'en') {
            toggleSlider.setAttribute('data-lang', 'en');
        } else {
            toggleSlider.setAttribute('data-lang', 'es');
        }
        const langEs = document.querySelector('.lang-option[data-lang="es"]');
        const langEn = document.querySelector('.lang-option[data-lang="en"]');
        if (langEs) langEs.classList.toggle('active-lang', idioma === 'es');
        if (langEn) langEn.classList.toggle('active-lang', idioma === 'en');
        
        aplicarTraduccionInterfaz();
        generarSecciones();
    }

    function inicializarIdioma() {
        const guardado = localStorage.getItem('lang');
        if (guardado === 'es' || guardado === 'en') {
            idiomaActual = guardado;
        } else {
            const navLang = navigator.language || navigator.userLanguage;
            if (navLang && navLang.toLowerCase().startsWith('es')) {
                idiomaActual = 'es';
            } else {
                idiomaActual = 'en';
            }
        }
        cambiarIdioma(idiomaActual);
    }

    async function cargarProyectos() {
        try {
            const respuesta = await fetch('proyectos.json');
            if (!respuesta.ok) throw new Error('Error al cargar proyectos.json');
            todosLosProyectos = await respuesta.json();
            generarSecciones();
        } catch (error) {
            console.error('Error:', error);
            portfolioContainer.innerHTML = '<p>Error loading projects.</p>';
        }
    }

    function generarSecciones() {
        const ordenCategorias = ['documentales', 'ficcion', 'trailers', 'comerciales', 'asistencia', 'videoclips', 'redes-sociales'];
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
            let nombreCategoria = '';
            switch(categoria) {
                case 'documentales': nombreCategoria = traducciones[idiomaActual].doc; break;
                case 'ficcion': nombreCategoria = traducciones[idiomaActual].fic; break;
                case 'trailers': nombreCategoria = traducciones[idiomaActual].tra; break;
                case 'comerciales': nombreCategoria = traducciones[idiomaActual].cor; break;
                case 'asistencia': nombreCategoria = traducciones[idiomaActual].asi; break;
                case 'videoclips': nombreCategoria = traducciones[idiomaActual].vid; break;
                case 'redes-sociales': nombreCategoria = traducciones[idiomaActual].red; break;
                default: nombreCategoria = categoria.toUpperCase();
            }
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
        
        // TRADUCCIÓN DEL ROL
        let rolTexto = '';
        if (proyecto.rol) {
            let rolMostrado = proyecto.rol;
            if (idiomaActual === 'en') {
                rolMostrado = rolTraducciones.en[proyecto.rol] || proyecto.rol;
            }
            rolTexto = `<p class="project-rol">${rolMostrado}</p>`;
        }
        
        // Traducción de detalles y título si es inglés
        if (idiomaActual === 'en') {
            detalles = detalles.map(linea => traducirDetalle(linea, 'en'));
            tituloHTML = traducirTitulo(tituloHTML, 'en');
        } else {
            tituloHTML = traducirTitulo(tituloHTML, 'es');
        }
        
        // Manejo especial de "Edición + animación"
        const indexEdicion = detalles.findIndex(d => d.includes("Editing + Animation") || d.includes("Edición + animación"));
        if (indexEdicion !== -1) {
            detalles.splice(indexEdicion, 1);
            const textoEdicion = (idiomaActual === 'es') ? ' - Edición + animación' : ' - Editing + Animation';
            tituloHTML += `<span class="coeditor">${textoEdicion}</span>`;
        }
        
        const lineasDetalle = detalles.map(linea => `<p class="project-detail-line">${linea}</p>`).join('');
        
        const imageWrapper = document.createElement('div');
        let imageWrapperClass = 'image-wrapper';
        if (proyecto.categoria === 'redes-sociales') {
            imageWrapperClass += ' vertical';
        }
        imageWrapper.className = imageWrapperClass;
        
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
        detailsDiv.innerHTML = rolTexto + lineasDetalle;
        
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
        const modalContainer = document.querySelector('.modal-container');
        if (modalContainer) modalContainer.classList.remove('vertical-mode');
    }

    function actualizarModal() {
        if (!proyectoActual || !proyectoActual.videos || proyectoActual.videos.length === 0) return;
        
        const videos = proyectoActual.videos;
        const videoId = videos[indiceVideoActual];
        const plataforma = proyectoActual.plataforma || 'youtube';
        
        let iframeSrc = '';
        if (plataforma === 'vimeo') {
            iframeSrc = `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=1`;
        } else {
            iframeSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
        
        const modalContainer = document.querySelector('.modal-container');
        if (proyectoActual.categoria === 'redes-sociales') {
            modalContainer.classList.add('vertical-mode');
        } else {
            modalContainer.classList.remove('vertical-mode');
        }
        
        modalContent.innerHTML = `
            <div class="iframe-container ${proyectoActual.categoria === 'redes-sociales' ? 'vertical' : ''}">
                <div class="video-wrapper">
                    <iframe src="${iframeSrc}" 
                            allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        `;
        
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
        if (link.id === 'sidebarReel' || link.id === 'sidebarContacto') return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                scrollASeccion(targetId);
            }
        });
    });
    
    if (sidebarReel) {
        sidebarReel.addEventListener('click', (e) => {
            e.preventDefault();
            abrirReel();
            cerrarMenu();
        });
    }
    
    if (sidebarContacto) {
        sidebarContacto.addEventListener('click', (e) => {
            e.preventDefault();
            scrollASeccion('contacto');
        });
    }
    
    if (btnReel) {
        btnReel.addEventListener('click', (e) => {
            e.preventDefault();
            abrirReel();
        });
    }

    toggleSlider.addEventListener('click', () => {
        const nuevoIdioma = idiomaActual === 'es' ? 'en' : 'es';
        cambiarIdioma(nuevoIdioma);
    });

    inicializarIdioma();
    cargarProyectos();
    handleInitialHash();  // ✅ Corregido: sin la 's' sobrante
});

// Función para manejar el hash de la URL y desplazar a la sección
function handleInitialHash() {
    setTimeout(() => {
        const hashId = window.location.hash.substring(1);
        if (hashId) {
            const targetSection = document.getElementById(hashId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }, 300);
}