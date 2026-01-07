"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, ArrowRight } from "lucide-react";
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
      await addDoc(collection(db, "contacts"), {
        name: formState.name,
        email: formState.email,
        message: formState.message,
        createdAt: serverTimestamp(),
        read: false,
      });

      setSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative bg-bg-paper" ref={ref}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-24">
            
            {/* Left: Info */}
            <div>
               <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 animate={isInView ? { opacity: 1, y: 0 } : {}}
                 className="text-6xl md:text-8xl font-serif text-text-charcoal mb-12 tracking-tight"
               >
                 Let&apos;s <br /> <span className="italic text-accent-moss">Collaborate.</span>
               </motion.h2>

               <div className="space-y-12">
                  <div>
                    <span className="block font-mono text-xs text-text-olive mb-2 uppercase tracking-widest">Email</span>
                    <a href="mailto:charith@example.com" className="text-2xl md:text-3xl font-sans font-light text-text-charcoal hover:text-accent-terracotta transition-colors border-b border-text-charcoal/20 pb-1">
                      charith@example.com
                    </a>
                  </div>

                  <div>
                    <span className="block font-mono text-xs text-text-olive mb-2 uppercase tracking-widest">Location</span>
                    <p className="text-2xl md:text-3xl font-sans font-light text-text-charcoal">
                      San Francisco, CA
                    </p>
                  </div>

                  <div className="pt-12">
                     <span className="block font-mono text-xs text-text-olive mb-4 uppercase tracking-widest">Socials</span>
                     <div className="flex gap-8">
                        {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                           <a key={social} href="#" className="text-lg font-serif italic text-text-charcoal hover:text-accent-moss transition-colors">
                              {social}
                           </a>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right: Minimal Form */}
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={isInView ? { opacity: 1, y: 0 } : {}}
               transition={{ delay: 0.2 }}
               className="bg-bg-cream/50 p-12"
            >
               <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-2">
                     <label htmlFor="name" className="block font-mono text-xs text-text-olive uppercase tracking-widest">Name</label>
                     <input
                        type="text"
                        id="name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        required
                        className="w-full bg-transparent border-b border-text-charcoal/20 py-4 text-xl font-sans text-text-charcoal focus:outline-none focus:border-accent-moss transition-colors placeholder:text-text-charcoal/20"
                        placeholder="John Doe"
                     />
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="email" className="block font-mono text-xs text-text-olive uppercase tracking-widest">Email</label>
                     <input
                        type="email"
                        id="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        required
                        className="w-full bg-transparent border-b border-text-charcoal/20 py-4 text-xl font-sans text-text-charcoal focus:outline-none focus:border-accent-moss transition-colors placeholder:text-text-charcoal/20"
                        placeholder="john@example.com"
                     />
                  </div>

                  <div className="space-y-2">
                     <label htmlFor="message" className="block font-mono text-xs text-text-olive uppercase tracking-widest">Message</label>
                     <textarea
                        id="message"
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        required
                        rows={4}
                        className="w-full bg-transparent border-b border-text-charcoal/20 py-4 text-xl font-sans text-text-charcoal focus:outline-none focus:border-accent-moss transition-colors placeholder:text-text-charcoal/20 resize-none"
                        placeholder="Tell me about your project..."
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={isSubmitting || submitted}
                     className="group flex items-center gap-4 text-xl font-serif font-medium italic text-text-charcoal hover:text-accent-terracotta transition-colors disabled:opacity-50"
                  >
                     {isSubmitting ? "Sending..." : submitted ? "Message Sent" : "Send Message"}
                     {!isSubmitting && !submitted && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                  </button>
               </form>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
