export const parseQrCccd = (raw) => {
  if (!raw || typeof raw !== 'string') {
    return { success: false, error: 'Dữ liệu QR không hợp lệ.' };
  }

  const parts = raw.split('|');
  // Expected length is usually 7 (citizenId, oldId, fullName, dob, gender, address, issueDate)
  if (parts.length < 6) {
    return { success: false, error: 'Dữ liệu QR thiếu trường thông tin (ít nhất 6 trường).' };
  }

  const [citizenId, oldId, fullName, dobRaw, gender, address, issueDateRaw] = parts;

  // Validate citizenId
  if (!/^\d{12}$/.test(citizenId)) {
    return { success: false, error: 'Số CCCD phải bao gồm đúng 12 chữ số.' };
  }

  // Validate fullName, gender, address basic checks
  if (!fullName || !gender || !address) {
    return { success: false, error: 'Thiếu thông tin họ tên, giới tính hoặc địa chỉ.' };
  }

  // Validate and parse DOB
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return null;
    const day = parseInt(dateStr.substring(0, 2), 10);
    const month = parseInt(dateStr.substring(2, 4), 10);
    const year = parseInt(dateStr.substring(4, 8), 10);
    
    if (year < 1900) return null;
    
    const dateObj = new Date(year, month - 1, day);
    // Check if valid date (e.g., not 31 Feb)
    if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
      return null;
    }
    
    // Check if future
    if (dateObj > new Date()) {
      return null;
    }
    
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const dob = parseDate(dobRaw);
  if (!dob) {
    return { success: false, error: 'Ngày sinh không hợp lệ hoặc sai định dạng.' };
  }

  const issueDate = parseDate(issueDateRaw || '') || '';

  return {
    success: true,
    data: {
      citizenId,
      oldId: oldId || '',
      fullName,
      dob,
      gender,
      address,
      issueDate
    }
  };
};
