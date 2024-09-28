import { Router } from "express";
import { addToFavorites, getFavourites } from "../../controllers/favouriteController";

const router = Router();

router.route("/:userId")
.get(getFavourites)
// .put(updateFavourites);

router.post('/add-to-favourites', addToFavorites);

export default router;