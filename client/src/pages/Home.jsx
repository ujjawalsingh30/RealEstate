import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BrowseByCategory from '../components/BrowseByCategory'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <BrowseByCategory/>
      <Footer/>
    </div>
  )
}

export default Home
