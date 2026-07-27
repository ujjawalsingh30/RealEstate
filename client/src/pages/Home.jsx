import React from 'react'
import Hero from '../components/Hero'
import BrowseByCategory from '../components/BrowseByCategory'
import WhyChooseUs from '../components/WhyChooseUs'
import FeaturedCollections from '../components/FeaturedCollections'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b131e] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Hero/>
      <BrowseByCategory/>
      <WhyChooseUs/>
      <FeaturedCollections/>
      <Footer/>
    </div>
  )
}

export default Home
