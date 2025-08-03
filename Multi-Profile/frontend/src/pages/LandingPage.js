// frontend/src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/Landing/HeroSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import PricingSection from '../components/Landing/PricingSection';
import ReferralBanner from '../components/Landing/ReferralBanner';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <ReferralBanner />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;