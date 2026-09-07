/* ==========================================================================
   NCONIX DATABASE & CONTENT REPOSITORY
   ========================================================================== */

const NCONIX_DATA = {
  // RAG Pipeline Stages Data
  ragSteps: [
    {
      id: "docs",
      step: "01",
      icon: "file-text",
      title: "Documents",
      heading: "1. Multi-Format Ingestion",
      desc: "Ingest unstructured & structured knowledge bases: PDFs, Word, Markdown, Confluence, SQL schemas, and Notion databases with metadata extraction.",
      bullets: [
        "PDF, DOCX, Codebases, Notion & Markdown Parsing",
        "Automatic metadata tagging (author, timestamp, tags)",
        "Zero-loss OCR for scanned enterprise blueprints"
      ],
      code: `# Multi-Source Ingestion Engine
from langchain_community.document_loaders import (
    PyPDFLoader, UnstructuredMarkdownLoader
)

loader = PyPDFLoader("data/nconix_enterprise_spec.pdf")
raw_docs = loader.load()
print(f"Loaded {len(raw_docs)} source pages")`
    },
    {
      id: "chunking",
      step: "02",
      icon: "scissors",
      title: "Chunking",
      heading: "2. Semantic Chunking & Tokenization",
      desc: "Split continuous text into semantic units preserving context boundaries, overlapping windows, and parent-child document relationships.",
      bullets: [
        "Recursive character & markdown-aware splitting",
        "Semantic sliding window (512 - 1024 token chunks)",
        "Overlapping contexts (50 - 100 token overlap)"
      ],
      code: `# Context-Preserving Semantic Splitter
from langchain_text_splitters import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=750,
    chunk_overlap=80,
    separators=["\\n\\n", "\\n", "(?<=\\.) ", " "]
)
chunks = text_splitter.split_documents(raw_docs)`
    },
    {
      id: "embeddings",
      step: "03",
      icon: "binary",
      title: "Embeddings",
      heading: "3. Dense Vector Embeddings",
      desc: "Transform text chunks into 1536-dimensional dense mathematical vectors capturing semantic intent, synonyms, and domain concepts.",
      bullets: [
        "OpenAI text-embedding-3-large & BAAI BGE-M3 models",
        "Domain-tuned embeddings for technical & legal corpora",
        "Normalized vector projections for cosine distance"
      ],
      code: `# High-Dimensional Dense Embeddings
from langchain_openai import OpenAIEmbeddings

embed_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    dimensions=1536
)
# vector_sample = embed_model.embed_query("Nconix Cloud Architecture")`
    },
    {
      id: "vectordb",
      step: "04",
      icon: "database",
      title: "Vector DB",
      heading: "4. Vector Indexing & Storage",
      desc: "Store and index high-dimensional embeddings in low-latency vector databases equipped with HNSW or IVF indexes for sub-10ms retrieval.",
      bullets: [
        "FAISS, Pinecone, Qdrant & Milvus integrations",
        "HNSW index for ultra-fast Approximate Nearest Neighbors (ANN)",
        "Filtered hybrid search with scalar metadata filtering"
      ],
      code: `# Persistent Vector Store Integration
from langchain_community.vectorstores import FAISS

vectorstore = FAISS.from_documents(
    documents=chunks,
    embedding=embed_model
)
vectorstore.save_local("vector_indices/nconix_knowledge")`
    },
    {
      id: "search",
      step: "05",
      icon: "search",
      title: "Similarity Search",
      heading: "5. Hybrid Search & Re-ranking",
      desc: "Combine dense vector similarity with sparse BM25 keyword matching and Cohere Cross-Encoder re-ranking to deliver the top-k highest precision chunks.",
      bullets: [
        "Hybrid Search (Dense + Sparse BM25 fusion)",
        "Cross-Encoder Re-ranking for top-5 relevant chunks",
        "Query expansion & hypothetical document embeddings (HyDE)"
      ],
      code: `# Hybrid Retrieval + Re-ranking Pipeline
retriever = vectorstore.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"k": 5, "score_threshold": 0.78}
)
relevant_docs = retriever.invoke("How does Nconix handle RAG security?")`
    },
    {
      id: "llm",
      step: "06",
      icon: "brain",
      title: "LLM Reasoning",
      heading: "6. LLM Context Synthesis",
      desc: "Inject retrieved factual chunks into the LLM system prompt for grounded, hallucination-free reasoning, citation generation, and precise answer formulation.",
      bullets: [
        "Support for Claude 3.5 Sonnet, GPT-4o & DeepSeek R1",
        "Strict citation enforcement with source page attribution",
        "Guardrails & zero-hallucination confidence scoring"
      ],
      code: `# Augmented Prompt Synthesis
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("""
Answer using ONLY the provided verified context:
<context>{context}</context>
Question: {question}
""")
llm = ChatOpenAI(model="gpt-4o", temperature=0.1)
rag_chain = prompt | llm`
    },
    {
      id: "answer",
      step: "07",
      icon: "sparkles",
      title: "Answer & Action",
      heading: "7. Grounded Answer & Tool Action",
      desc: "Deliver verified responses with inline reference links or trigger autonomous downstream API workflows, tickets, and automated reports.",
      bullets: [
        "Streaming Markdown response with source badges",
        "Direct action dispatching (Trigger webhooks, create tickets)",
        "Full conversation audit trail & user feedback collection"
      ],
      code: `# Stream Response with Citations
response = rag_chain.invoke({
    "context": "\\n".join([d.page_content for d in relevant_docs]),
    "question": "Explain Nconix deployment process"
})
print(f"Verified Answer: {response.content}")`
    }
  ],

  // Projects Showcase
  projects: [
    {
      id: "ai-doc-assistant",
      title: "AI Document Assistant & Enterprise Knowledge Engine",
      category: "genai",
      categoryLabel: "Generative AI / RAG",
      desc: "An intelligent document question-answering system that allows users to upload multi-gigabyte corporate documents and query in natural language with source citations.",
      techs: ["Python", "LangChain", "LLM", "FAISS", "Django", "FastAPI"],
      metrics: "99.4% Accuracy • Sub-1s Retrieval",
      features: ["Multi-document cross-comparison", "Automatic summarization", "Enterprise role-based access control"]
    },
    {
      id: "isl-cv-system",
      title: "Indian Sign Language AI Vision Recognition System",
      category: "cv",
      categoryLabel: "AI / Computer Vision",
      desc: "A computer-vision-based system for real-time processing and translation of Indian Sign Language gestures using live webcam feeds and landmark neural networks.",
      techs: ["Python", "OpenCV", "MediaPipe", "TensorFlow", "PyTorch"],
      metrics: "60 FPS Real-time • 96.8% Gesture Match",
      features: ["33-point hand landmark tracking", "Continuous sentence construction", "Audio speech synthesis output"]
    },
    {
      id: "ccna-lab-platform",
      title: "Interactive Networking Lab & Training Simulator",
      category: "networking",
      categoryLabel: "Education / Networking",
      desc: "A hands-on cloud networking laboratory supporting Cisco Packet Tracer integrations, subnetting calculators, and real-time router/switch configuration testing.",
      techs: ["CCNA", "Cisco Packet Tracer", "Python Netmiko", "Django", "Docker"],
      metrics: "1,500+ Active Labs • Live Packet Inspections",
      features: ["Browser-based CLI terminal simulator", "Automated lab grading", "OSI & Subnetting interactive sandboxes"]
    },
    {
      id: "n8n-workflow-automation",
      title: "Enterprise AI Agent & Workflow Automation Platform",
      category: "automation",
      categoryLabel: "Automation / AI Agents",
      desc: "Self-healing enterprise automation orchestrator integrating n8n, CRM endpoints, Slack bots, and LLM reasoning agents for automated invoice and lead triage.",
      techs: ["n8n", "AI Agents", "REST APIs", "Python", "PostgreSQL", "Redis"],
      metrics: "85% Manual Work Reduction • 24/7 SLA",
      features: ["Multi-agent tool routing", "Automated anomaly alerts", "Zero-code visual flow editor"]
    },
    {
      id: "fintech-microservices",
      title: "Cloud-Native Django & FastAPI Core Banking Backend",
      category: "software",
      categoryLabel: "Software Development",
      desc: "High-concurrency microservices platform handling secure transaction routing, KYC verification, distributed rate limiting, and real-time webhook broadcasts.",
      techs: ["Django REST", "FastAPI", "PostgreSQL", "Celery", "Docker", "AWS"],
      metrics: "12,000 req/sec • 99.99% Uptime",
      features: ["PCI-DSS compliant cryptography", "Idempotent payment pipelines", "Distributed event bus with RabbitMQ"]
    },
    {
      id: "gesture-telehealth-cam",
      title: "Smart Healthcare Video Diagnostics & Posture Analyzer",
      category: "cv",
      categoryLabel: "Computer Vision / HealthTech",
      desc: "Real-time orthopedic physical therapy rehabilitation monitor analyzing patient joint angles, repetition count, and spine alignment via edge AI models.",
      techs: ["Python", "YOLOv8", "OpenCV", "FastAPI", "WebRTC"],
      metrics: "Edge Inference • Real-time Joint Angle Calc",
      features: ["Skeletal landmark tracking", "Automated PDF recovery reports", "HIPAA-compliant video streaming"]
    }
  ],

  // Academy Courses
  courses: [
    {
      id: "course-genai",
      title: "Generative AI with Python & Autonomous Agents",
      track: "ai",
      trackLabel: "AI & Data Science",
      level: "Intermediate - Advanced",
      duration: "12 Weeks (Live Projects)",
      mode: "Live Interactive + Lab Access",
      instructor: "Nconix AI Research Team",
      badge: "Bestseller",
      description: "Master modern AI development from fundamentals of Transformers and LLMs to building production RAG pipelines, fine-tuning, and multi-agent systems.",
      modules: [
        "1. Foundations of Python for AI & Vector Math",
        "2. Machine Learning Core: Scikit-Learn & Feature Engineering",
        "3. Deep Learning & Neural Nets with PyTorch",
        "4. Transformer Architecture & Attention Mechanisms",
        "5. Large Language Models (LLMs) & Prompt Engineering",
        "6. Dense Embeddings & Tokenization Strategies",
        "7. Vector Databases (FAISS, Qdrant, Pinecone)",
        "8. Advanced Retrieval-Augmented Generation (RAG)",
        "9. Multi-Step AI Agents & Function/Tool Calling",
        "10. LangChain & LangGraph Enterprise Workflows",
        "11. Model Evaluation, Guardrails & Deployment",
        "12. Capstone Project: Enterprise RAG Knowledge Hub"
      ],
      projects: ["Enterprise Document Copilot", "Autonomous SQL Agent", "Voice AI Assistant"]
    },
    {
      id: "course-python-fullstack",
      title: "Python, Django & Modern Web Engineering",
      track: "programming",
      trackLabel: "Programming & Dev",
      level: "Beginner to Professional",
      duration: "10 Weeks",
      mode: "Live Interactive + Portfolio",
      instructor: "Nconix Engineering Leads",
      badge: "High Demand",
      description: "Build robust, scalable web applications with Python, Django, REST APIs, PostgreSQL, authentication, and Docker deployment.",
      modules: [
        "1. Advanced Python 3 Syntax & OOP Patterns",
        "2. Data Structures, Algorithms & Problem Solving",
        "3. Django Architecture (MVT, ORM, Migrations)",
        "4. Django REST Framework & API Security",
        "5. Relational Databases & SQL Optimization",
        "6. JWT Authentication, Sessions & RBAC",
        "7. Asynchronous Tasks with Celery & Redis",
        "8. Frontend Integration (Vanilla JS & Modern UI)",
        "9. Docker Containerization & CI/CD Pipelines",
        "10. Capstone: Complete Multi-tenant SaaS Platform"
      ],
      projects: ["Multi-Vendor Marketplace", "RESTful SaaS API Hub", "Microservices Dashboard"]
    },
    {
      id: "course-ccna-networking",
      title: "CCNA & Enterprise Networking Mastery",
      track: "networking",
      trackLabel: "Networking & Security",
      level: "All Levels",
      duration: "8 Weeks",
      mode: "Live Labs + Packet Tracer",
      instructor: "Certified Cisco Instructor",
      badge: "Industry Certified",
      description: "Hands-on networking training covering OSI, TCP/IP, IP Subnetting, Routing protocols (OSPF, BGP), Switching, VLANs, and Network Automation with Python Netmiko.",
      modules: [
        "1. Network Fundamentals & OSI 7-Layer Deep Dive",
        "2. IPv4 & IPv6 Addressing, VLSM & Subnetting Mastery",
        "3. Ethernet Switching, VLANs & Trunking (802.1Q)",
        "4. Spanning Tree Protocol (STP & RSTP)",
        "5. IP Routing Protocols: OSPFv2, OSPFv3 & Static",
        "6. Access Control Lists (ACLs) & Network Security",
        "7. NAT, PAT, DHCP, DNS & NTP Configuration",
        "8. Network Automation with Python & Netmiko",
        "9. Real-World Cisco Packet Tracer Topology Labs",
        "10. Capstone: Enterprise Multi-Branch Network Design"
      ],
      projects: ["Multi-Branch Enterprise Topology", "Automated Python Switch Configurator", "Secure Firewall & VPN Tunnel"]
    },
    {
      id: "course-cv-deep-learning",
      title: "Computer Vision & Edge AI with OpenCV & PyTorch",
      track: "ai",
      trackLabel: "AI & Data Science",
      level: "Intermediate",
      duration: "8 Weeks",
      mode: "Project-Based Cohort",
      instructor: "Computer Vision Specialists",
      badge: "Specialized",
      description: "Build cutting-edge visual AI models for object detection, segmentation, gesture recognition, facial analysis, and edge deployment with OpenCV and YOLOv8.",
      modules: [
        "1. Image Processing Fundamentals with OpenCV",
        "2. Convolutions, Filters & Spatial Transforms",
        "3. Convolutional Neural Networks (CNNs) in PyTorch",
        "4. Transfer Learning (ResNet, EfficientNet)",
        "5. Real-Time Object Detection with YOLOv8",
        "6. Landmark Estimation with Google MediaPipe",
        "7. Gesture & Sign Language Recognition Systems",
        "8. Edge Deployment with TensorRT & ONNX"
      ],
      projects: ["Real-Time Sign Language Translator", "Smart Surveillance Anomaly Tracker", "Face Mask & Biometrics Guard"]
    }
  ],

  // Live Classes
  liveClasses: [
    {
      id: "live-1",
      course: "Generative AI with Python: Building Production RAG",
      instructor: "A. Sharma (Nconix AI Lead)",
      date: "Tomorrow, 7:00 PM IST",
      countdownHours: 18,
      duration: "2.5 Hours",
      status: "Registration Open",
      roomLink: "meet.google.com/ncx-genai-live",
      seatsLeft: 8
    },
    {
      id: "live-2",
      course: "CCNA Practical Labs: Complex Subnetting & OSPF",
      instructor: "R. Patel (CCNA / CCNP Certified)",
      date: "Thursday, 6:30 PM IST",
      countdownHours: 42,
      duration: "2.0 Hours",
      status: "Registration Open",
      roomLink: "zoom.us/j/88920194821",
      seatsLeft: 12
    },
    {
      id: "live-3",
      course: "Django REST Framework: Production Token Auth & Celery",
      instructor: "V. Nair (Principal Architect)",
      date: "Saturday, 11:00 AM IST",
      countdownHours: 86,
      duration: "3.0 Hours",
      status: "Filling Fast",
      roomLink: "meet.google.com/ncx-django-master",
      seatsLeft: 4
    }
  ],

  // Client Case Studies
  caseStudies: [
    {
      client: "MediCore Global Healthcare",
      industry: "HealthTech & Diagnostics",
      problem: "Doctors spent 3+ hours daily sifting through unstructured pathology reports and patient medical histories manually.",
      solution: "Nconix engineered a HIPAA-compliant Private RAG Assistant with medical entity recognition and zero-data-retention security.",
      outcome: "78% reduction in chart lookup time and instant diagnosis synthesis for 120+ clinical staff."
    },
    {
      client: "Apex Logistics & Freight",
      industry: "Supply Chain & Transport",
      problem: "Disjointed dispatch communication and manual quote processing led to high billing latency and delayed route planning.",
      solution: "Built a customized Django + FastAPI enterprise core connected with n8n automated route optimization webhooks.",
      outcome: "4x increase in quotation velocity and 99.98% platform uptime across 18 regional hubs."
    },
    {
      client: "SkillBridge Educational Network",
      industry: "EdTech & University Labs",
      problem: "Inability to offer 2,000+ computer science students realistic cloud networking hardware for hands-on packet inspection.",
      solution: "Deployed Nconix Cloud Networking Simulator with browser-accessible virtual routers and automated lab evaluation.",
      outcome: "92% course completion rate and immediate employment for 450+ certified students."
    }
  ],

  // Blog / Knowledge Hub
  blogs: [
    {
      id: "blog-1",
      title: "RAG vs. Fine-Tuning: When to Use Which in Production AI?",
      category: "AI & LLMs",
      readTime: "6 min read",
      date: "August 2026",
      desc: "A pragmatic architectural guide for enterprise teams choosing between retrieval augmentation and parameter updates.",
      tags: ["RAG", "LLM", "Fine-Tuning", "Vector DB"]
    },
    {
      id: "blog-2",
      title: "Mastering Subnetting in 15 Minutes: The CCNA Cheat Sheet",
      category: "Networking",
      readTime: "8 min read",
      date: "August 2026",
      desc: "Step-by-step breakdown of VLSM, CIDR notation, subnet masks, and fast calculation tricks for Cisco exams.",
      tags: ["CCNA", "Subnetting", "TCP/IP", "Cisco"]
    },
    {
      id: "blog-3",
      title: "Architecting Multi-Agent AI Systems with LangGraph & Python",
      category: "AI Agents",
      readTime: "7 min read",
      date: "August 2026",
      desc: "How to design state machines for autonomous agents with tool-calling, cycle loops, human-in-the-loop, and memory.",
      tags: ["LangGraph", "AI Agents", "Python", "Autonomous"]
    },
    {
      id: "blog-4",
      title: "Django REST Framework Best Practices for Scalable SaaS",
      category: "Programming",
      readTime: "5 min read",
      date: "August 2026",
      desc: "Query optimization with select_related, custom permissions, throttling strategies, and Redis caching.",
      tags: ["Django", "Python", "REST API", "PostgreSQL"]
    }
  ],

  // Testimonials
  testimonials: [
    {
      name: "Dr. Alistair Vance",
      role: "CTO, MediCore Tech",
      category: "client",
      projectTag: "Enterprise RAG",
      metric: "6-Week Delivery",
      date: "August 2026",
      rating: 5,
      avatar: "AV",
      text: "Nconix delivered our generative AI knowledge retrieval platform in 6 weeks. The precision of their RAG pipeline and attention to security exceeded all our benchmark standards."
    },
    {
      name: "Sarah Jenkins",
      role: "Founder & CEO, ScaleFlow AI",
      category: "client",
      projectTag: "Multi-Tenant SaaS",
      metric: "45-Day Launch",
      date: "August 2026",
      rating: 5,
      avatar: "SJ",
      text: "Partnering with Nconix allowed us to take our multi-tenant SaaS from architectural napkin sketches to production launch on AWS in under 45 days. Absolutely remarkable engineering quality."
    },
    {
      name: "Mark Reynolds",
      role: "VP Operations, Apex Freight",
      category: "client",
      projectTag: "Workflow Automation",
      metric: "99.99% Uptime",
      date: "July 2026",
      rating: 5,
      avatar: "MR",
      text: "Their software development and workflow automation team revamped our entire dispatch system. Professional, fast, and technically world-class with 99.99% uptime."
    },
    {
      name: "Pooja Deshmukh",
      role: "Senior AI Engineer, TechCorp",
      category: "student",
      projectTag: "LangChain & Agents",
      metric: "AI Engineer Role",
      date: "August 2026",
      rating: 5,
      avatar: "PD",
      text: "The Generative AI & LangChain course at Nconix Academy was transformative. The hands-on project building gave me the exact portfolio that landed my current AI engineer role."
    },
    {
      name: "Marcus Thorne",
      role: "Director of Product, FinFlow",
      category: "client",
      projectTag: "Financial OCR",
      metric: "Sub-Second OCR",
      date: "July 2026",
      rating: 5,
      avatar: "MT",
      text: "The automated invoice OCR and reconciliation engine designed by Nconix slashed our processing latency from days down to seconds. An indispensable engineering partner."
    },
    {
      name: "Elena Rostova",
      role: "Head of Engineering, OmniRetail",
      category: "client",
      projectTag: "Custom ERP Engine",
      metric: "Zero Downtime",
      date: "June 2026",
      rating: 5,
      avatar: "ER",
      text: "Their custom ERP and real-time inventory engine handled our peak Black Friday load effortlessly without a single dropped transaction or memory leak."
    },
    {
      name: "Rohit Sundaram",
      role: "Network Architect, Cisco Partner",
      category: "student",
      projectTag: "Network Automation",
      metric: "CCNA Certified",
      date: "July 2026",
      rating: 5,
      avatar: "RS",
      text: "The CCNA and Python network automation labs were top tier. Practicing live on real Packet Tracer scenarios made our enterprise migrations completely frictionless."
    },
    {
      name: "David Chen",
      role: "Co-Founder, VisionEdge Labs",
      category: "client",
      projectTag: "Computer Vision",
      metric: "<18ms Latency",
      date: "August 2026",
      rating: 5,
      avatar: "DC",
      text: "Nconix optimized our edge computer vision gesture models to run under 18ms on low-power IoT hardware. Exceptional mastery over PyTorch, ONNX, and OpenCV."
    }
  ]
};
