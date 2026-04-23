// Root redirect — sends users to /welcome by default
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/welcome");
}
