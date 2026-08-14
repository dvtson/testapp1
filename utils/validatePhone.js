/**
 * Kiểm tra định dạng số điện thoại Việt Nam
 * Bắt đầu bằng 0 hoặc +84, theo sau là 9 chữ số.
 * @param {string} phone 
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const regex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
  // Chấp nhận mọi số bắt đầu bằng 0 và có độ dài 10 để linh hoạt cho bản demo, 
  // hoặc dùng regex chuẩn ở trên. 
  // Để an toàn với số giả, nới lỏng regex 1 chút:
  const looseRegex = /^(0|\+84)[0-9]{9}$/;
  return looseRegex.test(phone.trim());
};
