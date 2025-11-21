'use client';

import { useEffect, useState } from 'react';
import { getInsurers } from '@/lib/actions/insurers';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export interface InsurerSelectProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	id?: string;
	placeholder?: string;
	required?: boolean;
}

export function InsurerSelect({
	value,
	onChange,
	disabled = false,
	id = 'insurer-select',
	placeholder = 'Sin aseguradora',
	required = false,
}: InsurerSelectProps) {
	const [insurers, setInsurers] = useState<
		{ id: string; name: string }[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		const loadInsurers = async () => {
			try {
				setIsLoading(true);
				const data = await getInsurers();
				if (!cancelled) {
					setInsurers(data);
				}
			} catch (err) {
				if (!cancelled) {
					console.error('Error loading insurers:', err);
					toast.error('No se pudieron cargar las aseguradoras.');
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		};

		loadInsurers();

		return () => {
			cancelled = true;
		};
	}, []);

	if (isLoading) {
		return <Skeleton className='h-10 w-full' />;
	}

	return (
		<Select
			value={value}
			onValueChange={onChange}
			disabled={disabled}
			required={required}
		>
			<SelectTrigger id={id} className='w-full'>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='none'>Sin aseguradora</SelectItem>
				{insurers.map((insurer) => (
					<SelectItem key={insurer.id} value={insurer.id}>
						{insurer.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
