import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

console.log("Starting server...")
dotenv.config({ path: './..env' })

console.log("Loaded .env:", process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const app = express()
app.use(cors())

app.use(express.json())

// Multer setup for file uploads
const upload = multer({storage: multer.memoryStorage()})

// Supabase client setup
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_KEY
)

// Test route
app.get('/', (req, res) => {
  res.send('Express server is running')
})

// Upload route for uploading profile pictures
app.post('/upload-profile-picture', upload.single('file'), async (req, res) => {
    try {
        const file = req.file
        const userId = req.body.userId

        // Error if file doesn't exist
        if(!file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        // Error if user id isn't available
        if(!userId) {
            return res.status(400).json({ error: 'User ID is required' })
        }

        const ext = file.originalname.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${ext}`;


        // Upload image to Supabase Storage, under the name
        // userId/imagename
        const { data, error } = await supabase.storage
            .from('profile-pictures')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            })
        
        // Throw an error if the upload fails
        if (error) {
            console.error('Supabase upload error:', error)
            return res.status(500).json({ error: 'Failed to upload file to Supabase' })
        }

        // Get public URL of the uploaded image
        const {data: publicUrl} = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(fileName)
        
        // Update the profile row with the url
        const { data: updateData, error: updateError } = await supabase
            .from('profiles')
            .update({ profile_picture_url: publicUrl.publicUrl })
            .eq('user_id', userId)
            .select();

        // ⭐ SEND RESPONSE HERE — BEFORE ANY LOGGING THAT COULD CRASH ⭐
        res.json({
            url: publicUrl.publicUrl,
            updated: updateData
        });

        // Safe logging AFTER response
        console.log("UPDATE DATA:", updateData);

    } catch (error) {
        console.error('Error uploading file:', error)
        res.status(500).json({ error: 'Failed to upload file' })
    }
})

app.listen(3000, () => console.log('Server running on port 3000'))
