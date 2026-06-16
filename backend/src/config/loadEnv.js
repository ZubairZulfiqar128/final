import dotenv from 'dotenv'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Always load backend/.env regardless of where node is started from */
dotenv.config({ path: join(__dirname, '..', '..', '.env') })
