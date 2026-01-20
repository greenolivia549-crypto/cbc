// In-memory store for dummy likes (resets on server restart)
// Key: "userId:slug"
export const DUMMY_LIKES_STORE = new Set<string>();

export const DUMMY_POSTS = [
    {
        _id: "101",
        title: "The Ultimate Guide to Zero Waste Living",
        slug: "zero-waste-living",
        excerpt: "Practical steps to reduce your environmental footprint, from kitchen hacks to sustainable shopping.",
        content: `
            <p>Living a zero-waste lifestyle is about more than just recycling; it's about shifting our mindset to value resources and minimize waste at the source. In this guide, we'll explore practical steps you can take today.</p>
            <h2>1. Refuse What You Don't Need</h2>
            <p>The first step is to simply say "no" to single-use plastics, junk mail, and promotional freebies that you'll never use.</p>
            <h2>2. Reduce What You Use</h2>
            <p>Be mindful of your consumption. Do you really need that new gadget? Can you borrow or buy second-hand instead?</p>
            <h2>3. Reuse Everything</h2>
            <p>Switch to reusable shopping bags, water bottles, and coffee cups. Repurpose glass jars for storage.</p>
            <h2>4. Rot (Compost)</h2>
            <p>Composting food scraps significantly reduces the amount of waste sent to landfills and creates nutrient-rich soil for your garden.</p>
        `,
        image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2670&auto=format&fit=crop",
        category: "Lifestyle",
        likes: 120,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        author: { name: "Sarah Green" }
    },
    {
        _id: "102",
        title: "Solar Energy Revolution 2026",
        slug: "solar-energy-2026",
        excerpt: "New photovoltaic technologies are making solar power more accessible and efficient than ever.",
        content: `
            <p>The solar energy landscape is evolving rapidly. With new innovations in efficiency and storage, going solar is becoming a viable option for more households.</p>
            <p>Recent breakthroughs in perovskite solar cells promise to deliver higher efficiency at a lower cost compared to traditional silicon cells.</p>
        `,
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2672&auto=format&fit=crop",
        category: "Technology",
        likes: 45,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        author: { name: "Tech Insider" }
    },
    {
        _id: "103",
        title: "Urban Gardening for Beginners",
        slug: "urban-gardening",
        excerpt: "You don't need a backyard to grow your own food. Discover the joy of balcony and indoor gardening.",
        content: `
            <p>Urban gardening is a fantastic way to reconnect with nature, even if you live in a high-rise apartment.</p>
            <h2>Choosing the Right Plants</h2>
            <p>Herbs like basil, mint, and parsley are great for beginners. They require little space and can thrive on a sunny windowsill.</p>
        `,
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2670&auto=format&fit=crop",
        category: "Home",
        likes: 890,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        author: { name: "Green Thumb" }
    },
    {
        _id: "104",
        title: "Why Minimalism Makes You Happier",
        slug: "minimalism-happiness",
        excerpt: "Decluttering your physical space can lead to profound mental clarity and increased life satisfaction.",
        content: `
            <p>Minimalism isn't about owning nothing; it's about owning only what adds value to your life.</p>
            <p>By removing the excess, you make room for more time, energy, and freedom to pursue what truly matters.</p>
        `,
        image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2671&auto=format&fit=crop",
        category: "Wellness",
        likes: 350,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
        author: { name: "Zen Master" }
    },
    {
        _id: "105",
        title: "10 Endangered Species We Must Save",
        slug: "endangered-species",
        excerpt: "A look at the creatures most at risk and what conservationists are doing to prevent their extinction.",
        content: `
            <p>Our planet's biodiversity is under threat. Here are ten species that critically need our protection.</p>
            <p>Conservation efforts are vital to ensuring these magnificent creatures survive for future generations to appreciate.</p>
        `,
        image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=2670&auto=format&fit=crop",
        category: "Nature",
        likes: 1200,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
        author: { name: "Wild Life" }
    }
];
