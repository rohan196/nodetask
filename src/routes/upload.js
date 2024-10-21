import express from 'express';
import multer, { diskStorage } from 'multer';
import csvParser from 'csv-parser';
import { createReadStream, unlink, existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import Stock from '../models/Stock.js';

const router = express.Router();

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileType = extname(file.originalname);
        if (fileType === '.csv') {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    }
});

// Route to upload
router.post('/', upload.single('file'), async (req, res) => {
    let records = [];

    // Check if JSON data is provided
    if (req.is('application/json')) {
        records.push(req.body); // Push the JSON data to records
    } else if (req.file) {
        const filePath = req.file.path;
        const expectedColumns = ['Date', 'Symbol', 'Series', 'Prev Close', 'Open', 'High', 'Low', 'Last', 'Close', 'VWAP', 'Volume', 'Turnover', 'Trades', 'Deliverable', '%Deliverable'];

        // Parse the CSV file
        await new Promise((resolve, reject) => {
            createReadStream(filePath)
                .pipe(csvParser())
                .on('headers', (headers) => {
                    // Check for missing columns
                    const missingColumns = expectedColumns.filter(col => !headers.includes(col));
                    if (missingColumns.length > 0) {
                        return reject(new Error(`Missing columns: ${missingColumns.join(', ')}`));
                    }
                })
                .on('data', (row) => {
                    records.push({
                        date: row['Date'],
                        symbol: row['Symbol'],
                        series: row['Series'],
                        prev_close: parseFloat(row['Prev Close']),
                        open: parseFloat(row['Open']),
                        high: parseFloat(row['High']),
                        low: parseFloat(row['Low']),
                        last: parseFloat(row['Last']),
                        close: parseFloat(row['Close']),
                        vwap: parseFloat(row['VWAP']),
                        volume: parseFloat(row['Volume']),
                        turnover: parseFloat(row['Turnover']),
                        trades: parseInt(row['Trades']),
                        deliverable: parseInt(row['Deliverable']),
                        percent_deliverable: parseFloat(row['%Deliverable'])
                    });
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(err);
                });
        });

        // Delete the uploaded file after processing
        unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
        });
    } else {
        return res.status(400).json({ error: 'No file uploaded or invalid format' });
    }

    // Validate records before saving
    const validRecords = records.filter(record => {
        return (
            !isNaN(Date.parse(record.date)) && // Validate date
            !isNaN(record.prev_close) &&
            !isNaN(record.open) &&
            !isNaN(record.high) &&
            !isNaN(record.low) &&
            !isNaN(record.last) &&
            !isNaN(record.close) &&
            !isNaN(record.vwap) &&
            !isNaN(record.volume) &&
            !isNaN(record.turnover) &&
            !isNaN(record.trades) &&
            !isNaN(record.deliverable) &&
            !isNaN(record.percent_deliverable)
        );
    });

    // Insert valid records into MongoDB
    try {
        await Stock.insertMany(validRecords);
        res.status(201).json({
            message: 'Data successfully uploaded',
            totalRecords: records.length,
            successCount: validRecords.length,
            failedCount: records.length - validRecords.length,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error saving data to the database' });
    }
});

export default router;
