// Handle all user interface controls
export function initControls(state, sound) {
    const muteBtn = document.getElementById('mute-btn');
    const playBtn = document.getElementById('play-btn');
    const spinToggle = document.getElementById('spin-toggle');
    const mountainBtns = document.querySelectorAll('.mountain-btn');

    // Audio controls
    muteBtn.addEventListener('click', () => {
        state.isMuted = !state.isMuted;
        sound.mute(state.isMuted);
        muteBtn.classList.toggle('active', state.isMuted);
    });

    playBtn.addEventListener('click', () => {
        state.isPlaying = !state.isPlaying;
        if (state.isPlaying) {
            sound.play();
        } else {
            sound.pause();
        }
        playBtn.classList.toggle('active', state.isPlaying);
    });

    // Spin controls
    spinToggle.addEventListener('click', () => {
        state.isSpinning = !state.isSpinning;
        spinToggle.classList.toggle('active', state.isSpinning);
    });

    // Mountain controls
    mountainBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mountain = btn.dataset.mountain;
            if (mountain === state.currentMountain) return;
            
            const img = document.getElementById('mountain-img');
            gsap.to(img, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    img.src = `assets/mountains/${mountain}.png`;
                    gsap.to(img, {
                        opacity: 1,
                        duration: 0.5
                    });
                }
            });
            
            state.currentMountain = mountain;
        });
    });
} 