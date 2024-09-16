import { Router } from 'express';
import { deleteUser, getAllUsers, getUserByEmail, getUserById, postUser, updateUserRole } from '../../controllers/usersController';
const router = Router();

router.get('/all-users', getAllUsers);
router.get('/login', getUserByEmail);
router.get('/:id', getUserById);

router.post('/register', postUser);


router.patch("/update-role/:id", updateUserRole);

router.delete('/delete/:id', deleteUser);
export default router;
