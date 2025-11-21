// ===========================================================
// JavaScript for Kerala Detail Page
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Inquiry Form Submission Logic ---
    const inquiryForm = document.getElementById('keralaInquiryForm');
    const confirmationMessage = document.getElementById('confirmationMessage');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const customerName = document.getElementById('customerName').value;
            
            // Display success message
            confirmationMessage.textContent = `Thank you, ${customerName}! Your inquiry for the Kerala package has been received. A trip expert will contact you within 24 hours.`;
            confirmationMessage.classList.remove('d-none');
            
            // Disable submit temporarily
            inquiryForm.querySelector('button[type="submit"]').disabled = true;

            // Clear form after short delay
            setTimeout(() => {
                inquiryForm.reset();
                confirmationMessage.classList.add('d-none');
                inquiryForm.querySelector('button[type="submit"]').disabled = false;
            }, 5000);
        });
    }

    // --- Back Button Functionality ---
    const backButton = document.getElementById('backToHome');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'homepage.html';
        });
    }

    // ===========================================================
    // 💬 Bootstrap Travel Tips Popovers
    // ===========================================================

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach((el) => {
        new bootstrap.Popover(el, {
            trigger: el.getAttribute('data-bs-trigger') || 'hover focus',
            html: true,
            sanitize: false, // allows image HTML in content (safe for your own data)
            placement: el.getAttribute('data-bs-placement') || 'top'
        });
    });

    // ===========================================================
    // 📱 Scroll Progress Bar
    // ===========================================================

    (function() {
        const bar = document.getElementById('scrollProgressBar');
        if (!bar) return;

        let ticking = false;

        function updateProgress() {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            bar.style.width = progress + '%';
            bar.setAttribute('aria-valuenow', Math.round(progress));
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress);
                ticking = true;
            }
        }, { passive: true });

        // initial update on load
        updateProgress();
    })();

}); // END DOMContentLoaded


// ===========================================================
// 🎬 YouTube Video Interactivity (Hover + Scroll + Touch)
// ===========================================================

// Store all YouTube player references
let players = [];

// Called automatically by YouTube Iframe API
function onYouTubeIframeAPIReady() {
    const iframes = document.querySelectorAll('.day-video-frame');

    iframes.forEach((iframe) => {
        const player = new YT.Player(iframe, {
            events: {
                onReady: (event) => setupVideoControls(iframe, event.target)
            }
        });
        players.push(player);
    });
}

// Setup hover, touch, and scroll play/pause behavior
function setupVideoControls(iframe, player) {

    // --- Play when hovered (desktop)
    iframe.addEventListener('mouseenter', () => {
        player.playVideo();
    });

    // --- Pause when mouse leaves
    iframe.addEventListener('mouseleave', () => {
        player.pauseVideo();
    });

    // --- Play when tapped (mobile)
    iframe.addEventListener('touchstart', () => {
        player.playVideo();
    });

    // --- Play when visible, pause when not (on scroll)
    window.addEventListener('scroll', () => {
        const rect = iframe.getBoundingClientRect();
        const isVisible =
            rect.top < window.innerHeight * 0.75 &&
            rect.bottom > window.innerHeight * 0.25;

        if (isVisible) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
    });
}

// --- Auto update footer year ---
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
