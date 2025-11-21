import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DatabaseErrorProps {
	message?: string;
	onRetry?: () => void;
}

export function DatabaseError({
	message = 'No se pudo conectar a la base de datos',
	onRetry,
}: DatabaseErrorProps) {
	return (
		<div className='flex flex-col items-center justify-center p-8 text-center'>
			<AlertCircle className='h-12 w-12 text-yellow-500 mb-4' />
			<h3 className='text-lg font-semibold mb-2'>
				Problema de conexión
			</h3>
			<p className='text-sm text-muted-foreground mb-4 max-w-md'>
				{message}. Por favor, verifica tu conexión a internet e
				intenta nuevamente.
			</p>
			{onRetry && <Button onClick={onRetry}>Reintentar</Button>}
		</div>
	);
}
