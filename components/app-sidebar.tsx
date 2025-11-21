'use client';

import {
	ArchiveRestore,
	Command,
	File,
	ReceiptText,
	SquareTerminal,
	Users2,
} from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from './ui/sidebar';
import Link from 'next/link';
import { NavItem, NavMain } from './nav-main';
import { useState } from 'react';

export function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const [navigation] = useState<NavItem[]>([
		{
			type: 'item',
			title: 'Dashboard',
			url: '/',
			icon: SquareTerminal,
			isActive: false,
		},
		{
			type: 'separator',
			key: 'app-sdebar-separator',
		},
		{
			type: 'item',
			title: 'Pacientes',
			url: '/patients',
			icon: Users2,
			isActive: false,
		},
		{
			type: 'item',
			title: 'Sesiones',
			url: '/sessions',
			icon: File,
			isActive: false,
		},
		{
			type: 'item',
			title: 'Autorizaciones',
			url: '/authorizations',
			icon: ArchiveRestore,
			isActive: false,
		},
		{
			type: 'item',
			title: 'Facturas',
			url: '/invoices',
			icon: ReceiptText,
			isActive: false,
		},
	]);

	return (
		<Sidebar variant='floating' collapsible='icon' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<Link href='/'>
								<div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
									<Command className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>
										Registro de Pacientes
									</span>
									<span className='truncate text-xs text-muted-foreground'>
										Terapia ocupacional
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navigation} />
			</SidebarContent>
		</Sidebar>
	);
}
