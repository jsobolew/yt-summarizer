from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from pytube import YouTube
from openai import OpenAI
import json
import os
from typing import Optional, Dict, List
import logging
from dotenv import load_dotenv
from pydantic import BaseModel

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class SentimentModel(BaseModel):
    positive: int
    negative: int
    neutral: int
    emotions: List[str]
    class Config:
        extra = "forbid"

class InsightsModel(BaseModel):
    summary: str
    topics: List[str]
    sentiment: SentimentModel
    key_points: List[str]
    quotes: List[str]
    class Config:
        extra = "forbid"

class YouTubeAnalyzer:
    def __init__(self):
        """Initialize the YouTubeAnalyzer with OpenAI API key."""
        self.formatter = TextFormatter()
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.client = OpenAI(api_key=self.api_key)

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

    def analyze_captions(self, captions: str) -> Optional[InsightsModel]:
        """Analyze captions using GPT-4o and generate structured insights."""
        try:
            system_message = "You are a helpful assistant that analyzes video transcripts and extracts structured insights."
            user_message = (
                "Analyze the following video transcript and extract:\n"
                "1. summary (str): A concise summary of the video.\n"
                "2. topics (list of main topics discussed)\n"
                "3. sentiment (object): {positive (int), negative (int), neutral (int), emotions (list of str)}\n"
                "4. key_points (list of key insights and takeaways)\n"
                "5. quotes (list of important quotes or statements)\n"
                "Respond in the format of the provided Pydantic model.\n"
                f"\nTranscript:\n{captions}"
            )

            response = self.client.responses.parse(
                model="gpt-4o-2024-08-06",
                input=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                text_format=InsightsModel,
            )
            return response.output_parsed
        except Exception as e:
            logger.error(f"Error analyzing captions: {e}")
            return None

    def save_results(self, captions: Dict, analysis: str, output_dir: str, video_id: str, language: str):
        """Save captions and analysis to files."""
        os.makedirs(output_dir, exist_ok=True)
        
        # Save captions as JSON
        json_path = os.path.join(output_dir, f"{video_id}_{language}.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(captions, f, ensure_ascii=False, indent=2)
        
        # Save captions as text
        text_path = os.path.join(output_dir, f"{video_id}_{language}.txt")
        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(captions['text'])
        
        # Save analysis
        analysis_path = os.path.join(output_dir, f"{video_id}_analysis.txt")
        with open(analysis_path, 'w', encoding='utf-8') as f:
            f.write(analysis)
        
        logger.info(f"Results saved to {output_dir}")

def main():
    analyzer = YouTubeAnalyzer()
    
    # Get YouTube URL from user
    video_url = input("Enter YouTube video URL: ")
    video_id = analyzer.get_video_id(video_url)
    
    if not video_id:
        logger.error("Invalid YouTube URL")
        return
    
    # Get available languages
    languages = analyzer.get_available_languages(video_id)
    logger.info(f"Available languages: {languages}")
    
    # Get captions in English (or first available language)
    language = 'en' if 'en' in languages else languages[0] if languages else 'en'
    captions = analyzer.get_captions(video_id, language)
    
    if not captions:
        logger.error("Failed to get captions")
        return
    
    # Analyze captions
    analysis = analyzer.analyze_captions(captions['text'])
    if not analysis:
        logger.error("Failed to analyze captions")
        return
    
    # Save results
    analyzer.save_results(captions, analysis, 'analysis', video_id, language)
    logger.info("Analysis complete!")

if __name__ == "__main__":
    main() 