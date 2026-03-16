import express from 'express';
import handleCreateUser from '../../controllers/user/create/createUser';
import handleGetUsers from '../../controllers/user/read/getUsers';
import handleUpdateUser from '../../controllers/user/update/updateUser';
import handleDeleteUser from '../../controllers/user/delete/deleteUser';
import authenticateToken from '../../controllers/auth/middleware/authenticateToken';
const router = express.Router();

router.post('/', authenticateToken, handleCreateUser);
router.get('/', authenticateToken, handleGetUsers);
router.put('/:id', authenticateToken, handleUpdateUser);
router.delete('/:id', authenticateToken, handleDeleteUser);

export default router;
