import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/global.css";
import Head from "next/head";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from 'next/script';
function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-[#DFD7CF] min-h-screen flex flex-col">
      <Head>
        <title>Kushal</title>
        <link rel="icon" href="/contemplation.ico" />
      </Head>
      <GoogleAnalytics gaId="G-D3SC1WNS4Q" />
      {/* Add Simple Analytics script */}
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
     
      {/* CursorFlow Integration with production URLs */}
    <Script
      src="https://hyphenbox-clientsdk.pages.dev/flow.js"
      strategy="afterInteractive"
      onLoad={() => {
        const cf = new window.CursorFlow({
          apiKey: 'hbk_live_c08e1b955a977b8b282dbb9c41842ae19ef934e1dae570f2'
        });
        cf.init();
      }}
    />
      
  {/* <Script
        src="/flow.js"
        strategy="afterInteractive"
        onLoad={() => {
          const cf = new window.CursorFlow({
            apiUrl: 'http://localhost:8000',
            organizationId : '996b5d3d-801c-4619-8648-7e4d27deecf5'
          });
          cf.init();
        }}
      />   */}

      <Header />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
      
      
    </div>
  );
}

export default MyApp;
