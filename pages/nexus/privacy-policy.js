export default function NexusPrivacyPolicy() {
  return (
    <div className="flex flex-col px-6 py-8 md:px-[4rem] lg:px-[16rem]">
      <h1 className="text-[#525051] font-[Sora] text-[2rem] md:text-[2.5rem] font-bold mb-4">
        Nexus Privacy Policy
      </h1>
      <p className="text-[1rem] md:text-[1.1rem] mb-8 text-gray-600">
        Effective date: March 21, 2026
      </p>

      <div className="space-y-8 text-[1rem] md:text-[1.2rem]">
        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            1. What Nexus Is
          </h2>
          <p>
            Nexus is a workout and nutrition tracking app that operates as a
            ChatGPT app. You interact with Nexus by chatting naturally in
            ChatGPT, and Nexus logs, retrieves, and manages your fitness and
            meal entries on your behalf. Nexus does not have a standalone
            frontend or mobile app — all interactions happen through ChatGPT.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            2. Categories of Personal Data Collected
          </h2>
          <p className="mb-4">
            Nexus collects only the minimum data required to provide workout
            and nutrition tracking. We collect the following categories of
            personal data:
          </p>

          <h3 className="font-bold mb-2">Account Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>User ID:</strong> A unique identifier from your
              authentication provider (Google via Supabase) used to associate
              your entries with your account.
            </li>
            <li>
              <strong>Display name:</strong> Your name as provided by your
              Google account, shown to friends you connect with.
            </li>
            <li>
              <strong>Email address:</strong> Provided during Google
              authentication, used for account identification.
            </li>
          </ul>

          <h3 className="font-bold mb-2">Workout Data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Exercise names and identifiers</li>
            <li>Sets, reps, and weight lifted</li>
            <li>Duration and distance for cardio activities</li>
            <li>Optional notes you provide</li>
            <li>Date of the workout</li>
          </ul>

          <h3 className="font-bold mb-2">Nutrition Data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Food item names and quantities</li>
            <li>
              Macronutrient information (calories, protein, carbs, fat)
            </li>
            <li>Meal type (breakfast, lunch, dinner, snack)</li>
            <li>Optional notes you provide</li>
            <li>Date of the meal</li>
          </ul>

          <h3 className="font-bold mb-2">Social / Friends Data</h3>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              A unique friend code (e.g., &quot;NEXUS-R3M8&quot;) generated
              for your account
            </li>
            <li>
              Friend connections you create (who you are friends with)
            </li>
          </ul>

          <h3 className="font-bold mt-4 mb-2">What We Do NOT Collect</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>No location or GPS data</li>
            <li>No IP addresses or device identifiers</li>
            <li>No conversation history or chat transcripts from ChatGPT</li>
            <li>No biometric data</li>
            <li>No financial or payment information</li>
            <li>
              No behavioral profiling, surveillance, or cross-app tracking
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            3. Purposes of Use
          </h2>
          <p className="mb-4">
            We use the collected data strictly for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Providing the service:</strong> Storing, retrieving,
              updating, and deleting your workout and meal entries.
            </li>
            <li>
              <strong>Account identification:</strong> Associating your entries
              with your account so only you (and friends you choose) can access
              them.
            </li>
            <li>
              <strong>Social features:</strong> Enabling friend connections so
              you can view each other&apos;s workout and nutrition data.
            </li>
            <li>
              <strong>Data integrity:</strong> Validating entries and computing
              nutritional totals server-side.
            </li>
          </ul>
          <p className="mt-4">
            We do <strong>not</strong> use your data for advertising, marketing,
            behavioral profiling, or training AI models. We do{" "}
            <strong>not</strong> sell, rent, or trade your personal data.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            4. Categories of Recipients
          </h2>
          <p className="mb-4">
            Your data may be shared with the following categories of recipients,
            solely to provide the service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Supabase:</strong> Provides authentication (Google
              OAuth) and hosts our PostgreSQL database where your entries are
              stored. Supabase processes your user ID, email, and display name
              for authentication, and stores all entry data.{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Supabase Privacy Policy
              </a>
            </li>
            <li>
              <strong>Google Cloud:</strong> Our server runs on Google Cloud
              Run. Google Cloud processes requests as our infrastructure
              provider.{" "}
              <a
                href="https://cloud.google.com/terms/cloud-privacy-notice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Google Cloud Privacy Notice
              </a>
            </li>
            <li>
              <strong>OpenAI / ChatGPT:</strong> You interact with Nexus
              through ChatGPT. Your conversations with ChatGPT are governed
              by{" "}
              <a
                href="https://openai.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                OpenAI&apos;s Privacy Policy
              </a>
              . Nexus only receives structured tool calls from ChatGPT (not
              your full conversation).
            </li>
            <li>
              <strong>Friends you connect with:</strong> If you add friends
              through Nexus, they can view your workout and nutrition entries.
              You control who you connect with.
            </li>
          </ul>
          <p className="mt-4">
            We do <strong>not</strong> share your data with any other third
            parties, advertisers, or data brokers.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            5. User Controls
          </h2>
          <p className="mb-4">You have the following controls over your data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>View your data:</strong> Use the{" "}
              <code className="bg-gray-100 px-1 rounded">history</code> tool
              in ChatGPT to view all your logged entries at any time.
            </li>
            <li>
              <strong>Update entries:</strong> Use the{" "}
              <code className="bg-gray-100 px-1 rounded">update</code> tool
              to correct any entry.
            </li>
            <li>
              <strong>Manage friends:</strong> Add, accept, reject, or remove
              friend connections at any time using the{" "}
              <code className="bg-gray-100 px-1 rounded">friends</code> tool.
            </li>
            <li>
              <strong>Disconnect:</strong> You can disconnect Nexus from
              ChatGPT at any time, which stops all data collection.
            </li>
            <li>
              <strong>Data deletion:</strong> To request deletion of your
              account and all associated data, contact us at the email below.
              We will process deletion requests within 30 days.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            6. Data Security
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All data is transmitted over HTTPS.</li>
            <li>
              Authentication uses industry-standard OAuth 2.0 with PKCE via
              Google and Supabase.
            </li>
            <li>
              Your data is stored in a managed PostgreSQL database with access
              restricted to authenticated users.
            </li>
            <li>
              Each user can only access their own data (or friend data, with
              mutual consent).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            7. Data Retention
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Your data is retained for as long as your account is active.
            </li>
            <li>
              Upon account deletion request, all your entries, friend
              connections, and authentication tokens are permanently deleted
              within 30 days.
            </li>
            <li>
              OAuth tokens expire automatically (access tokens after 1 hour,
              refresh tokens after 30 days).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            8. Children&apos;s Privacy
          </h2>
          <p>
            Nexus is intended for users aged 13 and older. We do not knowingly
            collect personal data from children under 13. If we learn that we
            have collected data from a child under 13, we will promptly delete
            that data.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            9. Contact
          </h2>
          <p>
            For privacy questions, data access requests, or deletion requests:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Email:{" "}
              <a
                href="mailto:kushalsokke@gmail.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                kushalsokke@gmail.com
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            10. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. If we make
            significant changes, we will notify users. Continued use of Nexus
            after changes constitutes acceptance of the updated policy.
          </p>
          <p className="mt-4 text-gray-600">Last updated: March 21, 2026</p>
        </section>
      </div>
    </div>
  );
}
