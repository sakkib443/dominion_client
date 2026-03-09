import NewHeader from "@/components/layout/Header/NewHeader";
import NewFooter from "@/components/layout/Footer/NewFooter";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NewHeader />
            <main>
                {children}
            </main>
            <NewFooter />
        </>
    );
}
