export const tools = {
  // Main UI
  title: "AI Tools",
  subtitle: "Complete suite of AI tools for your projects",
  welcomeTitle: "Welcome to Beit Al Reef AI Tools",
  welcomeSubtitle: "Select a tool to get started",
  back: "Back",
  backToSmartTools: "Back to Smart Tools",
  backToConstructionTools: "Back to List",
  startTool: "Run Analysis", 
  toolWorkArea: "Analysis Results",
  waitingForOutput: "Analysis results will appear here",
  comingSoon: "This tool will be enabled soon",
  poweredBy: "Powered by Weyaak Intelligent System – AI at your fingertips",
  
  aboutTool: "About Tool",
  
  proFeatures: "AI Professional Features",
  proDescription: "Get unlimited access to all advanced AI construction and design tools.",
  upgradeNow: "Upgrade Now",
  tools: "Tools Available",

  // General App Constants
  country: "United Arab Emirates",
  currency: "AED",
  regions: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"],

  // Tabs
  tabs: {
    overview: "Overview",
    tool: "Tool",
    history: "History"
  },

  // Common Titles for Overview Section
  overviewTitles: {
    description: "Tool Description",
    keyFeatures: "Key Features",
    howToUse: "How to Use",
    price: "Analysis Price",
    startNow: "Start Now",
    coins: "Coins"
  },

  // Tool Actions
  actions: {
    preview: "Preview Before Saving",
    confirmSave: "Confirm Save",
    edit: "Back to Edit",
    runAnalysis: "Run Analysis",
    downloadPdf: "Download PDF",
    downloadExcel: "Download Excel",
    saveFiles: "Save to My Files",
    share: "Share",
    copySummary: "Copy Summary",
    attachProject: "Attach to Project",
    view: "View",
    download: "Download",
    delete: "Delete Process",
    selectOption: "Select",
    processing: "Processing..."
  },

  // History Section
  history: {
    noHistory: "No previous runs for this tool",
    viewDetails: "View Details"
  },

  // Payment & Projects
  payment: {
    insufficientBalance: "Insufficient balance... Recharge now",
    rechargeNow: "Recharge Now",
    confirmDeduction: "{amount} coins will be deducted from your balance. Do you want to proceed?"
  },
  projects: {
    linkToExisting: "Link to existing project",
    createNew: "Create new project",
    savedSuccess: "Saved successfully",
    sharedSuccess: "Shared successfully",
    copiedSuccess: "Summary copied"
  },

  categories: {
    title: "Featured Categories",
    construction: {
      title: "AI Construction Tools",
      description: "Advanced tools for accurate calculations and quality control",
    },
    design: {
      title: "Design Tools (2D/3D)",
      description: "Transform ideas into visual reality and professional designs",
    },
    legal: {
      title: "Legal Tools",
      description: "Smart generation and review of contracts and quotations",
    },
    financial: {
      title: "Financial Tools",
      description: "Accurate management of budgets, payments, and profits",
    },
    project: {
      title: "Project Tools",
      description: "Track progress, tasks, and workforce in one place",
    },
    marketing: {
      title: "Marketing & Automation",
      description: "Content creation and campaign management tools",
    },
  },

  items: {
    // --- Construction Tools ---
    smartMaterialsCalculator: { 
      name: "Smart Materials Calculator", 
      desc: "Accurate calculation of quantities and materials required based on engineering standards",
      overview: {
        description: "The Smart Materials Calculator is the leading tool in the UAE market for precise construction quantity estimation. It relies on advanced engineering algorithms to analyze inputs and calculate actual required quantities of (steel, concrete, blocks, tiles) while considering the allowable wastage ratio in engineering codes.",
        features: ["Calculate quantities with 98% accuracy.", "Cost savings by reducing waste.", "Suggest best 3 suppliers.", "Instant cost estimation."],
        usage: "For skeleton and finishing works calculations."
      },
      inputs: { materialType: "Material Type", workQuantity: "Quantity", thickness: "Thickness (mm)", qualityLevel: "Quality", uploadPlan: "Upload Plan" },
      outputs: { requiredQty: "Net Quantity", reserveQty: "Wastage (5%)", approxCost: "Estimated Cost", bestSuppliers: "Suppliers" }
    },
    smartAreaCalculator: {
      name: "Smart Area Calculator",
      desc: "Accurate measurement of areas and volumes via plans",
      overview: {
        description: "Goodbye to manual measurements. Upload your plan image, and AI will automatically calculate room boundaries and areas.",
        features: ["Convert plan images to digital areas.", "Calculate floor and wall areas.", "Metric support."],
        usage: "Ideal for interior designers and quantity surveyors."
      },
      inputs: { length: "Length", width: "Width", height: "Height", uploadPlan: "Upload Plan", roomType: "Room Type", manualDims: "Manual Dims", tolerance: "Tolerance" },
      outputs: { area: "Area (m²)", volume: "Volume (m³)", approxCost: "Finishing Cost", calcArea: "Calculated Area", comparison: "Match Ratio", recommendations: "Recommendations" }
    },
    aiCostEstimator: {
      name: "AI Cost Estimator",
      desc: "Estimate project budget based on location and specs",
      overview: {
        description: "Your smart financial advisor. Analyzes UAE market prices to give you a realistic budget range for your project.",
        features: ["Location-based estimation.", "Finishing cost analysis.", "Regular price updates."],
        usage: "For budgeting before design starts."
      },
      inputs: { location: "Location", workType: "Work Type", projectArea: "Area", finishingLevel: "Finishing", uploadFiles: "Files" },
      outputs: { minCost: "Min Cost", maxCost: "Max Cost", avgCost: "Average", costAnalysis: "Analysis" }
    },
    floorPlanAnalyzer: {
      name: "Floor Plan Analyzer",
      desc: "Detect design errors and conflicts",
      overview: {
        description: "Scan your architectural plan to identify common design errors like door conflicts and narrow corridors.",
        features: ["Conflict detection.", "Traffic flow analysis.", "Ventilation suggestions."],
        usage: "Reviewing preliminary plans."
      },
      inputs: { uploadPlan: "Upload Plan", projectType: "Project Type", analysisPoints: "Analysis Points", analysisType: "Analysis Type" },
      outputs: { errors: "Errors", suggestions: "Suggestions", recommendations: "Recommendations", conflicts: "Conflicts" }
    },
    constructionQualityChecker: {
      name: "Quality Checker",
      desc: "Analyze site images for defects",
      overview: {
        description: "Take photos of the site, and AI will detect execution defects like honeycombing and cracks.",
        features: ["Crack detection.", "Moisture identification.", "Plaster assessment."],
        usage: "For owners and site engineers."
      },
      inputs: { checkType: "Check Type", uploadImages: "Site Images", readings: "Readings", materials: "Materials" },
      outputs: { qualityRating: "Rating", complianceRatio: "Compliance", notes: "Notes", fixRecommendations: "Fixes" }
    },
    mepInspector: {
      name: "MEP Inspector",
      desc: "Inspect electrical, plumbing, and HVAC",
      overview: {
        description: "Analyze installation photos before covering to ensure safety and code compliance.",
        features: ["Safety distance check.", "Violation detection.", "HVAC analysis."],
        usage: "Before plastering and false ceilings."
      },
      inputs: { uploadMedia: "Image/Video", type: "Type" },
      outputs: { faults: "Faults", risks: "Risks", recommendations: "Recommendations" }
    },
    boqGenerator: {
      name: "BOQ Generator",
      desc: "Auto-generate detailed Bill of Quantities",
      overview: {
        description: "Upload plans and the system will generate a professional BOQ ready for pricing.",
        features: ["Standard BOQ generation.", "Excel/PDF export.", "Estimated pricing."],
        usage: "For tendering and pricing."
      },
      inputs: { projectName: "Project", projectArea: "Area", usageType: "Usage", uploadPlans: "Plans", stage: "Stage", quality: "Quality" },
      outputs: { fullBOQ: "BOQ Table", downloadPDF: "Download", detailedBoq: "Details", qtyPrices: "Prices", notes: "Notes" }
    },
    contractAnalyzer: {
      name: "Contract Analyzer",
      desc: "Detect legal loopholes in contracts",
      overview: {
        description: "Reads construction contracts and analyzes clauses to find unfair terms and risks.",
        features: ["Loophole detection.", "Payment analysis.", "Wording suggestions."],
        usage: "Before signing contracts."
      },
      inputs: { contractText: "Contract Text" },
      outputs: { clauses: "Clauses", errors: "Loopholes", risks: "Risks", recommendations: "Recommendations" }
    },

    // --- Design Tools ---
    roomDesigner2d: { 
      name: "Room Designer 2D", 
      desc: "Quick 2D space planning and furniture layout",
      overview: {
        description: "A fast and easy tool for 2D room planning. Enter dimensions, add doors/windows, and drag furniture from the smart library to see the best layout.",
        features: ["Huge furniture library.", "Smart auto-layout.", "Export JPG/PDF.", "Accurate measurements."],
        usage: "For preliminary planning and furniture arrangement."
      },
      inputs: { dimensions: "Dimensions", style: "Style", furnitureList: "Furniture List", uploadSketch: "Upload Sketch" },
      outputs: { plan2d: "2D Plan", furnitureList: "Furniture List", spaceUsage: "Space Usage" }
    },
    imageTo3dConverter: { 
      name: "2D to 3D Converter", 
      desc: "Convert 2D plans and interior images into interactive 3D previews.",
      overview: {
        description: "Revolutionary tech that turns any 2D image (plan, room photo, sketch) into an interactive 3D model you can rotate and explore from all angles.",
        features: ["Instant AI conversion.", "Supports plans and photos.", "Realistic lighting and shadows.", "Export 3D files (OBJ/GLB)."],
        usage: "For designers and clients wanting clear visualization."
      },
      inputs: { uploadImage: "Upload 2D Image", depthLevel: "Depth Level", textureQuality: "Texture Quality" },
      outputs: { model3d: "3D Model", interactionLink: "Interaction Link", fileDownload: "File Download" }
    },
    roomDesigner3d: { 
      name: "Room Designer 3D", 
      desc: "Transform rooms into realistic 3D models",
      overview: {
        description: "Turn your plans or room photos into realistic 3D models. Experiment with materials, colors, and lighting interactively.",
        features: ["Realistic rendering.", "Change floors/walls.", "Extensive material library.", "Virtual tour."],
        usage: "For realistic interior visualization."
      },
      inputs: { uploadImage: "Room Image", style: "Style (Modern/Classic)", colorScheme: "Color Scheme" },
      outputs: { render3d: "3D Render", panoramicView: "Panoramic View", materialsUsed: "Materials Used" }
    },
    furniturePlanner: { 
      name: "Smart Furniture Planner", 
      desc: "Suggest optimal furniture layouts",
      overview: {
        description: "Struggling with furniture arrangement? This tool suggests the best layouts based on traffic flow, function, and aesthetics.",
        features: ["Traffic flow consideration.", "Visual balance.", "Small space solutions."],
        usage: "When furnishing a new home or rearranging."
      },
      inputs: { roomShape: "Room Shape", pieces: "Furniture Pieces", focalPoint: "Focal Point" },
      outputs: { layouts: "Proposed Layouts", tips: "Arrangement Tips" }
    },
    colorPaletteGenerator: { 
      name: "Color Palette Generator", 
      desc: "Harmonious color coordination",
      overview: {
        description: "Get inspired by an image you love, or let AI suggest coordinated color palettes for walls, furniture, and curtains.",
        features: ["Extract colors from images.", "60-30-10 rule.", "Paint codes (Jotun/Benjamin Moore)."],
        usage: "Choosing paint and decor colors."
      },
      inputs: { baseColor: "Base Color", mood: "Mood", roomType: "Room Type" },
      outputs: { palette: "Color Palette", paints: "Paint Codes", combinations: "Examples" }
    },
    styleDetection: { 
      name: "Style Detector", 
      desc: "Identify architectural and decor styles",
      overview: {
        description: "Upload any photo and the system will analyze it to tell you the style name (Boho, Industrial, Neoclassic...) with application tips.",
        features: ["Accurate image analysis.", "Style definition.", "Shopping suggestions."],
        usage: "To identify and apply your personal taste."
      },
      inputs: { uploadImage: "Upload Image" },
      outputs: { styleName: "Style Name", characteristics: "Characteristics", shoppingTags: "Shopping Ideas" }
    },
    materialsVisualizer: { 
      name: "Materials Visualizer", 
      desc: "Try floors and paints on your photos",
      overview: {
        description: "Take a photo of your room and change the floor or wall color with one click. See the result instantly before buying.",
        features: ["Augmented reality.", "Ceramic & Parquet library.", "Change wall colors."],
        usage: "Before buying finishing materials."
      },
      inputs: { uploadRoom: "Room Photo", materialCategory: "Category" },
      outputs: { visualizedImage: "Modified Image", materialInfo: "Material Info" }
    },
    facadeDesigner: { 
      name: "Facade Designer", 
      desc: "Renovate exterior building facades",
      overview: {
        description: "Give your home a new look. Upload your current facade photo and get design proposals to update it with modern materials.",
        features: ["Renovate old facades.", "Add exterior lighting.", "Try stone and cladding."],
        usage: "For renovating villas and old buildings."
      },
      inputs: { uploadFacade: "Facade Photo", stylePreference: "Style Preference" },
      outputs: { designs: "Proposed Designs", materialList: "Exterior Materials" }
    },
    landscapeDesigner: { 
      name: "Landscape Designer", 
      desc: "Design outdoor spaces",
      overview: {
        description: "Design your dream garden. The system distributes plants, pathways, and seating areas based on your yard size and climate.",
        features: ["Climate-appropriate plants.", "Lighting and irrigation.", "Pool design."],
        usage: "For landscaping yards and home gardens."
      },
      inputs: { areaDimensions: "Dimensions", preferences: "Preferences" },
      outputs: { plan: "Garden Plan", plants: "Plant List" }
    },
    vrPreview: { 
      name: "VR Preview", 
      desc: "Walk through your design",
      overview: {
        description: "Use VR glasses or your phone to walk through your design as if you were living in it.",
        features: ["360 degree tour.", "VR compatible.", "True scale feeling."],
        usage: "For final review before approval."
      },
      inputs: { uploadModel: "Upload 3D Model" },
      outputs: { vrLink: "Tour Link", qrCode: "QR Code" }
    },

    // --- Legal Tools ---
    contractTemplates: { 
      name: "Contract Library", 
      desc: "Approved legal contract templates",
      overview: {
        description: "A comprehensive library containing hundreds of carefully drafted engineering and construction contract templates to protect all parties.",
        features: ["Skeleton contracts.", "Finishing contracts.", "Supervision contracts.", "Solid legal wording."],
        usage: "For a quick start with a guaranteed contract."
      },
      inputs: { category: "Category", partyInfo: "Party Info" },
      outputs: { doc: "Contract File", tips: "Legal Tips" }
    },
    aiContractGenerator: { 
      name: "AI Contract Generator", 
      desc: "Write custom contracts",
      overview: {
        description: "Answer a few questions and AI will draft a professional contract tailored to your project, covering all technical and legal aspects.",
        features: ["Fully custom clauses.", "Add special conditions.", "Bilingual support.", "Auto-review."],
        usage: "For projects with special requirements."
      },
      inputs: { contractType: "Contract Type", scope: "Scope", paymentTerms: "Payment Terms" },
      outputs: { contract: "Generated Contract", summary: "Summary" }
    },
    quotationGenerator: { 
      name: "Quotation Maker", 
      desc: "Create professional quotations",
      overview: {
        description: "Create detailed and attractive quotations for your clients in minutes. Calculate costs, add markup, and issue with your logo.",
        features: ["Auto calculation.", "Professional designs.", "Item database."],
        usage: "For contractors and suppliers."
      },
      inputs: { clientName: "Client", items: "Items", markup: "Markup" },
      outputs: { quotationPdf: "Quotation PDF", validDate: "Valid Date" }
    },

    // --- Financial Tools ---
    invoiceManager: { 
      name: "Invoice Manager", 
      desc: "Issue and manage tax invoices",
      overview: {
        description: "Complete invoicing system compliant with tax regulations. Issue invoices, track status, and send via WhatsApp/Email.",
        features: ["Tax invoices.", "QR Code.", "Payment tracking.", "Periodic reports."],
        usage: "For sales and collection management."
      },
      inputs: { invoiceType: "Type", items: "Items", client: "Client" },
      outputs: { invoice: "Invoice", taxAmount: "Tax Amount" }
    },
    accountingBook: { 
      name: "Accounting Book", 
      desc: "Daily expense and revenue log",
      overview: {
        description: "Track every dirham in your project. Record expenses (material, labor, petty cash) and know your financial status instantly.",
        features: ["Expense categorization.", "Financial dashboard.", "Budget alerts."],
        usage: "To control project budget and prevent waste."
      },
      inputs: { type: "Expense/Income", amount: "Amount", category: "Category", notes: "Notes" },
      outputs: { balance: "Current Balance", report: "Financial Report" }
    },
    paymentTracker: { 
      name: "Payment Tracker", 
      desc: "Schedule and track payments",
      overview: {
        description: "Never miss a payment. Organize payment schedules for contractors or suppliers and get reminders before due dates.",
        features: ["Payment scheduling.", "Auto reminders.", "Link to progress."],
        usage: "For cash flow management."
      },
      inputs: { project: "Project", milestones: "Milestones", dates: "Dates" },
      outputs: { schedule: "Schedule", alerts: "Alerts" }
    },
    projectPricingTool: { 
      name: "Pricing Tool", 
      desc: "Calculate project cost and profit",
      overview: {
        description: "How to price your services? This tool helps you calculate operational costs and profit margins to offer competitive prices.",
        features: ["Direct/Indirect costs.", "Competitor analysis.", "Optimal price suggestion."],
        usage: "For tendering and service pricing."
      },
      inputs: { costs: "Costs", desiredMargin: "Target Margin", marketRate: "Market Rate" },
      outputs: { suggestedPrice: "Suggested Price", breakEven: "Break-even Point" }
    },
    profitAnalyzer: { 
      name: "Profit Analyzer", 
      desc: "Smart profit performance reports",
      overview: {
        description: "Know which projects are profitable and where you lose money. Visual analytics help you make sound financial decisions.",
        features: ["Margin analysis.", "Project comparison.", "Growth forecast."],
        usage: "For strategic planning."
      },
      inputs: { period: "Period", projects: "Projects" },
      outputs: { roi: "ROI", netProfit: "Net Profit" }
    },

    // --- Project Tools ---
    projectDashboard: { 
      name: "Project Dashboard", 
      desc: "Central view of all projects",
      overview: {
        description: "One place to see everything. Track progress, financial status, and pending tasks for all your projects on one screen.",
        features: ["Status summary.", "Risk alerts.", "KPIs."],
        usage: "For managers and owners."
      },
      inputs: { filter: "Filter" },
      outputs: { dashboardView: "Dashboard", keyMetrics: "Key Metrics" }
    },
    progressReports: { 
      name: "Progress Reports", 
      desc: "Create daily/weekly reports",
      overview: {
        description: "Create professional work progress reports with photos and percentages in seconds, and send them to owners.",
        features: ["Ready templates.", "Photo insertion.", "Auto progress calculation."],
        usage: "To document work and keep everyone informed."
      },
      inputs: { date: "Date", completedWork: "Completed Work", photos: "Photos" },
      outputs: { pdfReport: "Report PDF", shareLink: "Share Link" }
    },
    workforceTracker: { 
      name: "Workforce Tracker", 
      desc: "Labor attendance and productivity",
      overview: {
        description: "Record worker attendance, track productivity, and calculate overtime accurately to control labor costs.",
        features: ["Attendance log.", "Performance rating.", "Payroll calculation."],
        usage: "For site HR management."
      },
      inputs: { site: "Site", workers: "Workers", hours: "Hours" },
      outputs: { timesheet: "Timesheet", cost: "Daily Cost" }
    },
    tasksManagement: { 
      name: "Task Manager", 
      desc: "Assign and track tasks",
      overview: {
        description: "Don't let things slip. Assign tasks to engineers or supervisors, set deadlines, and track execution status.",
        features: ["To-Do lists.", "Assign responsibility.", "Delay alerts."],
        usage: "For daily team organization."
      },
      inputs: { task: "Task", assignee: "Assignee", deadline: "Deadline" },
      outputs: { status: "Status", list: "Task List" }
    },
    projectDocuments: { 
      name: "Project Archive", 
      desc: "Organize project documents",
      overview: {
        description: "Your secure digital vault. Keep all plans, contracts, licenses, and invoices organized and accessible anytime.",
        features: ["Auto categorization.", "Fast search.", "Secure sharing."],
        usage: "For archiving important docs."
      },
      inputs: { uploadDoc: "Upload Doc", category: "Category" },
      outputs: { archive: "Archive", link: "File Link" }
    },
    materialTracking: { 
      name: "Material Tracker", 
      desc: "Track inventory and consumption",
      overview: {
        description: "Monitor construction material movement. Record what was supplied and consumed to detect theft or waste.",
        features: ["Supply log.", "Consumption log.", "Stocktaking."],
        usage: "For warehouse and site control."
      },
      inputs: { material: "Material", quantity: "Quantity", action: "Supply/Consume" },
      outputs: { stock: "Current Stock", variance: "Variance" }
    },

    // --- Marketing Tools ---
    postGenerator: { 
      name: "Post Designer", 
      desc: "Design and write social posts",
      overview: {
        description: "Magic tool for real estate marketing. Choose a property photo, and AI will design an attractive post and write a convincing caption.",
        features: ["Ready designs.", "Copywriting.", "Multi-platform format."],
        usage: "For marketers and companies."
      },
      inputs: { image: "Property Image", platform: "Platform", keyPoints: "Key Points" },
      outputs: { designs: "Designs", caption: "Caption", hashtags: "Hashtags" }
    },
    reelsGenerator: { 
      name: "Reels Maker", 
      desc: "Fast short video editing",
      overview: {
        description: "Turn property photos/videos into professional Reels with music and effects to attract views.",
        features: ["Auto editing.", "Music sync.", "Animated text."],
        usage: "For TikTok and Instagram marketing."
      },
      inputs: { media: "Media", style: "Style", music: "Music" },
      outputs: { video: "Final Video", cover: "Cover Image" }
    },
    contentWizard: { 
      name: "Content Wizard", 
      desc: "Generate content ideas and plans",
      overview: {
        description: "Stuck on what to post? Get a monthly content plan and creative ideas to grow your audience.",
        features: ["Monthly calendar.", "Creative ideas.", "Video scripts."],
        usage: "To build a strong digital presence."
      },
      inputs: { niche: "Niche", targetAudience: "Audience" },
      outputs: { plan: "Content Plan", ideas: "Ideas List" }
    },
    whatsappBot: { 
      name: "WhatsApp Bot", 
      desc: "Smart auto-reply",
      overview: {
        description: "Don't miss any client. Set up smart auto-replies that answer queries, send files, and book appointments 24/7.",
        features: ["Quick replies.", "Send catalogs.", "Book appointments."],
        usage: "For customer service and sales."
      },
      inputs: { trigger: "Keyword", response: "Response", attachment: "Attachment" },
      outputs: { botConfig: "Config", testLink: "Test Link" }
    },
    autoPublishing: { 
      name: "Auto Publisher", 
      desc: "Schedule and publish content",
      overview: {
        description: "Save time and schedule next week's posts in one go. The system publishes at optimal times on all platforms.",
        features: ["FB/Insta/Twitter support.", "Interactive calendar.", "Best times."],
        usage: "For social media management."
      },
      inputs: { posts: "Posts", dates: "Dates", accounts: "Accounts" },
      outputs: { schedule: "Schedule", status: "Status" }
    },
    campaignAnalyzer: { 
      name: "Campaign Analyzer", 
      desc: "Measure ad performance",
      overview: {
        description: "Are your ads profitable? Analyze campaign performance, calculate Cost Per Lead and ROI to optimize results.",
        features: ["Cross-platform data.", "ROI calc.", "Optimization tips."],
        usage: "To optimize marketing budget."
      },
      inputs: { platformData: "Data", budget: "Budget", results: "Results" },
      outputs: { report: "Report", optimization: "Steps" }
    },
  }
};

export default tools;
