import { signIn } from "@/auth";
import { PrimaryButton } from "@/components/ui/primary-button";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/dashboard" });
      }}
    >
      <PrimaryButton className="w-full" type="submit">
        Continue with Google
      </PrimaryButton>
    </form>
  );
}
