import express from 'express';
import multer, { diskStorage } from 'multer';
import csvParser from 'csv-parser';
import { createReadStream, unlink, existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

const app = express();
const port = 3000;

// Set up storage for multer to handle file upload
const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // File format verification - only accept CSV files
        const fileType = extname(file.originalname);
        if (fileType === '.csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

app.get('/', (req, res) => {
    res.send('Welcome');
});

app.get('/upload', (req, res) => {
    res.send('Please use POST to upload a CSV file.');
});

// Route to upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file format' });
    }

    const filePath = req.file.path;
    const expectedColumns = ['Date', 'Symbol', 'Series', 'Prev Close', 'Open', 'High', 'Low', 'Last', 'Close', 'VWAP', 'Volume', 'Turnover', 'Trades', 'Deliverable', '%Deliverable'];

    let totalRecords = 0;
    let successCount = 0;
    let failedRecords = [];

    // Parse the CSV file
    createReadStream(filePath)
        .pipe(csvParser())
        .on('headers', (headers) => {
            // Check if the file contains the expected columns
            const missingColumns = expectedColumns.filter(col => !headers.includes(col));
            if (missingColumns.length > 0) {
                return res.status(400).json({ error: `Missing columns: ${missingColumns.join(', ')}` });
            }
        })
        .on('data', (row) => {
            totalRecords++;

            // Data validation
            const isValidDate = !isNaN(Date.parse(row['Date']));
            const numericFields = ['Prev Close', 'Open', 'High', 'Low', 'Last', 'Close', 'VWAP', 'Volume', 'Turnover', 'Trades', 'Deliverable', '%Deliverable'];
            const areNumbersValid = numericFields.every(field => !isNaN(parseFloat(row[field])));

            if (isValidDate && areNumbersValid) {
                successCount++;
            } else {
                // Log failed records
                failedRecords.push({
                    row: totalRecords,
                    data: row,
                    reason: isValidDate ? 'Invalid numeric fields' : 'Invalid date format'
                });
            }
        })
        .on('end', () => {
            // After file is processed, send response
            res.json({
                totalRecords,
                successCount,
                failedCount: failedRecords.length,
                failedRecords
            });

            // Optionally delete the uploaded file after processing
            unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'Error processing CSV file' });
        });
});

// Create upload directory if it doesn't exist
if (!existsSync('upload')) {
    mkdirSync('upload');
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

