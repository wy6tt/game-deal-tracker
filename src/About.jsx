import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Gamepad2, Search, Star, BarChart2, Heart, Store } from "lucide-react"

const features = [
  { icon: <Search size={20} />, title: "Live Deal Search", desc: "Search and filter thousands of game deals across all major stores in real time." },
  { icon: <Star size={20} />, title: "Wishlist", desc: "Save games you're interested in and track their prices across sessions." },
  { icon: <BarChart2 size={20} />, title: "Wishlist Analysis", desc: "Get an instant breakdown of your wishlist — best value, buy-first recommendations, average discount, and more." },
  { icon: <Heart size={20} />, title: "Price History", desc: "See how a game's price has changed over time and whether it's at its lowest ever." },
  { icon: <Gamepad2 size={20} />, title: "Free Games", desc: "A dedicated page for 100% off games — updated as they appear." },
  { icon: <Store size={20} />, title: "Browse by Store", desc: "Explore deals from Steam, Epic, GOG, Humble, and more — filtered by your favorite store." },
]

const stores = ["Steam", "Epic Games", "GOG", "Humble Store", "Fanatical", "GreenManGaming"]

const steps = [
  { number: "01", title: "Browse Deals", desc: "Visit the Deals page to see the best discounts across all stores right now." },
  { number: "02", title: "Save to Wishlist", desc: "Hit the + button on any game to save it. Create a free account to keep your wishlist across devices." },
  { number: "03", title: "Analyze & Buy", desc: "Use Wishlist Analysis to find the best value game to buy first — then grab it before the deal ends." },
]

const faqs = [
  { q: "Is DealQuest free to use?", a: "Yes, completely free. No ads, no subscriptions, no hidden fees." },
  { q: "How often are deals updated?", a: "Deals are pulled live from the CheapShark API every time you visit the page." },
  { q: "Do I need an account?", a: "No — you can browse all deals as a guest. You only need an account to save games to your wishlist." },
  { q: "Which stores do you track?", a: "We track Steam, Epic Games, GOG, Humble Store, Fanatical, GreenManGaming, and many more." },
  { q: "What is the Lowest Ever badge?", a: "It means the current sale price is the lowest this game has ever been sold for — a great time to buy!" },
]

function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gamepad2 className="text-green-400" size={32} />
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Deal<span className="animated-word text-green-400">Quest</span>
          </h1>
        </div>
        <p className="text-gray-400 text-base sm:text-xl max-w-xl mx-auto leading-relaxed">
          The smartest way to find game deals. Stop overpaying — let DealQuest do the hunting.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link to="/" className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition text-center">
            Browse Deals
          </Link>
          <Link to="/free" className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl transition text-center">
            Free Games
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-12">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: "30+", label: "Stores Tracked" },
            { value: "1000s", label: "Live Deals" },
            { value: "Free", label: "Always" },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-5">
              <p className="text-xl sm:text-3xl font-extrabold text-green-400 mb-1">{stat.value}</p>
              <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">How it works</h2>
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.1 }}
              className="flex items-start gap-4 bg-gray-900/80 border border-gray-800 rounded-2xl p-5"
            >
              <span className="text-2xl font-extrabold text-green-500 shrink-0">{step.number}</span>
              <div>
                <h3 className="font-bold mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.15 }}
              className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 hover:border-green-800 transition"
            >
              <div className="text-green-400 mb-3">{f.icon}</div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Stores we track</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {stores.map(store => (
            <span key={store} className="bg-gray-900 border border-gray-700 text-gray-300 text-sm px-4 py-2 rounded-full">
              {store}
            </span>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">FAQ</h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.25 }}
              className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5"
            >
              <h3 className="font-bold mb-2 text-sm sm:text-base">{faq.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12 text-center bg-green-950 border border-green-800 rounded-2xl p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to save money?</h2>
        <p className="text-gray-400 mb-5 text-sm sm:text-base">Browse thousands of deals across all major PC gaming stores.</p>
        <Link to="/" className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-xl transition inline-block">
          Start Browsing →
        </Link>
      </motion.div>

      {/* Footer note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-center text-gray-600 text-xs sm:text-sm pb-6">
        <p>Powered by the <a href="https://apidocs.cheapshark.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">CheapShark API</a> · Built with React, Supabase, and Framer Motion</p>
      </motion.div>

    </main>
  )
}

export default About
