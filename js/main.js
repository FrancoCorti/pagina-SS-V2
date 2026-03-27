// Ocultamos el preloader con un tiempo minimo de visualizacion
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.remove();
                AOS.init({ duration: 800, once: true, offset: 100 });
            }, 700);
        }, 2000);
    } else {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }
});

// Esperamos a que el DOM esté completamente cargado antes de ejecutar scripts
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Arquitectura inicializada correctamente.");

    // ==========================================
    // LÓGICA DEL MENÚ HAMBURGUESA Y NAVEGACIÓN
    // ==========================================
    
    // Seleccionamos los elementos del DOM
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-link, [href^='#']");

    // Lógica para abrir/cerrar menú al tocar la hamburguesa
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
        
        // Refactorización de A11y: Actualizamos el estado para lectores de pantalla
        const isOpen = hamburger.classList.contains("active");
        hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Lógica UX: Si el usuario hace clic en un enlace de navegación, el menú debe cerrarse
    // después de que se complete el scroll suave (800ms por defecto)
    links.forEach(link => {
        link.addEventListener("click", () => {
            // Cerrar menú después de un pequeño delay para mejor UX
            setTimeout(() => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }, 100);
        });
    });

    // ==========================================
    // LÓGICA DEL CARRUSEL DE TESTIMONIOS
    // ==========================================
    const track = document.querySelector('.carousel-track');

    if (track) {
        const slides  = Array.from(track.children);
        const nextBtn = document.querySelector('.carousel-button--right');
        const prevBtn = document.querySelector('.carousel-button--left');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots    = Array.from(dotsNav.children);

        // Calcula el ancho del contenedor en el momento de navegar (responsive)
        const getSlideWidth = () => track.parentElement.getBoundingClientRect().width;

        const moveToSlide = (currentSlide, targetSlide) => {
            const targetIndex = slides.indexOf(targetSlide);
            track.style.transform = `translateX(-${targetIndex * getSlideWidth()}px)`;
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-indicator');
            targetDot.classList.add('current-indicator');
        };

        const hideShowArrows = (targetIndex) => {
            prevBtn.classList.toggle('is-hidden', targetIndex === 0);
            nextBtn.classList.toggle('is-hidden', targetIndex === slides.length - 1);
        };

        nextBtn.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide    = currentSlide.nextElementSibling;
            const currentDot   = dotsNav.querySelector('.current-indicator');
            moveToSlide(currentSlide, nextSlide);
            updateDots(currentDot, currentDot.nextElementSibling);
            hideShowArrows(slides.indexOf(nextSlide));
        });

        prevBtn.addEventListener('click', () => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide    = currentSlide.previousElementSibling;
            const currentDot   = dotsNav.querySelector('.current-indicator');
            moveToSlide(currentSlide, prevSlide);
            updateDots(currentDot, currentDot.previousElementSibling);
            hideShowArrows(slides.indexOf(prevSlide));
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;
            const currentSlide = track.querySelector('.current-slide');
            const currentDot   = dotsNav.querySelector('.current-indicator');
            const targetIndex  = dots.indexOf(targetDot);
            moveToSlide(currentSlide, slides[targetIndex]);
            updateDots(currentDot, targetDot);
            hideShowArrows(targetIndex);
        });

        // Recalcula la posición al cambiar el tamaño de pantalla
        window.addEventListener('resize', () => {
            const currentIndex = slides.indexOf(track.querySelector('.current-slide'));
            track.style.transform = `translateX(-${currentIndex * getSlideWidth()}px)`;
        });
    }

    // ==========================================
    // LÓGICA DEL CARRUSEL DE PASOS
    // ==========================================
    const stepsCarousel = document.querySelector('.steps-carousel');

    if (stepsCarousel) {
        const slides      = Array.from(stepsCarousel.querySelectorAll('.steps-slide'));
        const indicators  = Array.from(stepsCarousel.querySelectorAll('.steps-indicator'));
        const prevBtn     = stepsCarousel.querySelector('#stepsPrev');
        const nextBtn     = stepsCarousel.querySelector('#stepsNext');
        const progressBar = stepsCarousel.querySelector('#stepsProgressBar');
        const total       = slides.length;
        let current       = 0;

        const goTo = (index) => {
            // Quita activo del slide y dot anterior
            slides[current].classList.remove('steps-slide--active');
            indicators[current].classList.remove('steps-indicator--active');

            current = index;

            // Activa el nuevo
            slides[current].classList.add('steps-slide--active');
            indicators[current].classList.add('steps-indicator--active');

            // Actualiza la barra de progreso
            progressBar.style.width = ((current + 1) / total * 100) + '%';

            // Habilita / deshabilita los botones en los extremos
            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === total - 1;
        };

        // Inicializa la barra al cargar
        progressBar.style.width = ((1 / total) * 100) + '%';

        prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
        nextBtn.addEventListener('click', () => { if (current < total - 1) goTo(current + 1); });

        indicators.forEach((dot, i) => {
            dot.addEventListener('click', () => goTo(i));
        });
    }
});