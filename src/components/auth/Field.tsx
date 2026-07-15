import { motion, type Variants } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { forwardRef, useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const fieldContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

export const fieldItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export function TextField({
  id,
  label,
  type = "text",
  error,
  ...props
}: { id: string; label: string; type?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <motion.div variants={fieldItem} className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} className={error ? "border-destructive focus-visible:ring-destructive" : ""} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </motion.div>
  )
}

export const PasswordField = forwardRef<HTMLInputElement, {
  id: string
  label: string
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>>(function PasswordField({ id, label, error, ...props }, ref) {
  const [show, setShow] = useState(false)
  return (
    <motion.div variants={fieldItem} className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          type={show ? "text" : "password"}
          className={`pr-11 ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </motion.div>
  )
})
