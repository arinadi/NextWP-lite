export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Login page has NO sidebar/top bar — full-screen layout
    return <>{children}</>;
}
