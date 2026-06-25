import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { supabase } from "./supabase"

function analyzeGames(wishlist) {
  if (!wishlist.length) return null

  const bestValue = wishlist.reduce((a, b) => parseFloat(a.savings) > parseFloat(b.savings) ? a : b)
  const mostExpensive = wishlist.reduce((a, b) => parseFloat(a.normal_price) > parseFloat(b.normal_price) ? a : b)
  const freeGames = wishlist.filter(g => parseFloat(g.sale_price) === 0)
  const avgDiscount = wishlist.reduce((acc, g) => acc + parseFloat(g.savings), 0) / wishlist.length
  const totalSavings = wishlist.reduce((acc, g) => acc + (parseFloat(g.normal_price) - parseFloat(g.sale_price)), 0)
  const buyFirst = wishlist.reduce((a, b) => parseFloat(a.savings) > parseFloat(b.savings) ? a : b)

  return { bestValue, mostExpensive, freeGames, avgDiscount, totalSavings, buyFirst }
}

function Wishlist({ user, onWishlistChange }) {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAnalysis, setShowAnalysis] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setWishlist(data)
        setLoading(false)
      })
  }, [user])

  const removeFromWishlist = async (id) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", id)
    if (error) {
      console.log("Delete error:", error)
    } else {
      setWishlist(prev => {
        const updated = prev.filter(item => item.id !== id)
        onWishlistChange(updated.map(item => item.deal_id))
        return updated
      })
    }
  }

  const totalSavings = wishlist.reduce((acc, item) => acc + (parseFloat(item.normal_price) - parseFloat(item.sale_price)), 0)
  const totalCost = wishlist.reduce((acc, item) => acc + parseFloat(item.sale_price), 0)
  const analysis = analyzeGames(wishlist)

  if (!user) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">🔒</p>
      <p className="text-xl font-bold mb-2">Sign in to view your wishlist</p>
      <p className="text-gray-400 mb-6">Create a free account to save games and track deals.</p>
      <Link to="/login" className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition">
        Sign in
      </Link>
    </div>
  )

  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-4xl font-extrabold tracking-tight mb-1">My Wishlist</h2>
          <p className="text-gray-400">Games you're watching — saved across sessions.</p>
        </motion.div>

        {/* Stats bar */}
        {wishlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-4 mb-8 flex-wrap items-center"
          >
            {[
              { label: "Games Saved", value: wishlist.length, color: "text-white" },
              { label: "Total Savings", value: `$${totalSavings.toFixed(2)}`, color: "text-green-400" },
              { label: "You'd Pay", value: `$${totalCost.toFixed(2)}`, color: "text-white" },
              { label: "Avg Discount", value: `${Math.round(wishlist.reduce((acc, g) => acc + parseFloat(g.savings), 0) / wishlist.length)}%`, color: "text-green-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.1 }}
                className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-xl px-5 py-3"
              >
                <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}

            <motion.button
              onClick={() => setShowAnalysis(!showAnalysis)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-auto bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-3 rounded-xl transition text-sm shadow-lg shadow-green-900/30"
            >
              {showAnalysis ? "Hide Analysis" : "📊 Analyze Wishlist"}
            </motion.button>
          </motion.div>
        )}

        {/* Analysis Panel */}
        <AnimatePresence>
          {showAnalysis && analysis && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-8 bg-gray-900/80 backdrop-blur border border-green-800 rounded-2xl p-6 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="text-green-400 text-lg">📊</span>
                <h3 className="text-green-400 font-bold text-lg">Wishlist Analysis</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">🏆 Best Value Deal</p>
                  <p className="font-bold text-white line-clamp-1">{analysis.bestValue.title}</p>
                  <p className="text-green-400 text-sm">{Math.round(parseFloat(analysis.bestValue.savings))}% off</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">🎯 Buy This First</p>
                  <p className="font-bold text-white line-clamp-1">{analysis.buyFirst.title}</p>
                  <p className="text-green-400 text-sm">Best deal right now — ${analysis.buyFirst.sale_price}</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">💸 Biggest Saving</p>
                  <p className="font-bold text-white line-clamp-1">{analysis.mostExpensive.title}</p>
                  <p className="text-green-400 text-sm">Was ${analysis.mostExpensive.normal_price} → ${analysis.mostExpensive.sale_price}</p>
                </div>

                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">📈 Overall Stats</p>
                  <p className="font-bold text-white">{Math.round(analysis.avgDiscount)}% average discount</p>
                  <p className="text-green-400 text-sm">Saving ${analysis.totalSavings.toFixed(2)} total</p>
                </div>

                {analysis.freeGames.length > 0 && (
                  <div className="bg-yellow-950 border border-yellow-800 rounded-xl p-4 sm:col-span-2">
                    <p className="text-xs text-yellow-400 mb-1">🆓 Free Games in Your List</p>
                    <p className="font-bold text-white">{analysis.freeGames.map(g => g.title).join(", ")}</p>
                    <p className="text-yellow-400 text-sm">Grab these now — free deals don't last!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 animate-pulse">
                <div className="w-full h-32 bg-gray-800" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-5xl mb-4">🎮</p>
            <p className="text-xl font-bold mb-2">No games saved yet</p>
            <p className="text-gray-400">Head to the Deals page and hit + to save games here.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {wishlist.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="relative bg-gray-900/80 backdrop-blur rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition group"
                >
                  <div className="overflow-hidden">
                    <img src={item.thumb} alt={item.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-xs mb-2 line-clamp-1 text-gray-100">{item.title}</h3>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-green-400 font-bold text-sm">${item.sale_price}</span>
                      <span className="text-gray-600 line-through text-xs">${item.normal_price}</span>
                      <span className="ml-auto text-xs bg-green-950 text-green-400 font-semibold px-1.5 py-0.5 rounded-md">-{Math.round(item.savings)}%</span>
                    </div>
                    <motion.button
                      onClick={() => removeFromWishlist(item.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-xs text-gray-500 hover:text-red-400 transition py-1 rounded-lg hover:bg-gray-800"
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </>
  )
}

export default Wishlist
