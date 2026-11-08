import { redirect } from "next/navigation";

export default function DocsIndexRedirect() {
  redirect("/docs/Getting_Started/The_First_Tour");
}
