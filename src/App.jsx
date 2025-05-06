import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cart from './Components/Cart/Cart'
import OrderConfirmationPage from './Components/OrderConfirmationPage/OrderConfirmationPage'
import MemberDashboard from './Components/MemberDashboard/MemberDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Cart/>
      {/* <OrderConfirmationPage/> */}
      {/* <MemberDashboard/> */}
    </>
  )
}

export default App
