'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log del error para debugging
		console.error('Error en la aplicación:', error);
	}, [error]);

	return (
		<div className='flex h-screen w-full flex-col items-center justify-center p-8'>
			<div className='flex max-w-md flex-col items-center text-center'>
				<AlertCircle className='h-16 w-16 text-destructive mb-4' />
				<h2 className='scroll-m-20 text-3xl font-semibold tracking-tight mb-2'>
					Algo salió mal
				</h2>
				<p className='text-muted-foreground mb-6'>
					Ha ocurrido un error inesperado en la aplicación. Por favor,
					intenta nuevamente o contacta al soporte si el problema
					persiste.
				</p>
				{error.message && (
					<div className='mb-6 rounded-md bg-muted p-4 text-sm text-left w-full'>
						<p className='font-mono text-xs break-all'>
							{error.message}
						</p>
					</div>
				)}
				<div className='flex gap-3'>
					<Button onClick={() => reset()}>Intentar de nuevo</Button>
					<Button
						variant='outline'
						onClick={() => (window.location.href = '/')}
					>
						Ir al inicio
					</Button>
				</div>
			</div>
		</div>
	);
}
