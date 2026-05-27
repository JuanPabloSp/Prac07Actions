const fs = require('fs');
const path = require('path');

console.log('🔍 Running static analysis on Terraform configuration files...');

const infraDir = path.join(__dirname, '..');
let violations = 0;

function checkTfFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
        // Rule 1: No hardcoded credentials
        if (line.includes('secret_key') || line.includes('access_key') || line.includes('password') || line.includes('api_key')) {
            if (line.includes('="') || line.includes('=\'')) {
                console.error(`❌ Security Warning in ${path.basename(filePath)} on line ${idx + 1}: Potential hardcoded credential found!`);
                violations++;
            }
        }

        // Rule 2: Ensure proper formatting of resource/variable naming (snake_case)
        const resourceMatch = line.match(/(resource|variable|output)\s+"([^"]+)"/);
        if (resourceMatch) {
            const name = resourceMatch[2];
            if (/[A-Z]/.test(name) || /[-]/.test(name)) {
                console.warn(`⚠️ Style Warning in ${path.basename(filePath)} on line ${idx + 1}: Resource/Variable name "${name}" should use snake_case.`);
            }
        }
    });
}

if (fs.existsSync(infraDir)) {
    const files = fs.readdirSync(infraDir);
    files.forEach(f => {
        if (f.endsWith('.tf')) {
            checkTfFile(path.join(infraDir, f));
        }
    });
}

if (violations > 0) {
    console.error(`🚨 Infrastructure validation failed with ${violations} security/syntax violation(s).`);
    process.exit(1);
} else {
    console.log('✅ Infrastructure static analysis completed successfully. No security risks found!');
    process.exit(0);
}
