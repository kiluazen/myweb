import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/global.css";
import Head from "next/head";
import { GoogleAnalytics } from "@next/third-parties/google";
function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-[#DFD7CF] min-h-screen flex flex-col">
      <Head>
        <title>Kushal</title>
        <link rel="icon" href="/contemplation.ico" />
      </Head>
      <GoogleAnalytics gaId="G-D3SC1WNS4Q" />
      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
