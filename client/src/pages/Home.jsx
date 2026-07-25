import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import BrowseByCategory from '../components/BrowseByCategory'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <BrowseByCategory/>
    </div>
  )
}

export default Home
