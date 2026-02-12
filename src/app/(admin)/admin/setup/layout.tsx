export default function SetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Setup page has NO sidebar/top bar — full-screen wizard layout
    return <>{children}</>;
}
