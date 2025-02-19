const express = require('express');
const router = express.Router();

// Mock claims data
let claims = [
    {
        id: 'CLM001',
        type: 'banned',
        reason: 'บัญชีถูกแบนโดยไม่ทราบสาเหตุ',
        status: 'approved',
        createdAt: '2024-02-18T10:00:00',
        updatedAt: '2024-02-19T15:30:00',
        newAccountId: 'NEW123',
        evidence: 'evidence1.jpg',
        product: 'Premium Account',
        amount: 1500
    },
    {
        id: 'CLM002',
        type: 'not_received',
        reason: 'ไม่ได้รับสินค้าหลังชำระเงิน',
        status: 'rejected',
        createdAt: '2024-02-17T14:20:00',
        updatedAt: '2024-02-18T09:15:00',
        rejectReason: 'ไม่พบหลักฐานการชำระเงิน',
        product: 'Standard Account',
        amount: 800
    }
];

// Get all claims
router.get('/claims', (req, res) => {
    res.json(claims);
});

// Get claim by id
router.get('/claims/:id', (req, res) => {
    const claim = claims.find(c => c.id === req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    res.json(claim);
});

// Update claim status
router.put('/claims/:id', (req, res) => {
    const { status, reason } = req.body;
    const claim = claims.find(c => c.id === req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    
    claim.status = status;
    claim.updatedAt = new Date().toISOString();
    if (status === 'rejected') {
        claim.rejectReason = reason;
    }
    
    res.json(claim);
});

// Create new claim
router.post('/claims', (req, res) => {
    const claim = {
        id: `CLM${String(claims.length + 1).padStart(3, '0')}`,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    claims.push(claim);
    res.status(201).json(claim);
});

module.exports = router;
