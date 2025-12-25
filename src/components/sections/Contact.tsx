"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firestore
      await addDoc(collection(db, "contacts"), {
        name: formState.name,
        email: formState.email,
        message: formState.message,
        createdAt: serverTimestamp(),
        read: false,
      });

      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-mono text-sm tracking-wider uppercase mb-4 block">
              Get In Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let&apos;s Work <span className="gradient-text">Together</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Have a project in mind or just want to chat? Feel free to reach out.
              I&apos;m always open to discussing new opportunities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <p className="text-zinc-400 mb-8">
                  I&apos;m currently available for freelance work and full-time positions.
                  If you have a project that needs my skills, I&apos;d love to hear about it.
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-6">
                <a
                  href="mailto:charith@example.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="font-medium group-hover:text-cyan-400 transition-colors">
                      charith@example.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Location</p>
                    <p className="font-medium">United States</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div>
                <p className="text-sm text-zinc-500 mb-4">Connect with me</p>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/charithkapuluru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/charithkapuluru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com/charithkapuluru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-300"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-4 rounded-xl bg-zinc-900/50 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 placeholder:text-zinc-600"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-4 rounded-xl bg-zinc-900/50 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 placeholder:text-zinc-600"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    required
                    rows={6}
                    className="w-full px-4 py-4 rounded-xl bg-zinc-900/50 border border-white/10 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 placeholder:text-zinc-600 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    submitted
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-black hover:bg-zinc-200"
                  } disabled:opacity-70`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : submitted ? (
                    "Message Sent!"
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
