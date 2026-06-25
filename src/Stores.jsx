import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import confetti from "canvas-confetti"
import { supabase } from "./supabase"

const STORES = [
  { id: "1", name: "Steam", color: "from-blue-900 to-blue-950", accent: "border-blue-700/50 hover:border-blue-500/70", badge: "bg-blue-500" },
  { id: "25", name: "Epic Games", color: "from-gray-800 to-gray-900", accent: "border-gray-600/50 hover:border-gray-400/70", badge: "bg-gray-400" },
  { id: "7", name: "GOG", color: "from-purple-900 to-purple-950", accent: "border-purple-700/50 hover:border-purple-500/70", badge: "bg-purple-500" },
  { id: "8", name: "Humble", color: "from-red-900 to-red-950", accent: "border-red-700/50 hover:border-red-500/70", badge: "bg-red-500" },
  { id: "11", name: "Fanatical", color: "from-orange-900 to-orange-950", accent: "border-orange-700/50 hover:border-orange-500/70", badge: "bg-orange-500" },
  { id: "3", name: "GreenManGaming", color: "from-green-900 to-green-950", accent: "border-green-700/50 hover:border-green-500/70", badge: "bg-green-500" },
]

function Stores({ user, wishlist, setWishlist }) {
  const [selectedStore, setSelectedStore] = useState(STORES[0])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=${selectedStore.id}&pageSize=24&sortBy=Deal Rating`)
      .then(res => res.json())
      .then(data => {
        setDeals(data)
        setLoading(false)
      })
  }, [selectedStore])

  const toggleWishlist = async (deal) => {
    if (!user) {
      toast("Sign in to save games to your wishlist!", { icon: "🔒" })
      return
    }
    const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("deal_id", deal.dealID)

    if (existing && existing.length > 0) {
      await supabase.from("wishlist").delete().eq("id", existing[0].id)
      setWishlist(prev => prev.filter(id => id !== deal.dealID))
      toast("Removed from wishlist", { icon: "🗑️" })
    } else {
      await supabase.from("wishlist").insert({
        user_id: user.id,
        deal_id: deal.dealID,
        title: deal.title,
        sale_price: deal.salePrice,
        normal_price: deal.normalPrice,
        savings: deal.savings,
        thumb: deal.thumb,
      })
      setWishlist(prev => [...prev, deal.dealID])
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#4ade80", "#22c55e", "#ffffff", "#86efac"] })
      toast.success(`Added "${deal.title}" to wishlist!`)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Browse by Store</h1>
        <p className="text-gray-400 text-lg">See the best deals from your favorite stores.</p>
      </motion.div>

      {/* Store tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mb-8">
        {STORES.map(store => (
          <motion.button
            key={store.id}
            onClick={() => setSelectedStore(store)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedStore.id === store.id
                ? "bg-green-500 text-black shadow-lg shadow-green-900/50"
                : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {store.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Deals grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
              <div className="w-full h-32 bg-gray-800" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {deals.map((deal, i) => {
              const saved = wishlist.includes(deal.dealID)
              const isFree = parseFloat(deal.salePrice) === 0
              const rating = parseFloat(deal.dealRating)
              return (
                <motion.a
                  key={deal.dealID}
                  href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4 }}
                  className={`relative bg-gray-900 rounded-2xl overflow-hidden border ${selectedStore.accent} transition-colors group`}
                >
                  {isFree && <span className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>}
                  <motion.button
                    onClick={e => { e.preventDefault(); toggleWishlist(deal) }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      saved ? "bg-green-500 text-black" : "bg-black/60 text-white hover:bg-green-500 hover:text-black"
                    }`}
                  >
                    {saved ? "✓" : "+"}
                  </motion.button>
                  <div className="overflow-hidden">
                    <img src={deal.thumb} alt={deal.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-xs mb-2 line-clamp-1 text-gray-100">{deal.title}</h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-green-400 font-bold text-sm">{isFree ? "FREE" : `$${deal.salePrice}`}</span>
                      <span className="text-gray-600 line-through text-xs">${deal.normalPrice}</span>
                      <span className="ml-auto text-xs bg-green-950 text-green-400 font-semibold px-1.5 py-0.5 rounded-md">-{Math.round(deal.savings)}%</span>
                    </div>
                    {rating > 0 && (
                      <div className="w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(rating * 10, 100)}%` }}
                          transition={{ delay: i * 0.03 + 0.3, duration: 0.5 }}
                          className="h-1 rounded-full bg-gradient-to-r from-green-600 to-green-400"
                        />
                      </div>
                    )}
                  </div>
                </motion.a>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  )
}

export default Stores
