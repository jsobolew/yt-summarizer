from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict
from youtube_analyzer import YouTubeAnalyzer
import logging
from pytube import YouTube

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="YouTube Video Analyzer API",
    description="API for extracting and analyzing YouTube video captions",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the analyzer
analyzer = YouTubeAnalyzer()

class VideoURL(BaseModel):
    url: HttpUrl

class AnalysisResponse(BaseModel):
    video_id: str
    language: str
    captions: Dict
    analysis: str
    available_languages: List[str]

@app.post("/analyze")
async def analyze_video(video: VideoURL):
    """
    Analyze a YouTube video by its URL.
    Returns captions and analysis in the specified language.
    """
    try:
        # Get video ID
        video_id = analyzer.get_video_id(str(video.url))
        if not video_id:
            raise HTTPException(status_code=400, detail="Invalid YouTube URL")

        # Get available languages
        languages = analyzer.get_available_languages(video_id)
        if not languages:
            raise HTTPException(status_code=404, detail="No captions available for this video")

        # Get captions in English (or first available language)
        language = 'en' if 'en' in languages else languages[0]
        captions = analyzer.get_captions(video_id, language)
        if not captions:
            raise HTTPException(status_code=500, detail="Failed to get captions")

        # Analyze captions
        analysis = analyzer.analyze_captions(captions['text'])
        if not analysis:
            raise HTTPException(status_code=500, detail="Failed to analyze captions")

        # Minimal videoInfo object (no pytube)
        video_info = {
            "id": video_id,
            "title": "",
            "description": "",
            "channelTitle": "",
            "publishedAt": "",
            "thumbnailUrl": "",
            "duration": 0,
            "viewCount": 0,
            "likeCount": 0
        }

        # Convert captions to transcript format
        transcript = []
        for seg in captions['segments']:
            transcript.append({
                "start": seg["start"],
                "end": seg["start"] + seg["duration"],
                "text": seg["text"]
            })

        # Parse analysis string into insights (for now, only summary)
        insights = {
            "summary": analysis,
            "topics": [],
            "sentiment": {"positive": 0, "negative": 0, "neutral": 0, "emotions": []},
            "keyPoints": []
        }

        return {
            "videoInfo": video_info,
            "transcript": transcript,
            "insights": insights,
            "availableLanguages": languages,
            "selectedLanguage": language
        }
    except Exception as e:
        logger.error(f"Error processing video: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/languages/{video_id}")
async def get_available_languages(video_id: str):
    """
    Get available caption languages for a YouTube video.
    """
    try:
        languages = analyzer.get_available_languages(video_id)
        if not languages:
            raise HTTPException(status_code=404, detail="No captions available for this video")
        return {"languages": languages}
    except Exception as e:
        logger.error(f"Error getting languages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/captions/{video_id}")
async def get_captions(video_id: str, language: str = 'en'):
    """
    Get captions for a YouTube video in the specified language.
    """
    try:
        captions = analyzer.get_captions(video_id, language)
        if not captions:
            raise HTTPException(status_code=404, detail="Captions not found")
        return captions
    except Exception as e:
        logger.error(f"Error getting captions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 