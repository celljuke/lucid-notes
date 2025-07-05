import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create demo users
  const demoPassword = await bcryptjs.hash("password123", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      password: demoPassword,
    },
  });

  const johnUser = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
      password: demoPassword,
    },
  });

  console.log("✅ Created demo users");

  // Create folders for demo user
  const workFolder = await prisma.folder.create({
    data: {
      name: "Work",
      color: "#4F46E5",
      userId: demoUser.id,
    },
  });

  const personalFolder = await prisma.folder.create({
    data: {
      name: "Personal",
      color: "#10B981",
      userId: demoUser.id,
    },
  });

  const ideasFolder = await prisma.folder.create({
    data: {
      name: "Ideas",
      color: "#F59E0B",
      userId: demoUser.id,
    },
  });

  console.log("✅ Created folders");

  // Create sample notes
  const notes = [
    {
      title: "Project Planning - Q1 2024",
      content: `# Q1 2024 Project Goals

## Key Objectives
- Launch new product feature
- Improve user onboarding flow
- Implement analytics dashboard
- Conduct user interviews

## Timeline
- **Week 1-2**: Research and planning
- **Week 3-6**: Development sprint
- **Week 7-8**: Testing and refinement
- **Week 9-12**: Launch and monitoring

## Resources Needed
- 2 developers
- 1 designer
- User research budget: $5,000

## Success Metrics
- User engagement +25%
- Feature adoption rate >60%
- Customer satisfaction score >4.5/5`,
      tags: ["project", "planning", "q1", "goals"],
      color: "#FFE066",
      isPinned: true,
      folderId: workFolder.id,
      userId: demoUser.id,
    },
    {
      title: "Meeting Notes - Team Standup",
      content: `# Daily Standup - March 15, 2024

## Attendees
- Sarah (PM)
- Mike (Developer)
- Lisa (Designer)
- Alex (QA)

## Yesterday's Progress
- Completed user authentication flow
- Fixed responsive design issues
- Wrote unit tests for API endpoints

## Today's Tasks
- Implement search functionality
- Review design mockups
- Deploy to staging environment

## Blockers
- Waiting for API keys from third-party service
- Need clarification on user permissions model

## Action Items
- [ ] Sarah: Follow up on API keys
- [ ] Mike: Document API endpoints
- [ ] Lisa: Update design system
- [ ] Alex: Create test scenarios`,
      tags: ["meeting", "standup", "team", "notes"],
      color: "#FF8A65",
      folderId: workFolder.id,
      userId: demoUser.id,
    },
    {
      title: "Recipe Collection - Favorites",
      content: `# My Favorite Recipes

## Pasta Carbonara
**Ingredients:**
- 400g spaghetti
- 200g pancetta
- 4 large eggs
- 100g pecorino cheese
- Black pepper
- Salt

**Instructions:**
1. Cook pasta in salted water
2. Crisp pancetta in a pan
3. Whisk eggs with cheese
4. Combine everything off heat
5. Toss until creamy

## Chocolate Chip Cookies
**Ingredients:**
- 2¼ cups flour
- 1 tsp baking soda
- 1 cup butter
- ¾ cup brown sugar
- ¾ cup white sugar
- 2 eggs
- 2 tsp vanilla
- 2 cups chocolate chips

**Instructions:**
1. Mix dry ingredients
2. Cream butter and sugars
3. Add eggs and vanilla
4. Combine wet and dry
5. Fold in chocolate chips
6. Bake at 375°F for 9-11 minutes`,
      tags: ["recipes", "cooking", "food", "favorites"],
      color: "#F06292",
      folderId: personalFolder.id,
      userId: demoUser.id,
    },
    {
      title: "Travel Plans - Japan 2024",
      content: `# Japan Trip Planning

## Itinerary (10 days)

### Tokyo (4 days)
- **Day 1**: Arrival, Shibuya, Harajuku
- **Day 2**: Tsukiji Market, Imperial Palace, Ginza
- **Day 3**: Asakusa, Skytree, Ueno
- **Day 4**: Day trip to Nikko

### Kyoto (3 days)
- **Day 5**: Fushimi Inari, Gion District
- **Day 6**: Kinkaku-ji, Arashiyama Bamboo Grove
- **Day 7**: Nijo Castle, Pontocho Alley

### Osaka (2 days)
- **Day 8**: Osaka Castle, Dotonbori
- **Day 9**: Nara day trip (deer park, Todai-ji)

### Tokyo (1 day)
- **Day 10**: Last-minute shopping, departure

## Budget Estimate
- **Flights**: $800
- **Accommodation**: $1,200
- **Food**: $600
- **Transportation**: $400
- **Activities**: $500
- **Total**: $3,500

## Must-try Foods
- Ramen (various styles)
- Sushi (from Tsukiji)
- Takoyaki (Osaka specialty)
- Kaiseki dinner (traditional)
- Street food in Harajuku`,
      tags: ["travel", "japan", "planning", "vacation"],
      color: "#4FC3F7",
      folderId: personalFolder.id,
      userId: demoUser.id,
    },
    {
      title: "App Ideas - Innovation List",
      content: `# Innovative App Ideas

## 1. Smart Plant Care Assistant
**Concept**: AI-powered plant care app that uses computer vision to diagnose plant health issues and provides personalized care recommendations.

**Features:**
- Photo-based plant identification
- Disease detection and treatment suggestions
- Watering schedule optimization
- Community sharing and tips
- Integration with smart home devices

**Target Market**: Plant enthusiasts, urban gardeners, beginners

## 2. Micro-Learning Language Exchange
**Concept**: 5-minute daily language learning sessions paired with native speakers for real-time practice.

**Features:**
- Quick conversation starters
- Cultural context lessons
- Pronunciation correction AI
- Gamified progress tracking
- Time zone matching for global partners

**Target Market**: Busy professionals, students, travelers

## 3. Sustainable Living Tracker
**Concept**: Track and optimize personal environmental impact with actionable suggestions and community challenges.

**Features:**
- Carbon footprint calculator
- Sustainable product recommendations
- Local eco-friendly business directory
- Community challenges and rewards
- Impact visualization and reports

**Target Market**: Environmentally conscious consumers

## 4. Mood-Based Productivity Assistant
**Concept**: AI assistant that adapts work recommendations based on current mood and energy levels.

**Features:**
- Mood check-ins and analysis
- Task prioritization based on energy
- Break recommendations
- Environment optimization tips
- Integration with calendar and to-do apps

**Target Market**: Remote workers, students, productivity enthusiasts`,
      tags: ["ideas", "apps", "innovation", "startup"],
      color: "#BA68C8",
      isPinned: true,
      folderId: ideasFolder.id,
      userId: demoUser.id,
    },
    {
      title: "Learning Goals - 2024",
      content: `# Learning Goals for 2024

## Technical Skills
- [ ] Master React 18 features (Concurrent rendering, Suspense)
- [ ] Learn TypeScript advanced patterns
- [ ] Get AWS certification
- [ ] Explore AI/ML fundamentals
- [ ] Practice system design

## Soft Skills
- [ ] Improve public speaking
- [ ] Learn Spanish conversational level
- [ ] Develop leadership skills
- [ ] Practice design thinking
- [ ] Build negotiation skills

## Books to Read
- [ ] "System Design Interview" by Alex Xu
- [ ] "Clean Code" by Robert Martin
- [ ] "The Pragmatic Programmer" by Hunt & Thomas
- [ ] "Atomic Habits" by James Clear
- [ ] "Nonviolent Communication" by Marshall Rosenberg

## Courses & Certifications
- [ ] AWS Solutions Architect
- [ ] Google UX Design Certificate
- [ ] Stanford CS229 Machine Learning
- [ ] Coursera Leadership Certificate

## Practice Projects
- [ ] Build a full-stack SaaS application
- [ ] Contribute to open source projects
- [ ] Create a mobile app
- [ ] Design and implement a system architecture
- [ ] Write technical blog posts

## Tracking Progress
- Monthly reviews
- Quarterly goal adjustments
- Annual skills assessment
- Peer feedback sessions`,
      tags: ["learning", "goals", "development", "skills"],
      color: "#66BB6A",
      folderId: personalFolder.id,
      userId: demoUser.id,
    },
    {
      title: "Quick Meeting Notes",
      content: `# Client Call - March 20, 2024

## Key Points
- Budget approved for Phase 2
- Timeline extended by 2 weeks
- New requirements for mobile app
- Need to schedule user testing

## Follow-up Actions
- Send updated proposal
- Schedule design review
- Prepare user testing plan`,
      tags: ["meeting", "client", "quick"],
      color: "#90A4AE",
      folderId: workFolder.id,
      userId: demoUser.id,
    },
    {
      title: "Book Recommendations",
      content: `# Great Books I've Read Recently

## Fiction
- "The Seven Husbands of Evelyn Hugo" - Taylor Jenkins Reid
- "Where the Crawdads Sing" - Delia Owens
- "The Midnight Library" - Matt Haig

## Non-Fiction
- "Sapiens" - Yuval Noah Harari
- "Educated" - Tara Westover
- "The Power of Now" - Eckhart Tolle

## Tech/Business
- "Zero to One" - Peter Thiel
- "The Lean Startup" - Eric Ries
- "Don't Make Me Think" - Steve Krug`,
      tags: ["books", "recommendations", "reading"],
      color: "#26A69A",
      folderId: personalFolder.id,
      userId: demoUser.id,
    },
  ];

  // Create notes
  for (const note of notes) {
    await prisma.note.create({
      data: note,
    });
  }

  console.log("✅ Created sample notes");

  // Create some folders for John
  const johnWorkFolder = await prisma.folder.create({
    data: {
      name: "Projects",
      color: "#6366F1",
      userId: johnUser.id,
    },
  });

  // Create a few notes for John
  const johnNotes = [
    {
      title: "Welcome to Lucid Notes",
      content: `# Welcome to Lucid Notes! 🎉

This is your personal note-taking space where you can:

## Features
- 📝 Create and organize notes
- 📁 Use folders to stay organized
- 🏷️ Add tags for easy searching
- 📌 Pin important notes
- 🎨 Customize colors
- 🤖 Use AI features to enhance your notes

## Getting Started
1. Create your first note
2. Organize with folders
3. Use tags to categorize
4. Try the AI features for title generation and summarization

Happy note-taking! ✨`,
      tags: ["welcome", "getting-started", "help"],
      color: "#FFE066",
      isPinned: true,
      folderId: johnWorkFolder.id,
      userId: johnUser.id,
    },
    {
      title: "AI Feature Testing",
      content: `This is a test note to demonstrate the AI features. The AI can help you generate titles, expand shorthand notes, and summarize long content. Try editing this note and using the AI actions panel!`,
      tags: ["ai", "testing", "demo"],
      color: "#4FC3F7",
      folderId: johnWorkFolder.id,
      userId: johnUser.id,
    },
  ];

  for (const note of johnNotes) {
    await prisma.note.create({
      data: note,
    });
  }

  console.log("✅ Created notes for John");

  // Create some AI usage tracking data
  const aiUsageData = [
    { userId: demoUser.id, feature: "title", success: true },
    { userId: demoUser.id, feature: "expand", success: true },
    { userId: demoUser.id, feature: "summarize", success: true },
    { userId: demoUser.id, feature: "title", success: false },
    { userId: demoUser.id, feature: "expand", success: true },
    { userId: johnUser.id, feature: "title", success: true },
    { userId: johnUser.id, feature: "summarize", success: true },
  ];

  for (const usage of aiUsageData) {
    await prisma.aiUsage.create({
      data: usage,
    });
  }

  console.log("✅ Created AI usage tracking data");

  console.log("🎉 Database seeding completed!");
  console.log("");
  console.log("Demo accounts created:");
  console.log("📧 demo@example.com / password123");
  console.log("📧 john@example.com / password123");
  console.log("");
  console.log("Sample data includes:");
  console.log("- 3 folders for demo user");
  console.log("- 8 notes with realistic content");
  console.log("- 2 folders and 2 notes for John");
  console.log("- AI usage tracking data");
  console.log("- Various tags and categories");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
