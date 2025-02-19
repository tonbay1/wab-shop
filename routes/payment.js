const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

// Mock payment processing
router.post('/process', async (req, res) => {
    try {
        const { amount, cardNumber } = req.body;
        // TODO: Add proper payment processing
        res.json({ 
            success: true,
            transactionId: Date.now(),
            amount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// เติมเงินเข้าบัญชี
router.post('/topup', auth, async (req, res) => {
    try {
        const { amount, paymentMethod, paymentDetails } = req.body;

        // ตรวจสอบข้อมูล
        if (!amount || amount <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'จำนวนเงินไม่ถูกต้อง'
            });
        }

        // จำลองการตรวจสอบการชำระเงิน
        const paymentSuccess = await processPayment(amount, paymentMethod, paymentDetails);
        if (!paymentSuccess) {
            return res.status(400).json({
                success: false,
                message: 'การชำระเงินไม่สำเร็จ'
            });
        }

        // เพิ่มเงินเข้าบัญชีผู้ใช้
        const user = await User.findById(req.user.id);
        user.balance = (user.balance || 0) + amount;
        await user.save();

        // บันทึกประวัติการเติมเงิน
        const transaction = {
            userId: req.user.id,
            type: 'topup',
            amount: amount,
            method: paymentMethod,
            timestamp: new Date(),
            status: 'success'
        };

        res.json({
            success: true,
            message: 'เติมเงินสำเร็จ',
            balance: user.balance,
            transaction
        });
    } catch (error) {
        console.error('TopUp Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'เกิดข้อผิดพลาดในการเติมเงิน'
        });
    }
});

// หักเงินจากบัญชี
router.post('/deduct', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'จำนวนเงินไม่ถูกต้อง'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบบัญชีผู้ใช้'
            });
        }

        if ((user.balance || 0) < amount) {
            return res.status(400).json({
                success: false,
                message: 'ยอดเงินคงเหลือไม่เพียงพอ'
            });
        }

        user.balance -= amount;
        await user.save();

        res.json({
            success: true,
            message: 'หักเงินสำเร็จ',
            balance: user.balance
        });
    } catch (error) {
        console.error('Deduct Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการหักเงิน'
        });
    }
});

// คืนเงินเข้าบัญชี
router.post('/refund', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'จำนวนเงินไม่ถูกต้อง'
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบบัญชีผู้ใช้'
            });
        }

        user.balance = (user.balance || 0) + amount;
        await user.save();

        res.json({
            success: true,
            message: 'คืนเงินสำเร็จ',
            balance: user.balance
        });
    } catch (error) {
        console.error('Refund Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการคืนเงิน'
        });
    }
});

// ดูยอดเงินคงเหลือ
router.get('/balance', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบบัญชีผู้ใช้'
            });
        }

        res.json({
            success: true,
            balance: user.balance || 0
        });
    } catch (error) {
        console.error('Balance Error:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        });
    }
});

// ฟังก์ชันจำลองการตรวจสอบการชำระเงิน
async function processPayment(amount, method, details) {
    // TODO: เชื่อมต่อกับระบบชำระเงินจริง
    return true;
}

module.exports = router;
