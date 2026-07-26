# VIDHWAAN News Engine

## Overview

VIDHWAAN News Engine is a fully automated AI-powered news pipeline that collects news from trusted RSS feeds, extracts article content, generates original Telugu news using Groq AI, validates the output, and publishes production-ready JSON files for the VIDHWAAN News PWA.

## Features

- Automatic RSS collection
- Full article extraction
- Duplicate removal
- AI-generated original Telugu news
- JSON validation
- Static JSON publishing
- Fully automated GitHub Actions
- No database required

## Repository Structure

vidhwaan-news-engine/

├── .github/
│   └── workflows/
│       └── news.yml
│
├── config/
│   ├── settings.json
│   ├── prompts.json
│   └── sources.json
│
├── engine/
│   ├── index.js
│   ├── collector/
│   ├── ai/
│   ├── publisher/
│   ├── validator/
│   └── utils/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── output/
│
├── dist/
│   ├── latest.json
│   ├── national.json
│   ├── international.json
│   └── andhra-pradesh.json
│
├── package.json
├── .gitignore
├── .env.example
└── README.md

## Output

The engine generates:

- dist/latest.json
- dist/national.json
- dist/international.json
- dist/andhra-pradesh.json

These files are consumed directly by the VIDHWAAN News frontend.

## License

Copyright © VIDHWAAN.
All rights reserved.
