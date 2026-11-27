import { redirect } from "next/navigation";
import { getLocalizedHref } from "@/lib/utils";

export default async function BenefitsRedirect({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(getLocalizedHref('/organica/Benefits-Using-Natural-Beauty-Products', lang));
}
