from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from pytube import YouTube
import json
import os
from typing import Optional, Dict, List
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class YouTubeCaptionScraper:
    def __init__(self):
        self.formatter = TextFormatter()

    def get_video_id(self, url: str) -> Optional[str]:
        """Extract video ID from YouTube URL."""
        try:
            yt = YouTube(url)
            return yt.video_id
        except Exception as e:
            logger.error(f"Error extracting video ID: {e}")
            return None

    def get_available_languages(self, video_id: str) -> List[str]:
        """Get available caption languages for a video."""
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            return [transcript.language_code for transcript in transcript_list]
        except Exception as e:
            logger.error(f"Error getting available languages: {e}")
            return []

    def get_captions(self, video_id: str, language: str = 'en') -> Optional[Dict]:
        """Get captions for a video in the specified language."""
        try:
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
            
            # Format the transcript into plain text
            formatted_text = ""
            for entry in transcript:
                formatted_text += entry['text'] + " "
            
            return {
                'text': formatted_text.strip(),
                'segments': transcript,
                'language': language
            }
        except Exception as e:
            logger.error(f"Error getting captions: {e}")
            return None

    def save_captions(self, captions: Dict, output_dir: str, video_id: str, language: str):
        """Save captions to JSON and text files."""
        os.makedirs(output_dir, exist_ok=True)
        
        # Save as JSON
        json_path = os.path.join(output_dir, f"{video_id}_{language}.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(captions, f, ensure_ascii=False, indent=2)
        
        # Save as text
        text_path = os.path.join(output_dir, f"{video_id}_{language}.txt")
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(captions['text'])
        
        logger.info(f"Captions saved to {json_path} and {text_path}")

def main():
    scraper = YouTubeCaptionScraper()
    
    # Example usage
    video_url = input("Enter YouTube video URL: ")
    video_id = scraper.get_video_id(video_url)
    
    if not video_id:
        logger.error("Invalid YouTube URL")
        return
    
    # Get available languages
    languages = scraper.get_available_languages(video_id)
    logger.info(f"Available languages: {languages}")
    
    # Get captions in English (or first available language)
    language = 'en' if 'en' in languages else languages[0] if languages else 'en'
    captions = scraper.get_captions(video_id, language)
    
    if captions:
        # Save captions to 'captions' directory
        scraper.save_captions(captions, 'captions', video_id, language)
    else:
        logger.error("Failed to get captions")

if __name__ == "__main__":
    main() 