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
    const html = `
        <section class="page active statistics-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Thống kê & Phân tích</h1>
                    <p class="page-subtitle">Phân tích tần suất và xu hướng từ 100+ kỳ quay</p>
                </div>
                
                <div class="stats-content">
                    <div class="card">
                        <h3 class="card-title">Đang phát triển...</h3>
                        <p>Tính năng thống kê sẽ được bổ sung trong phiên bản tiếp theo.</p>
                    </div>
                </div>
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
                        <h3 class="card-title">Đang phát triển...</h3>
                        <p>Tính năng kiểm tra vé sẽ được bổ sung trong phiên bản tiếp theo.</p>
                    </div>
                </div>
            </div>
        </section>
    `;

    document.getElementById('dynamicContent').innerHTML = html;
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

    const html = results.map((result, index) => `
        <div class="prediction-result card">
            <div class="result-header">
                <h3>Bộ số #${index + 1}</h3>
                <div class="score-badge ${getScoreClass(result.score)}">
                    <div class="score-value">${result.score}</div>
                    <div class="score-label">AI Score</div>
                </div>
            </div>
            
            <div class="numbers-display">
                ${result.numbers.map(num => `
                    <div class="number-ball">
                        <span class="number">${num.toString().padStart(2, '0')}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="result-meta">
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <span>${result.strategy}</span>
                </div>
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>${new Date(result.timestamp).toLocaleTimeString('vi-VN')}</span>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4 class="analysis-title">Phân tích chi tiết</h4>
                <div class="analysis-grid">
                    <div class="analysis-item">
                        <div class="analysis-label">Chẵn/Lẻ</div>
                        <div class="analysis-value">${result.analysis.evenOdd.even} chẵn - ${result.analysis.evenOdd.odd} lẻ</div>
                        <div class="analysis-score">${result.analysis.evenOddScore}/20 điểm</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Cao/Thấp</div>
                        <div class="analysis-value">${result.analysis.lowHigh.low} thấp - ${result.analysis.lowHigh.high} cao</div>
                        <div class="analysis-score">${result.analysis.lowHighScore}/20 điểm</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Tổng số</div>
                        <div class="analysis-value">${result.analysis.sum}</div>
                        <div class="analysis-score">${result.analysis.sumScore}/15 điểm</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Số liên tiếp</div>
                        <div class="analysis-value">${result.analysis.hasConsecutive ? 'Có' : 'Không'}</div>
                        <div class="analysis-score">${result.analysis.consecutiveScore}/15 điểm</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Phân bố</div>
                        <div class="analysis-value">${result.analysis.isBalanced ? 'Cân bằng' : 'Chưa tối ưu'}</div>
                        <div class="analysis-score">${result.analysis.distributionScore}/10 điểm</div>
                    </div>
                    <div class="analysis-item">
                        <div class="analysis-label">Tránh mô hình</div>
                        <div class="analysis-value">${result.analysis.avoidsPatterns ? 'Tốt' : 'Cần cải thiện'}</div>
                        <div class="analysis-score">${result.analysis.patternScore}/10 điểm</div>
                    </div>
                </div>
            </div>
            
            <div class="result-actions">
                <button class="btn btn-primary" onclick="savePrediction(${index})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Lưu dự đoán
                </button>
                <button class="btn btn-secondary" onclick="copyNumbers(${index})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Sao chép
                </button>
            </div>
        </div>
    `).join('');

    resultsContainer.innerHTML = html;

    // Store results temporarily for save/copy functions
    window.currentPredictions = results;
}

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
