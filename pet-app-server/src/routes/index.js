const express = require('express');
const router = express.Router();
const { auth, optionalAuth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const authCtrl = require('../controllers/authController');
const petCtrl = require('../controllers/petController');
const serviceCtrl = require('../controllers/serviceController');
const productCtrl = require('../controllers/productController');
const orderCtrl = require('../controllers/orderController');
const reviewCtrl = require('../controllers/reviewController');
const messageCtrl = require('../controllers/messageController');
const favCtrl = require('../controllers/favoriteController');
const categoryCtrl = require('../controllers/categoryController');
const searchCtrl = require('../controllers/searchController');
const uploadCtrl = require('../controllers/uploadController');

// ==================== Auth ====================
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/profile', auth, authCtrl.getProfile);
router.put('/auth/profile', auth, authCtrl.updateProfile);
router.put('/auth/password', auth, authCtrl.changePassword);
router.post('/auth/sign-in', auth, authCtrl.signIn);
router.post('/auth/apply-merchant', auth, authCtrl.applyMerchant);

// ==================== Categories ====================
router.get('/categories', categoryCtrl.list);
router.post('/categories', auth, authorize('admin'), categoryCtrl.create);
router.put('/categories/:id', auth, authorize('admin'), categoryCtrl.update);
router.delete('/categories/:id', auth, authorize('admin'), categoryCtrl.delete);

// ==================== Pets ====================
router.get('/pets', optionalAuth, petCtrl.list);
router.get('/pets/mine', auth, petCtrl.getMyPets);
router.get('/pets/:id', optionalAuth, petCtrl.getById);
router.post('/pets', auth, petCtrl.create);
router.put('/pets/:id', auth, petCtrl.update);
router.delete('/pets/:id', auth, petCtrl.delete);

// ==================== Services ====================
router.get('/services', optionalAuth, serviceCtrl.list);
router.get('/services/:id', optionalAuth, serviceCtrl.getById);
router.post('/services', auth, serviceCtrl.create);
router.put('/services/:id', auth, serviceCtrl.update);
router.delete('/services/:id', auth, serviceCtrl.delete);

// ==================== Products ====================
router.get('/products', optionalAuth, productCtrl.list);
router.get('/products/:id', optionalAuth, productCtrl.getById);
router.post('/products', auth, productCtrl.create);
router.put('/products/:id', auth, productCtrl.update);
router.delete('/products/:id', auth, productCtrl.delete);

// ==================== Orders ====================
router.get('/orders', auth, orderCtrl.list);
router.get('/orders/:id', auth, orderCtrl.getById);
router.post('/orders', auth, orderCtrl.create);
router.post('/orders/:id/pay', auth, orderCtrl.pay);
router.post('/orders/:id/accept', auth, orderCtrl.accept);
router.post('/orders/:id/serve', auth, orderCtrl.startServing);
router.post('/orders/:id/complete', auth, orderCtrl.complete);
router.post('/orders/:id/cancel', auth, orderCtrl.cancel);
router.post('/orders/:id/refund', auth, orderCtrl.refund);

// ==================== Reviews ====================
router.get('/reviews/:target_type/:target_id', reviewCtrl.listByTarget);
router.post('/reviews', auth, reviewCtrl.create);
router.post('/reviews/:id/reply', auth, reviewCtrl.reply);

// ==================== Messages ====================
router.get('/messages/conversations', auth, messageCtrl.listConversations);
router.get('/messages/conversations/:conversation_id', auth, messageCtrl.getMessages);
router.post('/messages/send', auth, messageCtrl.sendMessage);
router.get('/messages/unread', auth, messageCtrl.unreadCount);

// ==================== Notifications ====================
router.get('/notifications', auth, messageCtrl.listNotifications);
router.put('/notifications/:id/read', auth, messageCtrl.readNotification);

// ==================== Favorites ====================
router.post('/favorites/toggle', auth, favCtrl.toggle);
router.get('/favorites', auth, favCtrl.listFavorites);

// ==================== Browse History ====================
router.post('/history', auth, favCtrl.addHistory);
router.get('/history', auth, favCtrl.listHistory);
router.delete('/history', auth, favCtrl.clearHistory);

// ==================== Cart ====================
router.get('/cart', auth, favCtrl.getCart);
router.post('/cart', auth, favCtrl.addToCart);
router.put('/cart/:id', auth, favCtrl.updateCartItem);
router.delete('/cart/:id', auth, favCtrl.removeCartItem);

// ==================== Addresses ====================
router.get('/addresses', auth, favCtrl.listAddresses);
router.post('/addresses', auth, favCtrl.createAddress);
router.put('/addresses/:id', auth, favCtrl.updateAddress);
router.delete('/addresses/:id', auth, favCtrl.deleteAddress);

// ==================== Search ====================
router.get('/search', optionalAuth, searchCtrl.search);
router.get('/search/hot', searchCtrl.hotSearches);

// ==================== Upload ====================
router.post('/upload/:type', auth, upload.array('files', 9), uploadCtrl.uploadImages);
router.post('/upload/avatar', auth, upload.single('file'), uploadCtrl.uploadAvatar);

module.exports = router;
