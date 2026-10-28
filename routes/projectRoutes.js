const router = require('express').Router();
const c = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').post(c.create).get(c.getAll);
router.route('/:id').get(c.getOne).put(c.update).delete(authorize('admin'), c.remove);
module.exports = router;