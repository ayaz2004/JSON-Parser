# 🤖 AI Document Parser

> Transform any document into structured JSON using the power of AI vision models

An intelligent document parsing system that extracts data from images, PDFs, and Word documents into custom JSON formats. Perfect for digitizing scanned documents, extracting form data, and automating document workflows.

## ✨ What Makes This Special?

- 👁️ **Vision-Powered**: Reads scanned PDFs and images directly using AI vision (no OCR setup needed!)
- 🆓 **Free to Start**: Uses Google Gemini 2.5 by default - completely free with generous limits
- 🎯 **Your Format**: Define any JSON structure you want - the AI adapts to your schema
- 🤖 **Multi-LLM Support**: Choose from Google Gemini, OpenAI GPT-4o, Claude 3.5, Groq, or local Ollama
- 🔐 **Privacy First**: Your API keys stay on your device - never stored on servers
- ⚡ **Zero Config**: No environment variables or complex setup required
- 🎨 **Beautiful UI**: Modern, responsive interface built with Next.js and Tailwind CSS

## 🎯 Perfect For

- 📝 **Educational Content**: Converting exam papers, quizzes, and worksheets into digital question banks
- 🧾 **Invoices & Receipts**: Extracting structured data from financial documents
- 📋 **Forms & Applications**: Digitizing paper forms into database records
- 🏥 **Medical Records**: Converting patient documents into structured healthcare data
- 📄 **Legal Documents**: Extracting clauses and terms from contracts
- 💳 **Business Cards**: Turning photos into contact information

## 🚀 Quick Start

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd ai-document-parser
npm install
```

### Step 2: Get a Free API Key (30 seconds!)

Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create a free API key. No credit card required!

### Step 3: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you're ready to go! 🎉

## 💡 How to Use

### 1. **Upload Your Document**
Drag and drop any PDF, DOC, DOCX, JPG, or PNG file. Works great with:
- Scanned documents ✅
- Photos taken with your phone ✅  
- Digital PDFs ✅

### 2. **Define Your Output Format**
Tell the AI what JSON structure you want. Example for a quiz:

```json
{
  "questionOrder": 1,
  "questionText": "What is the capital of France?",
  "option1": "London",
  "option2": "Berlin",
  "option3": "Paris",
  "option4": "Madrid",
  "isCorrect": 3,
  "explanation": "Paris has been the capital of France since the 10th century."
}
```

### 3. **Select AI Provider**
- **Google Gemini** (Recommended) - Free, fast, great for most documents
- **OpenAI GPT-4o** - Premium accuracy, best for complex documents
- **Claude 3.5** - Excellent alternative to GPT-4o

### 4. **Get Your JSON**
Click "Parse Document" and watch the AI extract, understand, and format your data. Download or copy the results!

## 🤖 AI Provider Comparison

| Provider | Cost | Speed | Best For | Vision Support |
|----------|------|-------|----------|----------------|
| **Google Gemini 2.5** | 🆓 Free | ⚡ Fast | Most documents, exams, forms | ✅ Yes |
| **OpenAI GPT-4o** | 💰 ~$0.01/doc | ⚡ Fast | Complex documents, high accuracy | ✅ Yes |
| **Claude 3.5** | 💰 ~$0.01/doc | ⚡ Fast | Long documents, detailed analysis | ✅ Yes |
| **Groq** | 🆓 Free | ⚡⚡ Very Fast | Text-only documents | ❌ No |
| **Ollama** | 🆓 Free | 🐢 Slower | Offline use, privacy | ❌ No |

## 📖 Real-World Example

**Input**: Scanned exam paper with 100 multiple-choice questions  
**Process**: Upload → Define question schema → Select Gemini → Parse  
**Output**: JSON array with 100 questions, all options extracted, answers provided by AI  
**Time**: ~20-30 seconds  
**Cost**: $0 (using free Gemini API)

## 🔒 Security & Privacy

- ✅ API keys entered in the browser - never sent to our servers
- ✅ Keys used only for that one request, then discarded
- ✅ No database, no storage, no tracking
- ✅ Your documents are processed by the AI provider you choose
- ✅ Deploy your own instance for complete control

## 🎨 Technical Details

### Built With
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI SDK, Anthropic SDK, Google Generative AI
- **Document Parsing**: pdf-parse, mammoth, Tesseract.js (fallback)
- **Deployment**: Optimized for Vercel (zero configuration)

### Project Structure
```
├── app/
│   ├── api/parse/          # Document processing API
│   ├── page.tsx            # Main UI
│   └── layout.tsx          # App layout
├── components/
│   ├── FileUpload.tsx      # Document upload
│   ├── JsonSchemaInput.tsx # Schema editor
│   ├── LLMSelector.tsx     # AI provider picker
│   └── ResultsDisplay.tsx  # Output viewer
├── lib/
│   ├── parsers/            # PDF, DOC, Image parsers
│   ├── llm/                # AI provider integrations
│   └── utils/              # Helper functions
└── types/                  # TypeScript definitions
```


## 📚 Additional Resources

### Get Free API Keys
- [Google AI Studio](https://makersuite.google.com/app/apikey) - Gemini (FREE)
- [OpenAI Platform](https://platform.openai.com/api-keys) - GPT-4 ($5 free credit)
- [Anthropic Console](https://console.anthropic.com/) - Claude (pay-as-you-go)
- [Groq Console](https://console.groq.com/) - Fast inference (FREE) - [Ollama](https://ollama.ai/) - Run models locally (FREE)


## 🤝 Contributing

Contributions are welcome! This project is perfect for:
- Adding new document formats
- Improving extraction accuracy
- Adding new AI providers
- Enhancing the UI/UX

## ⭐ Show Your Support

If this project helped you, give it a ⭐ on GitHub!

## 📝 License

MIT License - Feel free to use this in your own projects!

---

**Built with ❤️ for the AI community**

## Support

For issues and questions, please open an issue on GitHub.
