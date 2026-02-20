# 🎰 Vietlott AI Predictor

Ứng dụng dự đoán thông minh cho **Power 6/55** và **Mega 6/45** sử dụng AI và phân tích thống kê.

## ✨ Tính năng

### 🤖 5 Chiến lược AI
- **AI Smart Pick (Balanced Mix)**: Kết hợp số nóng, lạnh, và moderate
- **Hot Numbers Focus**: Tập trung vào số xuất hiện nhiều
- **Cold Numbers Focus**: Tập trung vào số ít xuất hiện
- **Wheeling System**: Tạo nhiều bộ số từ 8-10 số yêu thích
- **Quick Random**: Chọn ngẫu nhiên nhanh

### 📊 AI Scoring System (0-100 điểm)
Mỗi dự đoán được chấm điểm dựa trên 7 tiêu chí:
- **Chẵn/Lẻ Balance** (20 điểm): Tỷ lệ 3-3 hoặc 4-2 hoặc 2-4
- **Cao/Thấp Balance** (20 điểm): Phân bố đều giữa số cao và thấp
- **Sum Range** (15 điểm): Tổng số trong phạm vi tối ưu
- **Consecutive Numbers** (15 điểm): Có ít nhất 1 cặp số liên tiếp
- **Distribution** (10 điểm): Phân bố đều trên toàn dải số
- **Pattern Avoidance** (10 điểm): Tránh các mô hình phổ biến
- **Numbers > 31** (10 điểm): Có ít nhất 2 số > 31

### 💾 Lưu trữ & Quản lý
- Lưu lịch sử dự đoán (LocalStorage)
- Xem lại các bộ số đã tạo
- Sao chép số nhanh chóng
- Lưu tối đa 50 dự đoán gần nhất

### 🎨 Giao diện
- Dark mode / Light mode
- Responsive (Mobile, Tablet, Desktop)
- Animations mượt mà
- Glassmorphism effects

## 🚀 Cách sử dụng

### 1. Mở ứng dụng
Mở file `index.html` trong trình duyệt web (Chrome, Firefox, Edge, Safari).

### 2. Chọn loại xổ số
- **Power 6/55**: Jackpot 30 tỷ, khó hơn
- **Mega 6/45**: Jackpot 12 tỷ, dễ hơn 3.56 lần

### 3. Chọn chiến lược
- Chọn một trong 5 chiến lược AI
- Đặt số lượng bộ số muốn tạo (1-10)
- Với Wheeling System: Nhập 8-10 số yêu thích

### 4. Dự đoán
- Click "Dự đoán ngay"
- Xem kết quả với AI Score và phân tích chi tiết
- Lưu hoặc sao chép bộ số

### 5. Xem lịch sử
- Truy cập trang "Lịch sử"
- Xem lại các dự đoán đã lưu
- Kiểm tra AI Score của từng bộ

## 📁 Cấu trúc thư mục

```
lot/
├── index.html              # Trang chủ
├── app.js                  # Logic chính
├── styles.css              # Global styles
├── css/
│   └── predictor.css       # Styles cho predictor
└── js/
    └── prediction-engine.js # AI prediction core
```

## 🧠 Thuật toán AI

### Balanced Mix Strategy
1. Chọn 2 số nóng (hot numbers)
2. Chọn 2 số trung bình (moderate frequency)
3. Chọn 1 số lạnh (cold number)
4. Chọn 1 số ngẫu nhiên
5. Điều chỉnh để đạt 70+ điểm

### Auto-Adjustment Algorithm
- Tối đa 10 lần điều chỉnh
- Cải thiện điểm yếu nhất (chẵn/lẻ, cao/thấp, consecutive, v.v.)
- Đảm bảo AI Score >= 70 điểm

## ⚠️ Lưu ý quan trọng

> **Cảnh báo**: Ứng dụng sử dụng phân tích thống kê và AI, **KHÔNG đảm bảo 100% chính xác**. Xổ số là trò chơi may rủi. Vui lòng chơi có trách nhiệm!

### Nguyên tắc chơi an toàn:
1. Chỉ chơi với số tiền bạn có thể mất
2. Đặt giới hạn ngân sách hàng tháng
3. Không vay mượn để chơi
4. Xem đây là giải trí, không phải cách kiếm tiền

## 🔧 Công nghệ sử dụng

- **HTML5**: Cấu trúc trang
- **CSS3**: Styling với CSS Variables, Flexbox, Grid
- **Vanilla JavaScript**: Logic không cần framework
- **LocalStorage**: Lưu trữ dữ liệu local
- **Google Fonts**: Inter font family

## 📱 Tương thích

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Roadmap (Tính năng tương lai)

- [ ] Thống kê chi tiết với biểu đồ (Chart.js)
- [ ] Kiểm tra vé với kết quả thực tế
- [ ] Xuất PDF dự đoán
- [ ] Dữ liệu lịch sử thực tế từ API
- [ ] Machine Learning để cải thiện dự đoán
- [ ] Chia sẻ dự đoán qua social media

## 📄 License

MIT License - Sử dụng tự do cho mục đích cá nhân và giáo dục.

## 🙏 Credits

Được xây dựng với ❤️ và AI bởi Antigravity (Google DeepMind)

---

**Chúc bạn may mắn! 🍀**
