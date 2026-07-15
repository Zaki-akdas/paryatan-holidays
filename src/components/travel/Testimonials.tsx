import { motion } from 'framer-motion'

type Review = { name: string; text: string; place?: string; stars?: number; tag?: string }

const reviews: Review[] = [
  { name: 'Chanchalesh Gagdhe', text: 'Highly appreciate and recommend PARYATAN HOLIDAYS for your well planned and organised family/solo travels. Mr. AAZAM has been super helpful with regular follow ups.', place: 'Family Trip • Bhopal', stars: 5 },
  { name: 'Anshu Verma', text: 'It was an amazing trip. Very well organised. Tour agent Mr. Praveen managed the things very nicely. All the students and the teachers thoroughly enjoyed.', place: 'School Tour', stars: 5 },
  { name: 'gajendra rajput', text: 'Thank you PARYATAN HOLIDAYS for such a wonderful and cost efficient trip. Best hotels best travel suggestions everything was perfect. You deserve 10 out of 5 star…', place: 'Family Holiday', stars: 5 },
  { name: 'Vikas Jain', text: 'Best Tour In My Life – Hyderabad – Golconda Fort – Ramoji Film City – Snow World – Char Minar 😊🕌💯', place: 'Hyderabad • Educational Tour', stars: 5 },
  { name: 'Chhavi Pawar', text: 'Thank you paryatan holidays for providing such an interesting and wonderful tour. I really enjoyed my trip a lot and hope to get a chance to travel again.', place: 'Group Tour', stars: 5 },
  { name: 'Sanjana Sharma', text: 'It was a memorable trip of Mysore to Ooty. Our guide Sanil Nair Sir is super friendly, He made our trip easy and more flexible.', place: 'Mysore – Ooty', stars: 5 },
  { name: 'Khushboo Chhabra Sandhu', text: 'Trip to Jaisalmer was fantastic and memorable! The hotels & tours you provided were excellent. Highly recommended for family & friends.', place: 'Rajasthan • Jaisalmer', stars: 5 },
  { name: 'Geetha S. Nair', text: 'Travelling with Sanil was a very great experience. They organised the tour according to the wish of the participants and in a very budgetted way.', place: 'Group Tour • Kerala', stars: 5 },
  { name: 'Dev', text: 'My journey from Bhopal to Ooty was a mesmerizing adventure filled with scenic beauty and cultural richness. Thank you paryatan for organising this tour.', place: 'Ooty • Solo', stars: 5 },
  { name: 'Jacob Malkias', text: 'It was wonderful to be part of Paryatan Team, enjoyed a lot and well arranged everything: traveling, stay, food, and dealing; all wonderful.', place: 'Group Tour', stars: 5 },
  { name: 'Sunakshi Crosue', text: 'It was a memorable trip of Hyderabad. Our guides Sanil Nair Sir and Anoop Sir were super friendly, they made our trip easy and more flexible.', place: 'Hyderabad', stars: 5 },
  { name: 'Zoya Ghaus', text: 'We went Amritsar to Manali we had enjoyed a lot. Thank u paryatan holidays. Our guide was brilliant he told each and everything about that particular place.', place: 'Amritsar – Manali', stars: 5 },
  { name: 'Ketan Pandey', text: 'It was a great experience for me to have a travel tour with Praveen sir. I had a lot of fun and had made memories.', place: 'Student Tour', stars: 5 },
  { name: 'Soma Koner', text: 'Thank you Pravin Sir for the wonderful Manali trip. This is our second experience with you and I hope many more to come. 3 cheers for Paryatan holidays 🎊', place: 'Manali • Repeat Client', stars: 5 },
  { name: 'Satish Patni', text: 'Sikkim tour bahut Anand mein Raha, hamari poori family ne khoob enjoy kiya. Paryatan ne bahut achha arrangements kiye.', place: 'Sikkim • Family', stars: 5 },
  { name: 'Atharv Jain', text: 'Very good communication and tour organizer paryatan holidays and good services and tasty food good cab bus and very nice service', place: 'School Tour', stars: 5 },
  { name: 'yash jain', text: 'One Stop solution for all your travel needs. best and most professional travel planner.', place: 'Bhopal', stars: 5, tag: 'Local Guide' },
  { name: 'ashwin sivadas', text: 'The perfect agency that i came across!! Had a really wonderful experience. Perfect companion to rely on!!', place: 'Verified Traveller', stars: 5 },
  { name: 'Aarth padhar', text: 'We enjoyed a lot at every sightseeing....all memories are very good....those days like a dream comes true..... thank you for guidance and all arrangements', place: 'Family Trip', stars: 5 },
  { name: 'Vishesh Dubey', text: 'It was very wonderful amazing experience....we want another chance to explore it.... Thank you paryatan team......', place: 'Group Tour', stars: 5 },
  { name: 'Bharat Sindoor', text: 'Thank you paryatan holidays for providing such an interesting and wonderful tour. This was my first trip – amazing and memorable.', place: 'First-time Traveller', stars: 5 },
  { name: 'Shrashti Awasthi', text: 'Best guide ever!! I had amazing days in Hyderabad and that couldn\'t have been possible with Praveen sir, thank you for that great experience!!', place: 'Hyderabad', stars: 5 },
  { name: 'Ayush saxena', text: 'I had an excellent experience with Paryatan Holidays. They organized my stay seamlessly and took into consideration my food restrictions.', place: 'Verified • Google', stars: 5 },
  { name: 'Geeta Rani', text: 'Good arrangements done by Paryatan Holidays. Good experience 😊', place: 'Verified Traveller', stars: 5 },
]

function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500 text-[13px]" aria-label={`${n} stars`}>
      {'★★★★★'.slice(0,n)}
    </div>
  )
}

function ReviewCard({ r }: { r: Review }) {
  const initials = r.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()
  return (
    <div className="w-[320px] sm:w-[360px] shrink-0 rounded-[20px] bg-white border border-slate-200 shadow-sm p-5 mx-3">
      <Stars n={r.stars ?? 5} />
      <p className="text-[14.5px] text-slate-700 leading-relaxed mt-2.5 line-clamp-[7]">“{r.text}”</p>
      <div className="flex items-center gap-3 mt-4">
        <div className="w-9 h-9 rounded-full bg-gradient-ocean text-white flex items-center justify-center text-[11px] font-bold">{initials}</div>
        <div>
          <div className="text-[13.5px] font-semibold text-[#1b3440]">{r.name}</div>
          <div className="text-[11.5px] text-slate-500">{r.place}{r.tag ? ` • ${r.tag}` : ''}</div>
        </div>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse=false, duration=85 }: { items: Review[], reverse?: boolean, duration?: number }) {
  const dup = [...items, ...items]
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {dup.map((r, i) => <ReviewCard key={r.name + i} r={r} />)}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#f7fbfc] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#f7fbfc] to-transparent" />
    </div>
  )
}

export default function Testimonials() {
  const row1 = reviews.slice(0, 12)
  const row2 = reviews.slice(12)

  return (
    <section id="reviews" className="section-pad bg-[#f6fbfc]/88 backdrop-blur-[1.5px] overflow-hidden border-y border-cyan-100/70">
      <div className="container-narrow text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[12px] uppercase tracking-widest text-primary font-semibold">Google Reviews</p>
          <h2 className="text-[34px] md:text-[42px] tracking-tight text-[#13313b] mt-2">Travellers love Paryatan</h2>
          <div className="flex items-center justify-center gap-3 mt-3 text-[14px] text-slate-700">
            <span className="text-amber-500 text-[18px]">★★★★★</span>
            <span><b>4.8 / 5</b> • 500+ Google reviews • Bhopal</span>
          </div>
          <p className="text-slate-600 mt-2 text-[14.5px]">Real reviews from families, students, corporate groups & solo travellers across India.</p>
        </motion.div>
      </div>

      <div className="mt-10 space-y-5">
        <MarqueeRow items={row1} duration={95} />
        <MarqueeRow items={row2} reverse duration={105} />
      </div>

      <div className="container-narrow text-center mt-8 text-[12.5px] text-slate-500">
        Reviews sourced from Google Maps – Paryatan Holidays, Bhopal • Guides mentioned: Sanil Nair, Anoop Sir, Praveen Sir, Aazam • 
        <a className="text-primary hover:underline ml-1" href="https://www.google.com/maps/search/Paryatan+Holidays+Bhopal" target="_blank" rel="noreferrer">Read all on Google</a>
      </div>
    </section>
  )
}
