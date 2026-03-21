export default function NexusTermsOfService() {
  return (
    <div className="flex flex-col px-6 py-8 md:px-[4rem] lg:px-[16rem]">
      <h1 className="text-[#525051] font-[Sora] text-[2rem] md:text-[2.5rem] font-bold mb-4">
        Nexus Terms of Service
      </h1>
      <p className="text-[1rem] md:text-[1.1rem] mb-8 text-gray-600">
        Effective date: March 21, 2026
      </p>

      <div className="space-y-8 text-[1rem] md:text-[1.2rem]">
        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By connecting or using Nexus through ChatGPT, you agree to these
            Terms of Service and our{" "}
            <a
              href="/nexus/privacy-policy"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </a>
            . If you do not agree, disconnect the app from ChatGPT and stop
            using the service.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            2. Description of Service
          </h2>
          <p className="mb-4">
            Nexus is a workout and nutrition tracking service that operates as
            a ChatGPT app. Through natural conversation in ChatGPT, Nexus
            allows you to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Log workout entries (exercises, sets, reps, weight, duration).
            </li>
            <li>
              Log meal entries with nutritional information (calories, protein,
              carbs, fat).
            </li>
            <li>View, update, and manage your logged entries.</li>
            <li>
              Connect with friends to share workout and nutrition data.
            </li>
          </ul>
          <p className="mt-4">
            Nexus does not have a standalone app, website interface, or mobile
            app. All interactions happen exclusively through ChatGPT.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            3. Eligibility
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must have a valid ChatGPT account to use Nexus.</li>
            <li>You must be at least 13 years of age to use Nexus.</li>
            <li>
              You must authenticate with a Google account through our OAuth
              flow.
            </li>
            <li>
              By using Nexus, you represent that you meet these requirements.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            4. Your Account and Data
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You are responsible for the accuracy of the data you log. Nexus
              stores exactly what you provide.
            </li>
            <li>
              You retain ownership of all workout and nutrition data you log
              through Nexus.
            </li>
            <li>
              You can view your data at any time using the history tool and
              update entries using the update tool.
            </li>
            <li>
              You can request deletion of your account and all data by
              contacting us at{" "}
              <a
                href="mailto:kushalsokke@gmail.com"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                kushalsokke@gmail.com
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            5. Acceptable Use
          </h2>
          <p className="mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Attempt to overload, hack, or reverse-engineer the service.
            </li>
            <li>
              Use Nexus to store sensitive personal information unrelated to
              workout and nutrition tracking (such as medical records,
              financial data, or passwords).
            </li>
            <li>
              Abuse the friends feature to harass or spam other users.
            </li>
            <li>
              Circumvent authentication, rate limits, or access controls.
            </li>
            <li>
              Use Nexus in any way that violates{" "}
              <a
                href="https://openai.com/policies/usage-policies/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                OpenAI&apos;s Usage Policies
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            6. Health and Fitness Disclaimer
          </h2>
          <p>
            Nexus is a <strong>data tracking tool only</strong>. It does{" "}
            <strong>not</strong> provide medical advice, dietary
            recommendations, fitness coaching, or health diagnoses. Nutritional
            estimates provided through ChatGPT are approximate and should not
            be relied upon for medical purposes. Always consult a qualified
            healthcare professional before making changes to your diet or
            exercise routine. Nexus and its developer are not responsible for
            any health decisions you make based on tracked data.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            7. Friends and Shared Data
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You can connect with other Nexus users by sharing friend codes.
              Friend connections require mutual consent.
            </li>
            <li>
              Once connected, friends can view your workout and meal entries.
              You can remove a friend at any time to revoke access.
            </li>
            <li>
              You are responsible for choosing who you share your data with
              through the friends feature.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            8. Service Availability
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Nexus is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis.
            </li>
            <li>
              We do not guarantee uninterrupted or error-free service.
            </li>
            <li>
              Service availability depends on ChatGPT&apos;s platform, Google
              Cloud, and Supabase being operational.
            </li>
            <li>
              We reserve the right to modify, suspend, or discontinue the
              service with reasonable notice.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            9. Intellectual Property
          </h2>
          <p>
            All rights, title, and interest in the Nexus service, including
            its code, design, and branding, are owned by the developer. You
            retain full ownership of all workout and nutrition data you log
            through the service.
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            10. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, Nexus and its
            developer shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including but not
            limited to loss of data, health outcomes, or any damages arising
            out of your use of or inability to use the service. Our total
            liability shall not exceed the amount you paid for the service
            (currently $0, as Nexus is free).
          </p>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            11. Termination
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You may stop using Nexus at any time by disconnecting the app
              from ChatGPT.
            </li>
            <li>
              We reserve the right to suspend or terminate your access if you
              violate these terms.
            </li>
            <li>
              Upon disconnection or termination, your data remains stored
              until you request deletion. Contact us to have your data
              permanently removed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[#525051] font-[Sora] text-[1.5rem] font-bold mb-4">
            12. Contact
          </h2>
          <p>For questions about these terms or the service:</p>
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
            13. Changes to These Terms
          </h2>
          <p>
            We may update these terms from time to time. If we make significant
            changes, we will notify users. Continued use of Nexus after
            changes constitutes acceptance of the revised terms.
          </p>
          <p className="mt-4 text-gray-600">Last updated: March 21, 2026</p>
        </section>
      </div>
    </div>
  );
}
