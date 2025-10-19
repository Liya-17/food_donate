const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('role').optional().isIn(['donor', 'receiver', 'admin']).withMessage('Invalid role')
];

// Login validation
exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Donation creation validation
exports.createDonationValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('foodType').isIn(['vegetarian', 'non-vegetarian', 'vegan', 'mixed'])
    .withMessage('Invalid food type'),
  body('quantity').notEmpty().withMessage('Quantity is required'),
  body('servings').isInt({ min: 1 }).withMessage('Servings must be at least 1'),
  body('category').isIn(['cooked-food', 'raw-food', 'packaged-food', 'fruits-vegetables', 'bakery', 'other'])
    .withMessage('Invalid category'),
  body('expiryTime').isISO8601().withMessage('Invalid expiry time'),
  body('availableTo').isISO8601().withMessage('Invalid available to time')
];

// Donation update validation
exports.updateDonationValidation = [
  body('title').optional().trim().isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description').optional().trim().isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('foodType').optional().isIn(['vegetarian', 'non-vegetarian', 'vegan', 'mixed'])
    .withMessage('Invalid food type'),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be at least 1'),
  body('category').optional().isIn(['cooked-food', 'raw-food', 'packaged-food', 'fruits-vegetables', 'bakery', 'other'])
    .withMessage('Invalid category')
];

// Request creation validation
exports.createRequestValidation = [
  body('pickupTime').isISO8601().withMessage('Invalid pickup time'),
  body('numberOfServingsNeeded').isInt({ min: 1 })
    .withMessage('Number of servings must be at least 1'),
  body('purpose').isIn(['personal', 'ngo', 'community-kitchen', 'elderly-care', 'orphanage', 'other'])
    .withMessage('Invalid purpose'),
  body('message').optional().isLength({ max: 300 })
    .withMessage('Message cannot exceed 300 characters')
];

// ID parameter validation
exports.idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

// Pagination validation
exports.paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

// Location validation
exports.locationValidation = [
  query('latitude').optional({ checkFalsy: true }).isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  query('longitude').optional({ checkFalsy: true }).isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  query('distance').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('Distance must be positive')
];
