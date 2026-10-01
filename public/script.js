

window.onload = function() {
    // 1. 초기 명언 로드
    fetch('/api/random-quote').then(res => res.json()).then(data => {
        document.getElementById('daily-quote').innerText = `"${data.text}"`;
        document.getElementById('author').innerText = `- ${data.author} -`;
    });

    // 2. ★ 엔터 키 이벤트 리스너 추가 ★
    const input = document.getElementById('worryInput');
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            destroyWorry(); // 엔터를 누르면 파괴하기 함수 실행
        }
    });
};

function destroyWorry() {
    const input = document.getElementById('worryInput');
    const word = input.value.trim();
    if(!word) return alert("단어를 입력해주세요!");

    input.value = "";
    triggerFullShatter(word);
}

async function flipCard(cardElement) {
    if(cardElement.classList.contains('flipped')) return;

    try {
        const res = await fetch('/api/fortune-cookies');
        const data = await res.json();
        const randomFortune = data.text || "운세가 준비되지 않았습니다.";
        
        cardElement.querySelector('.card-back').innerText = randomFortune;
        cardElement.classList.add('flipped');
    } catch(err) {
        console.error(err);
        cardElement.querySelector('.card-back').innerText = "서버 연결 오류";
        cardElement.classList.add('flipped');
    }
}

// [추가] 명언 및 고민 저장 기능 복구
async function saveHistory() {
    const loginUser = sessionStorage.getItem('loginUser');
    if (!loginUser) {
        alert("로그인 후 이용할 수 있습니다.");
        return;
    }
    
    const quote = document.getElementById('customQuote').value.trim();
    const author = document.getElementById('customAuthor').value.trim() || '익명';
    const worry = document.getElementById('customWorry').value.trim();
    
    if (!quote) {
        alert("기억하고 싶은 명언 문구를 입력해주세요.");
        return;
    }
    
    try {
        const res = await fetch('/api/register-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: loginUser,
                emotion: '기록함', 
                text: quote,
                author: author,
                worry: worry
            })
        });
        
        if (res.ok) {
            alert("나의 히스토리에 무사히 저장되었습니다! 마이페이지에서 확인해보세요.");
            document.getElementById('customQuote').value = '';
            document.getElementById('customAuthor').value = '';
            document.getElementById('customWorry').value = '';
        } else {
            alert("저장에 실패했습니다.");
        }
    } catch (err) {
        console.error(err);
        alert("서버 연결에 실패했습니다.");
    }
}

// --- [유리창 깨짐 효과 및 사운드 합성 구현] ---
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playGlassShatterSound() {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // 1. 저음 타격 임팩트 (Impact low thud)
        const oscLow = ctx.createOscillator();
        const gainLow = ctx.createGain();
        oscLow.type = 'triangle';
        oscLow.frequency.setValueAtTime(130, now);
        oscLow.frequency.exponentialRampToValueAtTime(30, now + 0.35);
        gainLow.gain.setValueAtTime(0.4, now);
        gainLow.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        
        oscLow.connect(gainLow);
        gainLow.connect(ctx.destination);
        oscLow.start(now);
        oscLow.stop(now + 0.35);

        // 2. 파편 마찰용 백색 소음 (White noise sweep)
        const bufferSize = ctx.sampleRate * 0.45;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noiseNode = ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(7500, now);
        filter.Q.setValueAtTime(1.8, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        noiseNode.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseNode.start(now);
        noiseNode.stop(now + 0.45);

        // 3. 금속성 하이피치 배음 벨 (High pitch resonance chimes)
        const chimeFreqs = [2400, 3200, 4100, 4950, 5800, 6700, 7500, 8300];
        chimeFreqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            const startDelay = Math.random() * 0.12;
            const playTime = now + startDelay;
            const duration = 0.35 + Math.random() * 0.45;
            
            osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, playTime);
            osc.frequency.linearRampToValueAtTime(freq * 0.85, playTime + duration); // 낙하하는 피치

            gainNode.gain.setValueAtTime(0.1, playTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, playTime + duration);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start(playTime);
            osc.stop(playTime + duration);
        });
    } catch (err) {
        console.error("유리창 깨짐 오디오 재생 실패:", err);
    }
}

function triggerFullShatter(word) {
    // 1. 풀스크린 오버레이 생성
    const overlay = document.createElement('div');
    overlay.id = 'shatter-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(12, 12, 18, 0.88)';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.cursor = 'none';

    const canvas = document.createElement('canvas');
    canvas.id = 'shatter-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // 리사이즈 대응
    const resizeHandler = () => {
        if (canvas) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', resizeHandler);

    const centerX = width / 2;
    const centerY = height / 2;

    // 대략적인 텍스트 측정
    ctx.font = '900 6.5rem "Pretendard", "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textWidth = ctx.measureText(word).width;
    const textHeight = 110;

    const particles = [];

    // (A) 거대 텍스트 격자형 파편 생성 (Text Shards)
    const cols = Math.min(Math.max(word.length * 4, 12), 24);
    const rows = 6;
    const cellW = textWidth / cols;
    const cellH = textHeight / rows;
    const startX = centerX - textWidth / 2;
    const startY = centerY - textHeight / 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = startX + c * cellW + cellW / 2;
            const y = startY + r * cellH + cellH / 2;
            
            const dx = x - centerX;
            const dy = y - centerY;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            const force = 9 + Math.random() * 12;

            particles.push({
                type: 'text',
                x: x,
                y: y,
                w: cellW * (0.85 + Math.random() * 0.3),
                h: cellH * (0.85 + Math.random() * 0.3),
                vx: (dx / dist) * force + (Math.random() - 0.5) * 5,
                vy: (dy / dist) * force - (4 + Math.random() * 6), // 사방 및 위쪽으로 튀게 함
                angle: Math.random() * Math.PI * 2,
                vAngle: (Math.random() - 0.5) * 0.3,
                color: '#ff3f34',
                opacity: 1,
                gravity: 0.22
            });
        }
    }

    // (B) 흩날리는 투명 유리 조각 입자 생성 (Glass Shards)
    const glassCount = 150;
    for (let i = 0; i < glassCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 6 + Math.random() * 20;
        const size = 8 + Math.random() * 22;

        particles.push({
            type: 'glass',
            x: centerX + (Math.random() - 0.5) * 120,
            y: centerY + (Math.random() - 0.5) * 60,
            size: size,
            p1x: (Math.random() - 0.5) * size,
            p1y: (Math.random() - 0.5) * size,
            p2x: (Math.random() - 0.5) * size,
            p2y: (Math.random() - 0.5) * size,
            p3x: (Math.random() - 0.5) * size,
            p3y: (Math.random() - 0.5) * size,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (3 + Math.random() * 7),
            angle: Math.random() * Math.PI * 2,
            vAngle: (Math.random() - 0.5) * 0.35,
            color: 'rgba(215, 245, 255, ' + (0.35 + Math.random() * 0.4) + ')',
            strokeColor: 'rgba(255, 255, 255, ' + (0.75 + Math.random() * 0.25) + ')',
            opacity: 1,
            gravity: 0.26
        });
    }

    // (C) 가벼운 발광 스파클링 먼지 (Sparkles)
    const sparkleCount = 60;
    for (let i = 0; i < sparkleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 9;
        particles.push({
            type: 'sparkle',
            x: centerX,
            y: centerY,
            size: 2 + Math.random() * 3.5,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            opacity: 1,
            gravity: 0.08
        });
    }

    let isShattered = false;
    let frame = 0;

    function renderLoop() {
        frame++;
        
        ctx.fillStyle = 'rgba(12, 12, 18, 0.42)'; // 모션 블러 효과용 투명 페인트
        ctx.fillRect(0, 0, width, height);

        if (!isShattered) {
            // 깨지기 전: 진동하는 붉은 글자와 거대한 유리 프레임
            const shakeX = (Math.random() - 0.5) * 4;
            const shakeY = (Math.random() - 0.5) * 4;

            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#ff3838');
            gradient.addColorStop(0.5, '#ff5757');
            gradient.addColorStop(1, '#ff3838');

            ctx.shadowBlur = 40;
            ctx.shadowColor = 'rgba(255, 56, 56, 0.85)';
            ctx.fillStyle = gradient;
            ctx.fillText(word, centerX + shakeX, centerY + shakeY);

            // 유리 액자 테두리 그리기
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 4;
            ctx.strokeRect(centerX - textWidth/2 - 60 + shakeX, centerY - 90 + shakeY, textWidth + 120, 180);

            // 0.3초 (약 18프레임) 대기 후 강한 타격으로 폭발
            if (frame > 18) {
                isShattered = true;
                playGlassShatterSound();
            }

            requestAnimationFrame(renderLoop);
            return;
        }

        // 깨진 후: 시뮬레이션
        let activeParticles = 0;

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.angle += p.vAngle;

            p.opacity -= 0.013;
            if (p.opacity < 0) p.opacity = 0;
            if (p.opacity > 0) activeParticles++;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.globalAlpha = p.opacity;

            if (p.type === 'text') {
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 12;
                ctx.shadowColor = 'rgba(255, 63, 52, 0.7)';
                ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
            } else if (p.type === 'glass') {
                ctx.fillStyle = p.color;
                ctx.strokeStyle = p.strokeColor;
                ctx.lineWidth = 1.8;
                ctx.beginPath();
                ctx.moveTo(p.p1x, p.p1y);
                ctx.lineTo(p.p2x, p.p2y);
                ctx.lineTo(p.p3x, p.p3y);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            } else if (p.type === 'sparkle') {
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f8ef';
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        if (activeParticles > 0 && frame < 180) {
            requestAnimationFrame(renderLoop);
        } else {
            // 정리 작업
            window.removeEventListener('resize', resizeHandler);
            overlay.style.transition = 'opacity 0.6s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                document.getElementById('comfort-message').innerHTML = `
                    <span style="font-size: 1.5rem; color: #ff2a2a; text-shadow: 0 0 8px rgba(255,42,42,0.3); font-weight: 900;">"${word}"</span>(은)는 유리창 깨지듯 완전히 박살 났습니다! 속 시원하시길 바랍니다. 😊
                `;
                document.getElementById('comfort-message').style.display = 'block';
            }, 600);
        }
    }

    renderLoop();
}
