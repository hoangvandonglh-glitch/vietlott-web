// ===== APP STATE =====
const AppState = {
    currentPage: 'home',
    currentLottery: null,
    theme: localStorage.getItem('theme') || 'dark',
    predictions: JSON.parse(localStorage.getItem('predictions') || '[]'),
    historicalData: null
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Set initial theme
    document.documentElement.setAttribute('data-theme', AppState.theme);

    // Setup event listeners
    setupNavigation();
    setupThemeToggle();
    setupLotteryCards();
    setupMobileMenu();

    // Load historical data
    loadHistoricalData();

    console.log('🎰 Vietlott AI Predictor initialized');
}

// ===== THEME TOGGLE =====
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    themeToggle.addEventListener('click', () => {
        AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', AppState.theme);
        localStorage.setItem('theme', AppState.theme);
    });
}

// ===== NAVIGATION =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });
}

function navigateToPage(pageName) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show requested page
    if (pageName === 'home') {
        document.getElementById('homePage').classList.add('active');
        document.getElementById('dynamicContent').innerHTML = '';
    } else {
        document.getElementById('homePage').classList.remove('active');
        loadPage(pageName);
    }

    AppState.currentPage = pageName;

    // Close mobile menu if open
    document.getElementById('navMenu').classList.remove('active');
}

async function loadPage(pageName) {
    const dynamicContent = document.getElementById('dynamicContent');

    // Show loading state
    dynamicContent.innerHTML = '<div class="loading">Đang tải...</div>';

    // Simulate page loading (in real app, would fetch from pages/ directory)
    setTimeout(() => {
        switch (pageName) {
            case 'predictor':
                loadPredictorPage();
                break;
            case 'results':
                loadResultsPage();
                break;
            case 'statistics':
                loadStatisticsPage();
                break;
            case 'checker':
                loadCheckerPage();
                break;
            case 'history':
                loadHistoryPage();
                break;
        }
    }, 100);
}

// ===== LOTTERY CARD SELECTION =====
function setupLotteryCards() {
    const predictButtons = document.querySelectorAll('.predict-btn');

    predictButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lottery = btn.dataset.lottery;
            AppState.currentLottery = lottery;
            navigateToPage('predictor');
        });
    });
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ===== HISTORICAL DATA =====
function loadHistoricalData() {
    // This will be loaded from historical-data.js
    // For now, we'll set it when that file loads
    AppState.historicalData = window.HistoricalData || null;
}

// ===== PAGE LOADERS =====
function loadPredictorPage() {
    const lottery = AppState.currentLottery || 'power655';
    const lotteryName = lottery === 'power655' ? 'Power 6/55' : 'Mega 6/45';
    const maxNumber = lottery === 'power655' ? 55 : 45;

    const html = `
        <section class="page active predictor-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Dự đoán ${lotteryName}</h1>
                    <p class="page-subtitle">Sử dụng AI và phân tích thống kê để tạo bộ số tối ưu</p>
                </div>
                
                <div class="predictor-content">
                    <div class="predictor-sidebar">
                        <div class="card">
                            <h3 class="card-title">Cài đặt</h3>
                            
                            <div class="form-group">
                                <label>Loại xổ số</label>
                                <select id="lotteryType" class="form-control">
                                    <option value="power655" ${lottery === 'power655' ? 'selected' : ''}>Power 6/55</option>
                                    <option value="mega645" ${lottery === 'mega645' ? 'selected' : ''}>Mega 6/45</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>Chiến lược</label>
                                <select id="strategy" class="form-control">
                                    <option value="balanced">🎯 AI Smart Pick (Balanced Mix)</option>
                                    <option value="hot">🔥 Hot Numbers Focus</option>
                                    <option value="cold">❄️ Cold Numbers Focus</option>
                                    <option value="wheeling">🎡 Wheeling System</option>
                                    <option value="random">🎲 Quick Random</option>
                                </select>
                            </div>
                            
                            <div class="form-group" id="wheelingInputGroup" style="display: none;">
                                <label>Chọn 8-10 số yêu thích (cách nhau bởi dấu phẩy)</label>
                                <input type="text" id="wheelingNumbers" class="form-control" placeholder="VD: 5,12,18,23,31,39,44,51">
                            </div>
                            
                            <div class="form-group">
                                <label>Số lượng bộ số</label>
                                <input type="number" id="numberOfSets" class="form-control" value="1" min="1" max="10">
                            </div>
                            
                            <button id="predictBtn" class="btn btn-primary btn-block">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                </svg>
                                Dự đoán ngay
                            </button>
                        </div>
                    </div>
                    
                    <div class="predictor-main">
                        <div id="predictionResults"></div>
                    </div>
                </div>
            </div>
        </section>
    `;

    document.getElementById('dynamicContent').innerHTML = html;
    setupPredictorEvents();
}

function setupPredictorEvents() {
    const strategySelect = document.getElementById('strategy');
    const wheelingInputGroup = document.getElementById('wheelingInputGroup');
    const predictBtn = document.getElementById('predictBtn');
    const lotteryTypeSelect = document.getElementById('lotteryType');

    // Show/hide wheeling input
    strategySelect.addEventListener('change', () => {
        wheelingInputGroup.style.display =
            strategySelect.value === 'wheeling' ? 'block' : 'none';
    });

    // Update lottery type
    lotteryTypeSelect.addEventListener('change', () => {
        AppState.currentLottery = lotteryTypeSelect.value;
    });

    // Predict button
    predictBtn.addEventListener('click', generatePrediction);
}

function loadStatisticsPage() {
    const predictions = AppState.predictions;

    if (predictions.length === 0) {
        const html = `
            <section class="page active statistics-page">
                <div class="container">
                    <div class="page-header">
                        <h1 class="page-title">Thống kê Dự đoán</h1>
                        <p class="page-subtitle">Kiểm tra độ chính xác của các dự đoán đã lưu</p>
                    </div>
                    <div class="card empty-state">
                        <h3>Chưa có dữ liệu</h3>
                        <p>Bạn chưa có dự đoán nào được lưu. Hay tạo dự đoán trước!</p>
                        <button class="btn btn-primary" onclick="navigateToPage('predictor')">Dự đoán ngay</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById('dynamicContent').innerHTML = html;
        return;
    }

    // For each prediction: find the nearest draw AFTER prediction time
    const checkedResults = predictions.map(pred => {
        if (!window.HistoricalData || !window.HistoricalData[pred.lotteryType]) return null;
        const draws = window.HistoricalData[pred.lotteryType].results;
        if (!draws || draws.length === 0) return null;

        const predTime = new Date(pred.timestamp).getTime();

        // Find draws that happened AFTER the prediction
        const laterDraws = draws
            .filter(d => new Date(d.timestamp).getTime() > predTime)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        if (laterDraws.length === 0) {
            // No later draw found yet - it is PENDING
            return { pred, pending: true };
        }

        const draw = laterDraws[0]; // nearest draw after prediction
        const matched = pred.numbers.filter(n => draw.numbers.includes(n));
        return { pred, draw, matched: matched.length, pending: false };
    }).filter(Boolean);

    // Summary stats (calculated from completed results only)
    const completed = checkedResults.filter(r => !r.pending);
    const pendingCount = checkedResults.filter(r => r.pending).length;
    const totalCompleted = completed.length;

    const byMatch = [0, 1, 2, 3, 4, 5, 6].map(n => completed.filter(r => r.matched === n).length);
    const hitRate = totalCompleted > 0 ? (completed.filter(r => r.matched >= 2).length / totalCompleted * 100).toFixed(1) : 0;

    const summaryHtml = `
        <div class="card stats-summary-card">
            <h3 class="card-title">Tổng quan độ chính xác</h3>
            <div class="stats-summary-grid">
                <div class="stats-summary-item">
                    <div class="stats-summary-value">${totalCompleted}</div>
                    <div class="stats-summary-label">Dự đoán đã đối số</div>
                </div>
                <div class="stats-summary-item">
                    <div class="stats-summary-value" style="color:var(--accent)">${pendingCount}</div>
                    <div class="stats-summary-label">Đang chờ kết quả</div>
                </div>
                <div class="stats-summary-item">
                    <div class="stats-summary-value" style="color:var(--success)">${hitRate}%</div>
                    <div class="stats-summary-label">Trúng từ 2 số</div>
                </div>
                <div class="stats-summary-item">
                    <div class="stats-summary-value" style="color:var(--primary)">${byMatch[3] + byMatch[4] + byMatch[5] + byMatch[6]}</div>
                    <div class="stats-summary-label">Trúng từ 3 số</div>
                </div>
            </div>
            ${totalCompleted > 0 ? `
            <div class="match-breakdown">
                <h4 style="margin-bottom:0.75rem;font-size:0.95rem;color:var(--text-secondary)">Phân bổ số trúng (trên ${totalCompleted} kỳ)</h4>
                ${[0, 1, 2, 3, 4, 5, 6].map(n => {
        const count = byMatch[n];
        const pct = Math.round(count / totalCompleted * 100);
        const color = n >= 4 ? 'var(--success)' : n >= 2 ? 'var(--primary)' : 'var(--border-color)';
        return `<div class="freq-row">
                        <span style="min-width:4rem;font-weight:600;color:${n >= 2 ? 'var(--text-primary)' : 'var(--text-secondary)'}">${n} số trúng</span>
                        <div class="freq-bar-wrap"><div class="freq-bar" style="width:${pct}%;background:${color}"></div></div>
                        <span class="freq-count">${count} lần (${pct}%)</span>
                    </div>`;
    }).join('')}
            </div>` : ''}
        </div>`;

    // Detail table: last 20 predictions
    const recent = checkedResults.slice(0, 20);
    const detailHtml = `
        <div class="card" style="margin-top:1.5rem">
            <h3 class="card-title">Chi tiết ${recent.length} dự đoán gần nhất</h3>
            ${recent.map((r, i) => {
        const lotteryName = r.pred.lotteryType === 'power655' ? 'Power 6/55' : 'Mega 6/45';
        const predDate = new Date(r.pred.timestamp).toLocaleString('vi-VN');

        if (r.pending) {
            return `
                        <div class="stat-detail-row">
                            <div class="stat-detail-meta">
                                <span class="badge">${lotteryName}</span>
                                <span class="text-secondary" style="font-size:0.8rem">Dự đoán: ${predDate}</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:0.75rem;margin-top:0.4rem">
                                <div style="display:flex;gap:0.3rem">
                                    ${r.pred.numbers.map(n => `<span class="number-ball number-ball-sm">${String(n).padStart(2, '0')}</span>`).join('')}
                                </div>
                                <span class="badge" style="background:var(--bg-secondary);color:var(--accent);border-color:var(--accent)">Đang chờ kết quả...</span>
                            </div>
                        </div>`;
        }

        const drawDate = new Date(r.draw.timestamp).toLocaleDateString('vi-VN');
        const matchColor = r.matched >= 4 ? 'var(--success)' : r.matched >= 2 ? 'var(--primary)' : 'var(--text-secondary)';

        return `
                    <div class="stat-detail-row">
                        <div class="stat-detail-meta">
                            <span class="badge">${lotteryName}</span>
                            <span class="text-secondary" style="font-size:0.8rem">Dự đoán: ${predDate} → Kỳ quay: ${drawDate}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-top:0.4rem">
                            <div style="display:flex;gap:0.3rem">
                                ${r.pred.numbers.map(n => {
            const hit = r.draw.numbers.includes(n);
            return `<span class="number-ball number-ball-sm${hit ? ' number-ball-match' : ''}">${String(n).padStart(2, '0')}</span>`;
        }).join('')}
                            </div>
                            <span style="font-weight:700;color:${matchColor}">${r.matched}/6 số trúng</span>
                            <span class="text-secondary" style="font-size:0.8rem">Kỳ: ${r.draw.drawId}</span>
                        </div>
                    </div>`;
    }).join('<div class="result-set-divider"></div>')}
        </div>`;

    const html = `
        <section class="page active statistics-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Thống kê Dự đoán</h1>
                    <p class="page-subtitle">Kiểm tra độ chính xác dựa trên lịch sử dự đoán đã lưu</p>
                </div>
                ${summaryHtml}
                ${detailHtml}
            </div>
        </section>
    `;

    document.getElementById('dynamicContent').innerHTML = html;
}

function loadCheckerPage() {
    const html = `
        <section class="page active checker-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Kiểm tra vé</h1>
                    <p class="page-subtitle">So sánh bộ số của bạn với kết quả thực tế</p>
                </div>
                
                <div class="checker-content">
                    <div class="card">
                        <div class="form-group">
                            <label>Loại xổ số</label>
                            <select id="checkerLotteryType" class="form-control">
                                <option value="power655">Power 6/55</option>
                                <option value="mega645">Mega 6/45</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Nhập 6 số của bạn</label>
                            <div class="checker-inputs" style="display:flex;gap:0.5rem;margin-bottom:1rem">
                                <input type="number" class="form-control check-num" min="1" max="55" placeholder="01">
                                <input type="number" class="form-control check-num" min="1" max="55" placeholder="02">
                                <input type="number" class="form-control check-num" min="1" max="55" placeholder="03">
                                <input type="number" class="form-control check-num" min="1" max="55" placeholder="04">
                                <input type="number" class="form-control check-num" min="1" max="55" placeholder="05">
                                <input type="number" class="form-control check-num" min="1" max="55" placeholder="06">
                            </div>
                        </div>
                        <button class="btn btn-primary w-100" onclick="runChecker()">Kiểm tra kết quả</button>
                    </div>
                    
                    <div id="checkerResults" style="margin-top:2rem"></div>
                </div>
            </div>
        </section>
    `;

    document.getElementById('dynamicContent').innerHTML = html;
    window.runChecker = runChecker;
}

function runChecker() {
    const type = document.getElementById('checkerLotteryType').value;
    const inputs = Array.from(document.querySelectorAll('.check-num')).map(i => parseInt(i.value)).filter(n => !isNaN(n));

    if (inputs.length < 6) {
        showNotification('Vui lòng nhập đủ 6 số', 'error');
        return;
    }

    if (!window.HistoricalData || !window.HistoricalData[type]) {
        showNotification('Không có dữ liệu lịch sử', 'error');
        return;
    }

    const results = window.HistoricalData[type].results;
    const matches = results.map(draw => {
        const matched = inputs.filter(n => draw.numbers.includes(n));
        return { draw, matched: matched.length };
    }).filter(m => m.matched >= 2)
        .sort((a, b) => b.matched - a.matched || new Date(b.draw.timestamp) - new Date(a.draw.timestamp));

    const resultsContainer = document.getElementById('checkerResults');
    if (matches.length === 0) {
        resultsContainer.innerHTML = '<div class="card"><p>Không tìm thấy kết quả trùng khớp từ 2 số trở lên.</p></div>';
        return;
    }

    resultsContainer.innerHTML = `
        <div class="card">
            <h3 class="card-title">Kết quả đối soát (${matches.length} kỳ quay trùng)</h3>
            <div class="checker-results-list">
                ${matches.map(m => `
                    <div class="checker-result-row">
                        <div class="checker-draw-info">
                            <span class="badge">${m.draw.drawId}</span>
                            <span class="text-secondary">${new Date(m.draw.timestamp).toLocaleDateString('vi-VN')}</span>
                            <span class="badge-match badge">${m.matched}/6 số trùng</span>
                        </div>
                        <div style="display:flex;gap:0.4rem;margin-top:0.5rem">
                            ${m.draw.numbers.map(n => {
        const isMatch = inputs.includes(n);
        return `<span class="number-ball number-ball-sm ${isMatch ? 'number-ball-match' : ''}">${String(n).padStart(2, '0')}</span>`;
    }).join('')}
                        </div>
                    </div>
                `).join('<div class="result-set-divider"></div>')}
            </div>
        </div>
    `;
}

function loadHistoryPage() {
    const html = `
        <section class="page active history-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Lịch sử dự đoán</h1>
                    <p class="page-subtitle">Xem lại các bộ số đã dự đoán</p>
                </div>
                
                <div class="history-content">
                    ${renderHistoryList()}
                </div>
            </div>
        </section>
    `;

    document.getElementById('dynamicContent').innerHTML = html;
}

function renderHistoryList() {
    if (AppState.predictions.length === 0) {
        return `
            <div class="card empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Chưa có dự đoán nào</h3>
                <p>Hãy tạo dự đoán đầu tiên của bạn!</p>
                <button class="btn btn-primary" onclick="navigateToPage('predictor')">Bắt đầu dự đoán</button>
            </div>
        `;
    }

    return AppState.predictions.map(pred => `
        <div class="history-card card">
            <div class="history-header">
                <div>
                    <h4>${pred.lotteryType === 'power655' ? 'Power 6/55' : 'Mega 6/45'}</h4>
                    <p class="text-secondary">${new Date(pred.timestamp).toLocaleString('vi-VN')}</p>
                </div>
                <div class="score-badge ${getScoreClass(pred.score)}">
                    ${pred.score} điểm
                </div>
            </div>
            <div class="numbers-display">
                ${pred.numbers.map(num => `<span class="number-ball">${num.toString().padStart(2, '0')}</span>`).join('')}
            </div>
            <div class="history-meta">
                <span class="badge">${pred.strategy}</span>
            </div>
        </div>
    `).join('');
}

function getScoreClass(score) {
    if (score >= 80) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
}

// This function will be called from prediction-engine.js
function generatePrediction() {
    const lotteryType = document.getElementById('lotteryType').value;
    const strategy = document.getElementById('strategy').value;
    const numberOfSets = parseInt(document.getElementById('numberOfSets').value);

    // This will use the PredictionEngine from prediction-engine.js
    if (window.PredictionEngine) {
        const results = window.PredictionEngine.generate(lotteryType, strategy, numberOfSets);
        displayPredictionResults(results);
    } else {
        alert('Prediction engine chưa được tải. Vui lòng thử lại.');
    }
}

function displayPredictionResults(results) {
    const resultsContainer = document.getElementById('predictionResults');

    if (!results || results.length === 0) {
        resultsContainer.innerHTML = '<div class="card"><p>Không thể tạo dự đoán. Vui lòng thử lại.</p></div>';
        return;
    }

    // Auto-save all generated predictions
    results.forEach(result => {
        AppState.predictions.unshift(result);
    });
    if (AppState.predictions.length > 50) {
        AppState.predictions = AppState.predictions.slice(0, 50);
    }
    try {
        localStorage.setItem('predictions', JSON.stringify(AppState.predictions));
    } catch (e) {
        console.error('Lỗi lưu localStorage:', e);
    }

    // Render all sets inside ONE card
    const setsHtml = results.map((result, index) => `
        <div class="result-set-row">
            <div class="result-set-label">
                <span class="result-set-index">#${index + 1}</span>
                <div class="score-badge ${getScoreClass(result.score)} score-inline">
                    <span class="score-value-sm">${result.score}</span>
                    <span class="score-label-sm">pt</span>
                </div>
            </div>
            <div class="numbers-display numbers-display-compact">
                ${result.numbers.map(num => `<span class="number-ball number-ball-sm">${num.toString().padStart(2, '0')}</span>`).join('')}
            </div>
            <button class="btn btn-icon" title="Sao chép" onclick="copyNumbersSet(${index})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
            </button>
        </div>
    `).join('<div class="result-set-divider"></div>');

    // Analysis from first (best) result
    const best = results[0];
    const analysisHtml = `
        <div class="analysis-section" style="margin-top:1.5rem">
            <h4 class="analysis-title">Phân tích bộ số #1 (tốt nhất)</h4>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <div class="analysis-label">Chẵn/Lẻ</div>
                    <div class="analysis-value">${best.analysis.evenOdd.even} chẵn - ${best.analysis.evenOdd.odd} lẻ</div>
                    <div class="analysis-score">${best.analysis.evenOddScore}/20 điểm</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-label">Cao/Thấp</div>
                    <div class="analysis-value">${best.analysis.lowHigh.low} thấp - ${best.analysis.lowHigh.high} cao</div>
                    <div class="analysis-score">${best.analysis.lowHighScore}/20 điểm</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-label">Tổng số</div>
                    <div class="analysis-value">${best.analysis.sum}</div>
                    <div class="analysis-score">${best.analysis.sumScore}/15 điểm</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-label">Số liên tiếp</div>
                    <div class="analysis-value">${best.analysis.hasConsecutive ? 'Có' : 'Không'}</div>
                    <div class="analysis-score">${best.analysis.consecutiveScore}/10 điểm</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-label">Phân bố</div>
                    <div class="analysis-value">${best.analysis.isBalanced ? 'Cân bằng' : 'Chưa tối ưu'}</div>
                    <div class="analysis-score">${best.analysis.distributionScore}/10 điểm</div>
                </div>
                <div class="analysis-item">
                    <div class="analysis-label">Tránh mô hình</div>
                    <div class="analysis-value">${best.analysis.avoidsPatterns ? 'Tốt' : 'Cần cải thiện'}</div>
                    <div class="analysis-score">${best.analysis.patternScore}/10 điểm</div>
                </div>
            </div>
        </div>`;

    const html = `
        <div class="card prediction-result">
            <div class="result-header">
                <div>
                    <h3>${results.length} bộ số dự đoán</h3>
                    <p class="text-secondary" style="font-size:0.875rem;margin-top:0.25rem">
                        Chiến lược: ${results[0].strategy} &bull; Đã lưu tự động
                    </p>
                </div>
                <div class="score-badge ${getScoreClass(best.score)}">
                    <div class="score-value">${best.score}</div>
                    <div class="score-label">AI Score</div>
                </div>
            </div>
            <div class="results-sets-container">
                ${setsHtml}
            </div>
            ${results.length > 0 ? analysisHtml : ''}
        </div>`;

    resultsContainer.innerHTML = html;
    window.currentPredictions = results;
}

function copyNumbersSet(index) {
    if (!window.currentPredictions || !window.currentPredictions[index]) return;
    const nums = window.currentPredictions[index].numbers.map(n => String(n).padStart(2, '0')).join(' - ');
    navigator.clipboard.writeText(nums).then(() => {
        showNotification('Đã sao chép bộ số #' + (index + 1) + '!', 'success');
    });
}

window.copyNumbersSet = copyNumbersSet;

function savePrediction(index) {
    if (!window.currentPredictions || !window.currentPredictions[index]) {
        alert('Không tìm thấy dự đoán để lưu');
        return;
    }

    const prediction = window.currentPredictions[index];
    AppState.predictions.unshift(prediction); // Add to beginning

    // Keep only last 50 predictions
    if (AppState.predictions.length > 50) {
        AppState.predictions = AppState.predictions.slice(0, 50);
    }

    try {
        localStorage.setItem('predictions', JSON.stringify(AppState.predictions));
        // Show success message
        showNotification('Đã lưu dự đoán thành công!', 'success');
    } catch (error) {
        console.error('Lỗi khi lưu vào LocalStorage:', error);
        alert('Không thể lưu dữ liệu: ' + error.message);
    }
}

// Ensure functions are globally available for inline onclick handlers
window.savePrediction = savePrediction;
window.copyNumbers = copyNumbers;

function copyNumbers(index) {
    if (!window.currentPredictions || !window.currentPredictions[index]) {
        alert('Không tìm thấy dự đoán để sao chép');
        return;
    }

    const numbers = window.currentPredictions[index].numbers.join(' - ');

    navigator.clipboard.writeText(numbers).then(() => {
        showNotification('Đã sao chép: ' + numbers, 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = numbers;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Đã sao chép: ' + numbers, 'success');
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
