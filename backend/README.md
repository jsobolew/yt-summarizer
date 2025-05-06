# YouTube Caption Scraper

A Python tool for scraping captions from YouTube videos. This tool is designed to be used as a foundation for building knowledge graphs and reasoning systems for deep research.

## Features

- Extract captions from YouTube videos
- Support for multiple languages
- Saves captions in both JSON and text formats
- Error handling and logging
- Easy to use command-line interface

## Installation

1. Clone this repository
2. Install the required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Run the script:
```bash
python youtube_caption_scraper.py
```

The script will:
1. Prompt you to enter a YouTube video URL
2. Extract the video ID
3. Show available caption languages
4. Download captions in English (or first available language)
5. Save the captions in both JSON and text formats in the `captions` directory

## Output Format

The script creates two files for each video:
- `{video_id}_{language}.json`: Contains the full caption data including timestamps
- `{video_id}_{language}.txt`: Contains just the text of the captions

## Error Handling

The script includes comprehensive error handling for:
- Invalid YouTube URLs
- Missing captions
- Network issues
- Language availability

## Future Development

This tool is designed to be extended for:
- Building knowledge graphs
- Implementing reasoning systems
- Deep research analysis
- Multi-video processing
- Advanced caption analysis 