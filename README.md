Mạng Xã Hội Cựu Sinh Viên - Frontend

1. Mô tả dự án
Frontend cho hệ thống mạng xã hội dành cho cựu sinh viên, giảng viên và quản trị viên.  
Ứng dụng được xây dựng với **ReactJS** (hoặc Vue/Angular tùy bạn), hỗ trợ:
- Hiển thị bài viết, khảo sát, thông báo từ backend.
- Xử lý chat thời gian thực với **Firebase**.
- Ngăn chặn truy cập trái phép bằng kiểm tra quyền từ JWT token.
- Điều hướng an toàn: không thể truy cập trang quản trị bằng cách sửa URL.

2. Công nghệ sử dụng
- **ReactJS** + **React Router**
- **Firebase Realtime Database** / **Firestore** (chat)
- **Axios** (gọi API backend)
- **Bootstrap / TailwindCSS** (giao diện)
- **JWT** (kiểm tra đăng nhập & phân quyền)

3. Cài đặt
# Clone dự án
git clone https://github.com/QuangTruongPractice/socialNetwork-Frontend.git

# Cài đặt dependencies
npm install

# Chạy dev mode
npm start

4. Chức năng chính
Trang chủ: hiển thị bài viết, hình ảnh, khảo sát.

Chat trực tuyến: gửi và nhận tin nhắn thời gian thực.

Quản trị: chỉ ADMIN mới truy cập được.

Bảo mật điều hướng: chặn truy cập trái phép bằng kiểm tra token + role.

Thông báo lỗi & loading: UX thân thiện.