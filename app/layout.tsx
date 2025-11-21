import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Registro de Pacientes',
	description:
		'Aplicación para registrar y gestionar la agenda de los pacientes',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SidebarProvider
					style={
						{
							'--sidebar-width': '19rem',
						} as React.CSSProperties
					}
				>
					<AppSidebar />
					<SidebarInset>
						<header className='flex h-16 shrink-0 items-center gap-2 px-4'>
							<SidebarTrigger className='-ml-1' />
							<Separator
								orientation='vertical'
								className='mr-2 data-[orientation=vertical]:h-4'
							/>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className='hidden md:block'>
										<BreadcrumbLink href='#'>
											Building Your Application
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className='hidden md:block' />
									<BreadcrumbItem>
										<BreadcrumbPage>Data Fetching</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</header>
						<div className='flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden'>
							{children}
						</div>
					</SidebarInset>
				</SidebarProvider>
				<Toaster position='top-right' expand={true} richColors />
			</body>
		</html>
	);
}
