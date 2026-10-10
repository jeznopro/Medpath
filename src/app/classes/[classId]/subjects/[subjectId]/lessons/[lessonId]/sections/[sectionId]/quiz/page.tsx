import { redirect } from "next/navigation";

export default function NestedQuizRedirect({
  params,
}: {
  params: { sectionId: string };
}) {
  redirect(`/sections/${params.sectionId}/quiz`);
}
