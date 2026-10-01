/**
 * Dear Me - Universal Mobile Navigation & PWA Integration
 * Injects a modern Hamburger Drawer & Bottom Tab Bar on mobile devices
 */
(function() {
    // 1. Service Worker Registration for PWA
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').catch(function(err) {
                console.log('SW registration error:', err);
            });
        });
    }

    // 2. Initialize Navigation on DOM Ready
    function initMobileNav() {
        // Prevent duplicate injection
        if (document.getElementById('mobileDrawer')) return;

        const currentPath = window.location.pathname;
        const isAuthPage = currentPath === '/login' || currentPath === '/register';

        // Check login state from sessionStorage
        const loginUser = sessionStorage.getItem('loginUser');

        // Create Backdrop Overlay
        const overlay = document.createElement('div');
        overlay.id = 'mobileDrawerOverlay';
        overlay.className = 'mobile-drawer-overlay';
        document.body.appendChild(overlay);

        // Create Mobile Drawer
        const drawer = document.createElement('aside');
        drawer.id = 'mobileDrawer';
        drawer.className = 'mobile-drawer';
        drawer.setAttribute('aria-label', '모바일 사이드 메뉴');

        drawer.innerHTML = `
            <div class="mobile-drawer-header">
                <div class="mobile-drawer-brand">
                    <span class="brand-sparkle">✨</span>
                    <span class="brand-text">Dear Me</span>
                </div>
                <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="메뉴 닫기">✕</button>
            </div>
            
            <div class="mobile-user-status-card">
                ${loginUser ? `
                    <div class="user-greeting">
                        <span class="user-avatar">🌱</span>
                        <div class="user-info">
                            <span class="user-name"><strong>${loginUser}</strong>님</span>
                            <span class="user-sub">오늘도 평안한 하루 되세요</span>
                        </div>
                    </div>
                ` : `
                    <div class="user-greeting">
                        <span class="user-avatar">💫</span>
                        <div class="user-info">
                            <span class="user-name">로그인이 필요합니다</span>
                            <span class="user-sub">나만의 명언과 기록을 보관해보세요</span>
                        </div>
                    </div>
                    <div class="mobile-auth-quick-btns">
                        <a href="/login" class="quick-btn primary">로그인</a>
                        <a href="/register" class="quick-btn secondary">회원가입</a>
                    </div>
                `}
            </div>

            <nav class="mobile-drawer-nav">
                <div class="nav-section-title">주요 메뉴</div>
                <ul class="mobile-drawer-links">
                    <li><a href="/" class="${currentPath === '/' ? 'active' : ''}"><span class="m-icon">🏠</span> 메인 홈</a></li>
                    <li><a href="/recommend" class="${currentPath === '/recommend' ? 'active' : ''}"><span class="m-icon">✨</span> 감정별 명언 추천</a></li>
                    <li><a href="/library" class="${currentPath === '/library' ? 'active' : ''}"><span class="m-icon">📚</span> 나만의 명언 보관함</a></li>
                    <li><a href="/pet-collection" class="${currentPath === '/pet-collection' ? 'active' : ''}"><span class="m-icon">🐾</span> 짱구 도감</a></li>
                    <li><a href="/mypage" class="${currentPath === '/mypage' ? 'active' : ''}"><span class="m-icon">👤</span> 마이페이지 & 다마고치</a></li>
                </ul>

                <div class="nav-section-title">소통 공간</div>
                <ul class="mobile-drawer-links">
                    <li><a href="/board" class="${currentPath === '/board' ? 'active' : ''}"><span class="m-icon">💬</span> 익명 게시판</a></li>
                    <li><a href="/board/write" class="${currentPath === '/board/write' ? 'active' : ''}"><span class="m-icon">✍️</span> 따뜻한 글쓰기</a></li>
                    <li><a href="/postbox" class="${currentPath === '/postbox' ? 'active' : ''}"><span class="m-icon">💌</span> 위로 우체통 <span id="mobilePostboxBadge" class="badge-dot" style="display:none;"></span></a></li>
                    <li><a href="/feedback-page" class="${currentPath === '/feedback-page' ? 'active' : ''}"><span class="m-icon">🎧</span> 고객 지원 & 피드백</a></li>
                </ul>
            </nav>

            <div class="mobile-drawer-footer">
                ${loginUser ? `
                    <button class="mobile-logout-btn" id="mobileLogoutBtn">
                        <span class="m-icon">🚪</span> 로그아웃
                    </button>
                ` : `
                    <a href="/login" class="mobile-logout-btn login-mode">
                        <span class="m-icon">🔑</span> 로그인하기
                    </a>
                `}
            </div>
        `;
        document.body.appendChild(drawer);

        // 3. Inject Hamburger Toggle to Navbar if present
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            let toggleBtn = document.getElementById('mobileMenuToggle');
            if (!toggleBtn) {
                toggleBtn = document.createElement('button');
                toggleBtn.id = 'mobileMenuToggle';
                toggleBtn.className = 'mobile-menu-toggle';
                toggleBtn.setAttribute('aria-label', '모바일 메뉴 열기');
                toggleBtn.innerHTML = `
                    <span class="hamburger-bar"></span>
                    <span class="hamburger-bar"></span>
                    <span class="hamburger-bar"></span>
                `;
                navContainer.appendChild(toggleBtn);
            }

            toggleBtn.addEventListener('click', toggleDrawer);
        }

        // 4. Inject Bottom Navigation Bar (Skip on login/register pages)
        if (!isAuthPage) {
            const bottomNav = document.createElement('nav');
            bottomNav.id = 'mobileBottomNav';
            bottomNav.className = 'mobile-bottom-nav';
            bottomNav.setAttribute('aria-label', '모바일 하단 내비게이션');

            bottomNav.innerHTML = `
                <a href="/" class="mobile-tab-item ${currentPath === '/' ? 'active' : ''}">
                    <span class="tab-icon">🏠</span>
                    <span class="tab-label">홈</span>
                </a>
                <a href="/recommend" class="mobile-tab-item ${currentPath === '/recommend' ? 'active' : ''}">
                    <span class="tab-icon">✨</span>
                    <span class="tab-label">추천</span>
                </a>
                <a href="/pet-collection" class="mobile-tab-item ${currentPath === '/pet-collection' ? 'active' : ''}">
                    <span class="tab-icon">🐾</span>
                    <span class="tab-label">도감</span>
                </a>
                <a href="/board" class="mobile-tab-item ${currentPath.startsWith('/board') || currentPath === '/postbox' ? 'active' : ''}">
                    <span class="tab-icon">💬</span>
                    <span class="tab-label">게시판</span>
                </a>
                <a href="/mypage" class="mobile-tab-item ${currentPath === '/mypage' ? 'active' : ''}">
                    <span class="tab-icon">👤</span>
                    <span class="tab-label">마이</span>
                </a>
            `;
            document.body.appendChild(bottomNav);

            // Add bottom padding class to body on mobile
            document.body.classList.add('has-mobile-bottom-nav');
        }

        // 5. Drawer Event Listeners
        const closeBtn = document.getElementById('mobileDrawerClose');
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);

        // Close when clicking a link inside drawer
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeDrawer();
            });
        });

        // Logout handler
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', function() {
                if (typeof window.logout === 'function') {
                    window.logout();
                } else if (typeof window.handleLogout === 'function') {
                    window.handleLogout();
                } else {
                    sessionStorage.removeItem('loginUser');
                    alert('로그아웃 되었습니다.');
                    window.location.href = '/';
                }
            });
        }

        // Check for postbox badge sync
        const mainBadge = document.getElementById('postboxBadge');
        if (mainBadge) {
            const observer = new MutationObserver(() => {
                const isVisible = mainBadge.style.display !== 'none';
                const mobileBadge = document.getElementById('mobilePostboxBadge');
                if (mobileBadge) mobileBadge.style.display = isVisible ? 'inline-block' : 'none';
            });
            observer.observe(mainBadge, { attributes: true, attributeFilter: ['style'] });
        }
    }

    function toggleDrawer() {
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('mobileDrawerOverlay');
        const isOpen = drawer.classList.contains('open');

        if (isOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }

    function openDrawer() {
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('mobileDrawerOverlay');
        if (!drawer || !overlay) return;

        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeDrawer() {
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('mobileDrawerOverlay');
        if (!drawer || !overlay) return;

        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();
