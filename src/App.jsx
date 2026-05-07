import './App.scss'
import {Header} from "./components/Header/index.jsx";
import {Navigation} from "./components/Navigation/index.jsx";
import {Home} from "./pages/Home/index.jsx";
import {Route, Routes} from "react-router";
import {Footer} from "./components/Footer/index.jsx";
import {Reservation} from "./pages/Reservation/index.jsx";
import {Prices} from "./pages/Prices/index.jsx";
import ScrollToTop from "./components/ScrollToTop/index.jsx";
import {Subscriptions} from "./pages/Subscriptions/index.jsx";
import {Tickets} from "./pages/Tickets/index.jsx";
import {Contact} from "./pages/Contact/index.jsx";
import {Toast} from "./components/Toast/index.jsx";
import {ProtectedRoutes} from "./components/ProtectedRoutes/index.jsx";
import {Checkout} from "./pages/Checkout/index.jsx";
import {Privatization} from "./pages/Privatization/index.jsx";
import {Success} from "./pages/Success/index.jsx";
import {Cancel} from "./pages/Cancel/index.jsx";
import {Profile} from "./pages/Profile/index.jsx";
import {Coaching} from "./pages/Coaching/index.jsx";
import {Events} from "./pages/Events/index.jsx";
import {CookieBanner} from "./components/CookieBanner/index.jsx";
import MentionsLegales from "./components/Legal/MentionsLegales/index.jsx";
import CGU from "./components/Legal/CGU/index.jsx";
import CGV from "./components/Legal/CGV/index.jsx";
import PolitiqueCookies from "./components/Legal/PolitiqueCookies/index.jsx";
import PolitiqueConfidentialite from "./components/Legal/PolitiqueConfidentialite/index.jsx";
import {BookingConfirmation} from "./pages/BookingConfirmation/index.jsx";
import {SubscriptionSuccess} from "./pages/SubscriptionSuccess/index.jsx";
import {SubscriptionCancel} from "./pages/SubscriptionCancel/index.jsx";
import {MaintenanceGuard} from "./components/MaintenanceGuard/index.jsx";

function App() {

  return (
      <MaintenanceGuard>
          <>
              <Header />
              <ScrollToTop/>
              <Routes>
                  <Route index element={<Home />} />
                  <Route path="/reservations" element={<Reservation />} />
                  <Route path="/prices" element={<Prices />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="privatization" element={<Privatization />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/coaching" element={<Coaching />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/booking/:id" element={<BookingConfirmation />} />
                  <Route path="/order" element={<ProtectedRoutes />}>
                      <Route path="/order/checkout" element={<Checkout />}/>
                      <Route path="/order/success" element={<Success />}/>
                      <Route path="/order/cancel" element={<Cancel />}/>
                  </Route>
                  <Route path="/subscription" element={<ProtectedRoutes />} >
                      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
                      <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
                  </Route>
                  <Route path="/profile" element={<ProtectedRoutes />}>
                      <Route path="/profile/profile" element={<Profile />}/>
                  </Route>
                  <Route path="/cgv" element={<CGV />} />
                  <Route path="/cgu" element={<CGU />} />
                  <Route path="/mentions-legales" element={<MentionsLegales />} />
                  <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                  <Route path="/politique-cookies" element={<PolitiqueCookies />} />
              </Routes>

              <Toast/>
              <Footer />
              <Navigation />
              <CookieBanner />
          </>
      </MaintenanceGuard>
  )
}

export default App
