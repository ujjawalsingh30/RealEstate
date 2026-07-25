import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BrowseByCategory from '../components/BrowseByCategory'
import WhyChooseUs from '../components/WhyChooseUs'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <BrowseByCategory/>
      <WhyChooseUs/>
      <Footer/>
    </div>
  )
}

export default Home
