
        // Скролл и Навигация
        const navbar = document.getElementById('navbar');
        const burger = document.getElementById('burger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollTopBtn = document.getElementById('scrollTop');

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => link.addEventListener('click', () => {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }));

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
            scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });

        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        // ========== LIGHTBOX С НАВИГАЦИЕЙ ==========
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.querySelector('.lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        const lightboxCounter = document.querySelector('.lightbox-counter');

        const galleryImages = Array.from(document.querySelectorAll('.gallery-item img')).map(img => ({
            src: img.src,
            alt: img.alt
        }));

        let currentIndex = 0;

        function showImage(index) {
            if (index < 0) {
                currentIndex = galleryImages.length - 1;
            } else if (index >= galleryImages.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            lightboxImg.style.opacity = '0.5';
            
            setTimeout(() => {
                lightboxImg.src = galleryImages[currentIndex].src;
                lightboxImg.alt = galleryImages[currentIndex].alt;
                lightboxImg.style.opacity = '1';
                lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
            }, 150);
        }

        galleryImages.forEach((_, index) => {
            document.querySelectorAll('.gallery-item img')[index].addEventListener('click', () => {
                showImage(index);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showImage(currentIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showImage(currentIndex + 1);
            }
        });

        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showImage(currentIndex + 1);
                } else {
                    showImage(currentIndex - 1);
                }
            }
        }
    