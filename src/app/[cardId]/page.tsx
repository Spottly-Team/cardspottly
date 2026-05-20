import { redirect } from "next/navigation";
import { isValidCardId, normalizeCardId } from "@/lib/card-id";

/** Redirect /24VGJ5Q12GAM → /c/24VGJ5Q12GAM */
export default async function CardIdRedirectPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId: raw } = await params;
  const cardId = normalizeCardId(raw);

  if (isValidCardId(cardId)) {
    redirect(`/c/${cardId}`);
  }

  redirect("/");
}
