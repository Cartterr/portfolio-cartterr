import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
dotenv.config({ path: path.join(__dirname, '../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const port = Number(process.env.PORT || 5000)
const app = createApp()

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
