"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Rocket,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Clock,
  Award,
  Play,
  BookOpen,
  Target,
  Globe,
  MessageSquare,
  BarChart3,
  FileText,
  Headphones,
  Video,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// Updated Features Data
const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "AI-Powered Skill Assessment",
    description: "Advanced algorithms analyze your current skills and identify growth opportunities tailored to your career goals."
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: "Career Acceleration Engine",
    description: "Strategic roadmaps that fast-track your professional growth with actionable milestones and progress tracking."
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Personalized Learning Paths",
    description: "Custom curriculum designed around your industry, experience level, and aspirational goals."
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Expert Mentor Network",
    description: "Connect with seasoned professionals and industry leaders for guidance and networking opportunities."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: "Performance Analytics",
    description: "Comprehensive dashboards track your progress and provide insights for continuous improvement."
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Global Job Marketplace",
    description: "Access exclusive opportunities from leading companies worldwide, matched to your profile."
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: "24/7 AI Career Advisor",
    description: "Intelligent chatbot provides instant answers to career questions and strategic advice."
  },
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Industry Certifications",
    description: "Earn recognized credentials that validate your expertise and boost your professional credibility."
  }
];

// Updated Testimonials
const testimonials = [
  {
    author: "Alexandra Chen",
    role: "Senior Software Architect",
    company: "Meta",
    image: "/api/placeholder/60/60",
    quote: "This platform transformed my career trajectory in just 8 months. The AI-powered insights helped me identify skill gaps I never knew existed, and the personalized learning path got me promoted to a senior role."
  },
  {
    author: "Marcus Rodriguez",
    role: "Product Manager",
    company: "Spotify",
    image: "/api/placeholder/60/60",
    quote: "The mentor network is incredible. Being connected with industry veterans who provided real-world guidance made all the difference in my transition from engineering to product management."
  },
  {
    author: "Sarah Kim",
    role: "UX Director",
    company: "Adobe",
    image: "/api/placeholder/60/60",
    quote: "I've tried many career development platforms, but none come close to this. The combination of AI insights, practical skills training, and networking opportunities is unmatched."
  }
];

// Updated How It Works
const howItWorks = [
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Complete Assessment",
    description: "Take our comprehensive career evaluation to understand your current position and potential."
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Set Goals",
    description: "Define your career objectives and let our AI create a personalized roadmap for success."
  },
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: "Learn & Grow",
    description: "Follow your custom learning path with interactive courses, projects, and expert mentorship."
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "Track Progress",
    description: "Monitor your advancement with detailed analytics and celebrate key milestones."
  }
];

// Updated FAQs
const faqs = [
  {
    question: "How does the AI career assessment work?",
    answer: "Our AI analyzes your background, skills, experience, and career goals using advanced machine learning algorithms. It then provides personalized insights and recommendations based on successful career patterns from our database of over 100,000 professionals."
  },
  {
    question: "What types of careers does the platform support?",
    answer: "We support over 500 career paths across technology, business, healthcare, finance, creative industries, and more. Our platform is particularly strong in emerging fields like AI, data science, cybersecurity, and digital marketing."
  },
  {
    question: "How quickly can I expect to see results?",
    answer: "Most users see meaningful progress within 30 days, with significant career advancement typically occurring within 3-6 months. Results vary based on individual commitment and starting point."
  },
  {
    question: "Do you offer job placement assistance?",
    answer: "Yes! Our platform includes access to exclusive job opportunities, resume optimization tools, interview preparation, and direct connections with hiring managers at partner companies."
  },
  {
    question: "Is there ongoing support after completing programs?",
    answer: "Absolutely. You get lifetime access to our community, ongoing mentor relationships, career coaching sessions, and continuous updates to learning materials as industries evolve."
  }
];

const FloatingElements = () => {
  // Use fixed values to prevent hydration mismatch
  const fixedPositions = [
    { x: 397, y: 505 }, { x: 188, y: 38 }, { x: 636, y: 18 }, { x: 593, y: 362 },
    { x: 651, y: 366 }, { x: 421, y: 376 }, { x: 781, y: 163 }, { x: 629, y: 74 },
    { x: 398, y: 135 }, { x: 862, y: 41 }, { x: 677, y: 30 }, { x: 867, y: 105 },
    { x: 1002, y: 334 }, { x: 844, y: 99 }, { x: 424, y: 123 }, { x: 963, y: 486 },
    { x: 884, y: 237 }, { x: 556, y: 588 }, { x: 85, y: 210 }, { x: 276, y: 358 },
    { x: 37, y: 171 }, { x: 597, y: 101 }, { x: 575, y: 83 }, { x: 1116, y: 244 },
    { x: 1108, y: 537 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {fixedPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full"
          initial={{
            x: pos.x,
            y: pos.y,
          }}
          animate={{
            y: [pos.y, pos.y - 120, pos.y],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 12 + (i * 0.3), // Use index-based duration instead of random
            repeat: Infinity,
            delay: i * 0.2, // Use index-based delay instead of random
          }}
        />
      ))}
    </div>
  );
};

const AnimatedCounter = ({ end, suffix = "" }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / 80;
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const ParallaxSection = ({ children, offset = 50 }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <FloatingElements />
      
      {/* Enhanced Mesh Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:32px_32px]" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/8 via-secondary/8 to-primary/8"
          animate={{
            background: [
              "linear-gradient(60deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.08), rgba(139, 92, 246, 0.08))",
              "linear-gradient(120deg, rgba(16, 185, 129, 0.08), rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))",
              "linear-gradient(60deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.08), rgba(139, 92, 246, 0.08))",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Revolutionary Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Animated Background Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 120, 240, 360],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 240, 120, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            className="mb-8 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-full text-sm font-semibold border border-blue-200/50 dark:border-blue-800/50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <motion.span
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              style={{
                backgroundSize: "200% 100%",
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              Professional Future
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Harness the power of artificial intelligence to accelerate your career growth. 
            Get personalized insights, expert mentorship, and strategic guidance that adapts to your unique professional journey.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <Link href="/dashboard" passHref>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl"
                >
                  Begin Your Transformation
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </motion.div>
                </Button>
              </motion.div>
            </Link>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-10 text-lg font-bold border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl"
              >
                <Play className="mr-3 h-6 w-6" />
                Watch Success Stories
              </Button>
            </motion.div>
          </motion.div>

       
        </motion.div>
        </div>
        
        {/* Modern Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-600 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-slate-400 dark:bg-slate-600 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Scroll to explore</span>
        </motion.div>
      </motion.section>

      {/* Revolutionary Features Section */}
      <section className="w-full py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
        <ParallaxSection offset={40}>
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.h2
                variants={itemVariants}
                className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent"
              >
                Powered by Advanced AI Technology
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
              >
                Experience the future of professional development with cutting-edge tools designed for modern careers
              </motion.p>
            </motion.div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-8xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 h-full overflow-hidden">
                    <CardContent className="pt-8 text-center flex flex-col items-center h-full relative">
                      {/* Gradient Border Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
                      
                      <motion.div
                        className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900 dark:group-hover:to-purple-900 transition-colors duration-500 relative z-10"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-500 relative z-10">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 flex-grow leading-relaxed relative z-10">
                        {feature.description}
                      </p>
                      <motion.div
                        className="mt-6 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-500 relative z-10"
                        whileHover={{ x: 8 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </ParallaxSection>
      </section>

      {/* Enhanced Stats Section */}
      <section className="w-full py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-emerald-50 dark:from-blue-950 dark:via-purple-950 dark:to-emerald-950 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 25% 75%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Transforming Careers Worldwide
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto text-center"
          >
            {[
              { value: 127, suffix: "+", label: "Industries Supported", icon: Globe },
              { value: 5000, suffix: "+", label: "Learning Modules", icon: BookOpen },
              { value: 98, suffix: "%", label: "Career Advancement", icon: TrendingUp },
              { value: 15, suffix: "min", label: "Avg. Daily Learning", icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
                whileHover={{ scale: 1.08, y: -5 }}
              >
                <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/20 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <motion.div
                    className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800 dark:group-hover:to-purple-800 transition-colors duration-500"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <motion.h3
                    className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.1 }}
                  >
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </motion.h3>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section className="w-full py-32 bg-white dark:bg-slate-900 relative">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Your Journey to Success
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Four intelligent steps to revolutionize your professional trajectory with AI-powered precision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-8xl mx-auto">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.25, duration: 1 }}
                whileHover={{ y: -15 }}
              >
                {/* Enhanced Connection Line */}
                {index < howItWorks.length - 1 && (
                  <motion.div
                    className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 dark:from-blue-800 dark:via-purple-800 dark:to-emerald-800 z-0 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.4 + 0.8, duration: 1 }}
                  />
                )}
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-6 p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-100 via-purple-100 to-emerald-100 dark:from-blue-900 dark:via-purple-900 dark:to-emerald-900 flex items-center justify-center relative group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-emerald-200 dark:group-hover:from-blue-800 dark:group-hover:via-purple-800 dark:group-hover:to-emerald-800 transition-colors duration-500">
                      {item.icon}
                      <motion.div
                        className="absolute inset-0 rounded-3xl border-3 border-blue-300/50 dark:border-blue-700/50"
                        animate={{ 
                          rotate: 360,
                          borderColor: [
                            "rgba(59, 130, 246, 0.5)",
                            "rgba(16, 185, 129, 0.5)",
                            "rgba(139, 92, 246, 0.5)",
                            "rgba(59, 130, 246, 0.5)",
                          ]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg">
                      {index + 1}
                    </div>
                  </motion.div>
                  
                  <h3 className="font-black text-2xl text-slate-900 dark:text-slate-100">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="w-full py-32 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 relative overflow-hidden">
        <ParallaxSection offset={-30}>
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                Success Stories That Inspire
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Join thousands of professionals who have transformed their careers with our revolutionary platform
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-8xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.3, duration: 1 }}
                  whileHover={{ 
                    y: -15, 
                    rotateY: 8,
                    transition: { duration: 0.4 }
                  }}
                >
                  <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full overflow-hidden group">
                    <CardContent className="pt-8">
                      <div className="flex flex-col space-y-6 h-full">
                        <div className="flex items-center space-x-4 mb-6">
                          <motion.div
                            className="relative h-16 w-16 flex-shrink-0"
                            whileHover={{ scale: 1.15 }}
                          >
                            <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-400 to-purple-600 p-0.5">
                              <div className="h-full w-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-blue-600">
                                {testimonial.author.charAt(0)}
                              </div>
                            </div>
                            <motion.div
                              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-slate-800"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </motion.div>
                          <div className="flex-grow">
                            <p className="font-black text-lg text-slate-900 dark:text-slate-100">{testimonial.author}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{testimonial.role}</p>
                            <p className="text-sm text-blue-600 font-bold">{testimonial.company}</p>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i }}
                              >
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        
                        <motion.blockquote
                          className="flex-grow"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          <p className="text-slate-700 dark:text-slate-300 italic relative leading-relaxed text-lg">
                            <span className="text-6xl text-blue-300/40 absolute -top-4 -left-2 font-serif">
                              "
                            </span>
                            <span className="relative z-10">{testimonial.quote}</span>
                            <span className="text-6xl text-blue-300/40 absolute -bottom-8 right-2 font-serif">
                              "
                            </span>
                          </p>
                        </motion.blockquote>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </ParallaxSection>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="w-full py-32 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Questions & Answers
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to know about transforming your professional future
            </p>
          </motion.div>

          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <AccordionItem 
                    value={`item-${index}`}
                    className="border-0 rounded-2xl px-8 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden group"
                  >
                    <AccordionTrigger className="text-left hover:text-blue-600 transition-colors duration-500 py-8 text-lg font-bold">
                      <span>{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400 pb-8 text-base leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Revolutionary CTA Section */}
      <section className="w-full relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-emerald-600"
          animate={{
            background: [
              "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
              "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
              "linear-gradient(135deg, #8b5cf6 0%, #10b981 50%, #3b82f6 100%)",
              "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Advanced Animated Background */}
        <div className="absolute inset-0">
          {[
            { left: 52.67, top: 83.85, x: 20, y: 30 },
            { left: 66.38, top: 93.48, x: -15, y: 25 },
            { left: 86.94, top: 70.17, x: 30, y: -20 },
            { left: 77.53, top: 71.26, x: -25, y: 15 },
            { left: 18.97, top: 13.59, x: 35, y: 40 },
            { left: 87.27, top: 17.09, x: -30, y: 20 },
            { left: 2.86, top: 58.39, x: 25, y: -15 },
            { left: 57.96, top: 29.85, x: -20, y: 35 },
            { left: 16.32, top: 83.71, x: 40, y: -25 },
            { left: 31.18, top: 4.80, x: -35, y: 30 },
            { left: 51.57, top: 69.87, x: 15, y: -20 },
            { left: 96.39, top: 86.05, x: -40, y: 10 },
            { left: 28.09, top: 99.28, x: 30, y: -35 },
            { left: 64.29, top: 2.33, x: -15, y: 45 },
            { left: 33.39, top: 69.67, x: 25, y: -10 }
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-40 h-40 bg-white/10 rounded-full blur-2xl"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.1, 0.3, 0.1],
                x: [0, pos.x, 0],
                y: [0, pos.y, 0],
              }}
              transition={{
                duration: 10 + (i * 0.5),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto py-32 px-4">
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {/* Premium Badge */}
            <motion.div
              className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-lg rounded-full text-white/90 text-sm font-bold border border-white/30 shadow-2xl"
              whileHover={{ scale: 1.05, y: -3 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.div>
              Transform Your Career • Join 75,000+ Professionals Worldwide
            </motion.div>
            
            {/* Main Headline */}
            <motion.h2
              className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Ready to{" "}
              <motion.span
                className="relative inline-block"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 40px rgba(255,255,255,0.8)",
                    "0 0 60px rgba(255,255,255,1)",
                    "0 0 40px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,0.5)",
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Accelerate
              </motion.span>
              <br />
              Your Professional Growth?
            </motion.h2>
            
            {/* Subtitle */}
            <motion.p
              className="mx-auto max-w-3xl text-white/90 md:text-xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Join the AI revolution in career development. Get personalized insights, expert mentorship, 
              and strategic guidance that adapts to your unique professional journey. Start your transformation today.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 mt-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <Link href="/dashboard" passHref>
                <motion.div
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="h-16 px-12 text-lg font-black bg-white text-slate-900 hover:bg-slate-100 shadow-2xl hover:shadow-white/25 rounded-2xl"
                  >
                    <motion.span
                      animate={{ 
                        background: [
                          "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                          "linear-gradient(45deg, #8b5cf6, #10b981)",
                          "linear-gradient(45deg, #10b981, #3b82f6)",
                          "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      Start Your Transformation
                    </motion.span>
                    <motion.div
                      animate={{ x: [0, 8, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-3 h-6 w-6 text-slate-900" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-12 text-lg font-black border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-md rounded-2xl"
                >
                  <Video className="mr-3 h-6 w-6" />
                  Schedule Free Demo
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                14-day premium trial
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                24/7 expert support
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Money-back guarantee
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
