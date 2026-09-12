const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
    createOrg, getOrgs, getMyOrg, updateOrg, assignUserToOrg, getOrgStats
} = require('../controllers/organizationController');

router.get('/me', protect, getMyOrg);
router.get('/', protect, authorize('Admin'), getOrgs);
router.post('/', protect, authorize('Admin'), createOrg);
router.patch('/:id', protect, authorize('Admin'), updateOrg);
router.patch('/:id/assign-user', protect, authorize('Admin'), assignUserToOrg);
router.get('/:id/stats', protect, authorize('Admin'), getOrgStats);

module.exports = router;
