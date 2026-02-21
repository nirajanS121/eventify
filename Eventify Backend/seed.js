require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/User");
const Event = require("./models/Event");
const Booking = require("./models/Booking");
const PromoCode = require("./models/PromoCode");
const Settings = require("./models/Settings");
const Testimonial = require("./models/Testimonial");
const GalleryImage = require("./models/GalleryImage");
const Waitlist = require("./models/Waitlist");

const events = [
  {
    name: "Arctic Plunge Experience",
    type: "ICE_BATH",
    location: "Forge & Flow Wellness Center",
    venue: "Ice Chamber — Basement Level",
    date: "2026-03-15",
    startTime: "07:00",
    endTime: "09:00",
    price: 45,
    capacity: 20,
    booked: 14,
    bookingDeadline: "2026-03-14",
    description:
      "Push your limits with our signature cold exposure session. Start with guided breathwork to prepare your nervous system, then experience progressive cold immersion from 15°C down to 2°C. Our certified cold therapists will guide you through each stage, teaching you to control your breath, calm your mind, and unlock the incredible benefits of cold water therapy. Includes post-plunge sauna access and hot cacao.",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    ],
    instructor: "Viktor Hagen",
    difficulty: "Intermediate",
    equipment: ["Swimwear", "Towel", "Warm change of clothes", "Water bottle"],
    safetyNotes:
      "Not recommended for those with heart conditions, uncontrolled blood pressure, or pregnancy. Consult your doctor if unsure. Cold exposure will be progressive — no one is forced beyond their comfort zone.",
    status: "active",
    featured: true,
  },
  {
    name: "Sunrise Flow Yoga",
    type: "YOGA",
    location: "Rooftop Garden Studio",
    venue: "The Glass Pavilion — 12th Floor",
    date: "2026-03-10",
    startTime: "06:00",
    endTime: "07:30",
    price: 25,
    capacity: 30,
    booked: 22,
    bookingDeadline: "2026-03-09",
    description:
      "Welcome the morning sun with a flowing vinyasa sequence designed to awaken your body and calm your mind. This 90-minute session blends traditional yoga postures with modern mobility work, set against a stunning sunrise backdrop. Perfect for finding your center before the day begins. Herbal tea ceremony included after class.",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800",
    ],
    instructor: "Maya Chen",
    difficulty: "All Levels",
    equipment: ["Yoga mat (provided)", "Comfortable clothing", "Water bottle"],
    safetyNotes:
      "Inform instructor of any injuries before class. Modifications available for all postures. Practice at your own pace.",
    status: "active",
    featured: true,
  },
  {
    name: "Fight Night Boxing",
    type: "BOXING",
    location: "The Underground Gym",
    venue: "Ring Room — Lower Level",
    date: "2026-03-20",
    startTime: "18:00",
    endTime: "19:30",
    price: 35,
    capacity: 24,
    booked: 24,
    bookingDeadline: "2026-03-19",
    description:
      "High-energy boxing workout combining technique drills, pad work, and conditioning circuits. No sparring — just pure sweat, skill, and community. Whether you're throwing your first jab or refining your combinations, our coaches meet you where you are. Gloves and wraps provided. Expect to leave drenched and empowered.",
    images: [
      "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800",
      "https://images.unsplash.com/photo-1517438322307-e67111335449?w=800",
      "https://images.unsplash.com/photo-1615117950532-7b694e0cad5a?w=800",
    ],
    instructor: 'Marcus "Iron" Cole',
    difficulty: "All Levels",
    equipment: [
      "Athletic shoes",
      "Comfortable workout clothes",
      "Towel",
      "Water bottle",
    ],
    safetyNotes:
      "No contact sparring. Gloves and hand wraps provided. Warm-up included. Let coach know of any wrist, shoulder, or back injuries.",
    status: "active",
    featured: true,
  },
  {
    name: "Dawn Patrol Run Club",
    type: "RUN_CLUB",
    location: "Riverside Park — Main Entrance",
    venue: "Outdoor — Meeting Point at Fountain",
    date: "2026-03-12",
    startTime: "05:30",
    endTime: "06:45",
    price: 0,
    capacity: 50,
    booked: 31,
    bookingDeadline: "2026-03-11",
    description:
      "Join the pack for our weekly community run along the scenic river trail. Three pace groups available: chill (6:30+/km), steady (5:00-6:30/km), and chase (under 5:00/km). Route is 5K or 8K — your choice. Post-run coffee and stretch circle included. This is where friendships are forged and miles are shared.",
    images: [
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
    ],
    instructor: "Sam & The Crew",
    difficulty: "All Levels",
    equipment: [
      "Running shoes",
      "Reflective gear (optional)",
      "Water bottle",
      "Good vibes",
    ],
    safetyNotes:
      "Route is on shared paths. Run with the group. Hydration station at 3K mark. In case of severe weather, event moves to indoor track.",
    status: "active",
    featured: false,
  },
  {
    name: "Breathwork & Recovery Lab",
    type: "YOGA",
    location: "Forge & Flow Wellness Center",
    venue: "Zen Room — 2nd Floor",
    date: "2026-03-18",
    startTime: "19:00",
    endTime: "20:30",
    price: 30,
    capacity: 15,
    booked: 8,
    bookingDeadline: "2026-03-17",
    description:
      "A deeply restorative session combining Wim Hof-inspired breathwork, guided meditation, and recovery techniques including foam rolling, stretching, and nervous system regulation. Designed to downregulate your stress response and accelerate physical recovery. Bring nothing but yourself — leave feeling completely renewed.",
    images: [
      "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    ],
    instructor: "Dr. Anika Patel",
    difficulty: "Beginner",
    equipment: ["Comfortable clothing", "Open mind"],
    safetyNotes:
      "Breathwork can cause tingling, light-headedness, or emotional release — all normal. Instructor will guide you safely. Not recommended during pregnancy or for those with epilepsy.",
    status: "active",
    featured: false,
  },
  {
    name: "Cold Water Warriors",
    type: "ICE_BATH",
    location: "Lake Meridian — North Shore",
    venue: "Outdoor — Lakeside Dock",
    date: "2026-03-22",
    startTime: "06:30",
    endTime: "08:30",
    price: 55,
    capacity: 12,
    booked: 10,
    bookingDeadline: "2026-03-21",
    description:
      "The ultimate outdoor cold exposure experience. We take it to nature — a guided open-water cold immersion at the stunning Lake Meridian. Begin with powerful breathwork on the dock, then wade into the crisp natural waters together. Bonfire warm-up, hot broth, and community bonding afterwards. This is not just a dip — it's a rite of passage.",
    images: [
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800",
    ],
    instructor: "Viktor Hagen",
    difficulty: "Advanced",
    equipment: [
      "Swimwear",
      "Two towels",
      "Warm layers",
      "Thermos",
      "Neoprene booties (optional)",
    ],
    safetyNotes:
      "Safety divers on site. Maximum 3-minute immersion for first-timers. Medical clearance required for heart conditions. Water temperature approximately 4-6°C.",
    status: "active",
    featured: true,
  },
  {
    name: "HIIT & Chill",
    type: "FITNESS",
    location: "The Underground Gym",
    venue: "Main Floor",
    date: "2026-03-14",
    startTime: "12:00",
    endTime: "13:00",
    price: 20,
    capacity: 30,
    booked: 18,
    bookingDeadline: "2026-03-13",
    description:
      "30 minutes of all-out high-intensity interval training followed by 30 minutes of guided cool-down, stretching, and mindfulness. The perfect lunch break reset. Burn hard, recover smart. All fitness levels welcome — every exercise has a scaled option. Leave feeling energized, not destroyed.",
    images: [
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    ],
    instructor: "Jordan Blake",
    difficulty: "All Levels",
    equipment: ["Athletic shoes", "Towel", "Water bottle"],
    safetyNotes:
      "Work at your own pace. Scaled options for every movement. Inform trainer of any injuries.",
    status: "active",
    featured: false,
  },
  {
    name: "The Sunday Reset",
    type: "SOCIAL",
    location: "Forge & Flow Café",
    venue: "Community Lounge",
    date: "2026-03-16",
    startTime: "10:00",
    endTime: "12:00",
    price: 15,
    capacity: 40,
    booked: 12,
    bookingDeadline: "2026-03-15",
    description:
      "Our signature Sunday morning community gathering. Start with a gentle mobility flow, transition into journaling and intention-setting for the week ahead, then enjoy brunch together with specialty coffee and house-made açaí bowls. It's part wellness, part social — 100% good vibes. Meet your tribe.",
    images: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
    ],
    instructor: "The Community Team",
    difficulty: "All Levels",
    equipment: ["Journal (optional)", "Cozy outfit", "Appetite"],
    safetyNotes:
      "Allergen-friendly food options available. Please note dietary requirements when booking.",
    status: "active",
    featured: false,
  },
  {
    name: "Mobility Masters",
    type: "YOGA",
    location: "Forge & Flow Wellness Center",
    venue: "Movement Lab — 3rd Floor",
    date: "2026-03-25",
    startTime: "17:00",
    endTime: "18:15",
    price: 28,
    capacity: 20,
    booked: 5,
    bookingDeadline: "2026-03-24",
    description:
      "Unlock your body's full range of motion in this targeted mobility session. Using a combination of FRC (Functional Range Conditioning), animal flow, and deep tissue release work, you'll improve joint health, reduce pain, and move like you were designed to. Perfect for desk workers, athletes, and anyone feeling \"stuck\" in their body.",
    images: [
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    ],
    instructor: "Dr. Anika Patel",
    difficulty: "Beginner",
    equipment: [
      "Comfortable clothing",
      "Yoga mat (provided)",
      "Lacrosse ball (provided)",
    ],
    safetyNotes:
      "Move within your pain-free range. Never force a stretch. Communicate any sharp sensations immediately.",
    status: "active",
    featured: false,
  },
  {
    name: "Forge & Fire Social",
    type: "SOCIAL",
    location: "Forge & Flow Rooftop",
    venue: "The Terrace — Rooftop",
    date: "2026-03-28",
    startTime: "19:00",
    endTime: "22:00",
    price: 40,
    capacity: 60,
    booked: 35,
    bookingDeadline: "2026-03-27",
    description:
      "Our monthly community celebration. Live DJ, fire pit conversations, signature wellness cocktails (and mocktails), ice bath challenges, and a rooftop under the stars. This is where the community comes alive. Dress code: express yourself. Bring a friend, make ten more. Ticket includes two drinks and gourmet bites.",
    images: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
    ],
    instructor: "The Forge & Flow Family",
    difficulty: "All Levels",
    equipment: ["Your best self", "Dancing shoes (optional)"],
    safetyNotes:
      "Responsible drinking. Rooftop has safety barriers. Ice bath participation optional and supervised.",
    status: "active",
    featured: true,
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Regular Member — 8 months",
    avatar: "SM",
    text: "The ice bath sessions completely changed my relationship with discomfort. Viktor is an incredible guide — he made me feel safe pushing past limits I didn't know I had. Now I cold shower daily and my energy is through the roof.",
    rating: 5,
    event: "Arctic Plunge Experience",
  },
  {
    name: "James Rodriguez",
    role: "Marathon Runner",
    avatar: "JR",
    text: "Dawn Patrol is the highlight of my week. The community here is genuine — not performative. We run, we suffer, we laugh, we grab coffee. It's simple and it's exactly what I needed.",
    rating: 5,
    event: "Dawn Patrol Run Club",
  },
  {
    name: "Priya Sharma",
    role: "Tech Executive",
    avatar: "PS",
    text: "As someone who lives in their head, the breathwork sessions are transformative. Dr. Patel has this gift of making the woo-woo feel grounded in science. I've cut my anxiety medication in half since starting.",
    rating: 5,
    event: "Breathwork & Recovery Lab",
  },
  {
    name: "Tom Bradley",
    role: "Creative Director",
    avatar: "TB",
    text: "Fight Night is pure therapy. I walk in stressed and walk out feeling like a superhero. Marcus doesn't just teach boxing — he teaches you how to show up for yourself. The community is fire.",
    rating: 5,
    event: "Fight Night Boxing",
  },
  {
    name: "Elena Voss",
    role: "Yoga instructor turned member",
    avatar: "EV",
    text: "I've practiced yoga for 15 years and Maya's Sunrise Flow is genuinely special. The rooftop setting, her sequencing, the intention behind every cue — it's art, not just a class.",
    rating: 5,
    event: "Sunrise Flow Yoga",
  },
  {
    name: "David Kim",
    role: "New Member — 2 months",
    avatar: "DK",
    text: "The Sunday Reset is literally the reason I look forward to Sundays now. I came for the açaí bowl, stayed for the community. I've never felt so welcomed anywhere.",
    rating: 5,
    event: "The Sunday Reset",
  },
];

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
    alt: "Ice bath session",
  },
  {
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600",
    alt: "Yoga at sunrise",
  },
  {
    url: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600",
    alt: "Boxing training",
  },
  {
    url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600",
    alt: "Run club outdoors",
  },
  {
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    alt: "Community gathering",
  },
  {
    url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600",
    alt: "HIIT workout",
  },
  {
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600",
    alt: "Open water swimming",
  },
  {
    url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600",
    alt: "Social event",
  },
  {
    url: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=600",
    alt: "Breathwork session",
  },
  {
    url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
    alt: "Rooftop party",
  },
  {
    url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
    alt: "Mobility training",
  },
  {
    url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
    alt: "Group fitness",
  },
];

const promoCodes = [
  {
    code: "FIRSTPLUNGE",
    discountPercent: 20,
    maxUses: 50,
    currentUses: 23,
    expiryDate: "2026-04-30",
    description: "20% off your first ice bath session",
    isActive: true,
  },
  {
    code: "COMMUNITY10",
    discountPercent: 10,
    maxUses: 100,
    currentUses: 67,
    expiryDate: "2026-06-30",
    description: "10% community discount",
    isActive: true,
  },
  {
    code: "WARRIOR25",
    discountPercent: 25,
    maxUses: 20,
    currentUses: 20,
    expiryDate: "2026-03-31",
    description: "25% off Cold Water Warriors",
    isActive: false,
  },
];

async function seed() {
  try {
    await connectDB();
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany(),
      Event.deleteMany(),
      Booking.deleteMany(),
      PromoCode.deleteMany(),
      Settings.deleteMany(),
      Testimonial.deleteMany(),
      GalleryImage.deleteMany(),
      Waitlist.deleteMany(),
    ]);

    // Create admin user
    console.log("Creating admin user...");
    const admin = await User.create({
      name: "Admin",
      email: "admin@forgeandflow.com",
      password: "admin123",
      role: "admin",
    });

    // Create demo users
    console.log("Creating demo users...");
    const sarah = await User.create({
      name: "Sarah Mitchell",
      email: "sarah@example.com",
      password: "password123",
      phone: "+1 555-0101",
    });
    const james = await User.create({
      name: "James Rodriguez",
      email: "james@example.com",
      password: "password123",
      phone: "+1 555-0102",
    });
    const tom = await User.create({
      name: "Tom Bradley",
      email: "tom@example.com",
      password: "password123",
      phone: "+1 555-0103",
    });
    const priya = await User.create({
      name: "Priya Sharma",
      email: "priya@example.com",
      password: "password123",
      phone: "+1 555-0104",
    });
    const elena = await User.create({
      name: "Elena Voss",
      email: "elena@example.com",
      password: "password123",
      phone: "+1 555-0105",
    });

    // Create events
    console.log("Creating events...");
    const createdEvents = await Event.insertMany(events);

    // Create bookings referencing real event IDs
    console.log("Creating bookings...");
    const bookingsData = [
      {
        eventId: createdEvents[0]._id,
        eventName: "Arctic Plunge Experience",
        userId: sarah._id,
        fullName: "Sarah Mitchell",
        email: "sarah@example.com",
        phone: "+1 555-0101",
        address: "123 Wellness Ave, Portland, OR",
        paidAmount: 45,
        transactionId: "TXN-9823-ABCD",
        paymentScreenshot: "/uploads/payment-001.jpg",
        status: "approved",
        bookingDate: "2026-03-01",
        adminNotes: "Payment verified. Regular customer.",
        ticketId: "TKT-2026-001",
      },
      {
        eventId: createdEvents[1]._id,
        eventName: "Sunrise Flow Yoga",
        userId: james._id,
        fullName: "James Rodriguez",
        email: "james@example.com",
        phone: "+1 555-0102",
        address: "456 Runner Blvd, Portland, OR",
        paidAmount: 25,
        transactionId: "TXN-7721-EFGH",
        paymentScreenshot: "/uploads/payment-002.jpg",
        status: "approved",
        bookingDate: "2026-03-02",
        adminNotes: "",
        ticketId: "TKT-2026-002",
      },
      {
        eventId: createdEvents[5]._id,
        eventName: "Cold Water Warriors",
        userId: tom._id,
        fullName: "Tom Bradley",
        email: "tom@example.com",
        phone: "+1 555-0103",
        address: "789 Creative St, Portland, OR",
        paidAmount: 55,
        transactionId: "",
        paymentScreenshot: "/uploads/payment-003.jpg",
        status: "pending",
        bookingDate: "2026-03-05",
        adminNotes: "",
        ticketId: null,
      },
      {
        eventId: createdEvents[9]._id,
        eventName: "Forge & Fire Social",
        userId: priya._id,
        fullName: "Priya Sharma",
        email: "priya@example.com",
        phone: "+1 555-0104",
        address: "321 Tech Park, Portland, OR",
        paidAmount: 40,
        transactionId: "TXN-3344-IJKL",
        paymentScreenshot: "/uploads/payment-004.jpg",
        status: "pending",
        bookingDate: "2026-03-06",
        adminNotes: "",
        ticketId: null,
      },
      {
        eventId: createdEvents[2]._id,
        eventName: "Fight Night Boxing",
        userId: elena._id,
        fullName: "Elena Voss",
        email: "elena@example.com",
        phone: "+1 555-0105",
        address: "654 Yoga Lane, Portland, OR",
        paidAmount: 35,
        transactionId: "TXN-5566-MNOP",
        paymentScreenshot: "/uploads/payment-005.jpg",
        status: "rejected",
        bookingDate: "2026-03-03",
        adminNotes: "Payment amount does not match. Please rebook.",
        ticketId: null,
      },
    ];
    await Booking.insertMany(bookingsData);

    // Create promo codes
    console.log("Creating promo codes...");
    await PromoCode.insertMany(promoCodes);

    // Create settings
    console.log("Creating settings...");
    await Settings.create({ key: "qrCodeUrl", value: "" });
    await Settings.create({
      key: "paymentInstructions",
      value:
        "Scan the QR code below and pay the exact event amount. After payment, upload a screenshot of the confirmation below.",
    });
    await Settings.create({
      key: "siteAddress",
      value: "42 Wellness Way, Portland, OR 97201",
    });
    await Settings.create({ key: "siteEmail", value: "hello@forgeandflow.co" });
    await Settings.create({ key: "sitePhone", value: "+1 (555) 234-5678" });
    await Settings.create({
      key: "siteSocialInstagram",
      value: "https://instagram.com/forgeandflow",
    });
    await Settings.create({
      key: "siteSocialYoutube",
      value: "https://youtube.com/@forgeandflow",
    });
    await Settings.create({
      key: "siteSocialTwitter",
      value: "https://twitter.com/forgeandflow",
    });

    // Create testimonials
    console.log("Creating testimonials...");
    await Testimonial.insertMany(testimonials);

    // Create gallery images
    console.log("Creating gallery images...");
    await GalleryImage.insertMany(galleryImages);

    console.log("\n✅ Database seeded successfully!");
    console.log(`   Events: ${createdEvents.length}`);
    console.log(`   Bookings: ${bookingsData.length}`);
    console.log(`   Promos: ${promoCodes.length}`);
    console.log(`   Testimonials: ${testimonials.length}`);
    console.log(`   Gallery images: ${galleryImages.length}`);
    console.log(`   Users: 6 (1 admin + 5 demo)`);
    console.log("\n   Admin login: admin / admin123");
    console.log("   Demo user login: sarah@example.com / password123\n");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
