# RLOS Beta Demo (React Native Expo)

Dự án ứng dụng di động cho phép đăng ký khoản vay, quét QR CCCD, chụp ảnh khuôn mặt và tạo hồ sơ giả lập RLOS. Ứng dụng tuân thủ nghiêm ngặt nguyên tắc KHÔNG lưu trữ dữ liệu cá nhân cục bộ và đã áp dụng hệ thống Design System mới của ngân hàng (Màu Đỏ & Xanh dương sẫm).

## 🚀 Cài đặt và Chạy ứng dụng

1. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

2. **Khởi chạy ứng dụng bằng Expo:**
   ```bash
   npx expo start
   ```
   Sau khi chạy lệnh trên, bạn có thể sử dụng ứng dụng **Expo Go** trên điện thoại (Android/iOS) và quét mã QR hiện trên terminal để mở app.
   *(Nếu dùng Android Studio Emulator, bạn bấm phím `a` trong terminal).*

## 📱 Luồng màn hình (8 Bước)
1. **PhoneEntryScreen**: Nhập số điện thoại (VD: 0912345678).
2. **OtpScreen**: Nhập mã OTP ảo (6 số).
3. **LoanApplicationScreen**: Chọn số tiền, kỳ hạn và mục đích vay.
4. **IncomeVerificationScreen**: Nhập thu nhập, chọn hình thức nhận lương và upload bảng lương (tùy chọn).
5. **QrScanScreen**: Quét mã QR trên thẻ CCCD.
6. **FaceCaptureScreen**: Chụp ảnh khuôn mặt để đối chiếu.
7. **ReviewAndSubmitScreen**: Xem lại toàn bộ thông tin. Gửi hồ sơ lên Firebase.
8. **StatusScreen**: Hiển thị trạng thái (Tự động duyệt sau 3 giây để demo).

## ⚙️ Cấu hình Firebase & Bảo mật

Ứng dụng đang sử dụng Firebase với các tính năng sau:
- **Authentication**: Đăng nhập Ẩn danh (Anonymous Auth) tự động khi mở app, tạo một `userId` ẩn danh duy nhất cho thiết bị.
- **Firestore**: Lưu trữ dữ liệu hồ sơ với trường `userId`.
- **Storage**: (Đang tắt/bypass cho ảnh khuôn mặt do giới hạn tài khoản Spark, nhưng hỗ trợ tính năng upload `incomeProofFile` nếu đã bật trên console).

**Bảo mật Database (Firebase Rules):**
Chỉ thiết bị tạo hồ sơ mới có quyền đọc/ghi hồ sơ của chính mình. Người khác hoặc thiết bị khác tuyệt đối không thể đọc trộm dữ liệu CCCD.
Vui lòng thiết lập Rules sau trên Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{appId} {
      // Chỉ cho phép ĐỌC và TẠO hồ sơ nếu user đã đăng nhập ẩn danh 
      // VÀ (trường userId trong tài liệu phải trùng khớp với uid của thiết bị hiện tại).
      allow read, create: if request.auth != null && request.auth.uid == resource.data.userId;
      
      // Chặn toàn bộ quyền SỬA và XÓA từ phía client mobile.
      allow update, delete: if false;
    }
  }
}
```

## 🧪 Hướng dẫn test luồng phê duyệt

**Bản cập nhật mới (Tự động duyệt):**
Để thuận tiện cho việc trình diễn Demo, client app đã tích hợp hàm `setTimeout(3000)` tự động gọi `updateDoc` chuyển trạng thái hồ sơ sang `"APPROVED"` sau 3 giây.
*LƯU Ý: Đây chỉ là giải pháp tạm thời cho mục đích demo. Trong thực tế, việc duyệt hồ sơ phải do Backend/Rule Engine quyết định, không bao giờ để Client tự quyết.*

Nếu bạn muốn test thủ công thay đổi trạng thái sang `"REJECTED"`:
1. Gửi hồ sơ và chờ màn hình Status hiện lên.
2. Nhanh chóng vào **Firebase Console** -> **Firestore Database**.
3. Sửa trường `status` của hồ sơ thành `"REJECTED"`.
4. Màn hình điện thoại sẽ tự động đổi qua giao diện Bị từ chối.

## 🛡️ Nguyên tắc Bảo Mật (Đã áp dụng)
- Toàn bộ State (Thông tin cá nhân, CCCD, Ảnh) chỉ lưu trong RAM qua React Context.
- Dữ liệu lập tức được dọn dẹp khỏi RAM sau khi gửi thành công lên Firebase.
- Không sử dụng `AsyncStorage` hay `SecureStore` để lưu bất kỳ dữ liệu nhạy cảm nào.
- Khi người dùng thoát về trang chủ, toàn bộ phiên làm việc sẽ được khởi tạo lại.
