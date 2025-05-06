import os
import json
from typing import Dict, List, Optional
from openai import OpenAI
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class CaptionAnalyzer:
    def __init__(self):
        """Initialize the CaptionAnalyzer with OpenAI API key."""
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.client = OpenAI(api_key=self.api_key)

    def load_captions(self, caption_file: str) -> Optional[str]:
        """Load captions from a text file."""
        try:
            with open(caption_file, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error loading captions: {e}")
            return None

    def analyze_captions(self, captions: str) -> Optional[str]:
        """Analyze captions using GPT-4.1-nano and generate insights."""
        try:
            # Prepare the prompt for analysis
            system_message = "You are a helpful assistant that analyzes video transcripts and extracts meaningful insights."
            user_message = f"""Please analyze the following video transcript and provide key insights:

Transcript:
{captions}

Please provide:
1. Main topics discussed
2. Key insights and takeaways
3. Important quotes or statements
4. Overall sentiment and tone
5. Any notable patterns or recurring themes

Format the response in a clear, structured way."""

            # Make API call using the new Responses API
            response = self.client.responses.create(
                model="gpt-4.1-nano",
                input=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_output_tokens=1000
            )

            return response.output_text

        except Exception as e:
            logger.error(f"Error analyzing captions: {e}")
            return None

    def save_analysis(self, analysis: str, output_dir: str, video_id: str):
        """Save the analysis to a text file."""
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, f"{video_id}_analysis.txt")
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(analysis)
            logger.info(f"Analysis saved to {output_path}")
        except Exception as e:
            logger.error(f"Error saving analysis: {e}")

def main():
    # Example usage
    analyzer = CaptionAnalyzer()
    
    caption_file = "captions/BJjsfNO5JTo_en.txt"
    
    # Load captions
    captions = analyzer.load_captions(caption_file)
    if not captions:
        logger.error("Failed to load captions")
        return
    
    # Analyze captions
    analysis = analyzer.analyze_captions(captions)
    if not analysis:
        logger.error("Failed to analyze captions")
        return
    
    # Save analysis
    video_id = os.path.basename(caption_file).split('_')[0]
    analyzer.save_analysis(analysis, 'analysis', video_id)

if __name__ == "__main__":
    main() 