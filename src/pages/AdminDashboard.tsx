import { useEffect, useMemo, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { LogOut, Search, Trash2, Users as UsersIcon, Inbox, ShieldCheck, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  deleteLead,
  getLeads,
  searchLeads,
  seedDemoLeadsIfEmpty,
  updateLead,
  type Lead,
} from "../lib/leads"
import {
  deleteUser,
  getSession,
  listUsers,
  logout,
  setUserStatus,
  updateUserPassword,
  type User,
} from "../lib/auth"
import { company } from "../data/packages"

const STATUS_OPTIONS: Lead["status"][] = ["new", "contacted", "quoted", "booked", "closed"]

const statusStyles: Record<Lead["status"], string> = {
  new: "bg-accent/15 text-accent-foreground",
  contacted: "bg-primary/10 text-primary",
  quoted: "bg-amber-100 text-amber-700",
  booked: "bg-emerald-100 text-emerald-700",
  closed: "bg-muted text-muted-foreground",
}

function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const dur = 700
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{n}</>
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checked ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </label>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const session = getSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [leadQuery, setLeadQuery] = useState("")
  const [userQuery, setUserQuery] = useState("")
  const [selected, setSelected] = useState<Lead | null>(null)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  useEffect(() => {
    const s = getSession()
    if (!s || s.role !== "admin") {
      navigate("/signin", { replace: true })
      return
    }
    seedDemoLeadsIfEmpty()
    setLeads(getLeads())
    setUsers(listUsers())
  }, [navigate])

  const refreshLeads = () => setLeads(getLeads())
  const refreshUsers = () => setUsers(listUsers())

  const visibleLeads = useMemo(() => searchLeads(leadQuery, leads), [leadQuery, leads])
  const visibleUsers = useMemo(() => {
    if (!userQuery.trim()) return users
    const q = userQuery.toLowerCase()
    return users.filter((u) => [u.name, u.email, u.role].join(" ").toLowerCase().includes(q))
  }, [userQuery, users])

  const stats = useMemo(() => {
    const counts = { total: leads.length, new: 0, booked: 0, members: users.length }
    leads.forEach((l) => {
      if (l.status === "new") counts.new++
      if (l.status === "booked") counts.booked++
    })
    return counts
  }, [leads, users])

  if (!session || session.role !== "admin") return <Navigate to="/signin" replace />

  const handleLogout = () => {
    logout()
    navigate("/signin", { replace: true })
  }

  const cards = [
    { label: "Total Leads", value: stats.total, icon: Inbox, accent: false },
    { label: "New Leads", value: stats.new, icon: Sparkles, accent: true },
    { label: "Booked", value: stats.booked, icon: ShieldCheck, accent: false },
    { label: "Members", value: stats.members, icon: UsersIcon, accent: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3fafc] to-background">
      {/* Header */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="sticky top-0 z-30 border-b border-border bg-white/85 backdrop-blur-xl"
      >
        <div className="container-narrow flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Paryatan Holidays" className="h-9 w-9 object-contain" />
            <div>
              <p className="font-semibold leading-tight">{company.name}</p>
              <p className="text-xs text-muted-foreground">Admin Console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Back to Site
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="font-medium">{session.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container-narrow py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 220, damping: 22 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <span className={`w-9 h-9 rounded-xl grid place-items-center ${c.accent ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>
                  <c.icon className="w-4 h-4" />
                </span>
              </div>
              <p className={`display text-3xl mt-2 font-bold ${c.accent ? "text-accent" : "text-foreground"}`}>
                <CountUp value={c.value} />
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* LEADS */}
          <TabsContent value="leads">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="relative sm:max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={leadQuery}
                  onChange={(e) => setLeadQuery(e.target.value)}
                  placeholder="Search leads…"
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" size="sm" onClick={refreshLeads} className="sm:ml-auto">
                Refresh
              </Button>
            </div>

            <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="max-h-[62vh] overflow-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary text-left sticky top-0 z-10">
                      <tr>
                        <Th>Name</Th>
                        <Th>Destination</Th>
                        <Th>Source</Th>
                        <Th>Status</Th>
                        <Th></Th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {visibleLeads.map((lead, i) => (
                          <motion.tr
                            key={lead.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: Math.min(i * 0.02, 0.3) }}
                            onClick={() => setSelected(lead)}
                            className={`border-t border-border cursor-pointer transition-colors hover:bg-secondary/60 ${selected?.id === lead.id ? "bg-secondary/70" : ""}`}
                          >
                            <Td>
                              <div className="font-medium">{lead.name}</div>
                              <div className="text-xs text-muted-foreground">{lead.email}</div>
                            </Td>
                            <Td>{lead.destination}</Td>
                            <Td className="text-muted-foreground">{lead.source}</Td>
                            <Td>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${statusStyles[lead.status]}`}>
                                {lead.status}
                              </span>
                            </Td>
                            <Td className="text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteLead(lead.id)
                                  refreshLeads()
                                  if (selected?.id === lead.id) setSelected(null)
                                  toast.success("Lead deleted")
                                }}
                                className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </Td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      {visibleLeads.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-muted-foreground">
                            No leads found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.aside
                    key={selected.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    className="rounded-2xl border border-border bg-card p-5 h-fit lg:sticky lg:top-24"
                  >
                    <LeadDetail
                      lead={selected}
                      onStatusChange={(status) => {
                        updateLead(selected.id, { status })
                        refreshLeads()
                        setSelected({ ...selected, status })
                      }}
                    />
                  </motion.aside>
                ) : (
                  <motion.aside
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted-foreground lg:sticky lg:top-24"
                  >
                    Select a lead to view details and update its status.
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* MEMBERS */}
          <TabsContent value="members">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="relative sm:max-w-sm w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search members…"
                  className="pl-9"
                />
              </div>
              <Button variant="secondary" size="sm" onClick={refreshUsers} className="sm:ml-auto">
                Refresh
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="max-h-[62vh] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left sticky top-0 z-10">
                    <tr>
                      <Th>Member</Th>
                      <Th>Role</Th>
                      <Th>Joined</Th>
                      <Th>Status</Th>
                      <Th></Th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {visibleUsers.map((u, i) => (
                        <motion.tr
                          key={u.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: Math.min(i * 0.02, 0.3) }}
                          className="border-t border-border"
                        >
                          <Td>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </Td>
                          <Td>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs capitalize ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                              {u.role}
                            </span>
                          </Td>
                          <Td className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</Td>
                          <Td>
                            <button
                              onClick={() => {
                                const next = u.status === "active" ? "blocked" : "active"
                                setUserStatus(u.id, next)
                                refreshUsers()
                                toast.success(`${u.name} ${next === "active" ? "activated" : "blocked"}`)
                              }}
                              className={`text-xs px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}
                            >
                              {u.status}
                            </button>
                          </Td>
                          <Td className="text-right">
                            {u.role === "admin" ? (
                              <span className="text-xs text-muted-foreground">—</span>
                            ) : (
                              <button
                                onClick={() => {
                                  deleteUser(u.id)
                                  refreshUsers()
                                  toast.success("Member removed")
                                }}
                                className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            )}
                          </Td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {visibleUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-muted-foreground">
                          No members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings">
            <div className="grid gap-6 max-w-2xl">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="display text-lg font-bold">Profile</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Name</p>
                    <p className="font-medium">{session.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</p>
                    <p className="font-medium">{session.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Role</p>
                    <p className="font-medium capitalize">{session.role}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h3 className="display text-lg font-bold">Preferences</h3>
                <Toggle checked={notifications} onChange={setNotifications} label="Email notifications" />
                <Toggle checked={darkMode} onChange={setDarkMode} label="Dark mode" />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm">Language</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="h-10 rounded-xl border border-input bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h3 className="display text-lg font-bold">Security</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                  />
                </div>
                <Button
                  size="sm"
                  disabled={pwSaving || !currentPw || !newPw}
                  onClick={async () => {
                    setPwSaving(true)
                    const res = await updateUserPassword(session.userId, currentPw, newPw)
                    if (res.ok) {
                      toast.success("Password updated")
                      setCurrentPw("")
                      setNewPw("")
                    } else {
                      toast.error(res.error)
                    }
                    setPwSaving(false)
                  }}
                >
                  {pwSaving ? "Saving…" : "Change password"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
      {children}
    </th>
  )
}
function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-top ${className || ""}`}>{children}</td>
}

function LeadDetail({ lead, onStatusChange }: { lead: Lead; onStatusChange: (s: Lead["status"]) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="display text-xl font-bold">{lead.name}</h3>
        <p className="text-sm text-muted-foreground">{lead.email} · {lead.phone}</p>
      </div>

      <dl className="space-y-2 text-sm">
        <Row label="Destination" value={lead.destination} />
        <Row label="Travelers" value={lead.travelers ? String(lead.travelers) : "—"} />
        <Row label="Budget" value={lead.budget || "—"} />
        <Row label="Source" value={lead.source} />
        <Row label="Date" value={new Date(lead.date).toLocaleString()} />
      </dl>

      {lead.message && (
        <div>
          <p className="text-xs uppercase text-muted-foreground mb-1">Message</p>
          <p className="text-sm bg-secondary/60 rounded-xl p-3">{lead.message}</p>
        </div>
      )}

      <div>
        <p className="text-xs uppercase text-muted-foreground mb-2">Update status</p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-1 rounded-full text-xs capitalize border transition-colors ${lead.status === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  )
}
