// ===== RESULTS PAGE FUNCTIONS =====

// Add to loadPage switch statement:
// case 'results':
//     loadResultsPage();
//     break;

function loadResultsPage() {
    const html = `
        <section class="page active results-page">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Kết quả xổ số</h1>
                    <p class="page-subtitle">Kết quả thực tế từ 858 kỳ quay gần nhất</p>
                </div>
                
                <div class="results-filters">
                    <div class="filter-group">
                        <label>Loại xổ số</label>
                        <select id="resultsLotteryFilter" class="form-control">
                            <option value="power655">Power 6/55</option>
                            <option value="mega645">Mega 6/45</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Tìm kiếm</label>
                        <input type="text" id="resultsSearch" class="form-control" placeholder="Tìm theo ngày (dd/mm/yyyy)">
                    </div>
                    
                    <div class="filter-group">
                        <label>Hiển thị</label>
                        <select id="resultsLimit" class="form-control">
                            <option value="10">10 kỳ gần nhất</option>
                            <option value="20" selected>20 kỳ gần nhất</option>
                            <option value="50">50 kỳ gần nhất</option>
                            <option value="100">100 kỳ gần nhất</option>
                        </select>
                    </div>
                </div>
                
                <div id="resultsContainer" class="results-container">
                    <!-- Results will be loaded here -->
                </div>
            </div>
        </section>
    `;

    document.getElementById('dynamicContent').innerHTML = html;

    // Setup event listeners
    document.getElementById('resultsLotteryFilter').addEventListener('change', renderResults);
    document.getElementById('resultsSearch').addEventListener('input', renderResults);
    document.getElementById('resultsLimit').addEventListener('change', renderResults);

    // Initial render
    renderResults();
}

function renderResults() {
    const lotteryType = document.getElementById('resultsLotteryFilter').value;
    const searchTerm = document.getElementById('resultsSearch').value.toLowerCase();
    const limit = parseInt(document.getElementById('resultsLimit').value);

    if (!window.HistoricalData || !window.HistoricalData[lotteryType]) {
        document.getElementById('resultsContainer').innerHTML = `
            <div class="card empty-state">
                <h3>Không có dữ liệu</h3>
                <p>Dữ liệu lịch sử chưa được tải.</p>
            </div>
        `;
        return;
    }

    const data = window.HistoricalData[lotteryType];
    let results = data.results;

    // Filter by search term
    if (searchTerm) {
        results = results.filter(result => {
            const dateStr = formatResultDate(result.timestamp);
            return dateStr.includes(searchTerm) || result.drawId.toLowerCase().includes(searchTerm);
        });
    }

    // Limit results
    results = results.slice(0, limit);

    if (results.length === 0) {
        document.getElementById('resultsContainer').innerHTML = `
            <div class="card empty-state">
                <h3>Không tìm thấy kết quả</h3>
                <p>Thử tìm kiếm với từ khóa khác.</p>
            </div>
        `;
        return;
    }

    const html = results.map(result => `
        <div class="result-card card">
            <div class="result-card-header">
                <div>
                    <h4 class="result-draw-id">${result.drawId}</h4>
                    <p class="result-date">${result.dayOfWeek}, ${formatResultDate(result.timestamp)}</p>
                </div>
                <div class="result-jackpot">
                    <div class="jackpot-label">Jackpot 1</div>
                    <div class="jackpot-value">${formatCurrency(result.jackpot1)}</div>
                </div>
            </div>
            
            <div class="result-numbers">
                ${result.numbers.map(num => `
                    <div class="result-ball">${num.toString().padStart(2, '0')}</div>
                `).join('')}
                ${result.specialNumber ? `
                    <div class="result-ball special">${result.specialNumber.toString().padStart(2, '0')}</div>
                ` : ''}
            </div>
            
            <div class="result-winners">
                <div class="winner-item">
                    <span class="winner-label">Jackpot 1:</span>
                    <span class="winner-count">${result.winners.jackpot1} người</span>
                </div>
                <div class="winner-item">
                    <span class="winner-label">Jackpot 2:</span>
                    <span class="winner-count">${result.winners.jackpot2} người</span>
                </div>
                <div class="winner-item">
                    <span class="winner-label">Giải nhất:</span>
                    <span class="winner-count">${result.winners.prize1} người</span>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('resultsContainer').innerHTML = html;
}

function formatResultDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + ' tỷ';
    } else if (amount >= 1000000) {
        return (amount / 1000000).toFixed(0) + ' triệu';
    }
    return amount.toLocaleString('vi-VN') + ' đ';
}
