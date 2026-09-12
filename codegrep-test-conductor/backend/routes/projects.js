const express = require('express');
const { createProject, getProjects, getProjectById, updateProject } = require('../controllers/projectController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject);

router.route('/:id')
    .get(protect, getProjectById)
    .put(protect, updateProject);

module.exports = router;
