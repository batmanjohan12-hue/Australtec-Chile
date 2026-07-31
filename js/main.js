// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== ACTIVE SECTION INDICATOR =====
const sections = document.querySelectorAll('section');
const navLinksAll = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
    });
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

// ===== FADE-IN ON SCROLL =====
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
fadeElements.forEach(el => observer.observe(el));

// ===== VIDEO CAROUSEL NAVIGATION =====
const videoTrack = document.getElementById('videoTrack');
const prevBtn = document.querySelector('.video-nav-left');
const nextBtn = document.querySelector('.video-nav-right');

if (videoTrack && prevBtn && nextBtn) {
    let videoPosition = 0;

    const getCardWidth = () => {
        const card = videoTrack.querySelector('.video-card');
        if (!card) return 280;
        const style = window.getComputedStyle(videoTrack);
        const gap = parseFloat(style.gap) || 24;
        return card.offsetWidth + gap;
    };

    const getMaxScroll = () => Math.max(0, videoTrack.scrollWidth - videoTrack.parentElement.offsetWidth);

    const updateButtons = () => {
        prevBtn.disabled = videoPosition >= 0;
        nextBtn.disabled = Math.abs(videoPosition) >= getMaxScroll();
    };

    nextBtn.addEventListener('click', () => {
        const cardWidth = getCardWidth();
        videoPosition = Math.max(videoPosition - cardWidth, -getMaxScroll());
        videoTrack.style.transform = `translateX(${videoPosition}px)`;
        updateButtons();
    });

    prevBtn.addEventListener('click', () => {
        const cardWidth = getCardWidth();
        videoPosition = Math.min(videoPosition + cardWidth, 0);
        videoTrack.style.transform = `translateX(${videoPosition}px)`;
        updateButtons();
    });

    let touchStartX = 0;
    videoTrack.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    videoTrack.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) { diff > 0 ? nextBtn.click() : prevBtn.click(); }
    }, { passive: true });

    updateButtons();
    window.addEventListener('resize', () => {
        videoPosition = 0;
        videoTrack.style.transform = `translateX(0)`;
        updateButtons();
    });
}

// ===== CLICK TO PLAY + POSTER DINÁMICO =====
document.querySelectorAll('.video-card').forEach(card => {
    const posterUrl = card.dataset.poster;
    const posterEl = card.querySelector('.video-poster');
    if (posterUrl && posterEl) {
        posterEl.style.backgroundImage = `url('${posterUrl}')`;
        const testImg = new Image();
        testImg.onerror = () => { posterEl.style.backgroundImage = 'none'; };
        testImg.src = posterUrl;
    }

    card.addEventListener('click', () => {
        const video = card.querySelector('video');
        const isPlaying = card.classList.contains('playing');

        document.querySelectorAll('.video-card.playing').forEach(other => {
            if (other !== card) {
                other.classList.remove('playing');
                const v = other.querySelector('video');
                v.pause();
                v.currentTime = 0;
            }
        });

        if (isPlaying) {
            card.classList.remove('playing');
            video.pause();
        } else {
            if (!video.querySelector('source')) {
                const source = document.createElement('source');
                source.src = card.dataset.video;
                source.type = 'video/mp4';
                video.appendChild(source);
            }
            card.classList.add('playing');
            video.play().catch(() => card.classList.remove('playing'));
        }
    });
});