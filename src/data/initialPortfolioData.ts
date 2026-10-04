import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "MD. Ibrahim Shake Shuvo",
    title: "Python Web Automation Developer",
    location: "Dhaka, Bangladesh",
    email: "ibrahimshakeshuvo100@gmail.com",
    linkedIn: "https://www.linkedin.com/in/ibrahimshakeshuvo",
    status: "Available for new projects",
    avatarUrl: "/assets/hero_portrait.jpg"
  },
  hero: {
    headline: "Automate Any Browser Task & Web Workflow with Python",
    supportingHeadline: "Python Web Automation Developer",
    supportingParagraph: "I build Python automation systems that do repetitive web work for you: logging in, filling forms, collecting data, running AI-assisted steps and updating Google Sheets. Work that takes hours by hand can run in minutes, depending on the project.",
    capabilities: [
      "Custom Browser Bots",
      "Workflow Automation",
      "Web Scraping",
      "AI-Assisted Steps",
      "Google Sheets Sync"
    ],
    primaryCtaText: "Discuss a Project",
    secondaryCtaText: "View Projects"
  },
  trustStrip: [
    "Python",
    "Playwright",
    "SeleniumBase",
    "Requests",
    "BeautifulSoup",
    "pandas",
    "LLM APIs",
    "Google Sheets & Docs automation"
  ],
  services: [
    {
      id: "browser-automation-bots",
      title: "Custom Browser Automation Bots",
      description: "Python bots (Playwright / SeleniumBase) that work on websites without an API: login, clicks, forms, downloads.",
      iconName: "Target",
      tags: ["Playwright", "SeleniumBase", "Headless Browsers"]
    },
    {
      id: "workflow-automation",
      title: "Web Workflow & Task Automation",
      description: "End-to-end automation of repetitive web tasks, with logging and error handling.",
      iconName: "Building2",
      tags: ["Task Automation", "Error Handling", "Python"]
    },
    {
      id: "scraping-extraction",
      title: "Web Scraping & Data Extraction",
      description: "Structured data from static and JavaScript-heavy websites, delivered as CSV, Excel or Google Sheets.",
      iconName: "Database",
      tags: ["Requests", "BeautifulSoup", "pandas", "CSV / Excel / Google Sheets"]
    },
    {
      id: "ai-assisted-automation",
      title: "AI-Assisted Automation",
      description: "LLM calls inside the workflow to classify, score, summarize or clean collected data.",
      iconName: "Search",
      tags: ["LLM APIs", "Classification", "Summarization"]
    },
    {
      id: "sheets-docs-automation",
      title: "Google Sheets & Docs Automation",
      description: "Scripts that read, write and update Google Sheets and Docs automatically.",
      iconName: "CheckCheck",
      tags: ["Google Sheets API", "Google Docs API", "Auto-Sync"]
    },
    {
      id: "lead-discovery-automation",
      title: "Lead Discovery Automation",
      description: "Automated B2B lead finding, as one small use case of the automation tools above.",
      iconName: "MapPin",
      tags: ["Directory Scraping", "Verification", "Automation"]
    }
  ],
  howIWork: [
    {
      stepNumber: "01",
      title: "Workflow Analysis",
      description: "Analyze the target website, user interactions, login requirements, and data structure."
    },
    {
      stepNumber: "02",
      title: "Bot Development",
      description: "Develop Python automation scripts using Playwright, SeleniumBase, or Requests."
    },
    {
      stepNumber: "03",
      title: "Logging & Error Handling",
      description: "Implement structured logging, anti-bot bypass strategies, and automatic retry logic."
    },
    {
      stepNumber: "04",
      title: "Deployment & Auto-Sync",
      description: "Run automated workflows and sync structured outputs to Google Sheets, Docs, or CSV."
    }
  ],
  projects: [],
  tools: [
    {
      id: "tool-python",
      name: "Python",
      category: "Language",
      description: "Core language for custom browser bots, web workflow automation, data scraping, and API integrations.",
      highlight: true
    },
    {
      id: "tool-playwright",
      name: "Playwright",
      category: "Browser automation",
      description: "Modern, high-performance browser automation handling dynamic, JavaScript-heavy SPAs and complex logins.",
      highlight: true
    },
    {
      id: "tool-seleniumbase",
      name: "SeleniumBase",
      category: "Browser automation",
      description: "Advanced browser automation with built-in stealth capabilities and robust element interaction.",
      highlight: true
    },
    {
      id: "tool-requests",
      name: "Requests",
      category: "Scraping and parsing",
      description: "Fast HTTP client for REST APIs, static endpoints, and efficient web fetching.",
      highlight: true
    },
    {
      id: "tool-beautifulsoup",
      name: "BeautifulSoup",
      category: "Scraping and parsing",
      description: "Accurate DOM parsing and structured attribute extraction from raw HTML sources.",
      highlight: true
    },
    {
      id: "tool-pandas",
      name: "pandas",
      category: "Data",
      description: "Data manipulation, normalization, deduplication, and export to CSV, Excel, or databases.",
      highlight: true
    },
    {
      id: "tool-llm-apis",
      name: "LLM APIs",
      category: "AI",
      description: "AI-assisted processing inside automation pipelines to classify, score, and summarize data.",
      highlight: true
    },
    {
      id: "tool-sheets-docs",
      name: "Google Sheets & Docs",
      category: "Integrations",
      description: "Scripts that read, write, and update Google Sheets and Docs spreadsheets automatically.",
      highlight: true
    }
  ],
  about: {
    title: "About Me",
    statement: "I am a Python Web Automation Developer. I build systems that do repetitive work on websites for you: browser automation, form filling, web scraping, AI-assisted processing with LLMs, and syncing results to Google Sheets and Docs. Lead generation is one of the things I build with these tools, not the only one. My focus is clean, reliable Python code that saves real working hours.",
    capabilities: [
      "Python",
      "Playwright",
      "SeleniumBase",
      "Requests",
      "BeautifulSoup",
      "pandas",
      "LLM APIs",
      "Google Sheets & Docs automation"
    ],
    background: {
      degree: "Diploma in Agriculture",
      institution: "Agriculture Training Institute, Gaibandha",
      period: "2019–2023"
    }
  },
  cta: {
    headline: "Automate Any Browser Task & Web Workflow with Python",
    description: "Tell me about your repetitive web tasks or data extraction needs. Work that takes hours by hand can run in minutes.",
    primaryButtonText: "Discuss a Project",
    secondaryButtonText: "Contact Me"
  },
  contact: {
    email: "ibrahimshakeshuvo100@gmail.com",
    linkedIn: "https://www.linkedin.com/in/ibrahimshakeshuvo",
    location: "Dhaka, Bangladesh",
    availabilityNote: "Available for custom browser automation bots, web scraping pipelines, and Google Sheets integration projects."
  }
};
