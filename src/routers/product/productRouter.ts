import express from 'express';
import multer from 'multer';
import handleCreateProduct from '../../controllers/product/create/createProduct';
import handleGetProduct from '../../controllers/product/read/getProduct';
import handleUpdateProduct from '../../controllers/product/update/updateProduct';
import handleDeleteProduct from '../../controllers/product/delete/deleteProduct';
import authenticateToken from '../../controllers/auth/middleware/authenticateToken';
import { storage } from '../../cloudinary/cloudinary';
import handleGetManyProducts from '../../controllers/product/read/getManyProducts';
import handleSearchProduct from '../../controllers/product/read/searchProduct';

const router = express.Router();

const upload = multer({ storage });

router.post(
	'/',
	authenticateToken,
	upload.single('image'),
	handleCreateProduct
);
router.put(
	'/:id',
	authenticateToken,
	upload.single('image'),
	handleUpdateProduct
);

router.get('/search', handleSearchProduct);
router.get('/:identifier', handleGetProduct);
router.get('/', handleGetManyProducts);

router.delete('/:id', authenticateToken, handleDeleteProduct);

export default router;
