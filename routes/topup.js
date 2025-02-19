const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// สร้าง mock data สำหรับประวัติการเติมเงิน
let topupHistory = [];

// เติมเงิน
router.post('/money', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        
        // จำลองการเติมเงิน
        const transaction = {
            id: Date.now(),
            userId: req.user.id,
            type: 'money',
            amount: amount,
            status: 'success',
            timestamp: new Date()
        };
        
        topupHistory.push(transaction);
        
        res.json({
            success: true,
            message: 'เติมเงินสำเร็จ',
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเติมเงิน',
            error: error.message
        });
    }
});

// เติมทอง
router.post('/gold', auth, async (req, res) => {
    try {
        const { amount } = req.body;
        
        // จำลองการเติมทอง
        const transaction = {
            id: Date.now(),
            userId: req.user.id,
            type: 'gold',
            amount: amount,
            status: 'success',
            timestamp: new Date()
        };
        
        topupHistory.push(transaction);
        
        res.json({
            success: true,
            message: 'เติมทองสำเร็จ',
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการเติมทอง',
            error: error.message
        });
    }
});

// ดูประวัติการเติมเงิน/ทอง
router.get('/history', auth, async (req, res) => {
    try {
        const userHistory = topupHistory.filter(
            transaction => transaction.userId === req.user.id
        );
        
        res.json({
            success: true,
            history: userHistory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงประวัติ',
            error: error.message
        });
    }
});

module.exports = router;
