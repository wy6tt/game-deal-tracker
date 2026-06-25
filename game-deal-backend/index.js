import express from "express"
import cors from "cors"
import Anthropic from "@anthropic-ai/sdk"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post("/analyze", async (req, res) => {
  const { games } = req.body

  if (!games || games.length === 0) {
    return res.json({ analysis: "Add some games to your wishlist first and I'll analyze them for you!" })
  }

  const gameList = games.map(g => `- ${g.title} (Sale: $${g.sale_price}, Normal: $${g.normal_price}, Savings: ${Math.round(g.savings)}%)`).join("\n")

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `You are a helpful gaming deal advisor. Analyze this user's game wishlist and give them personalized advice. Comment on the best value deals, any patterns you notice in their taste, and which game they should buy first. Keep it friendly, concise, and under 150 words.

Here are their wishlisted games:
${gameList}`
      }
    ]
  })

  res.json({ analysis: message.content[0].text })
})

app.listen(3001, () => console.log("Server running on port 3001"))