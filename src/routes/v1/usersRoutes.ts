import { Router } from 'express';
import { getUserByEmail, postUser } from '../../controllers/usersController';
const router = Router();

// router.get('/all-users', getAllUsers);
router.get('/login', getUserByEmail);
router.post('/register', postUser);

export default router;
