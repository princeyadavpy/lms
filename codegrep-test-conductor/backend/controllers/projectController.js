const CodeProject = require('../models/CodeProject');

exports.createProject = async (req, res) => {
    try {
        const { title, files } = req.body;
        const project = await CodeProject.create({
            title,
            files: files || [{ filename: 'main.js', language: 'javascript', content: '' }],
            studentId: req.user.id
        });
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await CodeProject.find({ studentId: req.user.id });
        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await CodeProject.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, msg: 'Project not found' });

        if (project.studentId.toString() !== req.user.id && !project.isShared) {
            return res.status(403).json({ success: false, msg: 'Not authorized' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        let project = await CodeProject.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, msg: 'Project not found' });

        if (project.studentId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, msg: 'Not authorized' });
        }

        project = await CodeProject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
