const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.post('/download', async (req, res) => {
    const { url } = req.body;
    const apiKey = req.headers['x-rapidapi-key'];

    function isValidTikTokUrl(url) {
        const tiktokUrlPattern = /^(https?:\/\/)?(?:www\.)?tiktok\.com\/(?:v|@)?([\w-]+)/i;
        return tiktokUrlPattern.test(url);
    }

    if (!isValidTikTokUrl(url)) {
        return res.status(400).json({ error: 'Invalid TikTok video URL' });
    }

    try {
        const response = await axios({
            method: 'GET',
            url: 'https://tiktok-video-no-watermark2.p.rapidapi.com/',
            params: { url },
            headers: {
                'X-RapidAPI-Key': "171d319d15msha4bbbddf76401cdp1e3bc1jsn18202c89e037",
                'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            }
        });

        const videoUrl = response.data.data.play;

        if (!videoUrl) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.json({ success: true, downloadUrl: videoUrl });
    } catch (error) {
        console.error('Error downloading video:', error);
        res.status(500).json({ error: 'Failed to download video. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
