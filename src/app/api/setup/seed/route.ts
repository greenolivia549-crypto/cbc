import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Category from "@/models/Category";
import Post from "@/models/Post";
import User from "@/models/User";

export async function GET() {
    try {
        await connectToDatabase();

        // 1. Get an Admin User (to be the author)
        const adminUser = await User.findOne({ role: "admin" });
        if (!adminUser) {
            return NextResponse.json({ message: "No admin user found. Please create an account and promote it first." }, { status: 400 });
        }

        // 2. Define Categories
        const categories = [
            { name: "Sustainable Tech", slug: "sustainable-tech" },
            { name: "Eco Travel", slug: "eco-travel" },
            { name: "Plant Based", slug: "plant-based" },
            { name: "Mindful Living", slug: "mindful-living" },
            { name: "Green Energy", slug: "green-energy" }
        ];

        // 3. Create Categories
        for (const cat of categories) {
            await Category.findOneAndUpdate(
                { slug: cat.slug },
                { name: cat.name, slug: cat.slug },
                { upsert: true, new: true }
            );
        }

        // 4. Define Articles
        const articles = [
            {
                title: "The Rise of Solar Powered Smartphones",
                slug: "solar-powered-smartphones",
                category: "Sustainable Tech",
                image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1600",
                excerpt: "Imagine never having to charge your phone again. Solar technology is shrinking, and it's coming to your pocket sooner than you think.",
                content: `<h2>The Eternal Privacy of the Sun</h2><p>As battery anxiety becomes a modern condition, tech giants are looking to the sky. New <strong>perovskite solar cells</strong> are transparent enough to be integrated into screens without dimming the display.</p><p>This means your phone could theoretically charge itself while it sits on your desk or while you're scrolling in the park.</p><h3>When will it happen?</h3><p>Prototypes are already in testing phases in labs across California and Shenzhen. We expect the first hybrid-solar flagship devices to hit the market by late 2027.</p>`,
                seoTitle: "Solar Powered Smartphones: The Future of Mobile",
                seoDescription: "Explore the new wave of solar-charging mobile devices and how they boost sustainability.",
                keywords: "solar, smartphones, tech, green energy, battery"
            },
            {
                title: "Top 10 Eco-Lodges in Costa Rica",
                slug: "eco-lodges-costa-rica",
                category: "Eco Travel",
                image: "https://images.unsplash.com/photo-1544985392-aa09f196ce70?auto=format&fit=crop&q=80&w=1600",
                excerpt: "From treehouses in the canopy to solar-powered beach huts, discover the best places to stay that leave no trace.",
                content: `<h2> luxury without the footprint</h2><p>Costa Rica has long been the pioneer of ecotourism. But a new wave of <strong>ultra-sustainable lodges</strong> is raising the bar.</p><ul><li><strong>Lapa Rios</strong>: Located in a private nature reserve.</li><li><strong>Pacuare Lodge</strong>: Accessible only by raft.</li></ul><p>These destinations prove that luxury doesn't have to come at the Earth's expense.</p>`,
                seoTitle: "Best Eco-Lodges in Costa Rica 2026",
                seoDescription: "A curated guide to the most sustainable and luxurious eco-lodges in Costa Rica.",
                keywords: "travel, costa rica, eco-lodge, sustainable travel, vacation"
            },
            {
                title: "Why Your Diet Needs More Microgreens",
                slug: "microgreens-benefits",
                category: "Plant Based",
                image: "https://images.unsplash.com/photo-1533256860832-6bb201f35759?auto=format&fit=crop&q=80&w=1600",
                excerpt: "They might be small, but they pack a nutritional punch that rivals full-grown vegetables. Here's why you should sprinkle them on everything.",
                content: `<h2>Tiny Giants of Nutrition</h2><p>Microgreens are young vegetable greens that are approximately 1-3 inches tall. Despite their small size, they often contain higher nutrient levels than more mature vegetable greens.</p><p><strong>Red Cabbage Microgreens</strong>, for example, have 40x more Vitamin E and 6x more Vitamin C than mature red cabbage.</p><p>Try adding them to smoothies, salads, or just as a garnish to unlock this superfood potential.</p>`,
                seoTitle: "Health Benefits of Microgreens",
                seoDescription: "Learn why microgreens are the newest superfood you need in your plant-based diet.",
                keywords: "food, microgreens, health, vegan, nutrition"
            },
            {
                title: "Minimalism: A Path to Sustainability",
                slug: "minimalism-sustainability",
                category: "Mindful Living",
                image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1600",
                excerpt: "Owning less doesn't just clear your mind—it clears the air. The direct link between consumerism and carbon footprint explained.",
                content: `<h2>Buying Less, Living More</h2><p>Every object we own has a carbon cost attached to its manufacturing and shipping. By choosing <strong>minimalism</strong>, we aren't just decluttering our homes; we are opting out of the cycle of endless production.</p><p>Start by asking: <em>Do I really need this?</em> If the answer is no, you've just saved a tiny piece of the planet.</p>`,
                seoTitle: "How Minimalism Helps the Environment",
                seoDescription: "Understand the connection between minimalistic living and reducing your carbon footprint.",
                keywords: "minimalism, lifestyle, sustainability, green living"
            },
            {
                title: "Wind Turbines at Home: Are They Worth It?",
                slug: "home-wind-turbines",
                category: "Green Energy",
                image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1600",
                excerpt: "Solar panels get all the love, but small-scale wind turbines are becoming a viable option for homeowners in the right climates.",
                content: `<h2>Harnessing the Breeze</h2><p>If you live in a coastal area or open plain, wind might be a better resource than sun.</p><p>Modern <strong>vertical-axis turbines</strong> are quiet, bird-safe, and efficient. While the upfront cost is higher than solar, the generation capacity during winter nights makes them an excellent companion to a solar setup.</p><h3>Cost vs. Return</h3><p>Expect a payback period of 7-10 years, depending on your local electricity rates.</p>`,
                seoTitle: "Residential Wind Turbines: A Buyer's Guide",
                seoDescription: "Analysis of home wind turbines availability, cost, and efficiency for residential use.",
                keywords: "energy, wind power, wind turbines, eco home, renewable"
            }
        ];

        // 5. Create Articles
        for (const article of articles) {
            await Post.findOneAndUpdate(
                { slug: article.slug },
                {
                    ...article,
                    author: adminUser._id,
                    featured: Math.random() < 0.5 // Randomly feature some
                },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({
            message: "Setup Complete!",
            details: `Created/Updated ${categories.length} Categories and ${articles.length} Articles.`
        });

    } catch (error) {
        console.error("Seed Error:", error);
        return NextResponse.json({ message: "Internal Error", error }, { status: 500 });
    }
}
