document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const modal = document.getElementById('video-modal');
    const modalContent = document.getElementById('modal-media-content');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar-menu');

    let proyectosData = [];

    fetch('proyectos.json')
        .then(res => res.json())
        .then(data => {
            proyectosData = data;
            renderizar(proyectosData);
        });

    function renderizar(lista) {
        grid.innerHTML = '';
        lista.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card';
            const tieneVideo = p.videos && p.videos.length > 0;
            
            card.innerHTML = `
                <img src="${p.img}" alt="${p.titulo}">
                <div class="icon-overlay">${tieneVideo ? '▶' : '🔗'}</div>
            `;
            
            card.onclick = () => abrirModal(p);
            grid.appendChild(card);
        });
    }

    function abrirModal(proyecto) {
        modal.classList.add('active');
        if (proyecto.videos && proyecto.videos.length > 0) {
            modalContent.innerHTML = `<iframe src="https://www.youtube.com/embed/${proyecto.videos[0]}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            modalContent.innerHTML = `<a href="${proyecto.link}" target="_blank" style="color:white; font-size:2rem; text-decoration:none;">VER PROYECTO</a>`;
        }
    }

    // Cerrar modal
    document.getElementById('modal-close').onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

    // Filtros
    menuToggle.onclick = () => sidebar.classList.toggle('active');
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const cat = link.getAttribute('data-category');
            renderizar(cat === 'todos' ? proyectosData : proyectosData.filter(p => p.categoria === cat));
            sidebar.classList.remove('active');
        };
    });
});
