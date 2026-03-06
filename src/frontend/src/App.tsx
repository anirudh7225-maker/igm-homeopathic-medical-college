import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Award,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Facebook,
  GraduationCap,
  Heart,
  Instagram,
  Leaf,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Microscope,
  Phone,
  Star,
  Twitter,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FacultyMember, NewsEvent, Program } from "./backend.d.ts";
import { useActor } from "./hooks/useActor";
import {
  NewsEventCategory,
  useAddFacultyMember,
  useAddNewsEvent,
  useAddProgram,
  useGetActiveNewsEvents,
  useGetActivePrograms,
  useGetAllFacultyMembers,
  useSubmitAdmissionInquiry,
  useSubmitContactForm,
} from "./hooks/useQueries";

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const SAMPLE_PROGRAMS: Omit<Program, "id" | "isActive">[] = [
  {
    name: "BHMS – Bachelor of Homeopathic Medicine & Surgery",
    duration: "5.5 Years",
    description:
      "A comprehensive undergraduate program covering the principles of homeopathy, materia medica, organon of medicine, anatomy, physiology, and clinical training. Graduates are eligible to practice as licensed homeopathic physicians.",
    eligibility:
      "10+2 with Science (Biology, Physics, Chemistry) with minimum 50% marks. NEET qualification required.",
  },
  {
    name: "MD Homeopathy – Doctor of Medicine",
    duration: "3 Years",
    description:
      "Postgraduate program with specializations in Materia Medica, Organon & Homeopathic Philosophy, Practice of Medicine, Pediatrics, and Psychiatry. Research-focused with clinical immersion.",
    eligibility:
      "BHMS degree from a recognized university with minimum 55% aggregate marks.",
  },
  {
    name: "PG Diploma in Homeopathic Clinical Practice",
    duration: "1 Year",
    description:
      "Intensive diploma program focusing on advanced case-taking, clinical diagnosis, and therapeutic applications of homeopathic remedies in chronic and acute conditions.",
    eligibility:
      "BHMS degree from a recognized institution. Open to practicing physicians.",
  },
];

const SAMPLE_FACULTY: Omit<FacultyMember, "id">[] = [
  {
    name: "Dr. Arvind Sharma",
    designation: "Principal & Professor",
    qualification: "MD Homeopathy (Gold Medalist), Ph.D. (Medical Sciences)",
    department: "Organon of Medicine & Homeopathic Philosophy",
    bio: "With over 28 years of academic and clinical experience, Dr. Sharma has guided more than 500 postgraduate scholars. A pioneer in constitutional homeopathy, he has authored three textbooks and presented at international conferences across 15 countries.",
  },
  {
    name: "Dr. Bhavna Patel",
    designation: "Head of Department & Associate Professor",
    qualification: "MD Homeopathy, PGDHE",
    department: "Materia Medica",
    bio: "Dr. Patel brings 18 years of teaching excellence and clinical practice. Her research on polychrest remedies has been published in leading homeopathic journals. She runs a weekly advanced clinic for complex chronic cases.",
  },
  {
    name: "Dr. Chandrakant Gupta",
    designation: "Associate Professor",
    qualification: "MD Homeopathy, M.Sc. Biochemistry",
    department: "Practice of Medicine & Homeopathic Therapeutics",
    bio: "Specializing in pediatric homeopathy and integrative medicine, Dr. Gupta has over 14 years of experience. He is an active member of the Central Council of Homeopathy research committee and has contributed to 25+ peer-reviewed papers.",
  },
];

const SAMPLE_NEWS: Omit<NewsEvent, "id" | "isActive" | "date">[] = [
  {
    title: "Annual Homeopathy Symposium 2026 – Registration Open",
    description:
      "IGM HMC proudly hosts its 18th Annual National Homeopathy Symposium on March 20–21, 2026. Eminent speakers from AYUSH and international institutions will present the latest research. Registration deadline: March 10.",
    category: NewsEventCategory.event,
  },
  {
    title: "BHMS 2026 Admissions Now Open – Apply Before March 31",
    description:
      "Applications for the BHMS 2026–27 batch are now being accepted. Limited seats available. Candidates who have cleared NEET are encouraged to apply at the earliest. Merit list to be published on April 5.",
    category: NewsEventCategory.news,
  },
  {
    title: "IGM HMC Receives AYUSH Excellence Award 2025",
    description:
      "We are proud to announce that IGM Homeopathic Medical College has been recognized with the prestigious AYUSH Excellence Award 2025 for outstanding contributions to homeopathic education and research in India.",
    category: NewsEventCategory.news,
  },
];

// ─── Helper: format BigInt date ────────────────────────────────────────────────

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp);
  if (ms === 0)
    return new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const date = new Date(ms / 1_000_000); // Motoko timestamp is in nanoseconds
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home", ocid: "nav.home.link" },
    { label: "About", href: "#about", ocid: "nav.about.link" },
    { label: "Programs", href: "#programs", ocid: "nav.programs.link" },
    { label: "Faculty", href: "#faculty", ocid: "nav.faculty.link" },
    { label: "Facilities", href: "#facilities", ocid: "nav.facilities.link" },
    { label: "Admissions", href: "#admissions", ocid: "nav.admissions.link" },
    { label: "News & Events", href: "#news", ocid: "nav.news.link" },
    { label: "Contact", href: "#contact", ocid: "nav.contact.link" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-nav border-b border-college-green-100"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img
            src="/assets/generated/college-logo-transparent.dim_200x200.png"
            alt="IGM HMC Logo"
            className="w-10 h-10 object-contain"
          />
          <div className="hidden sm:block">
            <p className="font-display font-semibold text-sm text-college-green-800 leading-tight">
              IGM Homeopathic
            </p>
            <p className="font-display text-xs text-college-green-600 leading-tight">
              Medical College
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.ocid}>
              <a
                href={link.href}
                data-ocid={link.ocid}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isScrolled
                    ? "text-college-green-700 hover:text-college-green-500 hover:bg-college-green-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Apply CTA */}
        <div className="hidden lg:block ml-4">
          <Button
            asChild
            size="sm"
            className="bg-college-green-700 hover:bg-college-green-600 text-white font-medium px-4"
          >
            <a href="#admissions">Apply Now</a>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`lg:hidden p-2 rounded-md transition-colors ${
            isScrolled ? "text-college-green-700" : "text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white border-b border-college-green-100 shadow-nav overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.ocid}
                  href={link.href}
                  data-ocid={link.ocid}
                  className="px-4 py-3 rounded-md text-sm font-medium text-college-green-700 hover:bg-college-green-50 hover:text-college-green-500 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="mt-2 bg-college-green-700 hover:bg-college-green-600 text-white"
                onClick={() => {
                  setMobileOpen(false);
                  window.location.hash = "#admissions";
                }}
              >
                Apply Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/assets/generated/college-hero.dim_1200x600.jpg')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      {/* Subtle leaf pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cpath d='M40 8 C28 22 12 36 18 55 C24 70 46 74 56 60 C68 43 62 22 40 8Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <Leaf className="w-3.5 h-3.5 text-green-300" />
            <span className="text-white/90 text-sm font-medium tracking-wide">
              AYUSH Approved Institution
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
            IGM Homeopathic
            <br />
            <span className="text-gold-light">Medical College</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-white/85 font-light mt-4 mb-8 italic font-display">
            "Healing Through Nature's Wisdom"
          </p>

          <p className="text-white/75 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Nurturing the healers of tomorrow through evidence-based homeopathic
            education, rigorous clinical training, and compassionate care —
            since 1985.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              data-ocid="hero.primary_button"
              className="bg-college-green-600 hover:bg-college-green-500 text-white text-base px-8 py-3 h-auto font-semibold shadow-lg transition-transform hover:scale-105"
            >
              <a href="#admissions">
                Apply Now
                <ChevronRight className="ml-1 w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-ocid="hero.secondary_button"
              className="border-white/60 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm text-base px-8 py-3 h-auto font-medium"
            >
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {[
            { value: "1985", label: "Established" },
            { value: "5000+", label: "Alumni" },
            { value: "50+", label: "Faculty" },
            { value: "AYUSH", label: "Approved" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center"
            >
              <p className="font-display text-2xl sm:text-3xl font-bold text-gold-light">
                {stat.value}
              </p>
              <p className="text-white/75 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

// ─── About Section ─────────────────────────────────────────────────────────────

function AboutSection() {
  const stats = [
    {
      icon: CalendarDays,
      label: "Established",
      value: "1985",
      color: "text-college-green-700",
    },
    {
      icon: GraduationCap,
      label: "Alumni",
      value: "5000+",
      color: "text-college-green-700",
    },
    {
      icon: Users,
      label: "Faculty Members",
      value: "50+",
      color: "text-college-green-700",
    },
    {
      icon: Award,
      label: "AYUSH Approved",
      value: "Govt. India",
      color: "text-college-green-700",
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-college-green-50 text-college-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              <Leaf className="w-3.5 h-3.5" />
              About Us
            </div>
            <h2 className="section-title mb-6">
              A Legacy of Excellence in{" "}
              <span className="text-college-green-500">
                Homeopathic Education
              </span>
            </h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed text-base">
              <p>
                Founded in 1985 by visionary educationist Dr. I.G. Mehta, IGM
                Homeopathic Medical College has grown into one of India's most
                respected institutions for homeopathic medical education. Spread
                across a lush 12-acre campus, the college offers a
                transformative environment where ancient healing traditions meet
                modern clinical science.
              </p>
              <p>
                Our curriculum is crafted to produce competent, compassionate
                homeopathic physicians who can meet the healthcare needs of the
                21st century. With a 1:10 teacher-student ratio,
                state-of-the-art facilities, and 500+ OPD patients daily, our
                students graduate with exceptional clinical confidence.
              </p>
              <p>
                We hold affiliations with the Central Council of Homeopathy, the
                Ministry of AYUSH (Government of India), and our state
                university — ensuring that our degrees carry full national and
                international recognition.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                asChild
                className="bg-college-green-700 hover:bg-college-green-600 text-white"
              >
                <a href="#programs">
                  Explore Programs
                  <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-college-green-200 text-college-green-700 hover:bg-college-green-50"
              >
                <a href="#contact">Get in Touch</a>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-college-green-100 shadow-card-green hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-college-green-50 mb-4">
                      <stat.icon className="w-6 h-6 text-college-green-700" />
                    </div>
                    <p className="font-display text-3xl font-bold text-college-green-800 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Programs Section ──────────────────────────────────────────────────────────

function ProgramsSection() {
  const { actor } = useActor();
  const { data: programs, isLoading, isError } = useGetActivePrograms();
  const addProgramMutation = useAddProgram();
  const [seeded, setSeeded] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mutateAsync is stable
  useEffect(() => {
    if (!actor || seeded || isLoading || isError) return;
    if (programs && programs.length === 0) {
      setSeeded(true);
      Promise.all(
        SAMPLE_PROGRAMS.map((p) =>
          addProgramMutation.mutateAsync({
            actor,
            name: p.name,
            duration: p.duration,
            description: p.description,
            eligibility: p.eligibility,
          }),
        ),
      ).catch(() => {});
    }
  }, [actor, programs, isLoading, isError, seeded]);

  const displayPrograms =
    programs && programs.length > 0
      ? programs
      : SAMPLE_PROGRAMS.map((p, i) => ({
          ...p,
          id: BigInt(i),
          isActive: true,
        }));

  const programIcons = [GraduationCap, BookOpen, Star];

  return (
    <section
      id="programs"
      className="py-20 lg:py-28 section-green-bg"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.95 0.022 148) 0%, oklch(0.97 0.012 148) 100%)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-college-green-100 text-college-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <GraduationCap className="w-3.5 h-3.5" />
            Academic Programs
          </div>
          <h2 className="section-title mb-4">Programs We Offer</h2>
          <p className="section-subtitle mx-auto">
            Nationally recognized programs designed to cultivate skilled,
            compassionate homeopathic healthcare professionals.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="programs.loading_state"
            className="grid md:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-college-green-100">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div data-ocid="programs.error_state" className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground">
              Unable to load programs. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && displayPrograms.length === 0 && (
          <div data-ocid="programs.empty_state" className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No programs available at the moment.
            </p>
          </div>
        )}

        {/* Programs Grid */}
        {!isLoading && !isError && displayPrograms.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPrograms.slice(0, 6).map((program, index) => {
              const ocidIndex = index + 1;
              const ProgramIcon = programIcons[index % programIcons.length];
              return (
                <motion.div
                  key={program.id.toString()}
                  data-ocid={`programs.item.${ocidIndex}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-college-green-100 shadow-card-green hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-college-green-700 text-white shrink-0">
                          <ProgramIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold text-college-green-800 leading-snug">
                            {program.name}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {program.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-foreground/75 leading-relaxed mb-4">
                        {program.description}
                      </p>
                      <div className="bg-college-green-50 rounded-lg p-3 border border-college-green-100">
                        <p className="text-xs font-semibold text-college-green-700 mb-1 uppercase tracking-wide">
                          Eligibility
                        </p>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                          {program.eligibility}
                        </p>
                      </div>
                      <Button
                        asChild
                        className="mt-4 w-full bg-college-green-700 hover:bg-college-green-600 text-white text-sm"
                        size="sm"
                      >
                        <a href="#admissions">Apply for This Program</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Faculty Section ───────────────────────────────────────────────────────────

function FacultySection() {
  const { actor } = useActor();
  const { data: faculty, isLoading, isError } = useGetAllFacultyMembers();
  const addFacultyMutation = useAddFacultyMember();
  const [seeded, setSeeded] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mutateAsync is stable
  useEffect(() => {
    if (!actor || seeded || isLoading || isError) return;
    if (faculty && faculty.length === 0) {
      setSeeded(true);
      Promise.all(
        SAMPLE_FACULTY.map((f) =>
          addFacultyMutation.mutateAsync({
            actor,
            name: f.name,
            designation: f.designation,
            qualification: f.qualification,
            department: f.department,
            bio: f.bio,
          }),
        ),
      ).catch(() => {});
    }
  }, [actor, faculty, isLoading, isError, seeded]);

  const displayFaculty =
    faculty && faculty.length > 0
      ? faculty
      : SAMPLE_FACULTY.map((f, i) => ({ ...f, id: BigInt(i) }));

  const avatarColors = [
    "bg-college-green-700",
    "bg-college-green-600",
    "bg-college-green-800",
  ];

  return (
    <section id="faculty" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-college-green-50 text-college-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Users className="w-3.5 h-3.5" />
            Our Faculty
          </div>
          <h2 className="section-title mb-4">Meet Our Distinguished Faculty</h2>
          <p className="section-subtitle mx-auto">
            Experienced educators, researchers, and clinicians dedicated to
            shaping the next generation of homeopathic physicians.
          </p>
        </motion.div>

        {isLoading && (
          <div
            data-ocid="faculty.loading_state"
            className="grid md:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-college-green-100">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                  <Skeleton className="h-5 w-2/3 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <div data-ocid="faculty.error_state" className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground">
              Unable to load faculty. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && displayFaculty.length === 0 && (
          <div data-ocid="faculty.empty_state" className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Faculty information coming soon.
            </p>
          </div>
        )}

        {!isLoading && !isError && displayFaculty.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFaculty.slice(0, 6).map((member, index) => {
              const ocidIndex = index + 1;
              const initials = member.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0])
                .join("");
              return (
                <motion.div
                  key={member.id.toString()}
                  data-ocid={`faculty.item.${ocidIndex}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-college-green-100 shadow-card-green hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center bg-white">
                    <CardContent className="p-6">
                      {/* Avatar */}
                      <div
                        className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-display text-xl font-bold ${
                          avatarColors[index % avatarColors.length]
                        }`}
                      >
                        {initials}
                      </div>
                      <h3 className="font-display font-semibold text-lg text-college-green-800">
                        {member.name}
                      </h3>
                      <p className="text-college-green-600 text-sm font-medium mt-0.5">
                        {member.designation}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">
                        {member.department}
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-college-green-50 text-college-green-700 border border-college-green-200 text-xs mb-4"
                      >
                        {member.qualification}
                      </Badge>
                      <p className="text-sm text-foreground/70 leading-relaxed text-left">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Facilities Section ────────────────────────────────────────────────────────

function FacilitiesSection() {
  const facilities = [
    {
      name: "Modern Research Laboratory",
      description:
        "Our fully equipped laboratory supports homeopathic potentization research, pharmacognosy, biochemistry, and pathology. Students gain hands-on experience with advanced instruments under expert supervision.",
      image: "/assets/generated/college-lab.dim_600x400.jpg",
      icon: Microscope,
    },
    {
      name: "Well-Stocked Library",
      description:
        "Housing over 25,000 volumes of homeopathic and medical literature, journals, rare manuscripts, and digital databases. The e-library provides 24/7 access to international research resources and CCIM-prescribed texts.",
      image: "/assets/generated/college-library.dim_600x400.jpg",
      icon: BookOpen,
    },
    {
      name: "OPD Clinic & Teaching Hospital",
      description:
        "Our 500+ daily patient OPD clinic is the backbone of clinical education. Students observe and practice case-taking under qualified faculty, providing real homeopathic care to patients from across the region.",
      image: "/assets/generated/college-clinic.dim_600x400.jpg",
      icon: Building2,
    },
  ];

  return (
    <section
      id="facilities"
      className="py-20 lg:py-28"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.96 0.022 148) 0%, oklch(0.98 0.008 95) 100%)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-college-green-100 text-college-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Building2 className="w-3.5 h-3.5" />
            Campus Facilities
          </div>
          <h2 className="section-title mb-4">World-Class Infrastructure</h2>
          <p className="section-subtitle mx-auto">
            Purpose-built facilities that support rigorous academic learning and
            clinical excellence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-college-green-100 shadow-card-green hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white">
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-college-green-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/90 text-college-green-700">
                      <facility.icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold text-college-green-800 mb-3">
                    {facility.name}
                  </h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional facility highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { label: "12-Acre Campus", icon: Leaf },
            { label: "500+ Daily OPD", icon: Heart },
            { label: "Hostel Facility", icon: Building2 },
            { label: "Sports Complex", icon: Star },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 bg-white rounded-xl p-4 border border-college-green-100 shadow-xs"
            >
              <item.icon className="w-5 h-5 text-college-green-600 shrink-0" />
              <span className="text-sm font-medium text-college-green-800">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Admissions Section ────────────────────────────────────────────────────────

function AdmissionsSection() {
  const { actor } = useActor();
  const submitMutation = useSubmitAdmissionInquiry();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    background: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !form.name || !form.email || !form.phone || !form.program) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setStatus("loading");
    try {
      await submitMutation.mutateAsync({
        actor,
        applicantName: form.name,
        email: form.email,
        phone: form.phone,
        programOfInterest: form.program,
        academicBackground: form.background,
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", program: "", background: "" });
      toast.success("Your inquiry has been submitted! We'll contact you soon.");
    } catch {
      setStatus("error");
      toast.error("Submission failed. Please try again.");
    }
  }

  return (
    <section id="admissions" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-college-green-50 text-college-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              <GraduationCap className="w-3.5 h-3.5" />
              Admissions 2026
            </div>
            <h2 className="section-title mb-6">
              Join IGM Homeopathic Medical College
            </h2>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-college-green-800 text-lg">
                Eligibility Criteria
              </h3>
              <div className="space-y-3">
                {[
                  "Passed 10+2 with Physics, Chemistry, and Biology (minimum 50% aggregate)",
                  "Valid NEET-UG score (for BHMS program)",
                  "BHMS degree from recognized university (for PG programs)",
                  "Indian national or NRI / foreign nationals as per CCIM guidelines",
                  "Age: minimum 17 years as on December 31 of the admission year",
                ].map((criteria) => (
                  <div key={criteria} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-college-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80 leading-relaxed">
                      {criteria}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-college-green-700 rounded-2xl p-6 text-white">
              <h4 className="font-display font-semibold text-lg mb-3">
                Important Dates 2026
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { event: "Application Open", date: "Feb 1, 2026" },
                  { event: "Last Date to Apply", date: "Mar 31, 2026" },
                  { event: "Merit List Publication", date: "Apr 5, 2026" },
                  { event: "Counseling Rounds", date: "Apr 10–15, 2026" },
                  { event: "Classes Begin", date: "Aug 1, 2026" },
                ].map((item) => (
                  <div key={item.event} className="flex justify-between">
                    <span className="text-white/80">{item.event}</span>
                    <span className="font-medium text-gold-light">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Card className="border-college-green-100 shadow-card-green bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl text-college-green-800">
                  Admission Inquiry Form
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill in your details and our admissions team will reach out to
                  you within 24 hours.
                </p>
              </CardHeader>
              <CardContent>
                {/* Success State */}
                {status === "success" && (
                  <div
                    data-ocid="admissions.success_state"
                    className="flex items-center gap-3 bg-college-green-50 border border-college-green-200 rounded-xl p-4 mb-6"
                  >
                    <CheckCircle2 className="w-6 h-6 text-college-green-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-college-green-800 text-sm">
                        Inquiry Submitted!
                      </p>
                      <p className="text-college-green-700 text-xs mt-0.5">
                        We'll reach out within 24 hours on your provided contact
                        details.
                      </p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {status === "error" && (
                  <div
                    data-ocid="admissions.error_state"
                    className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                  >
                    <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
                    <p className="text-destructive text-sm">
                      Something went wrong. Please try again or contact us
                      directly.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="adm-name"
                      className="text-sm font-medium text-foreground"
                    >
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="adm-name"
                      data-ocid="admissions.form.input"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      required
                      className="border-college-green-200 focus:ring-college-green-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="adm-email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="adm-email"
                      type="email"
                      data-ocid="admissions.form.email.input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                      className="border-college-green-200 focus:ring-college-green-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="adm-phone"
                      className="text-sm font-medium text-foreground"
                    >
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="adm-phone"
                      type="tel"
                      data-ocid="admissions.form.phone.input"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      required
                      className="border-college-green-200 focus:ring-college-green-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">
                      Program of Interest{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.program}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, program: v }))
                      }
                    >
                      <SelectTrigger
                        data-ocid="admissions.form.select"
                        className="border-college-green-200 focus:ring-college-green-500"
                      >
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BHMS">
                          BHMS – Bachelor of Homeopathic Medicine & Surgery
                        </SelectItem>
                        <SelectItem value="MD Homeopathy">
                          MD Homeopathy
                        </SelectItem>
                        <SelectItem value="PG Diploma">
                          PG Diploma in Homeopathic Clinical Practice
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="adm-bg"
                      className="text-sm font-medium text-foreground"
                    >
                      Academic Background
                    </Label>
                    <Textarea
                      id="adm-bg"
                      data-ocid="admissions.form.textarea"
                      placeholder="Briefly describe your educational background, marks, and any relevant experience..."
                      value={form.background}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, background: e.target.value }))
                      }
                      rows={4}
                      className="border-college-green-200 focus:ring-college-green-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    data-ocid="admissions.form.submit_button"
                    disabled={status === "loading"}
                    className="w-full bg-college-green-700 hover:bg-college-green-600 text-white font-semibold h-11"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2
                          data-ocid="admissions.loading_state"
                          className="mr-2 w-4 h-4 animate-spin"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── News & Events Section ─────────────────────────────────────────────────────

function NewsSection() {
  const { actor } = useActor();
  const { data: newsEvents, isLoading, isError } = useGetActiveNewsEvents();
  const addNewsMutation = useAddNewsEvent();
  const [seeded, setSeeded] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: mutateAsync is stable
  useEffect(() => {
    if (!actor || seeded || isLoading || isError) return;
    if (newsEvents && newsEvents.length === 0) {
      setSeeded(true);
      Promise.all(
        SAMPLE_NEWS.map((n) =>
          addNewsMutation.mutateAsync({
            actor,
            title: n.title,
            description: n.description,
            category: n.category,
          }),
        ),
      ).catch(() => {});
    }
  }, [actor, newsEvents, isLoading, isError, seeded]);

  const displayNews =
    newsEvents && newsEvents.length > 0
      ? newsEvents
      : SAMPLE_NEWS.map((n, i) => ({
          ...n,
          id: BigInt(i),
          isActive: true,
          date:
            BigInt(Date.now()) * BigInt(1_000_000) -
            BigInt(i) * BigInt(7 * 24 * 3600) * BigInt(1_000_000_000),
        }));

  return (
    <section
      id="news"
      className="py-20 lg:py-28"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.95 0.022 148) 0%, oklch(0.97 0.012 148) 100%)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-college-green-100 text-college-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <CalendarDays className="w-3.5 h-3.5" />
            News & Events
          </div>
          <h2 className="section-title mb-4">Latest Updates</h2>
          <p className="section-subtitle mx-auto">
            Stay informed about the latest news, events, seminars, and
            announcements from IGM Homeopathic Medical College.
          </p>
        </motion.div>

        {isLoading && (
          <div
            data-ocid="news.loading_state"
            className="grid md:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-college-green-100">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isError && (
          <div data-ocid="news.error_state" className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-muted-foreground">
              Unable to load news. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !isError && displayNews.length === 0 && (
          <div data-ocid="news.empty_state" className="text-center py-12">
            <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No news or events available at the moment.
            </p>
          </div>
        )}

        {!isLoading && !isError && displayNews.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayNews.slice(0, 6).map((item, index) => {
              const ocidIndex = index + 1;
              const isEvent =
                (item.category as string) === NewsEventCategory.event;
              return (
                <motion.div
                  key={item.id.toString()}
                  data-ocid={`news.item.${ocidIndex}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-college-green-100 shadow-card-green hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          className={`text-xs font-medium capitalize ${
                            isEvent
                              ? "bg-gold/15 text-amber-700 border border-gold/30"
                              : "bg-college-green-50 text-college-green-700 border border-college-green-200"
                          }`}
                          variant="outline"
                        >
                          {isEvent ? "Event" : "News"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-college-green-800 text-base leading-snug mb-3 flex-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                      <button
                        type="button"
                        className="mt-4 text-sm text-college-green-600 font-medium hover:text-college-green-500 flex items-center gap-1 self-start transition-colors"
                      >
                        Read More
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Contact Section ───────────────────────────────────────────────────────────

function ContactSection() {
  const { actor } = useActor();
  const submitMutation = useSubmitContactForm();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setStatus("loading");
    try {
      await submitMutation.mutateAsync({
        actor,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Message sent! We'll get back to you shortly.");
    } catch {
      setStatus("error");
      toast.error("Failed to send message. Please try again.");
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      label: "Address",
      value:
        "IGM Homeopathic Medical College, Medical Campus Road, City – 000001",
    },
    { icon: Phone, label: "Phone", value: "+91-XXXXXXXXXX" },
    { icon: Mail, label: "Email", value: "info@igmhmc.edu" },
    { icon: Clock, label: "Office Hours", value: "Mon–Sat, 9:00 AM – 5:00 PM" },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-college-green-50 text-college-green-700 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Mail className="w-3.5 h-3.5" />
            Contact Us
          </div>
          <h2 className="section-title mb-4">Get In Touch</h2>
          <p className="section-subtitle mx-auto">
            Have questions about admissions, programs, or campus life? We're
            here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-college-green-700 flex items-center justify-center text-white shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-foreground/80 font-medium">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="mt-4 rounded-2xl overflow-hidden border border-college-green-100 shadow-card-green h-56 bg-college-green-50 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-10 h-10 mx-auto mb-2 text-college-green-300" />
                <p className="text-sm">Interactive map coming soon</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Card className="border-college-green-100 shadow-card-green bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl text-college-green-800">
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {status === "success" && (
                  <div
                    data-ocid="contact.success_state"
                    className="flex items-center gap-3 bg-college-green-50 border border-college-green-200 rounded-xl p-4 mb-6"
                  >
                    <CheckCircle2 className="w-6 h-6 text-college-green-600 shrink-0" />
                    <p className="text-college-green-800 text-sm font-medium">
                      Thank you! Your message has been received. We'll reply
                      within 24 hours.
                    </p>
                  </div>
                )}

                {status === "error" && (
                  <div
                    data-ocid="contact.error_state"
                    className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                  >
                    <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
                    <p className="text-destructive text-sm">
                      Message could not be sent. Please try again.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="contact-name"
                        className="text-sm font-medium"
                      >
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact-name"
                        data-ocid="contact.form.input"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        required
                        className="border-college-green-200"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="contact-phone"
                        className="text-sm font-medium"
                      >
                        Phone
                      </Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        data-ocid="contact.form.phone.input"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="border-college-green-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-email"
                      className="text-sm font-medium"
                    >
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      data-ocid="contact.form.email.input"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      required
                      className="border-college-green-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="contact-message"
                      className="text-sm font-medium"
                    >
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.form.textarea"
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      rows={5}
                      required
                      className="border-college-green-200 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    data-ocid="contact.form.submit_button"
                    disabled={status === "loading"}
                    className="w-full bg-college-green-700 hover:bg-college-green-600 text-white font-semibold h-11"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2
                          data-ocid="contact.loading_state"
                          className="mr-2 w-4 h-4 animate-spin"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Programs", href: "#programs" },
    { label: "Faculty", href: "#faculty" },
    { label: "Facilities", href: "#facilities" },
    { label: "Admissions", href: "#admissions" },
    { label: "News & Events", href: "#news" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-college-green-900 text-white">
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/college-logo-transparent.dim_200x200.png"
                alt="IGM HMC"
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-display font-bold text-lg leading-tight">
                  IGM Homeopathic
                </p>
                <p className="font-display text-sm text-college-green-300 leading-tight">
                  Medical College
                </p>
              </div>
            </div>
            <p className="text-college-green-200 text-sm leading-relaxed mb-5 max-w-sm">
              Committed to excellence in homeopathic medical education since
              1985. Approved by Ministry of AYUSH, Government of India.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-college-green-800 hover:bg-college-green-700 flex items-center justify-center transition-colors"
                >
                  <social.icon className="w-4 h-4 text-college-green-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.slice(0, 5).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-college-green-300 hover:text-gold-light transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4 text-white">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-college-green-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-college-green-500" />
                <span>Medical Campus Road, City – 000001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-college-green-500" />
                <span>+91-XXXXXXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-college-green-500" />
                <span>info@igmhmc.edu</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-college-green-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-college-green-400">
          <p>
            © {currentYear} IGM Homeopathic Medical College. All Rights
            Reserved.
          </p>
          <p>
            Built with{" "}
            <Heart className="w-3.5 h-3.5 inline text-red-400 mx-0.5" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-college-green-300 hover:text-gold-light transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen font-body">
      <Toaster position="top-right" richColors />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <FacultySection />
        <FacilitiesSection />
        <AdmissionsSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
