import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { AuthShell } from "../components/auth/AuthShell"
import { TextField, PasswordField, fieldContainer, fieldItem } from "../components/auth/Field"
import { Button } from "../components/ui/button"
import { ensureSeeded, loginUser, registerUser } from "../lib/auth"

ensureSeeded()

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = "Please enter your full name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email."
    if (form.password.length < 6) e.password = "Password must be at least 6 characters."
    if (form.confirm !== form.password) e.confirm = "Passwords do not match."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    const res = await registerUser({ name: form.name, email: form.email, password: form.password })
    setLoading(false)
    if (!res.ok) {
      if (res.error.toLowerCase().includes("already exists")) setErrors({ email: res.error })
      else toast.error(res.error)
      return
    }
    await loginUser(form.email, form.password)
    toast.success(`Account created — welcome, ${form.name.split(" ")[0]}!`)
    navigate("/", { replace: true })
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Paryatan to plan trips and track your bookings."
      side="Create an account to save favourite destinations, get personalised quotes, and manage your travel plans — all in one place."
    >
      <form onSubmit={handleSubmit} noValidate>
        <motion.div variants={fieldContainer} initial="hidden" animate="show" className="space-y-4">
          <TextField id="name" label="Full name" value={form.name} onChange={set("name")} placeholder="Jane Traveller" error={errors.name} />
          <TextField id="email" label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" error={errors.email} />
          <PasswordField id="password" label="Password" value={form.password} onChange={set("password")} placeholder="At least 6 characters" error={errors.password} />
          <PasswordField id="confirm" label="Confirm password" value={form.confirm} onChange={set("confirm")} placeholder="Re-enter password" error={errors.confirm} />

          <motion.div variants={fieldItem}>
            <Button type="submit" variant="sunset" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </motion.div>
        </motion.div>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/signin" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
