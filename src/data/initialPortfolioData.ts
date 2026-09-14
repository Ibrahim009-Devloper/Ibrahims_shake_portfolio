import { PortfolioData } from '../types/portfolio';

export const initialPortfolioData: PortfolioData = {
  profile: {
    name: "MD. Ibrahim Shake Shuvo",
    title: "B2B Lead Generation & Web Scraping Specialist",
    location: "Dhaka, Bangladesh",
    email: "ibrahimshakeshuvo100@gmail.com",
    linkedIn: "https://www.linkedin.com/in/ibrahimshakeshuvo",
    status: "Available for new projects",
    avatarUrl: "" // Will fall back to custom professional monogram placeholder
  },
  hero: {
    headline: "B2B Lead Generation & Web Scraping Specialist",
    supportingHeadline: "I help businesses find targeted B2B leads through web research, data scraping, and organized business data collection.",
    supportingParagraph: "Delivering clean, verified prospect and company datasets structured for sales teams, agencies, and market research. No duplicate entries, no generic data dump.",
    capabilities: [
      "B2B Lead Generation",
      "Web Research",
      "Google Maps Lead Generation",
      "Web Scraping",
      "Data Extraction"
    ],
    primaryCtaText: "Get a Lead List",
    secondaryCtaText: "View My Work"
  },
  trustStrip: [
    "B2B Lead Generation",
    "Web Research",
    "Google Maps Research",
    "E-commerce Data",
    "Web Scraping",
    "Data Cleaning"
  ],
  services: [
    {
      id: "b2b-lead-gen",
      title: "B2B Lead Generation",
      description: "Targeted business and prospect lists based on niche, location, and client requirements.",
      iconName: "Target",
      tags: ["Prospecting", "Verified Leads", "Custom Criteria"]
    },
    {
      id: "prospect-list-building",
      title: "Business & Prospect List Building",
      description: "Research and organize relevant companies and prospect information into structured lists.",
      iconName: "Building2",
      tags: ["Decision Makers", "Role Targeting", "Company Profiles"]
    },
    {
      id: "web-research",
      title: "Web Research",
      description: "Collect relevant business information from websites, directories, Google Maps, and other public sources.",
      iconName: "Search",
      tags: ["Deep Research", "Public Directories", "Market Data"]
    },
    {
      id: "gmaps-leads",
      title: "Google Maps Lead Generation",
      description: "Find relevant local businesses and organize useful business information for sales and marketing research.",
      iconName: "MapPin",
      tags: ["Local Businesses", "Phone & Address", "Reviews & Ratings"]
    },
    {
      id: "web-scraping",
      title: "Web Scraping & Data Extraction",
      description: "Extract structured information from websites using Python-based automation tools.",
      iconName: "Database",
      tags: ["Python", "Playwright", "Selenium"]
    },
    {
      id: "data-cleaning",
      title: "Data Cleaning & Organization",
      description: "Clean, organize, and structure collected data into practical Excel or CSV-ready datasets.",
      iconName: "CheckCheck",
      tags: ["Deduplication", "Format Normalization", "CSV / Excel Ready"]
    }
  ],
  howIWork: [
    {
      stepNumber: "01",
      title: "Understand",
      description: "Understand the target niche, location, and required data fields."
    },
    {
      stepNumber: "02",
      title: "Research",
      description: "Find relevant businesses and prospects from appropriate public sources."
    },
    {
      stepNumber: "03",
      title: "Collect & Clean",
      description: "Collect, validate, clean, and organize the data into uniform columns."
    },
    {
      stepNumber: "04",
      title: "Deliver",
      description: "Deliver a structured and usable lead list in Excel or CSV format."
    }
  ],
  projects: [
    {
      id: "proj-b2b-lead-list",
      title: "B2B Business Lead List",
      shortDescription: "Verified business prospect dataset focusing on targeted industry verticals and decision-makers.",
      category: "B2B Business Lead List",
      dataCollected: "Company Name, Decision Maker, Title, Email, LinkedIn Profile, Headcount, Location",
      tools: ["Python", "Web Research", "Data Verification"],
      outputFormat: "Excel (.xlsx) / CSV",
      isDemoSample: true,
      coverBadge: "Sample Dataset",
      caseStudy: {
        overview: "A structured B2B lead list compiled to illustrate how decision-maker data is researched, extracted, and cleaned for direct sales outreach.",
        objective: "Identify decision-makers (Founders, Managing Directors, Operations Heads) across designated industry niches with direct contact points.",
        researchSource: "Public business registers, verified corporate websites, and professional business directories.",
        dataFields: [
          "Company Name",
          "Website",
          "Contact Person",
          "Job Title",
          "Business Email",
          "LinkedIn URL",
          "Employee Range",
          "Location / Country"
        ],
        process: [
          "Target criteria and industry filters defined with specific geographic bounds.",
          "Automated and manual research conducted across public company directories.",
          "Verification of business domains and structured formatting of contact points.",
          "Deduplication check and formatting into standard CRM-compatible columns."
        ],
        toolsUsed: ["Python", "Custom Verification Scripts", "Spreadsheet Automation"],
        finalOutput: "Clean Excel spreadsheet and standard UTF-8 CSV with normalized phone formats and standardized headers.",
        sampleRows: [
          {
            "Company": "Apex Logistics Group",
            "Contact": "Marcus Vance",
            "Title": "Director of Operations",
            "Email": "m.vance@apexlogistics-demo.com",
            "LinkedIn": "linkedin.com/in/demo-marcus-vance",
            "Location": "London, UK",
            "Status": "Verified"
          },
          {
            "Company": "BluePeak Digital Solutions",
            "Contact": "Elena Rostova",
            "Title": "Head of Growth",
            "Email": "elena.r@bluepeak-demo.io",
            "LinkedIn": "linkedin.com/in/demo-elena-growth",
            "Location": "Austin, TX, USA",
            "Status": "Verified"
          },
          {
            "Company": "Krona Engineering Ltd",
            "Contact": "Arthur Lindqvist",
            "Title": "Managing Director",
            "Email": "lindqvist@krona-demo.se",
            "LinkedIn": "linkedin.com/in/demo-arthur-l",
            "Location": "Stockholm, Sweden",
            "Status": "Verified"
          },
          {
            "Company": "Solaris Energy Partners",
            "Contact": "David Chen",
            "Title": "VP Business Development",
            "Email": "dchen@solaris-demo.com",
            "LinkedIn": "linkedin.com/in/demo-david-chen",
            "Location": "Singapore",
            "Status": "Verified"
          }
        ]
      }
    },
    {
      id: "proj-gmaps-leads",
      title: "Google Maps Business Leads",
      shortDescription: "Structured directory extraction of verified local businesses across specified metropolitan markets.",
      category: "Google Maps Business Leads",
      dataCollected: "Business Name, Category, Physical Address, Phone, Website, Rating, Review Count, Place ID",
      tools: ["Python", "Playwright", "Google Maps Research"],
      outputFormat: "CSV / Google Sheets",
      isDemoSample: true,
      coverBadge: "Sample Dataset",
      caseStudy: {
        overview: "Comprehensive local business list collected from Google Maps public listings for local service providers, medical clinics, and commercial trades.",
        objective: "Extract localized commercial business contacts within specific zip codes or municipal boundaries without missing key contact attributes.",
        researchSource: "Google Maps public business listings and verified local web directories.",
        dataFields: [
          "Business Name",
          "Category / Primary Service",
          "Street Address",
          "City & Postal Code",
          "Phone Number",
          "Official Website",
          "Google Rating",
          "Total Reviews"
        ],
        process: [
          "Target radius and keywords (e.g., Dental Clinics, HVAC Services, Commercial Law) established.",
          "Automated headless browser queries executing with Playwright to extract dynamic map cards.",
          "Cleaning of special characters, normalization of international dial codes, and website URL cleaning.",
          "Removal of closed establishments and duplicate location pins."
        ],
        toolsUsed: ["Python", "Playwright", "Data Cleaning Pipeline"],
        finalOutput: "Ready-to-import CSV with phone numbers formatted in E.164 and clean website URLs.",
        sampleRows: [
          {
            "Business Name": "Metro Dental Wellness Care",
            "Category": "Dental Clinic",
            "Address": "442 Lexington Ave, NY 10017",
            "Phone": "+1 (212) 555-0192",
            "Website": "https://metrodental-demo.com",
            "Rating": "4.8 (142 reviews)",
            "Status": "Active"
          },
          {
            "Business Name": "Premier HVAC Services",
            "Category": "Air Conditioning & Heating",
            "Address": "1208 Industrial Pkwy, Chicago, IL",
            "Phone": "+1 (312) 555-0144",
            "Website": "https://premierhvac-demo.com",
            "Rating": "4.9 (89 reviews)",
            "Status": "Active"
          },
          {
            "Business Name": "Highland Physical Therapy",
            "Category": "Rehabilitation Center",
            "Address": "89 Oak Creek Rd, Dallas, TX",
            "Phone": "+1 (214) 555-0187",
            "Website": "https://highlandpt-demo.com",
            "Rating": "4.7 (210 reviews)",
            "Status": "Active"
          }
        ]
      }
    },
    {
      id: "proj-ecommerce-data",
      title: "E-commerce Product Data",
      shortDescription: "Automated multi-page catalog and price extraction across categories for competitive market analysis.",
      category: "E-commerce Product Data",
      dataCollected: "Product Title, SKU / Model, Current Price, Brand, Category, Availability, Image URL",
      tools: ["Python", "Selenium", "Data Normalization"],
      outputFormat: "Structured CSV / JSON",
      isDemoSample: true,
      coverBadge: "Sample Dataset",
      caseStudy: {
        overview: "Structured extraction of catalog product data from multi-page online retailers to assist with competitive price benchmarking and inventory monitoring.",
        objective: "Extract product attributes including pricing variations, stock states, and categorization across hundreds of catalog pages.",
        researchSource: "Public online product catalog listings and category pagination.",
        dataFields: [
          "Product Title",
          "Brand Name",
          "Category Hierarchy",
          "SKU / Item ID",
          "Retail Price",
          "Discounted Price",
          "Stock Availability",
          "Product URL"
        ],
        process: [
          "Inspection of pagination structure and dynamic JavaScript element rendering.",
          "Selenium and Python script handles multi-page navigation and handles delayed DOM renders.",
          "Cleaning of currency symbols, whitespace stripping, and extraction of numeric price values.",
          "Validation of unique SKU keys to eliminate redundant catalog entries."
        ],
        toolsUsed: ["Python", "Selenium", "Regular Expressions"],
        finalOutput: "Normalized CSV with standard column datatypes and structured JSON for automated ingestion.",
        sampleRows: [
          {
            "Product Title": "Ergonomic Mesh Task Chair X-400",
            "Brand": "WorkPro Solutions",
            "SKU": "WPS-CH-4091",
            "Regular Price": "$289.00",
            "Current Price": "$249.00",
            "Availability": "In Stock",
            "Category": "Office Furniture"
          },
          {
            "Product Title": "Dual Monitor Arm Stand 32-inch",
            "Brand": "MountTech",
            "SKU": "MT-ARM-32D",
            "Regular Price": "$119.99",
            "Current Price": "$99.99",
            "Availability": "In Stock",
            "Category": "Accessories"
          },
          {
            "Product Title": "Adjustable Standing Desk 60x30",
            "Brand": "ElevateDesk",
            "SKU": "ED-DSK-6030-W",
            "Regular Price": "$499.00",
            "Current Price": "$459.00",
            "Availability": "Low Stock",
            "Category": "Office Furniture"
          }
        ]
      }
    },
    {
      id: "proj-web-research",
      title: "Web Research Dataset",
      shortDescription: "Rigorous manual and automated web research compiling niche industry listings and member directories.",
      category: "Web Research Dataset",
      dataCollected: "Organization Name, Leadership, Direct Contact, Website, Services, City/State",
      tools: ["Manual Web Research", "Python", "Spreadsheets"],
      outputFormat: "Clean Spreadsheet (.xlsx)",
      isDemoSample: true,
      coverBadge: "Sample Dataset",
      caseStudy: {
        overview: "A targeted research project aggregating information on professional service firms and specialized consultancy agencies across targeted regions.",
        objective: "Collect specific business details not readily available through basic scrapers by verifying organizational pages and about sections.",
        researchSource: "Public trade association member directories, corporate websites, and regulatory registers.",
        dataFields: [
          "Organization Name",
          "Corporate Office Location",
          "Key Executive / Partner",
          "Official Contact Email",
          "Primary Practice Areas",
          "Year Founded",
          "Website URL"
        ],
        process: [
          "Detailed parameter verification matching client's strict industry criteria.",
          "Systematic exploration of organizational directories and secondary confirmation via official websites.",
          "Data validation ensuring active operational status and non-defunct domains.",
          "Formatting into clean, readable spreadsheet with frozen headers and color-coded verification statuses."
        ],
        toolsUsed: ["Web Research Protocols", "Python Assistant Tools", "Excel Formatting"],
        finalOutput: "Structured Excel workbook with standardized data types and clear source links for spot verification.",
        sampleRows: [
          {
            "Organization": "Beacon Strategy Advisory",
            "Location": "Boston, MA, USA",
            "Executive": "Sarah Jenkins",
            "Contact Email": "sjenkins@beacon-advisory-demo.com",
            "Practice Area": "Healthcare Strategy",
            "Status": "Verified Active"
          },
          {
            "Organization": "Vanguard Compliance Partners",
            "Location": "Toronto, ON, Canada",
            "Executive": "Liam O'Connor",
            "Contact Email": "loconnor@vanguard-compliance-demo.ca",
            "Practice Area": "Fintech Regulatory",
            "Status": "Verified Active"
          },
          {
            "Organization": "Nexa Growth Partners",
            "Location": "Melbourne, Australia",
            "Executive": "Chloe Tan",
            "Contact Email": "ctan@nexagrowth-demo.com.au",
            "Practice Area": "Supply Chain Consulting",
            "Status": "Verified Active"
          }
        ]
      }
    },
    {
      id: "proj-prospect-list",
      title: "Prospect List Building",
      shortDescription: "Tailored outbound prospect list targeting specific organizational roles and corporate tiers.",
      category: "Prospect List Building",
      dataCollected: "Prospect Full Name, Verified Email, Role, Company Domain, Headcount, LinkedIn Profile",
      tools: ["Python", "Professional Directories", "Data Cleaning"],
      outputFormat: "CSV / CRM-Ready",
      isDemoSample: true,
      coverBadge: "Sample Dataset",
      caseStudy: {
        overview: "Custom-curated prospect list designed for outbound email campaigns, targeted by specific executive titles (e.g. VP Sales, Chief Marketing Officer).",
        objective: "Provide outbound sales teams with high-relevance prospects while eliminating invalid formats and outdated roles.",
        researchSource: "Public professional networks, conference speaker listings, and company team pages.",
        dataFields: [
          "First Name",
          "Last Name",
          "Job Title",
          "Company Name",
          "Company Website",
          "Work Email",
          "LinkedIn URL",
          "Industry"
        ],
        process: [
          "Filter by senior role keywords and relevant departmental ownership.",
          "Multi-step verification of domain status and MX records.",
          "Sanitization of special symbols, honorifics, and duplicate records.",
          "Exporting into CRM-ready format (compatible with HubSpot, Apollo, Salesforce, Outreach)."
        ],
        toolsUsed: ["Python", "Validation Scripts", "CSV Standardization"],
        finalOutput: "CSV ready for CRM import with separate First and Last Name columns and verified corporate emails.",
        sampleRows: [
          {
            "First Name": "Rachel",
            "Last Name": "Adams",
            "Title": "VP of Revenue",
            "Company": "CloudScale Analytics",
            "Email": "radams@cloudscale-demo.com",
            "Industry": "Enterprise Software",
            "Status": "Deliverable"
          },
          {
            "First Name": "Tariq",
            "Last Name": "Mansour",
            "Title": "Chief Marketing Officer",
            "Company": "Zenith Financial Tech",
            "Email": "tmansour@zenithfin-demo.com",
            "Industry": "Fintech",
            "Status": "Deliverable"
          },
          {
            "First Name": "Jessica",
            "Last Name": "Miller",
            "Title": "Director of Sales",
            "Company": "Veritas BioHealth",
            "Email": "jmiller@veritasbio-demo.com",
            "Industry": "Biotech",
            "Status": "Deliverable"
          }
        ]
      }
    }
  ],
  tools: [
    {
      id: "tool-python",
      name: "Python",
      category: "Automation Tool",
      description: "Custom scripts for automated data extraction, structured parsing, data formatting, and batch file processing.",
      highlight: true
    },
    {
      id: "tool-playwright",
      name: "Playwright",
      category: "Automation Tool",
      description: "Fast, modern browser automation for dynamic, JavaScript-heavy single-page applications and infinite scroll layouts.",
      highlight: true
    },
    {
      id: "tool-selenium",
      name: "Selenium",
      category: "Automation Tool",
      description: "Reliable automated browser navigation for complex multi-step web workflows and directory navigation.",
      highlight: true
    },
    {
      id: "tool-research",
      name: "Web Research",
      category: "Core Capability",
      description: "Deep, rigorous investigation of public databases, business registries, and verified company portals.",
      highlight: false
    },
    {
      id: "tool-extraction",
      name: "Data Extraction",
      category: "Core Capability",
      description: "Converting unstructured web content and paginated listings into clean, standardized tabular datasets.",
      highlight: false
    },
    {
      id: "tool-cleaning",
      name: "Data Cleaning",
      category: "Core Capability",
      description: "Deduplication, syntax normalization, postal code formatting, and preparing ready-to-use CSV or Excel files.",
      highlight: false
    }
  ],
  about: {
    title: "About Me",
    statement: "I help businesses collect targeted business and prospect data through web research, scraping, and structured data collection. I focus on delivering clean, organized, and practical datasets that can support sales and marketing research.",
    capabilities: [
      "B2B Lead Generation",
      "Web Research",
      "Web Scraping",
      "Python",
      "Playwright",
      "Selenium"
    ],
    background: {
      degree: "Diploma in Agriculture",
      institution: "Agriculture Training Institute, Gaibandha",
      period: "2019–2023"
    }
  },
  cta: {
    headline: "Need a Targeted Business Lead List?",
    description: "Tell me your target industry, location, and required data. I can help organize the research into a clean and usable lead list.",
    primaryButtonText: "Start a Project",
    secondaryButtonText: "Contact Me"
  },
  contact: {
    email: "ibrahimshakeshuvo100@gmail.com",
    linkedIn: "www.linkedin.com/in/ibrahimshakeshuvo",
    location: "Dhaka, Bangladesh",
    availabilityNote: "Responding within 24 hours. Open for targeted list-building and automated scraping contracts."
  }
};
