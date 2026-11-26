import { Providers } from "@/app/providers";
import "../globals.css";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Providers lang="en" enableAuth={true}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
