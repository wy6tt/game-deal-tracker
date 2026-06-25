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

function About() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gamepad2 className="text-green-400" size={40} />
          <h1 className="text-5xl font-extrabold tracking-tight">
            Deal<span className="animated-word text-green-400">Quest</span>
          </h1>
        </div>
        <p className="text-gray-400 text-xl max-w-xl mx-auto leading-relaxed">
          The smartest way to find game deals. Stop overpaying — let DealQuest do the hunting.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Link to="/" className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition">
            Browse Deals
          </Link>
          <Link to="/free" className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-xl transition">
            Free Games
          </Link>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.1 }}
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Stores we track</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {stores.map(store => (
            <span key={store} className="bg-gray-900 border border-gray-700 text-gray-300 text-sm px-4 py-2 rounded-full">
              {store}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Footer note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center text-gray-600 text-sm">
        <p>Powered by the <a href="https://apidocs.cheapshark.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">CheapShark API</a> · Built with React, Supabase, and Framer Motion</p>
      </motion.div>
    </main>
  )
}

export default About
