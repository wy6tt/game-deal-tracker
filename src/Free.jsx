import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import confetti from "canvas-confetti"
import { supabase } from "./supabase"

function Free({ user, wishlist, setWishlist }) {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://www.cheapshark.com/api/1.0/deals?upperPrice=0&pageSize=30&sortBy=Deal Rating")
      .then(res => res.json())
      .then(data => {
        const seen = new Set()
        const unique = data.filter(deal => {
          if (seen.has(deal.title)) return false
          seen.add(deal.title)
          return true
        })
        setDeals(unique)
        setLoading(false)
      })
  }, [])

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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🆓</span>
          <h1 className="text-4xl font-extrabold tracking-tight">Free Games</h1>
        </div>
        <p className="text-gray-400 text-lg">100% off — grab them before they're gone.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
              <div className="w-full h-32 bg-gray-800" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">😔</p>
          <p className="text-xl font-bold mb-2">No free games right now</p>
          <p className="text-gray-400">Check back soon — free games pop up all the time!</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {deals.map((deal, i) => {
              const saved = wishlist.includes(deal.dealID)
              return (
                <motion.a
                  key={deal.dealID}
                  href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="relative bg-gray-900 rounded-2xl overflow-hidden border border-yellow-500/30 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-950/30 transition-colors group"
                >
                  <span className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-400 font-bold text-sm">FREE</span>
                      <span className="text-gray-600 line-through text-xs">${deal.normalPrice}</span>
                      <span className="ml-auto text-xs bg-yellow-950 text-yellow-400 font-semibold px-1.5 py-0.5 rounded-md">100% off</span>
                    </div>
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

export default Free
