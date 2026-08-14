import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../config/firebase';
import uuid from 'react-native-uuid';

/**
 * Gửi hồ sơ lên Firebase
 * @param {Object} data - Toàn bộ dữ liệu thu thập được từ các màn hình
 * @returns {Promise<String>} applicationId - ID của hồ sơ vừa tạo
 */
export const submitApplication = async (data) => {
  try {
    const {
      qrData, faceImageBase64,
      phoneNumber, loanAmount, loanTermMonths, loanPurpose,
      monthlyIncome, salaryAccountType, incomeProofFile, assetsDescription,
      consentGivenAt
    } = data;

    // 1. Xử lý ảnh khuôn mặt (Tạm lưu base64 vào Firestore do giới hạn gói Spark trước đây)
    const faceImageUrl = `data:image/jpeg;base64,${faceImageBase64}`;

    // 2. Xử lý upload bảng lương (nếu có)
    let incomeProofUrl = null;
    if (incomeProofFile) {
      try {
        const ext = incomeProofFile.name.split('.').pop();
        const fileId = uuid.v4();
        const storageRef = ref(storage, `income-proofs/${fileId}.${ext}`);
        
        // Chuyển URI thành Blob để upload
        const response = await fetch(incomeProofFile.uri);
        const blob = await response.blob();
        
        await uploadBytes(storageRef, blob);
        incomeProofUrl = await getDownloadURL(storageRef);
      } catch (uploadError) {
        console.warn("Lỗi upload bảng lương lên Storage, bỏ qua file này:", uploadError);
        // Nếu lỗi do giới hạn Storage của gói Spark, tiếp tục không ném lỗi cứng
      }
    }

    // 3. Tạo document trong Firestore
    const applicationsRef = collection(db, 'applications');
    const docRef = await addDoc(applicationsRef, {
      // Từ QR CCCD
      citizenId: qrData.citizenId,
      fullName: qrData.fullName,
      dob: qrData.dob,
      gender: qrData.gender,
      address: qrData.address,
      issueDate: qrData.issueDate || null,
      oldId: qrData.oldId || null,
      faceImageUrl: faceImageUrl,
      
      // Từ luồng khoản vay
      phoneNumber,
      loanAmount,
      loanTermMonths,
      loanPurpose,
      monthlyIncome,
      salaryAccountType,
      incomeProofUrl,
      assetsDescription,

      // Hệ thống
      status: "PENDING",
      createdAt: serverTimestamp(),
      consentGivenAt: consentGivenAt || null,
      source: "mobile_app_beta",
      userId: auth.currentUser ? auth.currentUser.uid : "unknown"
    });

    // 4. TỰ ĐỘNG DUYỆT (MỚI)
    // LƯU Ý QUAN TRỌNG: Đây là cơ chế tự duyệt phía client, chỉ phù hợp cho mục đích demo/beta cá nhân.
    // Trong hệ thống RLOS thật, quyết định duyệt/từ chối phải luôn do backend/rule engine phía server thực hiện, 
    // KHÔNG BAO GIỜ để client tự quyết định trạng thái hồ sơ của chính nó.
    setTimeout(async () => {
      try {
        const appDocRef = doc(db, 'applications', docRef.id);
        await updateDoc(appDocRef, {
          status: "APPROVED",
          decidedAt: serverTimestamp()
        });
        console.log(`Auto-approved application ${docRef.id}`);
      } catch (err) {
        console.error("Auto-approve failed:", err);
      }
    }, 3000);

    return docRef.id;

  } catch (error) {
    // Phân loại lỗi mạng
    if (error.code === 'auth/network-request-failed' || error.message.includes('network')) {
      throw new Error('NETWORK_ERROR');
    }
    // Lỗi khác
    console.error("Firebase submit error: ", error);
    throw error;
  }
};
