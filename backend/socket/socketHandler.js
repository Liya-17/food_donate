const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store connected users
const connectedUsers = new Map();

// Store chat messages (in production, use MongoDB)
const chatMessages = new Map();

const initializeSocket = (io) => {
  // Socket.io middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);

    // Store user connection
    connectedUsers.set(socket.user._id.toString(), socket.id);

    // Join user's personal room
    socket.join(socket.user._id.toString());

    // Send connection confirmation
    socket.emit('connected', {
      message: 'Connected to socket server',
      userId: socket.user._id
    });

    // Handle user going online
    socket.broadcast.emit('user_online', {
      userId: socket.user._id,
      name: socket.user.name
    });

    // Handle typing indicator (for chat feature if needed)
    socket.on('typing', (data) => {
      socket.to(data.recipientId).emit('user_typing', {
        userId: socket.user._id,
        name: socket.user.name
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.recipientId).emit('user_stop_typing', {
        userId: socket.user._id
      });
    });

    // Handle real-time location updates
    socket.on('update_location', (data) => {
      socket.broadcast.emit('user_location_updated', {
        userId: socket.user._id,
        location: data.location
      });
    });

    // Handle marking notifications as read
    socket.on('mark_notification_read', (notificationId) => {
      // This would typically update the database
      socket.emit('notification_read_confirmed', { notificationId });
    });

    // Handle donation interest
    socket.on('express_interest', (data) => {
      // Emit to the donor
      io.to(data.donorId).emit('interest_received', {
        donationId: data.donationId,
        interestedUser: {
          id: socket.user._id,
          name: socket.user.name,
          organizationType: socket.user.organizationType
        }
      });
    });

    // Handle joining a chat room
    socket.on('join_chat', (data) => {
      const roomId = data.donationId;
      socket.join(roomId);
      console.log(`User ${socket.user.name} joined chat room: ${roomId}`);
    });

    // Handle leaving a chat room
    socket.on('leave_chat', (data) => {
      const roomId = data.donationId;
      socket.leave(roomId);
      console.log(`User ${socket.user.name} left chat room: ${roomId}`);
    });

    // Handle chat messages
    socket.on('send_message', (data) => {
      const messageData = {
        donationId: data.donationId,
        senderId: socket.user._id,
        senderName: socket.user.name,
        message: data.message,
        timestamp: data.timestamp || new Date(),
      };

      // Store message in memory
      const roomId = data.donationId;
      if (!chatMessages.has(roomId)) {
        chatMessages.set(roomId, []);
      }
      chatMessages.get(roomId).push(messageData);

      // Emit message to all users in the room
      io.to(roomId).emit('new_message', messageData);
    });

    // Get message history
    socket.on('get_messages', (data) => {
      const roomId = data.donationId;
      const messages = chatMessages.get(roomId) || [];
      socket.emit('message_history', {
        donationId: roomId,
        messages,
      });
    });

    // Handle donation status updates
    socket.on('donation_status_changed', (data) => {
      socket.broadcast.emit('donation_updated', {
        donationId: data.donationId,
        status: data.status,
        updatedBy: socket.user._id
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.user._id})`);
      connectedUsers.delete(socket.user._id.toString());

      socket.broadcast.emit('user_offline', {
        userId: socket.user._id,
        name: socket.user.name
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

// Helper function to emit to specific user
const emitToUser = (io, userId, event, data) => {
  io.to(userId.toString()).emit(event, data);
};

// Helper function to check if user is online
const isUserOnline = (userId) => {
  return connectedUsers.has(userId.toString());
};

// Helper function to get all online users
const getOnlineUsers = () => {
  return Array.from(connectedUsers.keys());
};

module.exports = {
  initializeSocket,
  emitToUser,
  isUserOnline,
  getOnlineUsers
};
