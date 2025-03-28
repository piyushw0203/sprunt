# Sprunt - AI-Powered Agile Automation Platform

Sprunt is an innovative platform that leverages artificial intelligence to automate and streamline agile development processes. It eliminates manual standups, automates task creation, and provides intelligent insights for better team productivity.

## Features

- 🤖 AI-Driven Daily Standups
- 📊 Automated Task & Sprint Management
- 🔍 Smart Code Review & Documentation
- 📈 AI-Powered Analytics & Insights
- 🔄 Seamless Integration with Existing Tools

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React

### Backend
- Python FastAPI (AI Backend)
- Node.js Express (API Backend)
- OpenAI GPT-4
- Supabase

## Project Structure

```
sprunt/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   │   ├── components/      # Reusable React components
│   │   │   └── styles/         # Global styles and Tailwind config
│   │   └── public/             # Static assets
│   ├── backend-ai/             # Python FastAPI AI backend
│   │   ├── main.py            # Main FastAPI application
│   │   └── .env              # Environment variables
│   └── backend-node/         # Node.js API backend
│       ├── index.js         # Main Express application
│       └── .env            # Environment variables
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- OpenAI API Key
- Supabase Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sprunt.git
cd sprunt
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install AI backend dependencies:
```bash
cd backend-ai
pip install -r requirements.txt
```

4. Install Node.js backend dependencies:
```bash
cd backend-node
npm install
```

5. Set up environment variables:
   - Copy `.env.example` to `.env` in both backend directories
   - Add your OpenAI API key and Supabase credentials

### Running the Application

1. Start the frontend:
```bash
cd frontend
npm run dev
```

2. Start the AI backend:
```bash
cd backend-ai
uvicorn main:app --reload
```

3. Start the Node.js backend:
```bash
cd backend-node
npm start
```

## Environment Variables

### AI Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Node.js Backend (.env)
```
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
PORT=3000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT-4 API
- Supabase for database and authentication
- Next.js team for the amazing framework 