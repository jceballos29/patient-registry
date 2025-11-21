'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function PatientsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Error en la página de pacientes:', error);
	}, [error]);

	return (
		<div className='flex h-full w-full flex-col items-center justify-center p-8'>
			<div className='flex max-w-md flex-col items-center text-center'>
				<AlertCircle className='h-12 w-12 text-destructive mb-4' />
				<h2 className='scroll-m-20 text-2xl font-semibold tracking-tight mb-2'>
					Error al cargar los pacientes
				</h2>
				<p className='text-sm text-muted-foreground mb-6'>
					No se pudo cargar la información de los pacientes. Esto
					puede deberse a un problema de conexión con la base de
					datos.
				</p>
				<div className='flex gap-3'>
					<Button onClick={() => reset()}>Reintentar</Button>
					<Button
						variant='outline'
						onClick={() => (window.location.href = '/')}
					>
						Volver al inicio
					</Button>
				</div>
			</div>
		</div>
	);
}
