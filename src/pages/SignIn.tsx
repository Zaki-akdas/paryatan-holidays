import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { AuthShell } from "../components/auth/AuthShell"
import { TextField, PasswordField, fieldContainer, fieldItem } from "../components/auth/Field"
import { Button } from "../components/ui/button"
import { ensureSeeded, loginUser } from "../lib/auth"

ensureSeeded()

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const [adminPw, setAdminPw] = useState("")
  const [adminLoading, setAdminLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.trim() || !password) {
      setError("Please enter your email and password.")
      return
    }
    setLoading(true)
    const res = await loginUser(email, password)
    setLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast.success(`Welcome back, ${res.user.name.split(" ")[0]}!`)
    navigate(res.user.role === "admin" ? "/admin/dashboard" : "/", { replace: true })
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!adminPw.trim()) {
      setError("Please enter the admin password.")
      return
    }
    setAdminLoading(true)
    const res = await loginUser("admin@paryatan.co.in", adminPw)
    setAdminLoading(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    toast.success("Welcome back, Admin!")
    navigate("/admin/dashboard", { replace: true })
  }

  return (
    <AuthShell
      title="Sign in to your account"
      subtitle="Access your trips, leads, and the Paryatan console."
      side="Sign in to manage bookings, track leads, or run the admin console. Your credentials are hashed and your session is kept private."
    >
      {!adminMode ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-4"
          >
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              ← Back to Site
            </Button>
          </motion.div>
          <form onSubmit={handleSubmit}>
          <motion.div variants={fieldContainer} initial="hidden" animate="show" className="space-y-4">
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={error && !password ? error : undefined}
            />
            <PasswordField
              id="password"
              label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={error && email ? error : undefined}
            />

            <motion.div variants={fieldItem} className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-primary w-4 h-4" /> Remember me
              </label>
              <button type="button" className="text-primary hover:underline">
                Forgot password?
              </button>
            </motion.div>

            <motion.div variants={fieldItem}>
              <Button type="submit" variant="sunset" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </motion.div>
          </motion.div>
        </form>
        </>
      ) : (
        <motion.form
          onSubmit={handleAdminLogin}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
            Enter the admin password to access the console.
          </div>
          <PasswordField
            id="admin-password"
            label="Admin Password"
            autoComplete="current-password"
            value={adminPw}
            onChange={(e) => setAdminPw(e.target.value)}
            placeholder="••••••••"
            error={error || undefined}
          />
          <Button type="submit" variant="sunset" className="w-full" disabled={adminLoading}>
            {adminLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Access Admin Console <Lock className="w-4 h-4" /></>}
          </Button>
          <button
            type="button"
            onClick={() => {
              setAdminMode(false)
              setAdminPw("")
              setError("")
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to sign in
          </button>
        </motion.form>
      )}

      {!adminMode && (
        <>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setAdminMode(true)
                setError("")
                setAdminPw("")
              }}
            >
              <Lock className="w-4 h-4" /> Admin Login
            </Button>
          </div>
        </>
      )}
    </AuthShell>
  )
}
