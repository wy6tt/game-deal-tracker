import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

function GameModal({ deal, onClose, isWishlisted, onToggleWishlist }) {
  const [priceHistory, setPriceHistory] = useState([])
  const [gameInfo, setGameInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!deal) return
    setLoading(true)
    setPriceHistory([])
    setGameInfo(null)
    fetch(`https://www.cheapshark.com/api/1.0/games?id=${deal.gameID}`)
      .then(r => r.json())
      .then(info => {
        setGameInfo(info)
        const STORE_NAMES = {
          "1": "Steam", "2": "GamersGate", "3": "GreenManGaming",
          "7": "GOG", "8": "Humble", "11": "Fanatical",
          "13": "Gamesplanet", "15": "Nuuvem", "21": "WinGameStore",
          "23": "GameBillet", "25": "Epic", "27": "IndieGala",
        }

        if (info.deals && info.deals.length > 1) {
          const formatted = info.deals.map(entry => ({
            date: STORE_NAMES[entry.storeID] || `Store ${entry.storeID}`,
            price: parseFloat(entry.price),
          }))
          setPriceHistory(formatted)
        }
        setLoading(false)
      })
  }, [deal])

  if (!deal) return null

  const chartData = {
    labels: priceHistory.map(p => p.date),
    datasets: [
      {
        data: priceHistory.map(p => p.price),
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.1)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        fill: true,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `$${ctx.parsed.y}` } } },
    scales: {
      x: { ticks: { color: "#9ca3af", font: { size: 11 } }, grid: { color: "#1f2937" } },
      y: { ticks: { color: "#9ca3af", font: { size: 11 }, callback: v => `$${v}` }, grid: { color: "#1f2937" } },
    },
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <img src={deal.thumb} alt={deal.title} className="w-full h-48 object-cover rounded-t-2xl" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition"
          >
            ✕
          </button>
          {parseFloat(deal.salePrice) === 0 && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">FREE</span>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold flex-1 mr-4">{deal.title}</h2>
            <button
              onClick={() => onToggleWishlist(deal)}
              className={`shrink-0 text-sm px-4 py-2 rounded-lg font-medium transition ${
                isWishlisted
                  ? "bg-green-500 text-black"
                  : "bg-gray-800 text-white hover:bg-green-500 hover:text-black"
              }`}
            >
              {isWishlisted ? "✓ Wishlisted" : "+ Wishlist"}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="bg-gray-800 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Sale Price</p>
              <p className="text-2xl font-bold text-green-400">
                {parseFloat(deal.salePrice) === 0 ? "FREE" : `$${deal.salePrice}`}
              </p>
            </div>
            <div className="bg-gray-800 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-gray-400 mb-1">Normal Price</p>
              <p className="text-xl font-bold text-gray-300 line-through">${deal.normalPrice}</p>
            </div>
            <div className="bg-green-900 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-green-400 mb-1">You Save</p>
              <p className="text-xl font-bold text-green-300">{Math.round(deal.savings)}%</p>
            </div>
            {gameInfo && (
              <div className="bg-gray-800 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Metacritic</p>
                <p className="text-xl font-bold text-yellow-400">
                  {gameInfo.info?.metacriticScore || "N/A"}
                </p>
              </div>
            )}
          </div>

          {gameInfo?.cheapestPriceEver?.price !== undefined && (
            <div className="bg-gray-800 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Lowest Price Ever</p>
                <p className="text-lg font-bold text-purple-400">
                  {parseFloat(gameInfo.cheapestPriceEver.price) === 0 ? "FREE" : `$${gameInfo.cheapestPriceEver.price}`}
                </p>
              </div>
              {parseFloat(deal.salePrice) === parseFloat(gameInfo.cheapestPriceEver.price) && (
                <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  That's now! 🎉
                </span>
              )}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Price History</h3>
            {loading ? (
              <div className="h-40 bg-gray-800 rounded-lg animate-pulse" />
            ) : priceHistory.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p className="text-gray-500 text-sm">No price history available.</p>
            )}
          </div>

          <a
            href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg text-center transition"
          >
            View Deal →
          </a>
        </div>
      </div>
    </div>
  )
}

export default GameModal
