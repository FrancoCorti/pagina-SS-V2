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
    
    if(track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button--right');
        const prevButton = document.querySelector('.carousel-button--left');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        // Obtiene el ancho dinámico del primer slide
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Organiza los slides uno al lado del otro
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        // Función principal para mover el carrusel
        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        }

        // Actualiza los dots visuales
        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-indicator');
            targetDot.classList.add('current-indicator');
        }

        // Oculta/Muestra flechas si es el inicio o final
        const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
            if (targetIndex === 0) {
                prevButton.classList.add('is-hidden');
                nextButton.classList.remove('is-hidden');
            } else if (targetIndex === slides.length - 1) {
                prevButton.classList.remove('is-hidden');
                nextButton.classList.add('is-hidden');
            } else {
                prevButton.classList.remove('is-hidden');
                nextButton.classList.remove('is-hidden');
            }
        }

        // Click Flecha Derecha
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-indicator');
            const nextDot = currentDot.nextElementSibling;
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        });

        // Click Flecha Izquierda
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-indicator');
            const prevDot = currentDot.previousElementSibling;
            const prevIndex = slides.findIndex(slide => slide === prevSlide);

            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
            hideShowArrows(slides, prevButton, nextButton, prevIndex);
        });

        // Click en los Dots
        dotsNav.addEventListener('click', e => {
            // Ignorar clics que no sean en un botón
            const targetDot = e.target.closest('button');
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-indicator');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
            hideShowArrows(slides, prevButton, nextButton, targetIndex);
        });
    }

    // ==========================================
    // LÓGICA DEL FORMULARIO DE CONTACTO
    // ==========================================
    const contactForm = document.getElementById('b2b-form');
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita que la página se recargue
            
            const btnSubmit = contactForm.querySelector('.form-submit');
            const originalText = btnSubmit.textContent;
            
            // Efecto visual de "Enviando"
            btnSubmit.textContent = 'Enviando...';
            btnSubmit.style.opacity = '0.7';
            btnSubmit.disabled = true;

            // Simulamos el envío a un servidor (Aquí luego conectarías Fetch a un Back-end)
            setTimeout(() => {
                // Mensaje de éxito
                btnSubmit.textContent = '¡Solicitud Enviada!';
                btnSubmit.style.backgroundColor = 'var(--color-verde)';
                btnSubmit.style.opacity = '1';
                
                // Limpiamos el formulario
                contactForm.reset();

                // Restauramos el botón después de 3 segundos
                setTimeout(() => {
                    btnSubmit.textContent = originalText;
                    btnSubmit.style.backgroundColor = '';
                    btnSubmit.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});