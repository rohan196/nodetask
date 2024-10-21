import express from 'express';
import Stock from '../models/Stock.js';

const router = express.Router();

// API 1: Get the records with the highest volume
router.get('/highest_volume', async (req, res) => {
    const { start_date, end_date, symbol } = req.query;

    // Build the query
    const query = {};
    if (start_date || end_date) {
        query.date = {};
        if (start_date) query.date['$gte'] = start_date;
        if (end_date) query.date['$lte'] = end_date;
    }
    if (symbol) {
        query.symbol = symbol;
    }

    try {
        const highestVolumeRecord = await Stock.find(query)
            .sort({ volume: -1 }) // Sort by volume in descending order
            .limit(1) // Get the record with the highest volume
            .exec();

        if (highestVolumeRecord.length > 0) {
            const { date, symbol, volume } = highestVolumeRecord[0];
            res.json({
                highest_volume: {
                    date,
                    symbol,
                    volume,
                },
            });
        } else {
            res.status(404).json({ error: 'No records found for the given criteria.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

// API 2: Calculate and return the average closing price
router.get('/average_close', async (req, res) => {
    const { start_date, end_date, symbol } = req.query;

    if (!symbol) {
        return res.status(400).json({ error: 'Symbol is required' });
    }

    // Build the query
    const query = {
        symbol,
    };

    if (start_date || end_date) {
        query.date = {};
        if (start_date) query.date['$gte'] = start_date;
        if (end_date) query.date['$lte'] = end_date;
    }

    try {
        const records = await Stock.find(query).exec();

        if (records.length > 0) {
            const totalClose = records.reduce((sum, record) => sum + record.close, 0);
            const averageClose = totalClose / records.length;

            res.json({
                average_close: averageClose,
            });
        } else {
            res.status(404).json({ error: 'No records found for the given criteria.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

// API 3: Calculate and return the average VWAP
router.get('/average_vwap', async (req, res) => {
    const { start_date, end_date, symbol } = req.query;

    // Build the query
    const query = {};
    if (start_date || end_date) {
        query.date = {};
        if (start_date) query.date['$gte'] = start_date;
        if (end_date) query.date['$lte'] = end_date;
    }
    if (symbol) {
        query.symbol = symbol;
    }

    try {
        const records = await Stock.find(query).exec();

        if (records.length > 0) {
            const totalVWAP = records.reduce((sum, record) => sum + record.vwap, 0);
            const averageVWAP = totalVWAP / records.length;

            res.json({
                average_vwap: averageVWAP,
            });
        } else {
            res.status(404).json({ error: 'No records found for the given criteria.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

export default router;
