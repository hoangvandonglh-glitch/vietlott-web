# 🚀 Hướng Dẫn Deploy Website Xổ Số (Miễn Phí & Tự Động)

Chúng ta sẽ sử dụng **GitHub** để lưu mã nguồn và chạy tool lấy dữ liệu tự động, và **Vercel** để hiển thị website.

## Bước 1: Chuẩn bị GitHub
1.  Đăng nhập vào [GitHub.com](https://github.com).
2.  Tạo một Repository mới (ví dụ đặt tên là `vietlott-web`).
    *   Chọn **Public** (nếu để Private thì Vercel miễn phí vẫn dùng được, nhưng Github Actions có giới hạn phút chạy ít hơn).
3.  **Quan trọng**: Đừng tick vào "Initialize this repository with a README".

## Bước 2: Đẩy code lên GitHub (Thực hiện trên máy tính của bạn)
Mở Terminal (hoặc CMD/PowerShell) tại thư mục này (`c:\Users\Admin\Downloads\lot`) và chạy lần lượt các lệnh sau:

```bash
# 1. Khởi tạo git (nếu chưa có)
git init

# 2. Thêm tất cả file vào git
git add .

# 3. Lưu phiên bản đầu tiên
git commit -m "First commit"

# 4. Đổi tên nhánh chính thành main (chuẩn mới)
git branch -M main

# 5. Liên kết với kho GitHub bạn vừa tạo (THAY THẾ LINK BÊN DƯỚI BẰNG LINK CỦA BẠN)
git remote add origin https://github.com/USERNAME_CUA_BAN/TEN_REPO_CUA_BAN.git

# 6. Đẩy code lên
git push -u origin main
```

## Bước 3: Deploy lên Vercel
1.  Đăng nhập vào [Vercel.com](https://vercel.com) (nên đăng nhập bằng GitHub).
2.  Bấm **"Add New..."** -> **"Project"**.
3.  Tìm repository `vietlott-web` bạn vừa tạo và bấm **Import**.
4.  Ở màn hình cấu hình:
    *   **Framework Preset**: Chọn `Other` (hoặc để mặc định, Vercel tự nhận diện).
    *   **Build Command**: Để trống (vì web tĩnh).
    *   **Output Directory**: Để trống (hoặc `.` ).
5.  Bấm **Deploy**.

## Bước 4: Kiểm tra Tự động cập nhật
Sau khi deploy xong, bạn vào lại trang GitHub của bạn:
1.  Bấm vào tab **Actions**.
2.  Bạn sẽ thấy workflow "Daily Data Update".
3.  Nó được thiết lập để chạy lúc **18:45 hàng ngày**.
4.  Nếu muốn test ngay, bạn có thể bấm vào workflow đó ở cột trái -> Bấm nút **"Run workflow"** màu xám bên phải.
5.  Sau khi chạy xong (màu xanh), file data trong code sẽ thay đổi -> Vercel sẽ tự động phát hiện và update lại website sau khoảng 1-2 phút.

---
**Lưu ý**: Lần chạy đầu tiên có thể `scraper.js` sẽ cần một chút thời gian để crawl 50 kỳ đầu tiên.
