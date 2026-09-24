import { PageTitle } from "@/components/ui/page-title";
import { requirePageUser } from "@/lib/auth/user";

export default async function ProfilePage() {
  const user = await requirePageUser();

  return (
    <div className="space-y-8">
      <PageTitle description="This profile is created from your Google account.">
        Profile
      </PageTitle>
      <section className="max-w-xl rounded-xl border border-slate-700 bg-slate-800 p-6">
        <dl className="space-y-5">
          <div>
            <dt className="text-sm font-medium text-slate-400">Name</dt>
            <dd className="mt-1 text-lg text-slate-50">
              {user.name || "Not provided"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-400">Email</dt>
            <dd className="mt-1 text-lg text-slate-50">
              {user.email || "Not provided"}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
