import {
  DEFAULT_PROFILES,
  UserProfile,
} from "@/lib/memoryStore";
import {
  AlertCircle,
  Bell,
  ChevronDown,
  Film,
  Heart,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

interface NetflixNavbarProps {
  currentProfile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
  onOpenIntro: () => void;
  onSearchChange?: (query: string) => void;
}

export function NetflixNavbar({
  currentProfile,
  onProfileChange,
  onOpenIntro,
  onSearchChange,
}: NetflixNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [location] = useLocation();

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchToggle = () => {
    if (!searchOpen) {
      setSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else if (!searchQuery) {
      setSearchOpen(false);
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearchChange?.(val);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange?.("");
    setSearchOpen(false);
  };

  const handleAddProfileAttempt = () => {
    toast.error("Error (US): Only 'Us' is allowed on this account.", {
      description: "Nobody else can be added to our story.",
    });
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Seasons (8 Months)", href: "/show" },
    { label: "Our Top 10", href: "/#top10" },
    { label: "My List", href: "/#mylist" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 select-none ${
        isScrolled
          ? "bg-[#141414]/95 backdrop-blur-md shadow-2xl border-b border-white/5"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo & Links */}
        <div className="flex items-center gap-6 sm:gap-10">
          {/* Netflix Logo / Arched Typography */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <span className="text-[#E50914] font-black tracking-tighter text-2xl sm:text-3xl uppercase font-bebas transform transition-transform group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(229,9,20,0.5)]">
              OUR STORY
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-[#e5e5e5]">
            {navLinks.map((link) => {
              const isActive = location === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors duration-200 hover:text-white ${
                    isActive ? "text-white font-bold" : "text-[#b3b3b3]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Search, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search Box */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-black/80 border border-white/40 rounded px-2.5 py-1.5 transition-all duration-300 w-48 sm:w-64">
                <Search className="w-4 h-4 text-white/70 mr-2 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search memories, dates, trips..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  className="bg-transparent text-white text-xs sm:text-sm outline-none w-full placeholder-white/40"
                />
                <button onClick={clearSearch} className="text-white/60 hover:text-white ml-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSearchToggle}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileMenuOpen(false);
              }}
              className="relative text-white/80 hover:text-white transition-colors p-1"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#E50914] rounded-full ring-2 ring-[#141414] animate-pulse" />
            </button>

            {notificationsOpen && (
              <div
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#181818]/95 border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl p-4 z-50 text-white animate-fade-down"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Story Updates
                  </span>
                  <span className="text-[10px] text-white/50">8 Seasons Active</span>
                </div>

                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto no-scrollbar py-1">
                  <div className="py-2.5 flex items-start gap-3 hover:bg-white/5 rounded px-2 transition-colors">
                    <Heart className="w-5 h-5 text-[#E50914] fill-current shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Season 8 Finale Ready!</p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        A special surprise episode is waiting for you.
                      </p>
                      <span className="text-[9px] text-[#E50914] mt-1 block">Just now</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-3 hover:bg-white/5 rounded px-2 transition-colors">
                    <Sparkles className="w-5 h-5 text-amber-400 fill-current shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Happy 8 Months Anniversary</p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        8 months of smiles, laughter, and pure happiness.
                      </p>
                      <span className="text-[9px] text-white/40 mt-1 block">Today</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-start gap-3 hover:bg-white/5 rounded px-2 transition-colors">
                    <Film className="w-5 h-5 text-[#54b9c5] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-white">Top 10 Memories Updated</p>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        Our first date is currently trending #1 in our hearts!
                      </p>
                      <span className="text-[9px] text-white/40 mt-1 block">Trending</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 group cursor-pointer p-0.5 rounded"
            >
              {/* Profile Avatar */}
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gradient-to-br from-[#E50914] to-red-950 flex items-center justify-center font-bebas text-sm font-bold shadow-md ring-2 ring-transparent group-hover:ring-white transition-all text-white"
              >
                US
              </div>
              <ChevronDown
                className={`w-4 h-4 text-white/70 transition-transform duration-200 group-hover:text-white ${
                  profileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {profileMenuOpen && (
              <div
                className="absolute right-0 mt-3 w-60 bg-[#181818]/95 border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl py-2 z-50 text-white animate-fade-down"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Current Profile Heading */}
                <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded bg-gradient-to-br from-[#E50914] to-red-950 flex items-center justify-center font-bebas text-xs font-bold text-white"
                  >
                    US
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate">Us</p>
                    <p className="text-[10px] text-white/50">Exclusive Viewer</p>
                  </div>
                </div>

                {/* Add Profile Option (Error Trigger) */}
                <div className="py-2 border-b border-white/10">
                  <button
                    onClick={handleAddProfileAttempt}
                    className="w-full px-4 py-1.5 flex items-center justify-between hover:bg-white/10 transition-colors text-left text-xs font-semibold text-white/70 hover:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-white/60" />
                      <span>Add Profile</span>
                    </div>
                    <span className="text-[9px] text-[#E50914] font-bold uppercase">Locked</span>
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="pt-1 text-xs">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenIntro();
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Replay Netflix Intro</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
