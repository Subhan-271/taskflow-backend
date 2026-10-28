const router = require('express').Router();
const c = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').post(c.create).get(c.getAll);   // GET /api/tasks?project=<id>
router.route('/:id').get(c.getOne).put(c.update).delete(authorize('admin'), c.remove);
module.exports = router;