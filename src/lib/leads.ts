export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  destination: string
  message?: string
  travelers?: number
  budget?: string
  startDate?: string
  hotelTier?: string
  date: string // ISO
  source: 'Contact Form' | 'Package Modal' | 'Itinerary Page' | 'Trip Customizer' | 'AI Chat' | 'Demo'
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'closed'
}

const KEY = 'paryatan_leads_v1'

export function getLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch { return [] }
}

export function saveLead(partial: Omit<Lead, 'id' | 'date' | 'status'> & Partial<Pick<Lead, 'status'>>): Lead {
  const lead: Lead = {
    id: 'ld_' + Math.random().toString(36).slice(2,9) + Date.now().toString(36),
    status: 'new',
    date: new Date().toISOString(),
    ...partial,
  }
  const all = getLeads()
  all.unshift(lead)
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 500)))
  return lead
}

export function updateLead(id: string, patch: Partial<Lead>) {
  const all = getLeads().map(l => l.id === id ? { ...l, ...patch } : l)
  localStorage.setItem(KEY, JSON.stringify(all))
  return all.find(l => l.id === id)
}

export function deleteLead(id: string) {
  const all = getLeads().filter(l => l.id !== id)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function searchLeads(query: string, leads = getLeads()): Lead[] {
  if (!query.trim()) return leads
  const q = query.toLowerCase()
  return leads.filter(l =>
    [l.name, l.email, l.phone, l.destination, l.message||'', l.source, l.status, l.budget||'']
      .join(' ').toLowerCase()
      .includes(q)
  )
}

// Seed with real Google reviews turned into demo leads
export function seedDemoLeadsIfEmpty() {
  try {
    const existing = getLeads()
    if (existing.length > 3) return
    const demo: Omit<Lead,'id'|'date'|'status'>[] = [
      { name: 'Sunakshi Crosue', email: 'sunakshi@example.com', phone: '+91 98xxxxxx12', destination: 'Hyderabad', message: 'Memorable trip – guides Sanil Nair Sir and Anoop Sir were super friendly', travelers: 2, budget: '₹35,000', source: 'Demo', hotelTier: '' },
      { name: 'Anshu Verma', email: 'anshu.v@example.com', phone: '+91 98xxxxxx34', destination: 'Student Group Tour – North India', message: 'Amazing trip, very well organised. Tour agent Mr. Praveen managed nicely. All students and teachers thoroughly enjoyed.', travelers: 42, budget: 'Group – POA', source: 'Demo', hotelTier: '' },
      { name: 'Chanchalesh Gagdhe', email: 'chanchalesh.g@example.com', phone: '+91 98xxxxxx56', destination: 'Family / Solo – Custom', message: 'Highly appreciate PARYATAN HOLIDAYS for well planned family/solo travels. Mr. AAZAM super helpful with follow ups.', travelers: 2, budget: '₹55,000', source: 'Demo', hotelTier: '' },
      { name: 'Vikas Jain', email: 'vikas.jain@example.com', phone: '+91 98xxxxxx78', destination: 'Hyderabad – Golconda Fort – Ramoji Film City', message: 'Educational Tour – SCNA – Best Tour In My Life #Hyderabad', travelers: 35, budget: 'Group', source: 'Demo', hotelTier: '' },
      { name: 'gajendra rajput', email: 'gajendra.r@example.com', phone: '+91 98xxxxxx90', destination: 'Budget Family Tour', message: 'Wonderful and cost efficient trip. Best hotels best travel suggestions everything was perfect. 10 out of 5 star', travelers: 4, budget: '₹28,000', source: 'Demo', hotelTier: '' },
      { name: 'Sanjana Sharma', email: 'sanjana.s@example.com', phone: '+91 98xxxxxx11', destination: 'Mysore – Ooty', message: 'Memorable trip, guide Sanil Nair Sir super friendly, made trip easy and flexible.', travelers: 2, budget: '₹24,000', source: 'Demo', hotelTier: '' },
      { name: 'Khushboo Chhabra Sandhu', email: 'khushboo.c@example.com', phone: '+91 98xxxxxx22', destination: 'Jaisalmer – Rajasthan', message: 'Trip to Jaisalmer was fantastic! Hotels & tours excellent. Highly recommended for family & friends.', travelers: 4, budget: '₹42,000', source: 'Demo', hotelTier: '' },
      { name: 'Zoya Ghaus', email: 'zoya.g@example.com', phone: '+91 98xxxxxx33', destination: 'Amritsar – Manali', message: '5th Oct to 12th Oct – enjoyed a lot with teachers and friends. Guide was brilliant.', travelers: 3, budget: '₹31,000', source: 'Demo', hotelTier: '' },
      { name: 'Kartik Ahirwar', email: 'kartik.a@example.com', phone: '+91 98xxxxxx44', destination: 'Hyderabad / Ooty', message: 'Very wonderful experience, locations beautiful, guide Praveen sir very friendly, hotels and transport good.', travelers: 2, budget: '₹29,000', source: 'Demo', hotelTier: '' },
      { name: 'Dev Ooty', email: 'dev.o@example.com', phone: '+91 98xxxxxx55', destination: 'Bhopal → Ooty', message: 'Mesmerizing adventure, scenic beauty and cultural richness. Nilgiri Mountain Railway was highlight.', travelers: 2, budget: '₹34,000', source: 'Demo', hotelTier: '' },
      { name: 'Geetha S. Nair', email: 'geetha.nair@example.com', phone: '+91 98xxxxxx66', destination: 'South India Group', message: 'Travelling with Sanil was very great. Organised according to participants wish, very budgetted.', travelers: 18, budget: 'Group', source: 'Demo', hotelTier: '' },
      { name: 'Jacob Malkias', email: 'jacob.m@example.com', phone: '+91 98xxxxxx77', destination: 'Pilgrimage Group', message: 'Well arranged everything: traveling, stay, food, and dealing; all wonderful.', travelers: 12, budget: '₹22,000 pp', source: 'Demo', hotelTier: '' },
      { name: 'Satyam Rathore', email: 'satyam.r@example.com', phone: '+91 98xxxxxx88', destination: 'Mumbai – Imagica', message: 'Best food items, helped exploring new places, enjoyed Imagica so much – 5 days tour', travelers: 4, budget: '₹26,000', source: 'Demo', hotelTier: '' },
      { name: 'Atharv Jain', email: 'atharv.j@example.com', phone: '+91 98xxxxxx99', destination: 'School Tour', message: 'Very good communication and tour organizer, good services, tasty food, good cab bus, very nice service', travelers: 30, budget: 'Group', source: 'Demo', hotelTier: '' },
    ]
    const now = Date.now()
    const seeded = demo.map((d, i) => ({
      id: 'demo_' + i,
      status: (['new','contacted','quoted','booked'] as const)[i % 4],
      date: new Date(now - i * 86400000 * (2 + (i%5))).toISOString(),
      travelers: d.travelers,
      budget: d.budget,
      hotelTier: d.hotelTier,
      startDate: '',
      name: d.name,
      email: d.email,
      phone: d.phone,
      destination: d.destination,
      message: d.message,
      source: 'Demo' as const,
    }) as Lead)
    const merged = [...existing, ...seeded]
    localStorage.setItem(KEY, JSON.stringify(merged.slice(0,200)))
  } catch {}
}
