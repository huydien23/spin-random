# 🎯 Vòng Quay May Mắn VHU

Ứng dụng vòng quay may mắn (Spin Wheel) được thiết kế đặc biệt cho các sự kiện của Đại học Văn Hiến (VHU). Ứng dụng có giao diện đẹp mắt, hiệu ứng sinh động và hệ thống quản lý phần quà hoàn chỉnh.

## ✨ Tính Năng Chính

### 🎡 Vòng Quay Tương Tác
- **Thiết kế đẹp mắt**: Vòng quay với hiệu ứng LED xung quanh, gradient màu sắc bắt mắt
- **Animation mượt mà**: Sử dụng Framer Motion cho các hiệu ứng chuyển động tự nhiên
- **Responsive**: Tự động điều chỉnh kích thước phù hợp với mọi thiết bị (mobile, tablet, desktop)
- **Âm thanh**: Hiệu ứng âm thanh khi quay và khi có kết quả (sử dụng use-sound)
- **Confetti**: Hiệu ứng pháo giấy rơi khi trúng thưởng

### 🎁 Quản Lý Phần Quà
- **Danh sách phần quà**: 8 phần quà mặc định với các loại:
  - 🧸 Gấu VHU
  - 🎒 Balo VHU
  - 👕 Áo VHU
  - 🍶 Bình Nước
  - ⛑️ Nón Bảo Hiểm
  - 🔑 Móc Khoá
  - 🔄 Thử Lại (không phải giải thưởng)
  - 🍀 May Mắn (không phải giải thưởng)

### 🔐 Panel Quản Trị
- **Xác thực bảo mật**: Yêu cầu mật khẩu để truy cập (mật khẩu mặc định: `vhu2024`)
- **Chỉnh sửa tên quà**: Thay đổi tên hiển thị của từng phần quà
- **Quản lý số lượng**: Tăng/giảm số lượng mỗi phần quà
- **Upload hình ảnh**: Cho phép thay đổi icon thành hình ảnh tùy chỉnh
- **Reset dữ liệu**: Khôi phục về cài đặt mặc định
- **Lưu trữ Local**: Dữ liệu được lưu tự động vào localStorage

### 🎨 Giao Diện Người Dùng
- **Theme VHU**: Sử dụng màu sắc đặc trưng của Đại học Văn Hiến (xanh #0054A6, vàng #FFD700, đỏ #E31837)
- **Logo**: Hiển thị logo VHU ở đầu trang
- **Background động**: Hiệu ứng floating icons và gradient background
- **Modal kết quả**: Hiển thị kết quả quay với animation đẹp mắt
- **Thông báo hết quà**: Tự động thông báo khi tất cả phần quà đã hết

## 🛠️ Công Nghệ Sử Dụng

### Frontend Framework
- **React 19.2.0**: Thư viện UI hiện đại
- **TypeScript**: Đảm bảo type-safe cho toàn bộ dự án
- **Vite**: Build tool nhanh chóng và hiệu quả

### UI/UX Libraries
- **Framer Motion**: Animation và transitions mượt mà
- **Tailwind CSS**: Styling utility-first
- **Lucide React**: Icons đẹp và nhẹ
- **React Confetti**: Hiệu ứng pháo giấy

### Utilities
- **use-sound**: Quản lý và phát âm thanh
- **clsx + tailwind-merge**: Quản lý className động
- **localStorage**: Lưu trữ dữ liệu phần quà

## 📦 Cài Đặt

### Yêu Cầu
- Node.js 16+ hoặc mới hơn
- npm hoặc yarn

### Các Bước Cài Đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd Spin-Random
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Chạy development server**
```bash
npm run dev
```

4. **Build cho production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 🎮 Hướng Dẫn Sử Dụng

### Cho Người Chơi
1. Nhấn vào nút **"Quay Ngay"** để bắt đầu
2. Chờ vòng quay dừng lại
3. Xem kết quả trong modal hiển thị
4. Nhận quà nếu trúng thưởng!

### Cho Quản Trị Viên
1. Nhấn vào biểu tượng **⚙️** ở góc trên bên phải
2. Nhập mật khẩu (mặc định: `vhu2024`)
3. Trong panel quản trị, bạn có thể:
   - ✏️ Sửa tên phần quà
   - ➕➖ Tăng/giảm số lượng
   - 🖼️ Upload hình ảnh tùy chỉnh
   - 🔄 Reset về mặc định
4. Nhấn **"Lưu Thay Đổi"** để áp dụng

## 📂 Cấu Trúc Dự Án

```
Spin-Random/
├── public/
│   ├── logo.png           # Logo VHU
│   └── sounds/            # File âm thanh
├── src/
│   ├── components/
│   │   ├── UI/
│   │   │   ├── ManagePanel.tsx      # Panel quản trị
│   │   │   ├── ManagerButton.tsx    # Nút mở panel
│   │   │   ├── PasswordModal.tsx    # Modal xác thực
│   │   │   ├── ResultDisplay.tsx    # Hiển thị kết quả
│   │   │   └── ResultModal.tsx      # Modal kết quả
│   │   └── Wheel/
│   │       └── SpinWheel.tsx        # Component vòng quay chính
│   ├── App.tsx            # Component chính
│   ├── App.css            # Styles cho App
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## ⚙️ Tùy Chỉnh

### Thay Đổi Mật Khẩu Quản Trị
Mở [src/components/UI/PasswordModal.tsx](src/components/UI/PasswordModal.tsx) và thay đổi hằng số `ADMIN_PASSWORD`

### Thêm/Sửa Phần Quà Mặc Định
Mở [src/App.tsx](src/App.tsx) và chỉnh sửa mảng `DEFAULT_PRIZES`

### Thay Đổi Màu Sắc Theme
Chỉnh sửa các giá trị màu trong:
- `color`: Màu chính của segment
- `colorEnd`: Màu kết thúc (cho gradient)

### Thêm Logo Tùy Chỉnh
Thay thế file `public/logo.png` bằng logo của bạn

## 🔧 Scripts Có Sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Kiểm tra lỗi với ESLint

## 📝 Lưu Ý

- Dữ liệu phần quà được lưu trong **localStorage** của trình duyệt
- Xóa localStorage sẽ reset về cài đặt mặc định
- Phiên xác thực quản trị được lưu trong **sessionStorage** (hết hạn khi đóng tab)
- Hình ảnh upload được lưu dưới dạng base64 trong localStorage


## 📄 License

Dự án này được phát triển cho mục đích sự kiện của Đại học Văn Hiến.



**🎓 Phát triển bởi Huy Điền **
