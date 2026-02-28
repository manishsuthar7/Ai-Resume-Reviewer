# 🚀 AI Resume Reviewer

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat&logo=openai&logoColor=white)

An advanced, AI-powered resume analysis tool built with Next.js and the OpenAI API. Optimize your resume for Applicant Tracking Systems (ATS), identify critical keyword gaps against a Job Description, and get instant, actionable feedback and bullet-point rewrites to land your dream job!

---

## ✨ Features

- **📄 Document Parsing**: Seamlessly upload and extract text from both `PDF` and Word (`DOCX`) resumes.
- **⚡ Instant AI Scoring**: Get immediate, accurate scores on Overall Quality, ATS Compatibility, and Job Description Match.
- **🔍 Keyword Gap Analysis**: Paste a target Job Description to see exactly which crucial keywords your resume is currently missing.
- **✍️ AI Bullet Rewrites**: Receive AI-generated, impact-driven rewrites of your resume bullet points. Easily copy and paste the improvements directly into your resume.
- **🎨 Premium UI/UX**: Enjoy a sleek, modern interface built with Tailwind CSS, featuring glassmorphism, dynamic glowing backgrounds, and modern layout.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI & Styling**: React, [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Integration**: [OpenAI API](https://openai.com/) (GPT-4o)
- **Document Processing**: `pdf-parse` (for PDF text extraction) and `mammoth` (for DOCX text extraction)
- **Language**: TypeScript

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun
- An active [OpenAI API Key](https://platform.openai.com/api-keys)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ai-resume-reviewer.git
   cd ai-resume-reviewer
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Environment Variables**

   Create a `.env.local` file in the root of the project (if not present) or copy the `.env.example` file:

   ```bash
   cp .env.example .env.local
   ```

   Add your OpenAI API Key to the `.env.local` file:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open the application**

   Open [http://localhost:3000](http://localhost:3000) in your browser to start optimizing your resume.

## 💡 How to Use

1. **Upload Resume**: Hover over the upload area and click to browse, or simply drag and drop your `.pdf` or `.docx` resume.
2. **Add Job Description (Optional but Recommended)**: Paste a target job description into the text area for a tailored, position-specific analysis.
3. **Analyze**: Watch as the AI parses your content, evaluates your formatting, checks for impact language, and analyzes token-by-token.
4. **Review your Results**: 
   - Check your Overall and ATS scores.
   - Expand sections to see where your resume succeeds and what can be improved.
   - Review any missing keywords to bypass Applicant Tracking Systems.
   - Copy the customized AI rewrites for your weakest bullet points!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/your-username/ai-resume-reviewer/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
