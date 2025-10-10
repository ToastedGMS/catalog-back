import express from 'express';
import handleCreateCategory from '../../controllers/category/create/createCategory';
import handleGetCategory from '../../controllers/category/read/getCategory';
import handleGetCategories from '../../controllers/category/read/getManyCategories';
import handleUpdateCategory from '../../controllers/category/update/updateCategory';
import handleDeleteCategory from '../../controllers/category/delete/deleteCategory';
import authenticateToken from '../../controllers/auth/middleware/authenticateToken';
const router = express.Router();

router.post('/', authenticateToken, handleCreateCategory);
router.get('/:id', handleGetCategory);
router.get('/', handleGetCategories);
router.put('/:id', authenticateToken, handleUpdateCategory);
router.delete('/:id', authenticateToken, handleDeleteCategory);

export default router;
