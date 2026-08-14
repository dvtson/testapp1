import { parseQrCccd } from './parseQrCccd';

describe('parseQrCccd', () => {
  it('case hợp lệ: parse chuẩn dữ liệu CCCD', () => {
    const raw = '001090123456|123456789|NGUYEN VAN A|01011990|Nam|Hà Nội|15102021';
    const result = parseQrCccd(raw);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      citizenId: '001090123456',
      oldId: '123456789',
      fullName: 'NGUYEN VAN A',
      dob: '1990-01-01',
      gender: 'Nam',
      address: 'Hà Nội',
      issueDate: '2021-10-15'
    });
  });

  it('case thiếu field: trả về lỗi khi thiếu thông tin bắt buộc', () => {
    // Thiếu dấu | (chỉ có 4 fields)
    const raw = '001090123456|NGUYEN VAN A|01011990|Nam';
    const result = parseQrCccd(raw);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('thiếu trường thông tin');
  });

  it('case sai định dạng ngày: trả về lỗi khi năm sinh vô lý', () => {
    // Năm sinh 1800 (< 1900)
    const raw = '001090123456||NGUYEN VAN A|01011800|Nam|Hà Nội|15102021';
    const result = parseQrCccd(raw);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Ngày sinh không hợp lệ');
  });

  it('case sai định dạng CCCD: không đủ 12 số', () => {
    const raw = '001090123|123456789|NGUYEN VAN A|01011990|Nam|Hà Nội|15102021';
    const result = parseQrCccd(raw);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('12 chữ số');
  });
});
