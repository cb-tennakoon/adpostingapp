"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Plus,
  Filter,
  Heart,
  Eye,
  ShieldCheck,
  User,
  Users,
  Sparkles,
  Flower2,
  Home,
  Video,
  Scissors,
  LayoutGrid,
  Flag,
  MessageCircle,
  Clock,
  Crown,
  X,
} from "lucide-react";

/* ----------------------------- Tier config ----------------------------- */
type Tier = "TITANIUM" | "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";

const TIERS: Record<Tier, { rank: number; label: string; badge: string; card: string }> = {
  TITANIUM: { rank: 5, label: "Titanium", badge: "bg-gradient-to-r from-fuchsia-500 to-amber-400 text-black", card: "ring-2 ring-fuchsia-500 shadow-lg shadow-fuchsia-200" },
  PLATINUM: { rank: 4, label: "Platinum", badge: "bg-slate-800 text-white", card: "ring-2 ring-slate-400 shadow-md" },
  GOLD: { rank: 3, label: "Gold", badge: "bg-amber-400 text-black", card: "ring-2 ring-amber-400" },
  SILVER: { rank: 2, label: "Silver", badge: "bg-gray-400 text-white", card: "ring-1 ring-gray-400" },
  BRONZE: { rank: 1, label: "Bronze", badge: "bg-orange-700 text-white", card: "border border-gray-200" },
};

/* ------------------------------- Data -------------------------------- */

const categories = [
  { name: "All", slug: "all", Icon: LayoutGrid },
  { name: "Girls Personal", slug: "girls-personal", Icon: User },
  { name: "Boys Personal", slug: "boys-personal", Icon: Users },
  { name: "Shemale Personal", slug: "shemale-personal", Icon: Sparkles },
  { name: "Spa & Massage", slug: "spa-wellness", Icon: Flower2 },
  { name: "Home Visit", slug: "home-visit", Icon: Home },
  { name: "Live Cam", slug: "live-cam", Icon: Video },
  { name: "Beauty & Salon", slug: "beauty-salon", Icon: Scissors },
];

const cities = ["All cities", "Colombo", "Nugegoda", "Kandy", "Dehiwala", "Mount Lavinia", "Negombo", "Online"];

type Ad = {
  id: number;
  adNumber: number;
  title: string;
  city: string;
  category: string;
  priceLkr: number | null;
  age: number;
  tier: Tier;
  verified: boolean;
  likes: number;
  views: number;
  minutesAgo: number;
  hoursLeft: number | null;
  whatsapp: string;
  image: string;
};

const ADS: Ad[] = [
  { id: 1, adNumber: 1001, title: "Verified profile, available evenings", city: "Colombo", category: "girls-personal", priceLkr: null, age: 24, tier: "TITANIUM", verified: true, likes: 1240, views: 12400, minutesAgo: 4, hoursLeft: 22, whatsapp: "94771000001", image: "https://picsum.photos/seed/ad1/400/500" },
  { id: 2, adNumber: 1002, title: "Professional Ayurvedic and body massage", city: "Nugegoda", category: "spa-wellness", priceLkr: 6500, age: 27, tier: "TITANIUM", verified: true, likes: 890, views: 8100, minutesAgo: 9, hoursLeft: 19, whatsapp: "94771000002", image: "https://picsum.photos/seed/ad2/400/500" },
  { id: 3, adNumber: 1003, title: "Live shows every night at 8PM", city: "Kandy", category: "live-cam", priceLkr: 5000, age: 22, tier: "PLATINUM", verified: false, likes: 2100, views: 19200, minutesAgo: 22, hoursLeft: 15, whatsapp: "94771000003", image: "https://picsum.photos/seed/ad3/400/500" },
  { id: 4, adNumber: 1004, title: "Home visit massage, experienced therapist", city: "Dehiwala", category: "home-visit", priceLkr: 7000, age: 29, tier: "PLATINUM", verified: true, likes: 560, views: 4300, minutesAgo: 31, hoursLeft: 13, whatsapp: "94771000004", image: "https://picsum.photos/seed/ad4/400/500" },
  { id: 5, adNumber: 1005, title: "Friendly profile, city area", city: "Colombo", category: "boys-personal", priceLkr: null, age: 25, tier: "GOLD", verified: true, likes: 1780, views: 15600, minutesAgo: 48, hoursLeft: 10, whatsapp: "94771000005", image: "https://picsum.photos/seed/ad5/400/500" },
  { id: 6, adNumber: 1006, title: "Couples spa package available", city: "Mount Lavinia", category: "spa-wellness", priceLkr: 15000, age: 30, tier: "GOLD", verified: false, likes: 420, views: 3800, minutesAgo: 66, hoursLeft: 8, whatsapp: "94771000006", image: "https://picsum.photos/seed/ad6/400/500" },
  { id: 7, adNumber: 1007, title: "New performer, weekend scheduled shows", city: "Online", category: "live-cam", priceLkr: 3000, age: 23, tier: "SILVER", verified: true, likes: 3200, views: 28000, minutesAgo: 90, hoursLeft: 5, whatsapp: "94771000007", image: "https://picsum.photos/seed/ad7/400/500" },
  { id: 8, adNumber: 1008, title: "Verified profile, weekends only", city: "Negombo", category: "shemale-personal", priceLkr: null, age: 26, tier: "SILVER", verified: true, likes: 980, views: 7200, minutesAgo: 120, hoursLeft: 3, whatsapp: "94771000008", image: "https://picsum.photos/seed/ad8/400/500" },
  { id: 9, adNumber: 1009, title: "Bridal makeup and hair styling", city: "Colombo", category: "beauty-salon", priceLkr: 12000, age: 31, tier: "BRONZE", verified: false, likes: 210, views: 1900, minutesAgo: 180, hoursLeft: null, whatsapp: "94771000009", image: "https://picsum.photos/seed/ad9/400/500" },
  { id: 10, adNumber: 1010, title: "Foot reflexology and wellness therapy", city: "Kandy", category: "spa-wellness", priceLkr: 4500, age: 33, tier: "BRONZE", verified: true, likes: 150, views: 1400, minutesAgo: 240, hoursLeft: null, whatsapp: "94771000010", image: "https://picsum.photos/seed/ad10/400/500" },
  { id: 11, adNumber: 1011, title: "New profile, available daily", city: "Nugegoda", category: "shemale-personal", priceLkr: null, age: 27, tier: "BRONZE", verified: false, likes: 90, views: 860, minutesAgo: 300, hoursLeft: null, whatsapp: "94771000011", image: "https://picsum.photos/seed/ad11/400/500" },
  { id: 12, adNumber: 1012, title: "Head and shoulder massage at home", city: "Dehiwala", category: "home-visit", priceLkr: 3500, age: 28, tier: "BRONZE", verified: false, likes: 60, views: 540, minutesAgo: 360, hoursLeft: null, whatsapp: "94771000012", image: "https://picsum.photos/seed/ad12/400/500" },
];

/* ------------------------------ Helpers ------------------------------ */

const PAGE_SIZE = 8;
const fmtViews = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`);
const fmtAgo = (m: number) => (m < 60 ? `${m}m ago` : `${Math.floor(m / 60)}h ago`);

/* ------------------------------- Page -------------------------------- */

export default function HomePage() {
  const [ageOk, setAgeOk] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [city, setCity] = useState("All cities");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sort, setSort] = useState<"tier" | "newest" | "views" | "price">("tier");
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [favs, setFavs] = useState<number[]>([]);

  useEffect(() => {
    try {
      setAgeOk(localStorage.getItem("age_ok") === "1");
      setFavs(JSON.parse(localStorage.getItem("favs") || "[]"));
    } catch {
      setAgeOk(false);
    }
  }, []);

  useEffect(() => setVisible(PAGE_SIZE), [search, category, city, verifiedOnly, maxPrice, sort]);

  const toggleFav = (id: number) =>
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem("favs", JSON.stringify(next));
      } catch {}
      return next;
    });

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = ADS.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      if (city !== "All cities" && a.city !== city) return false;
      if (verifiedOnly && !a.verified) return false;
      if (maxPrice !== "" && a.priceLkr !== null && a.priceLkr > maxPrice) return false;
      if (q && !`${a.title} ${a.city}`.toLowerCase().includes(q)) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "newest") return a.minutesAgo - b.minutesAgo;
      if (sort === "views") return b.views - a.views;
      if (sort === "price") return (a.priceLkr ?? Infinity) - (b.priceLkr ?? Infinity);
      return TIERS[b.tier].rank - TIERS[a.tier].rank || a.minutesAgo - b.minutesAgo;
    });
  }, [search, category, city, verifiedOnly, maxPrice, sort]);

  const activeFilters = (city !== "All cities" ? 1 : 0) + (verifiedOnly ? 1 : 0) + (maxPrice !== "" ? 1 : 0);
  const clearAll = () => {
    setSearch("");
    setCategory("all");
    setCity("All cities");
    setVerifiedOnly(false);
    setMaxPrice("");
  };
  const countFor = (slug: string) => (slug === "all" ? ADS.length : ADS.filter((a) => a.category === slug).length);

  /* ---------------- 18+ gate ---------------- */
  if (ageOk === null) return <div className="min-h-screen bg-gray-50" />;
  if (!ageOk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border shadow-sm p-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
            18+
          </div>
          <h1 className="text-2xl font-bold mb-2">Adults only</h1>
          <p className="text-sm text-gray-500 mb-6">
            This website contains adult content. You must be 18 or older, and it must be legal to view it where you live.
          </p>
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-rose-600 hover:bg-rose-700 h-11"
              onClick={() => {
                try {
                  localStorage.setItem("age_ok", "1");
                } catch {}
                setAgeOk(true);
              }}
            >
              I am 18 or older
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={() => (window.location.href = "https://www.google.com")}
            >
              Leave
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Main page ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-rose-600 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-sm">
              B
            </div>
            Bandu
          </Link>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ads, locations, services..."
                className="pl-10 h-11 bg-gray-50 border-gray-200 focus-visible:ring-rose-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
              <Heart className="h-4 w-4" /> {favs.length}
            </span>

            {/* Login - No asChild */}
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors px-3 py-2"
            >
              Login
            </Link>

            {/* Post Ad - No asChild */}
            <Link
              href="/dashboard/new-ad"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Post Ad
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-10 h-10 bg-gray-50"
            />
          </div>
        </div>
      </header>

      {/* Category bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
            {categories.map(({ name, slug, Icon }) => {
              const active = category === slug;
              return (
                <button
                  key={slug}
                  onClick={() => setCategory(slug)}
                  className="flex flex-col items-center gap-1 min-w-[84px] group"
                >
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                      active ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-xs font-medium text-center ${active ? "text-rose-600" : "text-gray-700"}`}>
                    {name}
                  </span>
                  <span className="text-[10px] text-gray-400">{countFor(slug)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Promo banner */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Post your ad and get more clients</h2>
            <p className="text-rose-100 text-sm md:text-base">
              Titanium and Platinum ads appear first. Every ad is reviewed by our team before it goes live.
            </p>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center justify-center h-11 px-6 rounded-md bg-white text-rose-600 hover:bg-rose-50 font-semibold shrink-0 transition-colors"
          >
            View Packages
          </Link>
        </div>

        {/* Title + filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Latest Ads
            </h1>
            <p className="text-sm text-gray-500">
              Showing {Math.min(visible, results.length)} of {results.length} results
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters((v) => !v)}>
            <Filter className="h-4 w-4" />
            Filters
            {activeFilters > 0 && (
              <span className="h-5 min-w-5 rounded-full bg-rose-600 text-white text-[11px] flex items-center justify-center px-1">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="bg-white border rounded-xl p-4 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <label className="text-sm">
              <span className="block mb-1 text-gray-600">City</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 px-2 bg-white"
              >
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="block mb-1 text-gray-600">Max price (Rs.)</span>
              <Input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 8000"
                className="h-10"
              />
            </label>
            <label className="text-sm">
              <span className="block mb-1 text-gray-600">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full h-10 rounded-md border border-gray-200 px-2 bg-white"
              >
                <option value="tier">Best match (tier first)</option>
                <option value="newest">Newest</option>
                <option value="views">Most viewed</option>
                <option value="price">Price: low to high</option>
              </select>
            </label>
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="accent-rose-600 h-4 w-4"
                />
                Verified only
              </label>
              <Button variant="ghost" size="sm" className="text-rose-600" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          </div>
        )}

        {/* Grid */}
        {results.length === 0 ? (
          <div className="bg-white border border-dashed rounded-2xl py-16 text-center">
            <p className="text-gray-500 mb-4">No ads match your search.</p>
            <Button variant="outline" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.slice(0, visible).map((ad) => (
              <AdCard key={ad.id} ad={ad} isFav={favs.includes(ad.id)} onFav={() => toggleFav(ad.id)} />
            ))}
          </div>
        )}

        {visible < results.length && (
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" className="px-10" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load more ads ({results.length - visible} left)
            </Button>
          </div>
        )}

        {/* Safety strip */}
        <div className="mt-14 bg-white border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-green-600 shrink-0" />
            <div>
              <p className="font-semibold">Spotted a fake or suspicious ad?</p>
              <p className="text-sm text-gray-500">
                Tap the flag on any ad. Our admins review reports and remove fake ads.
              </p>
            </div>
          </div>
          <Link
            href="/safety"
            className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Safety tips
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
              B
            </div>
            <span>© {new Date().getFullYear()} Bandu. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/packages" className="hover:text-rose-600">
              Packages
            </Link>
            <Link href="/safety" className="hover:text-rose-600">
              Safety
            </Link>
            <Link href="/help" className="hover:text-rose-600">
              Help
            </Link>
            <Link href="/terms" className="hover:text-rose-600">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-rose-600">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----------------------------- Ad card ----------------------------- */

function AdCard({ ad, isFav, onFav }: { ad: Ad; isFav: boolean; onFav: () => void }) {
  const tier = TIERS[ad.tier];

  return (
    <div className={`group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all ${tier.card}`}>
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <Link href={`/ads/${ad.adNumber}`}>
          <img
            src={ad.image}
            alt={ad.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          <Badge className={`${tier.badge} text-[10px] font-bold`}>
            {ad.tier === "TITANIUM" && <Crown className="h-3 w-3 mr-0.5" />}
            {tier.label}
          </Badge>
          {ad.hoursLeft !== null && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 text-white text-[10px] px-2 py-0.5">
              <Clock className="h-3 w-3" /> {ad.hoursLeft}h left
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
          <button
            onClick={onFav}
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
            className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:bg-white"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-rose-500 text-rose-500" : "text-gray-600"}`} />
          </button>
          {ad.verified && (
            <div className="bg-green-500 text-white p-1 rounded-full" title="Verified">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <Link href={`/ads/${ad.adNumber}`}>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-rose-600 transition-colors mb-1">
            {ad.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3" />
          {ad.city}
          <span>• {ad.age} yrs</span>
          <span className="ml-auto">{fmtAgo(ad.minutesAgo)}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-rose-600 text-sm">
            {ad.priceLkr ? `Rs. ${ad.priceLkr.toLocaleString()}` : "Contact"}
          </span>
          <span className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-0.5">
              <Heart className="h-3 w-3" /> {ad.likes}
            </span>
            <span className="flex items-center gap-0.5">
              <Eye className="h-3 w-3" /> {fmtViews(ad.views)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${ad.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-xs font-medium h-8"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <Link
            href={`/report/${ad.adNumber}`}
            title="Report this ad"
            aria-label="Report this ad"
            className="h-8 w-8 flex items-center justify-center rounded-md border text-gray-400 hover:text-red-600 hover:border-red-200"
          >
            <Flag className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}