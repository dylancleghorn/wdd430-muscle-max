import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  description: "How MuscleMAX collects, uses, and protects your information.",
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      description="This policy explains what information MuscleMAX uses and how it is handled."
      title="Privacy Policy"
    >
      <section>
        <h2 className="text-xl font-semibold text-slate-50">
          Information we collect
        </h2>
        <p className="mt-3 leading-7">
          When you sign in with Google, MuscleMAX receives your name, email
          address, and profile image. We also store the workout routines,
          exercises, and other workout information you choose to create in the
          app.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">
          How we use information
        </h2>
        <p className="mt-3 leading-7">
          We use your Google account information to create and secure your
          MuscleMAX account. We use your workout information to provide your
          private workout planner and tracker. MuscleMAX does not sell your
          personal information or use it for advertising.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">
          Sharing and storage
        </h2>
        <p className="mt-3 leading-7">
          Your information is stored with the services used to run MuscleMAX,
          including its hosting and database providers. We do not share your
          workout information with other MuscleMAX users. Google handles your
          sign-in under its own privacy policy.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">Your choices</h2>
        <p className="mt-3 leading-7">
          You can delete workout routines and exercises you no longer want to
          keep from within the app. You may also revoke MuscleMAX&apos;s access
          from your Google Account settings. To request help with your account
          or personal information, contact us at{" "}
          <a
            className="text-green-400 underline underline-offset-4 hover:text-green-300"
            href="mailto:dylan.cleghorn@gmail.com"
          >
            dylan.cleghorn@gmail.com
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">
          Changes to this policy
        </h2>
        <p className="mt-3 leading-7">
          We may update this policy as MuscleMAX changes. The date above shows
          when it was last revised.
        </p>
      </section>
    </LegalPage>
  );
}
