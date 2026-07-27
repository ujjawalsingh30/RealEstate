import React from 'react'
import Hero from '../components/Hero'
import BrowseByCategory from '../components/BrowseByCategory'
import WhyChooseUs from '../components/WhyChooseUs'
import FeaturedCollections from '../components/FeaturedCollections'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Hero/>
      <BrowseByCategory/>
      <WhyChooseUs/>
      <FeaturedCollections/>
      <Footer/>
    </div>
  )
}

export default Home
