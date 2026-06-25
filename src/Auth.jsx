import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2 } from "lucide-react"
import { supabase } from "./supabase"
import Starfield from "./Starfield"
import { useNavigate } from "react-router-dom"

function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setMessage("")

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(error.message)
    } else if (isSignUp) {
      setMessage("Check your email to confirm your account!")
    } else {
      navigate("/")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4">
      <Starfield />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="flex items-center justify-center gap-2 mb-3"
          >
            <Gamepad2 className="text-green-400" size={36} />
            <h1 className="text-4xl font-extrabold tracking-tight">
              Deal<span className="animated-word text-green-400">Quest</span>
            </h1>
          </motion.div>
          <p className="text-gray-400">The best game deals, all in one place.</p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/80 backdrop-blur border border-gray-800 rounded-2xl p-8"
        >
          <h2 className="text-lg font-bold mb-6">{isSignUp ? "Create your account" : "Welcome back"}</h2>

          <div className="space-y-3 mb-5">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
            />
          </div>

          {message && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-300 text-sm rounded-xl px-4 py-3 mb-4">
              {message}
            </div>
          )}

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition disabled:opacity-50 text-sm"
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Log In"}
          </motion.button>

          <p className="text-center text-gray-500 text-sm mt-5">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => { setIsSignUp(!isSignUp); setMessage("") }}
              className="text-green-400 hover:text-green-300 font-medium transition"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </p>
        </motion.div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Deals sourced from CheapShark API · Updated daily
        </p>
      </motion.div>
    </div>
  )
}

export default Auth
