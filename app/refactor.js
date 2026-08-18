const fs = require('fs');
const path = require('path');

const screensDir = __dirname;
const rlosDir = path.join(screensDir, 'screens', 'rlos');
const financeDir = path.join(screensDir, 'screens', 'finance');
const authDir = path.join(screensDir, 'screens', 'auth');

// Tạo thư mục nếu chưa có
[rlosDir, financeDir, authDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const files = [
    "ApplicationHistoryScreen.js", "ConsentScreen.js", "FaceCaptureScreen.js", 
    "HomeScreen.js", "IncomeVerificationScreen.js", "LoanApplicationScreen.js", 
    "OnboardingScreen.js", "OtpScreen.js", "PhoneEntryScreen.js", 
    "QrScanScreen.js", "ReviewAndSubmitScreen.js", "StatusScreen.js"
];

files.forEach(file => {
    const oldPath = path.join(screensDir, file);
    const newPath = path.join(rlosDir, file);
    
    if (fs.existsSync(oldPath)) {
        let content = fs.readFileSync(oldPath, 'utf8');
        content = content.replace(/'\.\.\/context\//g, "'../../context/");
        content = content.replace(/'\.\.\/constants\//g, "'../../constants/");
        content = content.replace(/'\.\.\/components\//g, "'../../components/");
        content = content.replace(/'\.\.\/config\//g, "'../../config/");
        content = content.replace(/'\.\.\/services\//g, "'../../services/");
        
        fs.writeFileSync(newPath, content, 'utf8');
        fs.unlinkSync(oldPath);
        console.log(`Moved and updated ${file}`);
    } else {
        console.log(`File not found: ${oldPath}`);
    }
});
