document.addEventListener("DOMContentLoaded", () => {
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    
    /* ---- 1. ANIMATED BACKGROUND LINES ---- */
    const linesContainer = document.getElementById('bg-lines');
    const numberOfLines = 8;
    
    for (let i = 0; i < numberOfLines; i++) {
        const line = document.createElement('div');
        line.classList.add('bg-line');
        // Randomize starting positions and timings
        line.style.left = `${Math.random() * 100}vw`;
        line.style.animationDuration = `${15 + Math.random() * 15}s`;
        line.style.animationDelay = `-${Math.random() * 10}s`;
        line.style.opacity = `${0.3 + Math.random() * 0.7}`;
        linesContainer.appendChild(line);
    }

    /* ---- 2. ON-LOAD ANIMATIONS ---- */
    setTimeout(() => {
        const loadElements = document.querySelectorAll('.hidden-onload');
        loadElements.forEach(el => {
            el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        });
    }, 100);

    /* ---- 3. SCROLL REVEAL (Intersection Observer) ---- */
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
            
            // Trigger chat if booking section is revealed
            if(entry.target.classList.contains('booking-visual')) {
                startChatMockup();
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    /* ---- 4. PARALLAX EFFECT ---- */
    const heroBg = document.querySelector('.hero-bg');
    window.addEventListener('scroll', () => {
        if (isTouchDevice) return;
        // Subtle offset based on scroll Y
        const scrollY = window.pageYOffset;
        if (scrollY < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.05)`;
        }
    });

    /* ---- 5. DARK MODE TOGGLE ---- */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const icon = themeBtn.querySelector('i');

    function toggleTheme() {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    themeBtn.addEventListener('click', toggleTheme);

    /* ---- 6. MOCK CHAT UI EXECUTOR ---- */
    const chatBody = document.getElementById('chat-body');
    const chatSequence = [
        { type: 'user', text: "Hey! Do you have any slots open today for a skin fade at 3 PM?", delay: 1000 },
        { type: 'bot', text: "Hello! Yes, Marcus has a 3:00 PM slot open.", delay: 2500 },
        { type: 'user', text: "Perfect. Book me in.", delay: 4000 },
        { type: 'bot', text: "All set! See you at 3 PM. You'll receive a confirmation SMS shortly.", delay: 5500 }
    ];

    let chatTriggered = false;
    function startChatMockup() {
        if (chatTriggered) return;
        chatTriggered = true;

        chatSequence.forEach(msg => {
            setTimeout(() => {
                const msgEl = document.createElement('div');
                msgEl.classList.add('msg', msg.type);
                msgEl.textContent = msg.text;
                chatBody.appendChild(msgEl);
                chatBody.scrollTop = chatBody.scrollHeight;
            }, msg.delay);
        });
    }

});
