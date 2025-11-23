import { initializeDatabase } from "@/lib/db"

async function main() {
  try {
    console.log("Initializing TALKSY database...")
    await initializeDatabase()
    console.log("✅ Database initialized successfully!")
  } catch (error) {
    console.error("❌ Database initialization failed:", error)
    process.exit(1)
  }
}

main()
