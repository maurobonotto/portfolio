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
            con: 'CONTACT',
            contact_title: 'CONTACT',
            reel: 'REEL',
            contacto_nav: 'Contact'
        }
    };

   function traducirDetalle(texto, idioma) {
    if (idioma === 'es') return texto;

    const reglas = [
        // === TELEFE (casos concretos, sin duplicación) ===
        [/Telefe Noticias \(Telefe - (\d{4} a \d{4})\)/i, 'Telefe News (Telefe Channel, Argentina - $1)'],
        [/Telefe - (\d{4} a \d{4})/i, 'Telefe Channel, Argentina - $1'],
        [/\(Telefe\)/i, '(Telefe Channel, Argentina)'],

        // === TRAILERS (frases completas, ANTES de que se traduzcan sus partes) ===
        ['Trailer para largometraje documental', 'Trailer for Documentary Feature'],
        ['Trailer para largometraje de ficción', 'Trailer for Fiction Feature'],
        ['Trailer para serie documental', 'Trailer for Documentary Series'],
        ['Trailer para cortometraje', 'Trailer for Short Film'],
        ['Trailer para película documental', 'Trailer for Documentary Feature'],
        ['Trailer para serie web infantil', 'Trailer for Kids Web Series'],

        // === FRASES CON NÚMEROS (documentales, series, comerciales) ===
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

        // === OTRAS FRASES COMPLETAS (sin números) ===
        ['Institucional para proyección en evento', 'Corporate Video for Event Screening'],
        ['Notas e informes especiales para:', 'Special reports and news segments for:'],
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

        // === CANALES Y PRODUCTORAS (sin duplicación de país) ===
        ['Canal Encuentro', 'Encuentro Channel, Argentina'],
        ['Canal ACUA Mayor', 'ACUA Mayor Channel, Argentina'],
        ['Canal 9', 'Channel 9, Argentina'],
        ['Canal 26', 'Channel 26, Argentina'],
        ['C5N', 'C5N Channel, Argentina'],

        // === RANGOS DE AÑOS ===
        [/(\d{4}) a (\d{4})/i, '$1 to $2'],
        [/(\d{4}) a /i, '$1 to '],
        [/ a (\d{4})/i, ' to $1'],

        // === UNIDADES (siempre al final) ===
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
    // Limpiar espacios dobles
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
        let nuevo = titulo;
        if (nuevo === 'INFORMES PERIODÍSTICOS') {
            nuevo = 'NEWS REPORTS';
        } else if (nuevo === 'HOMENAJE A LEONARDO FAVIO (2022)' || nuevo === 'HOMENAJE INMERSIVO A LEONARDO FAVIO (2022)') {
            nuevo = 'IMMERSIVE HOMAGE TO LEONARDO FAVIO (2022)';
        } else {
            nuevo = nuevo.replace(' - Co-editor', '');
            nuevo = nuevo.replace('Edición + animación', 'Editing + Animation');
        }
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
            let nombreCategoria = '';
            switch(categoria) {
                case 'documentales': nombreCategoria = traducciones[idiomaActual].doc; break;
                case 'ficcion': nombreCategoria = traducciones[idiomaActual].fic; break;
                case 'trailers': nombreCategoria = traducciones[idiomaActual].tra; break;
                case 'comerciales': nombreCategoria = traducciones[idiomaActual].cor; break;
                case 'asistencia': nombreCategoria = traducciones[idiomaActual].asi; break;
                case 'videoclips': nombreCategoria = traducciones[idiomaActual].vid; break;
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
    
    // === MOSTRAR EL ROL (sin traducción, solo español) ===
    let rolTexto = '';
    if (proyecto.rol) {
        rolTexto = `<p class="project-rol">${proyecto.rol}</p>`;
    }
    
    // Eliminamos lógica antigua de "Co-editor" en el título y "Editor principal" porque ahora usamos "rol"
    // Pero mantenemos la traducción de detalles (aunque por ahora está en español, no pasa nada)
    // Como estamos en español, no aplicamos traducciones a detalles ni título.
    
    // (Opcional: si quieres conservar el manejo de "Edición + animación" en el título, lo dejamos)
    const indexEdicion = detalles.findIndex(d => d.includes("Edición + animación"));
    if (indexEdicion !== -1) {
        detalles.splice(indexEdicion, 1);
        tituloHTML += `<span class="coeditor"> - Edición + animación</span>`;
    }
    
    const lineasDetalle = detalles.map(linea => `<p class="project-detail-line">${linea}</p>`).join('');
    
    // === Construcción del DOM ===
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
        
        modalContent.innerHTML = `
            <div class="iframe-container">
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
});