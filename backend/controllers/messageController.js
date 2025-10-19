const Message = require('../models/Message');
const User = require('../models/User');
const Donation = require('../models/Donation');

// @desc    Get user conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all donations where user is involved (as donor or receiver)
    const donations = await Donation.find({
      $or: [
        { donor: userId },
        { claimedBy: userId }
      ],
      status: { $in: ['claimed', 'completed'] }
    })
      .populate('donor', 'name email avatar')
      .populate('claimedBy', 'name email avatar')
      .sort({ updatedAt: -1 });

    // Build conversations with last message info
    const conversations = await Promise.all(
      donations.map(async (donation) => {
        // Determine the other user in the conversation
        const otherUser = donation.donor._id.toString() === userId.toString()
          ? donation.claimedBy
          : donation.donor;

        if (!otherUser) return null;

        // Get last message for this donation
        const lastMessage = await Message.findOne({
          donationId: donation._id
        })
          .sort({ createdAt: -1 })
          .select('message createdAt senderId');

        // Get unread count for this conversation
        const unreadCount = await Message.countDocuments({
          donationId: donation._id,
          recipientId: userId,
          isRead: false
        });

        return {
          donationId: donation._id,
          donationTitle: donation.title,
          donationStatus: donation.status,
          recipientId: otherUser._id,
          recipientName: otherUser.name,
          recipientEmail: otherUser.email,
          recipientAvatar: otherUser.avatar,
          lastMessage: lastMessage ? lastMessage.message : null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : donation.updatedAt,
          lastMessageSenderId: lastMessage ? lastMessage.senderId : null,
          unreadCount
        };
      })
    );

    // Filter out null values and sort by last message time
    const validConversations = conversations
      .filter(conv => conv !== null)
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.json({
      success: true,
      data: validConversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get messages for a donation
// @route   GET /api/messages/:donationId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { donationId } = req.params;
    const userId = req.user._id;

    // Verify user has access to this conversation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (
      donation.donor.toString() !== userId.toString() &&
      donation.claimedBy?.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this conversation'
      });
    }

    // Get messages
    const messages = await Message.find({
      donationId,
      isDeleted: false
    })
      .populate('senderId', 'name avatar')
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get total unread message count
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      recipientId: userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { count: unreadCount }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark all messages in a conversation as read
// @route   PUT /api/messages/:donationId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { donationId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        donationId,
        recipientId: userId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    // Get updated unread count
    const unreadCount = await Message.countDocuments({
      recipientId: userId,
      isRead: false
    });

    res.json({
      success: true,
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
