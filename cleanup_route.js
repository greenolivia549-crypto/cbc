const fs = require('fs');
const path = require('path');

const targetPath = path.join(process.cwd(), 'src', 'app', 'api', 'comments', '[commentId]');

console.log(`Attempting to delete: ${targetPath}`);

if (fs.existsSync(targetPath)) {
    try {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log('Successfully deleted the directory.');
    } catch (err) {
        console.error('Failed to delete directory:', err);
    }
} else {
    console.log('Directory does not exist.');
}
