import React, { createContext, useState } from 'react';

export const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  // --- THÔNG TIN HỆ THỐNG ---
  const [consentGivenAt, setConsentGivenAt] = useState(null);

  // --- THÔNG TIN CÁ NHÂN & LIÊN LẠC ---
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [otpCode, setOtpCode] = useState(null);

  // --- THÔNG TIN KHOẢN VAY ---
  const [loanAmount, setLoanAmount] = useState(50000000); // Mặc định 50 triệu
  const [loanTermMonths, setLoanTermMonths] = useState(12); // Mặc định 12 tháng
  const [loanPurpose, setLoanPurpose] = useState('Tiêu dùng cá nhân');

  // --- THÔNG TIN THU NHẬP & TÀI SẢN ---
  const [monthlyIncome, setMonthlyIncome] = useState(null);
  const [salaryAccountType, setSalaryAccountType] = useState('VRB'); // 'VRB' hoặc 'OTHER'
  const [incomeProofFile, setIncomeProofFile] = useState(null); // URI tạm
  const [assetsDescription, setAssetsDescription] = useState('');

  // --- THÔNG TIN ĐỊNH DANH (QR CCCD) ---
  const [qrData, setQrData] = useState(null);
  const [faceImage, setFaceImage] = useState(null); // Lưu trữ base64 hoặc URI tạm
  
  // --- TRẠNG THÁI HỒ SƠ ---
  const [applicationId, setApplicationId] = useState(null);
  const [status, setStatus] = useState(null); // 'PENDING', 'APPROVED', 'REJECTED'

  // Xóa sạch mọi dữ liệu cá nhân ngay lập tức (Nguyên tắc RAM-only)
  const resetPersonalData = () => {
    setPhoneNumber(null);
    setOtpCode(null);
    setLoanAmount(50000000); // Reset về mặc định
    setLoanTermMonths(12);
    setLoanPurpose('Tiêu dùng cá nhân');
    setMonthlyIncome(null);
    setSalaryAccountType('VRB');
    setIncomeProofFile(null);
    setAssetsDescription('');
    setQrData(null);
    setFaceImage(null);
  };

  // Khởi tạo một phiên làm việc hoàn toàn mới
  const resetSession = () => {
    resetPersonalData();
    setApplicationId(null);
    setStatus(null);
    setConsentGivenAt(null);
  };

  return (
    <ApplicationContext.Provider
      value={{
        consentGivenAt, setConsentGivenAt,
        phoneNumber, setPhoneNumber,
        otpCode, setOtpCode,
        loanAmount, setLoanAmount,
        loanTermMonths, setLoanTermMonths,
        loanPurpose, setLoanPurpose,
        monthlyIncome, setMonthlyIncome,
        salaryAccountType, setSalaryAccountType,
        incomeProofFile, setIncomeProofFile,
        assetsDescription, setAssetsDescription,
        qrData, setQrData,
        faceImage, setFaceImage,
        applicationId, setApplicationId,
        status, setStatus,
        resetPersonalData,
        resetSession,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
