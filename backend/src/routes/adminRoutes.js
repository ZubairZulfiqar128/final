import { Router } from 'express'
import { seedDatabase } from '../controllers/adminController.js'
import adminSecret from '../middleware/adminSecret.js'

const router = Router()

router.post('/seed', adminSecret, seedDatabase)

export default router
