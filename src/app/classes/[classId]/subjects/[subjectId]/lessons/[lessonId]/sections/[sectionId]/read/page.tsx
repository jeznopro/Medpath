import { redirect } from "next/navigation";

export default function NestedReadRedirect({
  params,
}: {
  params: { sectionId: string };
}) {
  redirect(`/sections/${params.sectionId}/read`);
}
