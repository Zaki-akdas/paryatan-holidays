export const company = {
  name: "Paryatan Holidays",
  tagline: "Miles to Go...",
  subTagline: "Enjoy the World",
  phone: "+91 89823 82828",
  phoneRaw: "918982382828",
  phoneAlt: "+91 755 400 2828",
  email: "info@paryatan.co.in",
  website: "paryatan.co.in",
  address: "MM2/SF 06, 2nd Floor, Aashima Mall, Narmadapuram Rd, Danish Nagar, Bagmugaliya, Bhopal, Madhya Pradesh 462026",
}

export const services = [
  { icon: "Plane", title: "Domestic & International Air Ticketing", desc: "Best fares, instant confirmations, group blocks." },
  { icon: "BedDouble", title: "Hotel Reservations Worldwide", desc: "2★ to 5★, villas, resorts – negotiated rates." },
  { icon: "Map", title: "Customized Tour Packages", desc: "India & abroad, family / honeymoon / group." },
  { icon: "Landmark", title: "Pilgrimage & Spiritual Tours", desc: "Char Dham, Jyotirlinga, Vaishno Devi & more." },
  { icon: "Car", title: "Car / Coach Rentals", desc: "AC sedans to luxury coaches, pan-India." },
  { icon: "Briefcase", title: "Corporate / MICE Travel", desc: "Conferences, incentives, offsites – end to end." },
  { icon: "Stamp", title: "Visa & Passport Assistance", desc: "Documentation, appointments, fast-track." },
  { icon: "ShieldCheck", title: "Travel Insurance", desc: "Comprehensive medical & trip protection." },
  { icon: "Ship", title: "Cruise Holidays", desc: "Cordelia, Royal Caribbean, international sailings." },
  { icon: "Mountain", title: "Adventure Tours", desc: "Trekking, rafting, biking – Ladakh, Himachal, NE." },
  { icon: "BadgeIndianRupee", title: "Foreign Exchange", desc: "Currency, forex cards at best rates." },
  { icon: "UsersRound", title: "Group & School Tours", desc: "Safe, well-managed educational trips." },
  { icon: "Headphones", title: "24×7 Travel Support", desc: "On-trip assistance, anytime, anywhere." },
]

export type PackageItem = {
  id: string
  route: string
  duration: string
  nights: number
  highlight?: string
  image: 'taj'|'kashmir'|'kerala'|'goa'|'rajasthan'|'northeast'|'shimla'|'ladakh'|'andaman'|'dubai'|'bali'|'europe'
  transport: string
  meals: string
  sightseeing: string[]
  priceFrom?: string
  itinerary?: { day: number; title: string; detail: string }[]
}

const mk = (id:string, route:string, duration:string, nights:number, image:PackageItem['image'], transport:string, meals:string, sightseeing:string | string[], priceFrom?:string, highlight?:string, itinerary?:PackageItem['itinerary']): PackageItem => {
  const sights = Array.isArray(sightseeing) ? sightseeing : sightseeing.split(/[|,]/).map(s => s.trim()).filter(Boolean)
  return {id, route, duration, nights, image, transport, meals, sightseeing: sights, priceFrom, highlight, itinerary}
}

export const packages: Record<string, PackageItem[]> = {
  north: [
    mk('north-gt','Delhi – Agra – Jaipur Golden Triangle','5N / 6D',5,'taj','Train / Flight to Delhi + AC Private Car','Daily Breakfast',"Taj Mahal sunrise, Agra Fort, Amber Fort, Hawa Mahal, India Gate",'₹24,900 pp'),
    mk('north-shimla','Shimla – Manali – Chandigarh','6N / 7D',6,'shimla','Volvo / Flight + AC Car','Daily Breakfast & Dinner',"Mall Road Shimla, Kufri, Rohtang / Atal Tunnel, Solang Valley, Manali Mall",'₹29,500 pp'),
    mk('north-kashmir','Best of Kashmir – Srinagar, Gulmarg, Pahalgam','6N / 7D',6,'kashmir','Flight to Srinagar + AC Car','Daily Breakfast',"Dal Lake shikara, Gulmarg Gondola, Pahalgam Betaab Valley, Mughal Gardens",'₹38,900 pp'),
    mk('north-amritsar','Amritsar – Dalhousie – Dharamshala','5N / 6D',5,'shimla','Train / Flight + AC Car','Daily Breakfast',"Golden Temple, Wagah Border, Khajjiar Mini Switzerland, McLeodganj",'₹26,900 pp'),
    mk('north-haridwar','Haridwar – Rishikesh – Mussoorie','4N / 5D',4,'shimla','Train + AC Car','Daily Breakfast',"Har Ki Pauri Ganga Aarti, Rishikesh Laxman Jhula, Mussoorie Mall Road, Kempty Falls",'₹18,500 pp'),
    mk('north-ladakh','Leh – Ladakh – Nubra – Pangong','6N / 7D',6,'ladakh','Flight to Leh + 4x4 SUV','Breakfast & Dinner',"Pangong Lake, Nubra Valley camel safari, Khardung La, Magnetic Hill",'₹44,900 pp','Adventure'),
    mk('north-corbett','Jim Corbett Wildlife Safari','2N / 3D',2,'shimla','Train + Jeep Safari','All Meals – Jungle Lodge',"2x Jeep Safaris, Corbett Falls, Garjiya Temple",'₹12,900 pp'),
    mk('north-vaishno','Vaishno Devi – Patnitop','4N / 5D',4,'shimla','Train / Flight to Jammu + AC Car','Daily Breakfast + 1 Dinner',"Vaishno Devi darshan assistance, Patnitop Nathatop",'₹19,900 pp'),
  ],
  west: [
    mk('west-goa','Goa Beaches & Nightlife','3N / 4D',3,'goa','Flight to Goa + AC Car','Daily Breakfast',"North Goa – Baga, Calangute, Fort Aguada | South Goa cruise",'₹16,900 pp'),
    mk('west-udaipur','Udaipur – Mount Abu Royal Rajasthan','4N / 5D',4,'rajasthan','Train / Flight + AC Car','Daily Breakfast',"City Palace Udaipur, Lake Pichola boat, Mount Abu Dilwara Temples",'₹22,500 pp'),
    mk('west-desert','Jaipur – Jodhpur – Jaisalmer Desert','6N / 7D',6,'rajasthan','Flight to Jaipur + AC Car','Daily Breakfast',"Amber Fort, Mehrangarh, Jaisalmer Sam Dunes camel safari & cultural night",'₹34,900 pp'),
    mk('west-mahab','Mumbai – Lonavala – Mahabaleshwar','4N / 5D',4,'goa','Flight / Train + AC Car','Daily Breakfast',"Gateway of India, Lonavala viewpoints, Mahabaleshwar strawberry farms",'₹21,900 pp'),
    mk('west-gir','Statue of Unity – Ahmedabad – Gir','4N / 5D',4,'rajasthan','Train / Flight + AC Car','Breakfast & Dinner',"Statue of Unity, Gir Lion safari, Somnath Temple",'₹24,900 pp'),
    mk('west-kutch','Rann of Kutch – White Desert Festival','3N / 4D',3,'rajasthan','Flight to Bhuj + AC Car','All Meals – Tent City',"White Rann sunset, cultural village, handicraft bazaar",'₹23,900 pp'),
  ],
  south: [
    mk('south-kerala','Wonders of Kerala – Munnar, Thekkady, Alleppey','6N / 7D',6,'kerala','Flight to Kochi + AC Car / Houseboat','Daily Breakfast',"Tea gardens Munnar, Periyar wildlife cruise, Alleppey overnight houseboat",'₹36,900 pp'),
    mk('south-karnataka','Coastal Karnataka – Gokarna, Udupi, Murudeshwar','6N / 7D',6,'goa','Train / Flight + AC Car','Daily Breakfast',"Om Beach Gokarna, Murudeshwar Shiva statue, St. Mary's Island",'₹29,900 pp'),
    mk('south-ooty','Ooty – Coonoor – Kodaikanal','4N / 5D',4,'northeast','Flight to Coimbatore + AC Car','Daily Breakfast',"Nilgiri toy train, Botanical Gardens, Coaker's Walk Kodaikanal",'₹22,900 pp'),
    mk('south-hyderabad','Hyderabad – Ramoji Film City','2N / 3D',2,'rajasthan','Flight / Train + AC Car','Daily Breakfast',"Charminar, Golconda, full-day Ramoji Film City",'₹11,900 pp'),
    mk('south-andaman','Andaman – Port Blair – Havelock','5N / 6D',5,'andaman','Flight to Port Blair + Ferry','Daily Breakfast',"Cellular Jail light & sound, Radhanagar Beach, Elephant Beach snorkeling",'₹39,900 pp'),
    mk('south-pondy','Chennai – Mahabalipuram – Pondicherry','3N / 4D',3,'kerala','Flight / Train + AC Car','Daily Breakfast',"Mahabalipuram Shore Temple, Pondicherry French Quarter, Auroville",'₹17,500 pp'),
  ],
  east: [
    mk('east-darjeeling','Gangtok – Pelling – Darjeeling','5N / 6D',5,'northeast','Flight to Bagdogra + AC Car','Breakfast & Dinner',"Tsomgo Lake, Nathula Pass, Tiger Hill sunrise, Darjeeling tea gardens",'₹32,900 pp'),
    mk('east-meghalaya','Meghalaya – Shillong – Cherrapunji','4N / 5D',4,'northeast','Flight to Guwahati + AC Car','Daily Breakfast',"Living root bridges, Nohkalikai Falls, Mawsmai Caves, Umiam Lake",'₹27,500 pp'),
    mk('east-sundarbans','Kolkata – Sundarbans','3N / 4D',3,'northeast','Train + Boat Cruise','All Meals',"Sundarbans mangrove boat safari, village walk, watchtower",'₹16,900 pp'),
    mk('east-silk','Sikkim Silk Route','5N / 6D',5,'northeast','Flight to Bagdogra + 4x4','Breakfast & Dinner',"Zuluk loops, Nathang Valley, Kupup Lake, Aritar",'₹31,900 pp'),
    mk('east-kaziranga','Kaziranga – Shillong – Guwahati','5N / 6D',5,'northeast','Flight to Guwahati + AC Car','Breakfast & Dinner',"Kaziranga elephant & jeep safari, Kamakhya Temple, Shillong peak",'₹33,900 pp'),
    mk('east-puri','Puri – Konark – Bhubaneswar','3N / 4D',3,'northeast','Train / Flight + AC Car','Daily Breakfast',"Jagannath Temple Puri, Konark Sun Temple, Lingaraj Temple",'₹15,900 pp'),
  ],
  adventure: [
    mk('adv-ladakh-bike','Leh Ladakh Bike Expedition','9N / 10D',9,'ladakh','Flight + Royal Enfield 350','Breakfast & Dinner | Backup vehicle',"Khardung La, Pangong, Nubra, Tso Moriri – full safety crew",'₹58,900 pp'),
    mk('adv-manali-leh','Manali – Leh – Srinagar Overland','8N / 9D',8,'ladakh','4x4 SUV Convoy','Breakfast & Dinner',"Rohtang, Jispa, Sarchu, Pangong, Kargil – acclimatization days",'₹52,900 pp'),
    mk('adv-rafting','Rishikesh River Rafting Camp','2N / 3D',2,'shimla','Train + AC Car','All Meals – Riverside Camp',"16km rafting, cliff jumping, bungee optional, Ganga Aarti",'₹8,900 pp'),
    mk('adv-spiti','Spiti Valley Circuit','7N / 8D',7,'ladakh','Tempo Traveller 4x4','Breakfast & Dinner',"Chandratal Lake, Key Monastery, Kaza, Kalpa – high altitude",'₹41,900 pp'),
    mk('adv-meghalaya-trek','Meghalaya Caving & Trek','5N / 6D',5,'northeast','Flight + AC Car + Trek','Breakfast & Dinner',"Double-decker root bridge trek, Mawsmai caves, Dawki boating",'₹29,900 pp'),
    mk('adv-andaman-scuba','Andaman Scuba & Island Hopping','5N / 6D',5,'andaman','Flight + Ferry','Daily Breakfast',"2x Scuba dives, Havelock – Neil Island, Radhanagar sunset",'₹42,900 pp'),
  ],
  wildlife: [
    mk('wild-corbett','Jim Corbett – Nainital','3N / 4D',3,'shimla','Train + Jeep Safari','Breakfast & Dinner',"2x Corbett jeep safaris, Naini Lake boating",'₹18,900 pp'),
    mk('wild-ranthambore','Ranthambore Tiger Safari','2N / 3D',2,'rajasthan','Train + Canter/Jeep','Breakfast & Dinner',"2x Tiger safaris, Ranthambore Fort",'₹14,900 pp'),
    mk('wild-gir','Gir National Park – Somnath','3N / 4D',3,'rajasthan','Train / Flight + AC Car','Breakfast & Dinner',"2x Gir lion safari, Somnath Jyotirlinga",'₹19,900 pp'),
    mk('wild-kaziranga','Kaziranga Rhino Safari – Assam','3N / 4D',3,'northeast','Flight + Jeep','Breakfast & Dinner',"Elephant & jeep safari – one-horned rhino",'₹24,900 pp'),
    mk('wild-mp','Bandhavgarh – Kanha – MP Tigers','5N / 6D',5,'shimla','Train + Safari Jeep','Breakfast & Dinner',"4x Tiger safaris across 2 parks",'₹36,900 pp'),
    mk('wild-sundarbans2','Sundarbans Mangrove Cruise','2N / 3D',2,'northeast','Train + Boat','All Meals',"Mangrove cruise, Sajnekhali watchtower, village tour",'₹13,900 pp'),
  ],
  corporate: [
    mk('corp-goa','Goa MICE – Beach Resorts','Tailor-made',3,'goa','Flight + Luxury Coach','Breakfast + Gala Dinner',"Beachside conference hall, DJ night, water sports, team activities",'Price on request'),
    mk('corp-jaipur','Jaipur Incentive & Galas','Tailor-made',3,'rajasthan','Flight + Coach','Breakfast + Gala Dinner',"Heritage hotel gala, elephant ride, cultural evening, awards night",'Price on request'),
    mk('corp-kerala','Kerala Backwater Conferences','Tailor-made',3,'kerala','Flight + AC Coach','Breakfast + Dinner',"Backwater resort MICE, houseboat networking, Ayurveda spa",'Price on request'),
    mk('corp-shimla','Shimla / Manali Offsites','Tailor-made',3,'shimla','Volvo / Flight + Coach','MAP Plan',"Mountain resort, adventure team-building, bonfire",'Price on request'),
    mk('corp-thailand','Thailand – Phuket – Krabi Incentive','4N / 5D',4,'bali','International Flight + Coach','Daily Breakfast',"Phi Phi island cruise, gala dinner, city tours – MICE rates",'Price on request'),
    mk('corp-dubai','Dubai Corporate Tour','3N / 4D',3,'dubai','International Flight + Coach','Daily Breakfast',"Desert safari gala, dhow cruise, Burj Khalifa – MICE",'Price on request'),
  ],
  international: [
    mk('int-dubai','Dubai – Abu Dhabi Extravaganza','4N / 5D',4,'dubai','International Flight + PVT Transfers','Daily Breakfast',"Burj Khalifa, Desert Safari, Abu Dhabi Grand Mosque, Marina Dhow Cruise",'₹59,900 pp'),
    mk('int-singmal','Singapore – Malaysia Twin Country','5N / 6D',5,'bali','International Flight + Coach','Daily Breakfast',"Universal Studios, Gardens by the Bay, Kuala Lumpur Twin Towers",'₹78,900 pp'),
    mk('int-thailand','Thailand – Bangkok – Pattaya','4N / 5D',4,'bali','International Flight + AC Coach','Daily Breakfast',"Coral Island speedboat, Alcazar Show, Bangkok temples & shopping",'₹39,900 pp'),
    mk('int-bali','Bali – Ubud – Seminyak','5N / 6D',5,'bali','International Flight + PVT Car','Daily Breakfast',"Ubud rice terraces, Tanah Lot, Uluwatu Kecak dance, beach clubs",'₹64,900 pp'),
    mk('int-europe','Europe Classic – Paris, Swiss, Italy','8N / 9D',8,'europe','International Flight + Euro Coach','Daily Breakfast',"Eiffel Tower, Swiss Alps Mt. Titlis, Venice gondola, Rome Colosseum",'₹1,89,900 pp'),
    mk('int-maldives','Maldives Honeymoon Escape','3N / 4D',3,'andaman','International Flight + Speedboat','Breakfast & Dinner',"Water villa, snorkeling, candlelight dinner, spa – honeymoon freebies",'₹82,900 pp / couple'),
    mk('int-vietnam','Vietnam – Hanoi – Halong – Danang','5N / 6D',5,'bali','International Flight + Coach','Daily Breakfast',"Halong Bay overnight cruise, Hoi An lantern town, Ba Na Hills",'₹69,900 pp'),
    mk('int-turkey','Turkey – Istanbul – Cappadocia','6N / 7D',6,'europe','International Flight + Domestic Flight','Daily Breakfast',"Bosphorus cruise, Cappadocia hot air balloon, Pamukkale pools",'₹1,24,900 pp'),
  ],
}

export const packageTabs = [
  { id: "north", label: "North India" },
  { id: "west", label: "West & Rajasthan" },
  { id: "south", label: "South India" },
  { id: "east", label: "East & Northeast" },
  { id: "adventure", label: "Adventure" },
  { id: "wildlife", label: "Wildlife" },
  { id: "corporate", label: "Corporate / MICE" },
  { id: "international", label: "International" },
]

export const specializations = [
  "Honeymoon & Romantic Getaways",
  "Pilgrimage & Char Dham Yatra",
  "Student / Educational Group Tours",
  "Senior Citizen Friendly Tours",
  "Luxury & Boutique Stays",
  "Adventure & Trekking Expeditions",
  "Cruise & Island Holidays",
  "Visa, Forex & Travel Insurance",
]

export const whyUs = [
  { value: 12, suffix: "+", label: "Years of Trust", desc: "Bhopal-based, pan-India ops" },
  { value: 48000, suffix: "+", label: "Happy Travellers", desc: "Families, corporates, students" },
  { value: 120, suffix: "+", label: "Destinations", desc: "India & 35+ countries" },
  { value: 24, suffix: "/7", label: "On-trip Support", desc: "Real humans, real fast" },
]

// Helper to build a day-wise plan if none is stored
export function buildItinerary(pkg: PackageItem) {
  if (pkg.itinerary && pkg.itinerary.length) return pkg.itinerary
  const cities = pkg.route.split('–').map(s=>s.trim())
  const days = pkg.nights + 1
  const out = []
  for (let d = 1; d <= days; d++) {
    if (d === 1) out.push({day: d, title: `Arrival – ${cities[0]}`, detail: `Welcome by Paryatan representative. Hotel check-in. Evening at leisure. Overnight at ${cities[0]}.`})
    else if (d === days) out.push({day: d, title: `Departure`, detail: `Breakfast. Check-out and transfer to airport / railway station with sweet memories.`})
    else {
      const city = cities[Math.min(d-1, cities.length-1)]
      out.push({day: d, title: `${city} Sightseeing`, detail: `${pkg.sightseeing.slice(0,3).join(', ')}. Meals: ${pkg.meals}. Transport: ${pkg.transport.split('+')[0].trim()}.`})
    }
  }
  return out
}


