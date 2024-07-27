import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/global.css';
function MyApp({ Component, pageProps }) {
  return (
    <div className='bg-[#DFD7CF] min-h-screen flex flex-col'>
      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  )
}

export default MyApp;