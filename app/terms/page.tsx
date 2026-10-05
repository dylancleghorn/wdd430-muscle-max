import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  description: "Terms of Service for MuscleMAX.",
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <LegalPage
      description="These terms describe the rules for using MuscleMAX."
      title="Terms of Service"
    >
      <section>
        <h2 className="text-xl font-semibold text-slate-50">Using MuscleMAX</h2>
        <p className="mt-3 leading-7">
          MuscleMAX is a personal workout planning and tracking tool. You may
          use it for lawful, personal purposes and are responsible for the
          information you add to your account and for keeping your Google
          account secure.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">Health notice</h2>
        <p className="mt-3 leading-7">
          MuscleMAX does not provide medical, fitness, or professional health
          advice. Consult a qualified professional before beginning or changing
          an exercise program, especially if you have a health concern or
          injury.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">Your content</h2>
        <p className="mt-3 leading-7">
          You retain responsibility for the workout information you create. You
          may remove routines and exercises from the app when you no longer want
          them. We may limit or suspend access if the service is used unlawfully
          or in a way that harms the service or other people.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">
          Availability and changes
        </h2>
        <p className="mt-3 leading-7">
          MuscleMAX is provided as available. We may update, change, or
          discontinue features as the app develops. We may also update these
          terms; the date above shows when they were last revised.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-slate-50">Contact</h2>
        <p className="mt-3 leading-7">
          Questions about these terms can be sent to{" "}
          <a
            className="text-green-400 underline underline-offset-4 hover:text-green-300"
            href="mailto:dylan.cleghorn@gmail.com"
          >
            dylan.cleghorn@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
