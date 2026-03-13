import UserLayout from '@/components/user/UserLayout';

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <UserLayout>{children}</UserLayout>;
}
