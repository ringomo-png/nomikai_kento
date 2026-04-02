let targetDate = new Date("2026-04-15T19:30:00");
const countdownTextEl = document.getElementById('countdown-text');

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff > 0) {
        const totalHours = Math.floor(diff / (1000 * 60 * 60));
        const h = String(totalHours).padStart(2, '0');
        const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
        const s = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
        countdownTextEl.innerText = `- ${h}:${m}:${s}`;
    } else {
        countdownTextEl.innerText = "00:00:00";
    }
}
setInterval(updateCountdown, 1000);
updateCountdown();

let isEventA = true;
function toggleMockEvent() {
    isEventA = !isEventA;
    if(isEventA) {
        document.getElementById('event-date').innerText = '2026.04.15 WED';
        document.getElementById('event-time').innerHTML = '19<span class="blink-colon">:</span>30 START';
        document.getElementById('event-place').innerText = '恵比寿 KINTAN';
        document.getElementById('member-list').innerHTML = `
            <div class="member-item">森 賢志</div>
            <div class="member-item">佐藤</div>
            <div class="member-item">ゆき</div>
            <div class="member-item">Daiki.T</div>
        `;
        targetDate = new Date("2026-04-15T19:30:00");
    } else {
        document.getElementById('event-date').innerText = '2026.04.24 FRI';
        document.getElementById('event-time').innerHTML = '20<span class="blink-colon">:</span>00 START';
        document.getElementById('event-place').innerText = '六本木 うかい亭';
        document.getElementById('member-list').innerHTML = `
            <div class="member-item">森 賢志</div>
            <div class="member-item">鈴木</div>
            <div class="member-item">田中</div>
            <div class="member-item">Kato.Y</div>
        `;
        targetDate = new Date("2026-04-24T20:00:00");
    }
    updateCountdown();
}

const coverEl = document.getElementById('cover-screen');
const detailEl = document.getElementById('detail-screen');
const participantsViewEl = document.getElementById('participants-view');
const timerViewEl = document.getElementById('timer-view'); 
const listViewEl = document.getElementById('list-view'); 
const headerLineEl = document.getElementById('header-line'); 
const bottomNavEl = document.getElementById('bottomNav');
const topLogoEl = document.getElementById('top-logo'); 
const profileIconEl = document.getElementById('profile-icon'); 
const revealElements = document.querySelectorAll('#detail-screen .info-text, .action-buttons, #profile-icon'); 

let isRevealed = false; 
let currentView = 'detail'; 
let isListViewOpen = false; 
const viewOrder = ['timer', 'detail', 'guests'];

const ANIM_OUT_MS = 400; 
const ANIM_IN_MS = 500;  

function updateNavState() {
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (isListViewOpen) {
        document.getElementById('nav-list').classList.add('active');
    } else {
        document.getElementById('nav-home').classList.add('active');
    }
}

function switchView(toView, isInstant = false) {
    if (currentView === toView) return;
    const panels = { 'detail': detailEl, 'guests': participantsViewEl, 'timer': timerViewEl };

    if (isInstant) {
        Object.values(panels).forEach(panel => {
            panel.classList.remove('active');
            panel.style.opacity = '0';
        });
        panels[toView].classList.add('active');
        panels[toView].style.opacity = '1';
        currentView = toView;
        return;
    }

    Object.values(panels).forEach(panel => {
        panel.style.transition = `opacity ${ANIM_OUT_MS / 1000}s ease`;
        panel.style.opacity = '0';
    });

    setTimeout(() => {
        Object.values(panels).forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetEl = panels[toView];
        targetEl.classList.add('active');
        
        requestAnimationFrame(() => {
            targetEl.style.transition = `opacity ${ANIM_IN_MS / 1000}s ease`;
            targetEl.style.opacity = '1';
        });
    }, ANIM_OUT_MS);

    currentView = toView;
}

window.goHome = function(e) {
    if (e) e.stopPropagation();
    if (isListViewOpen) {
        listViewEl.style.transition = `opacity ${ANIM_OUT_MS / 1000}s ease`;
        listViewEl.style.opacity = '0';
        isListViewOpen = false;
        updateNavState();
        setTimeout(() => {
            listViewEl.classList.remove('active');
            detailEl.classList.add('active');
            requestAnimationFrame(() => {
                detailEl.style.transition = `opacity ${ANIM_IN_MS / 1000}s ease`;
                detailEl.style.opacity = '1';
            });
            currentView = 'detail';
        }, ANIM_OUT_MS);
    } 
    else if (currentView !== 'detail') {
        switchView('detail');
    }
};

window.toggleListView = function(e) {
    e.stopPropagation();
    const panels = { 'detail': detailEl, 'guests': participantsViewEl, 'timer': timerViewEl };
    if (isListViewOpen) {
        goHome();
    } else {
        Object.values(panels).forEach(panel => {
            panel.style.transition = `opacity ${ANIM_OUT_MS / 1000}s ease`;
            panel.style.opacity = '0';
        });
        isListViewOpen = true;
        updateNavState();
        setTimeout(() => {
            Object.values(panels).forEach(panel => panel.classList.remove('active'));
            listViewEl.classList.add('active');
            requestAnimationFrame(() => {
                listViewEl.style.transition = `opacity ${ANIM_IN_MS / 1000}s ease`;
                listViewEl.style.opacity = '1';
            });
        }, ANIM_OUT_MS);
    }
};

window.showDetails = function(e) {
    e.stopPropagation(); 
    revealElements.forEach(el => el.classList.add('reveal-skip'));
    bottomNavEl.classList.add('reveal-skip');
    topLogoEl.classList.add('reveal-skip'); 
    headerLineEl.classList.add('reveal-skip'); 
    profileIconEl.classList.add('reveal-skip');
    isRevealed = true; 
    coverEl.style.opacity = '0';
    coverEl.style.transform = 'scale(1.1)';
    setTimeout(() => {
        detailEl.classList.add('active'); 
        setTimeout(() => {
            detailEl.style.transition = `opacity ${ANIM_IN_MS / 1000}s ease`;
            detailEl.style.opacity = '1';
        }, 20);
    }, 400);
    setTimeout(() => coverEl.style.display = 'none', 800);
};

window.openSettings = function(e) {
    e.stopPropagation(); 
    profileIconEl.style.opacity = '0.3';
    setTimeout(() => profileIconEl.style.opacity = '1', 200);
};

const infoTextElements = document.querySelectorAll('#detail-screen .info-text');
const isButtonTap = (e) => { return e.target.closest('.icon-btn, .nav-item, #profile-icon'); };

document.body.addEventListener('click', (e) => {
    if (coverEl.style.display !== 'none') return;
    if (isButtonTap(e)) return;
    if (isRevealed && currentView === 'detail' && !isListViewOpen) {
        infoTextElements.forEach((el, index) => {
            el.classList.remove('shake-active');
            setTimeout(() => void el.offsetWidth, 0); 
            setTimeout(() => el.classList.add('shake-active'), index * 50); 
        });
    }
});

const wrapper = document.getElementById('interactive-wrapper');
let isDragging = false;
let startX = 0; let startY = 0;
let currentTranslateX = 0; let currentTranslateY = 0;
let dragAxis = null; 

const startDrag = (x, y) => {
    if (!isRevealed) return; 
    if (isListViewOpen) return; 
    isDragging = true;
    startX = x; 
    startY = y;
    currentTranslateX = 0;
    currentTranslateY = 0;
    dragAxis = null; 
    wrapper.style.transition = 'none'; 
};

const onDrag = (x, y) => {
    if (!isDragging) return;
    let moveX = x - startX;
    let moveY = y - startY;

    if (!dragAxis) {
        if (Math.abs(moveX) > 10 || Math.abs(moveY) > 10) {
            dragAxis = Math.abs(moveX) > Math.abs(moveY) ? 'x' : 'y';
        }
        return; 
    }

    // ✅ 【重要】縦と横で「指の追従性（摩擦）」を明確に変える！
    if (dragAxis === 'x') {
        currentTranslateX = moveX * 0.7; // 横は指にスッと吸い付くように軽く
        wrapper.style.transform = `translateX(${currentTranslateX}px)`;
    } else {
        currentTranslateY = moveY * 0.3; // 縦はバネを引くように「重たく」する
        wrapper.style.transform = `translateY(${currentTranslateY}px)`;
    }
};

const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    
    // ✅ 縦と横で「切り替わるために必要な引っ張り距離」を変える
    const thresholdX = 40; // 横は軽いフリックでOK
    const thresholdY = 60; // 縦はしっかり奥まで押し込まないとダメ

    if (dragAxis === 'y') {
        let currentIndex = viewOrder.indexOf(currentView);
        if (currentTranslateY < -thresholdY) {
            let nextIndex = (currentIndex + 1) % viewOrder.length;
            switchView(viewOrder[nextIndex]);
        } else if (currentTranslateY > thresholdY) {
            let prevIndex = (currentIndex - 1 + viewOrder.length) % viewOrder.length;
            switchView(viewOrder[prevIndex]);
        }
    } 
    else if (dragAxis === 'x') {
        if (Math.abs(currentTranslateX) > thresholdX) {
            const direction = currentTranslateX > 0 ? 100 : -100;
            wrapper.style.transition = `transform ${ANIM_OUT_MS / 1000}s ease-in, opacity ${ANIM_OUT_MS / 1000}s ease-in`;
            wrapper.style.transform = `translateX(${direction}vw)`;
            wrapper.style.opacity = '0';
            setTimeout(() => {
                wrapper.style.transition = 'none';
                wrapper.style.transform = `translateX(${-direction}vw)`;
                toggleMockEvent();
                setTimeout(() => {
                    wrapper.style.transition = `transform ${ANIM_IN_MS / 1000}s cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${ANIM_IN_MS / 1000}s ease-out`;
                    wrapper.style.transform = `translateX(0px)`;
                    wrapper.style.opacity = '1';
                }, 50);
            }, ANIM_OUT_MS);
            currentTranslateX = 0; currentTranslateY = 0;
            return; 
        }
    }
    
    wrapper.style.transition = `transform ${ANIM_IN_MS / 1000}s cubic-bezier(0.2, 0.8, 0.2, 1)`;
    wrapper.style.transform = `translate(0px, 0px)`;
    currentTranslateX = 0; currentTranslateY = 0;
};

wrapper.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => onDrag(e.clientX, e.clientY));
window.addEventListener('mouseup', endDrag);
window.addEventListener('mouseleave', endDrag);
wrapper.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: false });
window.addEventListener('touchmove', (e) => {
    if(isDragging) {
        onDrag(e.touches[0].clientX, e.touches[0].clientY);
        if (dragAxis === 'x' || dragAxis === 'y') e.preventDefault(); 
    }
}, { passive: false });
window.addEventListener('touchend', endDrag);
