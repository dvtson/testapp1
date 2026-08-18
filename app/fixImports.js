const fs = require('fs');
const path = require('path');

const rlosDir = path.join(__dirname, 'screens', 'rlos');

const files = [
    "ApplicationHistoryScreen.js", "ConsentScreen.js", "FaceCaptureScreen.js", 
    "HomeScreen.js", "IncomeVerificationScreen.js", "LoanApplicationScreen.js", 
    "OnboardingScreen.js", "OtpScreen.js", "PhoneEntryScreen.js", 
    "QrScanScreen.js", "ReviewAndSubmitScreen.js", "StatusScreen.js"
];

files.forEach(file => {
    const filePath = path.join(rlosDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Thay ../../ thành ../../../
        content = content.replace(/'\.\.\/\.\.\/context\//g, "'../../../context/");
        content = content.replace(/'\.\.\/\.\.\/constants\//g, "'../../../constants/");
        content = content.replace(/'\.\.\/\.\.\/components\//g, "'../../../components/");
        content = content.replace(/'\.\.\/\.\.\/config\//g, "'../../../config/");
        content = content.replace(/'\.\.\/\.\.\/services\//g, "'../../../services/");
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed imports in ${file}`);
    } else {
        console.log(`File not found: ${filePath}`);
    }
});
