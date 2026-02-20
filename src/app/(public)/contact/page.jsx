"use client";

import React from "react";
import { Input, Textarea, Button, Divider } from "@heroui/react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock, Send, Twitter, Linkedin, Instagram } from "lucide-react";

import Container from "@/components/shared/Container";

export default function ContactPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1a1a1a] font-sans pb-24 selection:bg-[#c2e2e3] selection:text-black">
      
      {/* ================================================================= */}
      {/* 1. HEADER                                                         */}
      {/* ================================================================= */}
      <section className="pt-24 pb-12 text-center">
        <Container>
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl mx-auto">
            <motion.span variants={fadeUp} className="text-xs font-bold tracking-[0.2em] uppercase text-[#1e44d6] mb-4 block">
              Get in Touch
            </motion.span>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
              We'd love to hear <br className="hidden md:block" /> from you.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-500 text-lg">
              Whether you have a question about our publishing tools, pricing, or just want to say hello, our team is ready to answer all your questions.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ================================================================= */}
      {/* 2. CONTACT LAYOUT (INFO + FORM)                                   */}
      {/* ================================================================= */}
      <section className="py-12">
        <Container>
          <div className="flex flex-col lg:flex-row gap-16 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
            
            {/* Left: Contact Information */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="w-full lg:w-5/12 flex flex-col justify-between"
            >
              <div>
                <motion.h3 variants={fadeUp} className="text-2xl font-serif font-bold mb-8 text-[#1a1a1a]">
                  Contact Information
                </motion.h3>
                
                <div className="flex flex-col gap-6">
                  <motion.div variants={fadeUp} className="flex items-start gap-4">
                    <div className="p-3 bg-[#f7f5f0] rounded-full text-[#1e44d6]">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-1">Office</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Sector 62, Sahibzada Ajit Singh Nagar<br />
                        Punjab, India 160062
                      </p>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex items-start gap-4">
                    <div className="p-3 bg-[#f7f5f0] rounded-full text-[#1e44d6]">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-1">Email</h4>
                      <p className="text-sm text-gray-500">hello@phinity.com</p>
                      <p className="text-sm text-gray-500">support@phinity.com</p>
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex items-start gap-4">
                    <div className="p-3 bg-[#f7f5f0] rounded-full text-[#1e44d6]">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-1">Working Hours</h4>
                      <p className="text-sm text-gray-500">Monday - Friday: 9am - 6pm IST</p>
                      <p className="text-sm text-gray-500">Weekend: Closed</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-900 mb-4">Follow Us</h4>
                <div className="flex gap-4">
                  <SocialIcon Icon={Twitter} />
                  <SocialIcon Icon={Linkedin} />
                  <SocialIcon Icon={Instagram} />
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-7/12 bg-[#f7f5f0] rounded-2xl p-8 lg:p-10"
            >
              <h3 className="text-2xl font-serif font-bold mb-6 text-[#1a1a1a]">
                Send a Message
              </h3>
              
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="First Name" 
                    placeholder="John" 
                    labelPlacement="outside"
                    classNames={{ inputWrapper: "bg-white border-transparent shadow-sm h-12", label: "text-xs font-bold tracking-widest uppercase text-gray-500" }}
                  />
                  <Input 
                    label="Last Name" 
                    placeholder="Doe" 
                    labelPlacement="outside"
                    classNames={{ inputWrapper: "bg-white border-transparent shadow-sm h-12", label: "text-xs font-bold tracking-widest uppercase text-gray-500" }}
                  />
                </div>

                <Input 
                  type="email"
                  label="Email Address" 
                  placeholder="john@example.com" 
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white border-transparent shadow-sm h-12", label: "text-xs font-bold tracking-widest uppercase text-gray-500" }}
                />

                <Input 
                  label="Subject" 
                  placeholder="How can we help?" 
                  labelPlacement="outside"
                  classNames={{ inputWrapper: "bg-white border-transparent shadow-sm h-12", label: "text-xs font-bold tracking-widest uppercase text-gray-500" }}
                />

                <Textarea 
                  label="Message" 
                  placeholder="Write your message here..." 
                  labelPlacement="outside"
                  minRows={5}
                  classNames={{ inputWrapper: "bg-white border-transparent shadow-sm", label: "text-xs font-bold tracking-widest uppercase text-gray-500" }}
                />

                <Button 
                  type="submit"
                  size="lg" 
                  radius="sm" 
                  className="bg-[#1a1a1a] text-white font-bold tracking-widest uppercase text-xs mt-2 w-full sm:w-auto self-start px-10 h-14"
                  endContent={<Send size={16} />}
                >
                  Send Message
                </Button>
              </form>
            </motion.div>

          </div>
        </Container>
      </section>

    </div>
  );
}

// Helper Component for Social Icons
const SocialIcon = ({ Icon }) => (
  <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#1e44d6] flex items-center justify-center text-gray-500 hover:text-[#1e44d6] transition-colors shadow-sm">
    <Icon size={16} strokeWidth={2} />
  </button>
);