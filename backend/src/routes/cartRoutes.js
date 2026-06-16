import { Router } from 'express'
import {
  addItem,
  clearUserCart,
  getCart,
  mergeCart,
  removeItem,
  updateItem,
} from '../controllers/cartController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', getCart)
router.post('/items', addItem)
router.patch('/items/:productId', updateItem)
router.delete('/items/:productId', removeItem)
router.post('/merge', mergeCart)
router.delete('/', clearUserCart)

export default router
