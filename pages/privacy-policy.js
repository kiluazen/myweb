export default function PrivacyPolicy() {
    return (
      <div className="flex flex-col px-6 py-8 md:px-[4rem] lg:px-[16rem]">
        <h1 className="text-[#525051] font-[Sora] text-[2rem] md:text-[2.5rem] font-bold mb-8">
          Privacy Policy for Purpose Use
        </h1>
        
        <div className="space-y-8 text-[1rem] md:text-[1.2rem]">
          <section>
            <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
              1. Data Collection and Usage
            </h2>
            
            <h3 className="font-bold mb-2">Authentication Data</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We collect and store authentication information through Supabase</li>
              <li>This includes: email and authentication tokens</li>
              <li>Purpose: To provide secure access to your focus tracking data</li>
            </ul>
  
            <h3 className="font-bold mb-2">Screen Recording Data</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>We temporarily capture screen content</li>
              <li>Purpose: To analyze focus and detect context switches</li>
              <li>Processing: Screen content is analyzed in real-time using Google's Gemini API</li>
              <li>Storage: Raw screen recordings are NOT stored; only analysis results are kept</li>
            </ul>
  
            <h3 className="font-bold mb-2">Browsing Activity</h3>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Active tab URLs and titles</li>
              <li>Application names and window titles</li>
              <li>Purpose: To provide context for focus analysis</li>
              <li>Storage: Only stored when a context switch is detected</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
              2. Data Processing
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Screen content is processed through Google's Gemini API</li>
              <li>Data is stored in Supabase databases</li>
              <li>All data transmission uses secure HTTPS</li>
              <li>No data is shared with third parties for advertising</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
              3. User Rights
            </h2>
            <p className="mb-4">You can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your focus data anytime</li>
              <li>Delete your account and associated data</li>
              <li>Export your focus history</li>
              <li>Opt-out of data collection by uninstalling the extension</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
              4. Data Security
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Secure authentication through Supabase</li>
              <li>Encrypted data transmission</li>
              <li>API key protection</li>
              <li>Regular security updates</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
              5. Contact
            </h2>
            <p>For privacy concerns:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: kushalsokke@gmail.com</li>
           </ul>
          </section>
  
          <section>
            <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
              6. Updates
            </h2>
            <p>
              We may update this policy. Users will be notified of significant changes through the extension or website.
            </p>
            <p className="mt-4">
            Last updated: 03/02/2024
            </p>
          </section>
        </div>
      </div>
    );
  }