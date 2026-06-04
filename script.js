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

        const mapa = [
            [' - 2018 a 2022', ' - 2018 to 2022'],
            [' - 2023 a 2025', ' - 2023 to 2025'],
            ['a 2022', 'to 2022'],
            ['a 2025', 'to 2025'],
            ['Canal Encuentro', 'Encuentro Channel, Argentina'],
            ['Canal ACUA Mayor', 'ACUA Mayor Channel, Argentina'],
            ['Canal 9', 'Channel 9, Argentina'],
            ['Canal 26', 'Channel 26, Argentina'],
            ['C5N', 'C5N Channel, Argentina'],
            ['Editor principal', 'Lead Editor'],
            ['Co-editor', 'Co-editor'],
            ['Edición \\+ animación', 'Editing + Animation'],
            ['Asistente de edición', 'Assistant Editor'],
            ['Película para televisión - 56 min.', 'TV Movie - 56 min.'],
            ['Cortometraje - 15 min.', 'Short Film - 15 min.'],
            ['Largometraje documental', 'Documentary Feature'],
            ['Largometraje de ficción', 'Fiction Feature'],
            ['Serie - 13 caps. x 30 min.', 'Series - 13 eps. x 30 min.'],
            ['Serie web infantil - 8 caps. x 5-10 min.', 'Kids Web Series - 8 eps. x 5-10 min.'],
            ['Episodio piloto: Plásticos - 33 min.', 'Pilot Episode: Plastics - 33 min.'],
            ['Trailer para largometraje documental', 'Trailer for Documentary Feature'],
            ['Trailer para largometraje de ficción', 'Trailer for Fiction Feature'],
            ['Trailer para serie documental', 'Trailer for Documentary Series'],
            ['Trailer para cortometraje', 'Trailer for Short Film'],
            ['Trailer para serie web infantil', 'Trailer for Kids Web Series'],
            ['Documental Web - 3 caps. x 4min', 'Web Documentary - 3 eps. x 4 min'],
            ['Institucional para proyección en evento', 'Corporate Video for Event Screening'],
            ['Serie Web - 2 caps. x 15 min.', 'Web Series - 2 eps. x 15 min.'],
            ['Documental publicitario - 7 min.', 'Commercial Documentary - 7 min.'],
            ['Instructivos - 2 videos x 10min.', 'Tutorials - 2 videos x 10 min.'],
            ['Visualizador - DJ Sustancia', 'Visualizer - DJ Sustancia'],
            ['Videoclip - Spivi', 'Music Video - Spivi'],
            ['Videoclip - VBV', 'Music Video - VBV'],
            ['Proyecto 360° - 10 min.', '360° Screening - 10 min.'],
            ['Sala Inmersiva del CCK', 'Immersive Room - CCK'],
            ['Telefe Noticias', 'Telefe News'],
            ['Telefe', 'Telefe'],
            ['La Divina Noche de Dante', 'La Divina Noche de Dante'],
            ['Duro de domar', 'Duro de domar'],
            ['Turismo - Ciudad de Buenos Aires', 'Tourism - Buenos Aires City'],
            ['Brenda y Mauro Bonotto', 'Brenda & Mauro Bonotto'],
            ['Notas e informes especiales para:', 'Special reports and segments for:']
        ];

        for (let [es, en] of mapa) {
            if (texto.includes(es)) {
                return texto.replace(new RegExp(es.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), en);
            }
        }
        return texto;
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
        
        // Eliminar "Editor principal" solo para el proyecto "el-farmer"
        if (proyecto.id === 'el-farmer') {
            detalles = detalles.filter(linea => linea !== 'Editor principal');
        }
        
        // Manejo de " - Co-editor" en el título
        let tieneCoeditor = false;
        if (tituloHTML.includes(' - Co-editor')) {
            tieneCoeditor = true;
            tituloHTML = tituloHTML.replace(' - Co-editor', '');
        }
        
        if (idiomaActual === 'en') {
            detalles = detalles.map(linea => traducirDetalle(linea, 'en'));
            tituloHTML = traducirTitulo(tituloHTML, 'en');
        } else {
            tituloHTML = traducirTitulo(tituloHTML, 'es');
        }
        
        // Si tenía Co-editor, agregar la línea correspondiente al principio de detalles
        if (tieneCoeditor) {
            const textoCoeditor = (idiomaActual === 'es') ? 'Co-editor' : 'Co-editor';
            detalles.unshift(textoCoeditor);
        }
        
        tituloHTML = tituloHTML.replace(/ - Co-editor/g, '<span class="coeditor"> - Co-editor</span>');
        
        const indexEdicion = detalles.findIndex(d => d.includes("Editing + Animation") || d.includes("Edición + animación"));
        if (indexEdicion !== -1) {
            detalles.splice(indexEdicion, 1);
            const textoEdicion = (idiomaActual === 'es') ? ' - Edición + animación' : ' - Editing + Animation';
            tituloHTML += `<span class="coeditor">${textoEdicion}</span>`;
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