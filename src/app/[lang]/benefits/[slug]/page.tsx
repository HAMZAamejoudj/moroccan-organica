import { redirect } from "next/navigation";

export const revalidate = 2592000;
export const dynamicParams = false;

export default async function BenefitPostRedirect({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params;
    redirect(`/${lang}/organica/${slug}`);
}
