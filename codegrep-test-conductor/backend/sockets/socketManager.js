module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Join a test room for live monitoring
        socket.on('join_test_room', (testId) => {
            socket.join(`test_${testId}`);
            console.log(`Socket ${socket.id} joined room test_${testId}`);
        });

        // Student updates status (e.g. heartbeat, current question)
        socket.on('student_activity', (data) => {
            const { testId, studentId, status } = data;
            // Broadcast to teachers in the room
            io.to(`test_${testId}`).emit('update_student_status', { studentId, status, timestamp: Date.now() });
        });

        // Real-time collaborative coding on a CodeProject
        socket.on('join_project_room', (projectId) => {
            socket.join(`project_${projectId}`);
        });

        socket.on('code_insert', (data) => {
            const { projectId, diff } = data;
            socket.to(`project_${projectId}`).emit('code_change', diff);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
