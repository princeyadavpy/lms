const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
    createInstitution,
    getInstitutions,
    getInstitutionById,
    updateInstitution,
    deleteInstitution
} = require('../controllers/institutionController');

router.use(protect);

router.route('/')
    .get(getInstitutions)
    .post(authorize('Admin', 'SuperAdmin'), createInstitution);

router.route('/:id')
    .get(getInstitutionById)
    .patch(authorize('Admin', 'SuperAdmin', 'InstitutionAdmin'), updateInstitution)
    .delete(authorize('Admin', 'SuperAdmin'), deleteInstitution);

module.exports = router;

