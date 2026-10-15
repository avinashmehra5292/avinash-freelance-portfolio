/**
 * DEVCRAFT - FEATURED PROJECTS REPOSITORY
 * Contains detailed metadata, live URLs, and case study content for client presentation.
 */

const PROJECTS_DATA = [
  {
    id: "tiffinix",
    title: "Tiffinix",
    subtitle: "Smart Meal & Tiffin Subscription Ecosystem",
    category: "foodtech",
    categoryLabel: "FoodTech & Subscription",
    year: "2026",
    image: "assets/images/Tiffinix.png",
    liveUrl: "https://thetiffinix.html-5.me", // <-- PUT YOUR LIVE PROJECT LINK HERE
    summary: "A high-conversion food subscription and daily tiffin delivery management platform. Built to automate recurring meal scheduling, kitchen dispatch telemetry, real-time checkout, and customer nutrition tracking.",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Redis", "Stripe Subscriptions", "WebSockets"],
    caseStudy: {
      client: "Tiffinix Foods Inc.",
      role: "Lead Full-Stack Architect & UI/UX Designer",
      timeline: "6 Weeks (Concept to Production)",
      overview: "Tiffinix is a fast-growing gourmet meal delivery and subscription service. As their subscriber base scaled rapidly, their previous manual ordering workflow caused checkout friction, high customer churn, and dispatch delays. We re-engineered the complete digital ordering ecosystem from the ground up to deliver a frictionless daily meal management experience.",
      challenge: "The primary engineering hurdle was building an ultra-fast, 7-day visual meal customizer allowing users to mix-and-match menus, configure dietary preferences (keto, vegan, diabetic-friendly), and pause or skip deliveries without breaking recurring automated billing cycles.",
      solution: "We re-architected the entire web application using Next.js 15 App Router and PostgreSQL. A custom state engine was built for interactive calendar meal scheduling, accompanied by automated webhooks that sync directly with the kitchen dispatch terminal in real time.",
      highlights: [
        "Interactive 7-day calendar meal planner with instant nutrition macro calculators (protein, carbs, calories).",
        "Automated Stripe subscription pipeline supporting flexible skip, pause, and tier upgrades with zero human intervention.",
        "Redis-cached kitchen queue dispatch system reducing ticket generation latency from 4.2s to 110ms.",
        "Fully responsive mobile-first UI achieving a sub-700ms First Contentful Paint."
      ]
    }
  },
  {
    id: "krestates",
    title: "KR-ESTATE",
    subtitle: "Luxury Architectural Real Estate & PropTech Portal",
    category: "proptech",
    categoryLabel: "PropTech & Real Estate",
    year: "2026",
    image: "assets/images/krestates.png",
    liveUrl: "https://kr-estate-noida-2026-10-07-aad9f.onrender.com", // <-- PUT YOUR LIVE PROJECT LINK HERE
    summary: "A flagship ultra-luxury real estate portal featuring interactive 360° virtual tours, interactive map filtering, intelligent mortgage amortization calculators, and VIP broker lead-routing.",
    tech: ["React 19", "Three.js / WebGL", "Mapbox GL", "Express.js", "MongoDB", "AWS S3 / CloudFront", "Vanilla CSS"],
    caseStudy: {
      client: "KR Real Estate & Luxury Living Group",
      role: "Full-Stack Web Engineer & 3D Interactive Specialist",
      timeline: "8 Weeks",
      overview: "KR-ESTATE represents elite architectural estates, penthouses, and private beachfront residences. They required an ultra-premium digital portal whose visual elegance, fluid navigation, and responsive fidelity mirrored the multi-million dollar luxury of their physical listings.",
      challenge: "High-resolution architectural photography, 4K video walk-throughs, and 3D panoramic scans were causing severe page load delays on standard real estate themes, alienating affluent international buyers on mobile devices.",
      solution: "Engineered a custom Three.js WebGL rendering canvas for 360° virtual tours with progressive chunk streaming. Integrated Mapbox GL with custom dark-gold vector layers and implemented an intelligent mortgage and tax calculator.",
      highlights: [
        "Lightweight Three.js panoramic 360° tour viewer with zero noticeable lag on mobile devices.",
        "Faceted property filtering engine with live polygon radius search and commute-time estimation.",
        "Interactive financial mortgage & amortization calculator with instant downloadable PDF property brochures.",
        "AVIF / WebP automated CDN asset compression slashing initial bundle weight by 73%."
      ]
    }
  },
  {
    id: "Shri Ratna Jewellers",
    title: "Shri Ratna Jewellers",
    subtitle: "Bespoke Fine Jewellery & Luxury E-Commerce Experience",
    category: "ecommerce",
    categoryLabel: "Jewellery E-Commerce",
    year: "2026",
    image: "assets/images/Shri Ratna Jewellers.png",
    liveUrl: "https://sriratnajewellers.42web.io", // <-- PUT YOUR LIVE PROJECT LINK HERE
    summary: "An ultra-luxurious e-commerce destination for handcrafted gold, diamond, and bridal jewelry. Features live bullion gold-rate updates, interactive gemstone certification verification, high-resolution zoom, and bespoke WhatsApp jewelry concierge.",
    tech: ["Next.js 15", "TypeScript", "Node.js", "PostgreSQL", "Razorpay / Stripe", "Cloudinary HD Zoom", "Tailwind CSS"],
    caseStudy: {
      client: "Shri Ratna Jewellers",
      role: "Lead Full-Stack E-Commerce Architect & UI Designer",
      timeline: "7 Weeks",
      overview: "Shri Ratna Jewellers is a heritage fine jewelry brand celebrated for artisanal gold, polki, and diamond jewelry. They needed a high-end digital flagship store that replicates the warm, trust-driven in-store bespoke luxury buying experience online for nationwide and NRI customers.",
      challenge: "Selling high-ticket jewelry online requires razor-sharp visual clarity without page bloat, dynamic product pricing that fluctuates with live daily bullion gold and silver market rates, and building absolute trust through instant hallmark and gemstone certificate authentication.",
      solution: "Built a high-performance Next.js 15 store with deep-zoom image rendering, an automated bullion pricing engine calculating live item prices by karat purity (18K/22K/24K) and weight, digital certificate verification, and instant WhatsApp jewelry concierge routing.",
      highlights: [
        "Real-time bullion price sync engine that automatically adjusts catalog prices daily based on market rates.",
        "Ultra-high-definition interactive zoom viewer showcasing intricate gemstone cuts and hallmark engravings at 60 FPS.",
        "Built-in Hallmark & IGI / GIA certificate verification tool allowing buyers to authenticate pieces instantly.",
        "Integrated multi-channel sales flow with insured delivery tracking and direct 1-on-1 video call appointment booking."
      ]
    }
  },
  {
    id: "Jai Mata Di Travels",
    title: "Jai Mata Di Travels",
    subtitle: "Tour & Pilgrimage Travel Management Portal",
    category: "travel",
    categoryLabel: "Travel & Tourism",
    year: "2025 - 2026",
    image: "assets/images/Jai Mata Di Travels.png",
    liveUrl: "https://jaimataditravels.freedev.app", // <-- PUT YOUR LIVE PROJECT LINK HERE
    summary: "A comprehensive travel booking and pilgrimage tour platform offering customizable holiday packages, car rental fleet bookings, seasonal pilgrimage itineraries, instant WhatsApp quotation routing, and automated invoicing.",
    tech: ["React", "Next.js", "Express.js", "MongoDB", "WhatsApp Business API", "Razorpay", "Leaflet Maps"],
    caseStudy: {
      client: "Jai Mata Di Travels & Tourism",
      role: "Full-Stack Web Developer & Growth Engineer",
      timeline: "5 Weeks",
      overview: "Jai Mata Di Travels organizes high-volume pilgrimage tours (Mata Vaishno Devi, Char Dham, North India circuits), cab rentals, and custom holiday expeditions. They required an intuitive, mobile-first booking portal to replace manual phone handling and spreadsheet dispatching.",
      challenge: "Managing seasonal tariff surges for hotels and vehicles, providing customizable multi-city itineraries with clear day-by-day sightseeing breakdowns, and capturing leads instantly before travelers drop off on slow mobile connections.",
      solution: "Engineered a dynamic package builder with seasonal pricing calendars, vehicle fleet selection with transparent distance tariffs, instant WhatsApp quotation integration, and automated downloadable PDF booking receipts.",
      highlights: [
        "Interactive tour itinerary customizer with day-by-day sightseeing schedules, hotel options, and interactive route maps.",
        "One-tap WhatsApp direct quote generator sending pre-filled trip requirements straight to travel coordinators in real time.",
        "Dynamic cab fleet booking module with transparent distance, vehicle type (Sedan/SUV/Tempo), and per-km pricing.",
        "Automated booking confirmation with GST invoice and voucher PDF generation."
      ]
    }
  }
];

if (typeof window !== 'undefined') {
  window.PROJECTS_DATA = PROJECTS_DATA;
}
