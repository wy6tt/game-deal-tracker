import { useState, useEffect } from "react"
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "./supabase"
import { Gamepad2 } from "lucide-react"
import Auth from "./Auth"
import Wishlist from "./Wishlist"
import GameModal from "./GameModal"
import toast from "react-hot-toast"
import confetti from "canvas-confetti"
import Starfield from "./Starfield"
import Free from "./Free"
import Stores from "./Stores"
import About from "./About"

const STORES = [
  { id: "", name: "All Stores" },
  { id: "1", name: "Steam" },
  { id: "25", name: "Epic" },
  { id: "7", name: "GOG" },
  { id: "8", name: "Humble" },
]

const TABS = [
  { id: "top", label: "🏆 Top Deals", sortBy: "Deal Rating" },
  { id: "trending", label: "🔥 Trending", sortBy: "Trending" },
  { id: "lowest", label: "💰 Lowest Ever", sortBy: "Price" },
]

function App() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [user, setUser] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [activeTab, setActiveTab] = useState("top")
  const [selectedStore, setSelectedStore] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [hideDLC, setHideDLC] = useState(false)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    supabase
      .from("wishlist")
      .select("deal_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setWishlist(data.map(item => item.deal_id))
      })
  }, [user])

  useEffect(() => {
    setLoading(true)
    const tab = TABS.find(t => t.id === activeTab)
    let url = `https://www.cheapshark.com/api/1.0/deals?sortBy=${tab.sortBy}&pageSize=60`
    if (search) url += `&title=${search}`
    if (selectedStore) url += `&storeID=${selectedStore}`
    if (maxPrice) url += `&upperPrice=${maxPrice}`

    const timeout = setTimeout(() => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          const seen = new Set()
          const dlcKeywords = /dlc|pack|bundle|season pass|expansion|edition|soundtrack|artbook/i
          const unique = data.filter(deal => {
            if (seen.has(deal.title)) return false
            seen.add(deal.title)
            if (hideDLC && dlcKeywords.test(deal.title)) return false
            return true
          })
          setDeals(unique)
          setLoading(false)
        })
    }, 500)
    return () => clearTimeout(timeout)
  }, [search, activeTab, selectedStore, maxPrice, hideDLC])

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
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#4ade80", "#22c55e", "#ffffff", "#86efac"],
      })
      toast.success(`Added "${deal.title}" to wishlist!`)
    }
  }

  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-gray-950 bg-opacity-80 backdrop-blur-lg border-b border-gray-800 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 20 }} transition={{ type: "spring", stiffness: 300 }}>
              <Gamepad2 className="text-green-400" size={22} />
            </motion.div>
            <span className="text-lg font-extrabold tracking-tight text-white">Deal<span className="animated-word text-green-400">Quest</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/deals" className={`text-sm font-medium transition ${location.pathname === "/deals" ? "text-green-400" : "text-gray-400 hover:text-white"}`}>Deals</Link>
            <Link to="/free" className={`text-sm font-medium transition ${location.pathname === "/free" ? "text-green-400" : "text-gray-400 hover:text-white"}`}>Free</Link>
            <Link to="/stores" className={`text-sm font-medium transition ${location.pathname === "/stores" ? "text-green-400" : "text-gray-400 hover:text-white"}`}>Stores</Link>
            <Link to="/" className={`text-sm font-medium transition ${location.pathname === "/" ? "text-green-400" : "text-gray-400 hover:text-white"}`}>About</Link>
            {user ? (
              <>
                <Link to="/wishlist" className={`text-sm font-medium transition flex items-center gap-1.5 ${location.pathname === "/wishlist" ? "text-green-400" : "text-gray-400 hover:text-white"}`}>
                  Wishlist
                  <AnimatePresence>
                    {wishlist.length > 0 && (
                      <motion.span
                        key={wishlist.length}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="bg-green-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full"
                      >
                        {wishlist.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
                <button onClick={() => supabase.auth.signOut()} className="text-sm text-gray-500 hover:text-white transition">Sign out</button>
              </>
            ) : (
              <Link to="/login" className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-xl transition">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-800 mt-4 pt-4 flex flex-col gap-4"
            >
              {[
                { to: "/deals", label: "Deals" },
                { to: "/free", label: "Free Games" },
                { to: "/stores", label: "Stores" },
                { to: "/", label: "About" },
                ...(user ? [{ to: "/wishlist", label: "Wishlist" }] : []),
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium transition ${location.pathname === link.to ? "text-green-400" : "text-gray-400"}`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { supabase.auth.signOut(); setMenuOpen(false) }} className="text-sm text-gray-500 text-left">Sign out</button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-green-500 text-black text-sm font-bold px-4 py-2 rounded-xl text-center">
                  Sign in
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <Routes>
        <Route path="/deals" element={
          <main className="max-w-6xl mx-auto px-6 py-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="text-5xl font-extrabold mb-3 tracking-tight leading-tight">
                Find your next game{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  for less.
                </span>
              </h1>
              <p className="text-gray-400 text-lg">Live deals across Steam, Epic, GOG, and more — updated daily.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex gap-2 mb-5"
            >
              {TABS.map(tab => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-green-500 text-black shadow-lg shadow-green-900/50"
                      : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <div className="relative flex-1 min-w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search games..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                />
              </div>
              <select
                value={selectedStore}
                onChange={e => setSelectedStore(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 transition"
              >
                {STORES.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
              <select
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-500 transition"
              >
                <option value="">Any Price</option>
                <option value="0">Free Only</option>
                <option value="5">Under $5</option>
                <option value="10">Under $10</option>
                <option value="20">Under $20</option>
                <option value="30">Under $30</option>
              </select>
              <button
                onClick={() => setHideDLC(!hideDLC)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
                  hideDLC
                    ? "bg-green-500 text-black border-green-500"
                    : "bg-gray-900 text-gray-400 border-gray-700 hover:text-white"
                }`}
              >
                {hideDLC ? "✓ DLC Hidden" : "Hide DLC"}
              </button>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800"
                  >
                    <div className="w-full h-32 bg-gradient-to-r from-gray-800 via-gray-750 to-gray-800 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : deals.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <p className="text-4xl mb-3">🎮</p>
                <p className="text-gray-400">No deals found — try different filters.</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {deals.map((deal, i) => {
                    const saved = wishlist.includes(deal.dealID)
                    const isFree = parseFloat(deal.salePrice) === 0
                    const isLowest = parseFloat(deal.salePrice) === parseFloat(deal.cheapestPriceEver)
                    const rating = parseFloat(deal.dealRating)

                    return (
                      <motion.div
                        key={deal.dealID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => setSelectedDeal(deal)}
                        className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-950/30 transition-colors cursor-pointer group"
                      >
                        {isFree && <span className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">FREE</span>}
                        {!isFree && isLowest && <span className="absolute top-2 left-2 z-10 bg-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Lowest Ever</span>}

                        <motion.button
                          onClick={e => { e.stopPropagation(); toggleWishlist(deal) }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            saved ? "bg-green-500 text-black" : "bg-black/60 text-white hover:bg-green-500 hover:text-black"
                          }`}
                        >
                          {saved ? "✓" : "+"}
                        </motion.button>

                        <div className="overflow-hidden">
                          <img src={deal.thumb} alt={deal.title} className="w-full h-24 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
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
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        } />
        <Route path="/wishlist" element={<Wishlist user={user} onWishlistChange={setWishlist} />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/free" element={<Free user={user} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/stores" element={<Stores user={user} wishlist={wishlist} setWishlist={setWishlist} />} />
        <Route path="/" element={<About />} />
      </Routes>

      <GameModal
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        isWishlisted={selectedDeal && wishlist.includes(selectedDeal.dealID)}
        onToggleWishlist={toggleWishlist}
      />
    </div>
  )
}

export default App
