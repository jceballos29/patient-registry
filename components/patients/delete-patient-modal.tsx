'use client';

import {
	type Dispatch,
	type SetStateAction,
	useActionState,
	useCallback,
} from 'react';

import { deletePatientAction } from '@/lib/actions/patients';
import type { DeletePatientActionState } from '@/types/patients';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const deletePatientInitialState: DeletePatientActionState = {
	status: 'idle',
};

export interface DeletePatientModalProps {
	patientId: string | null;
	patientName?: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export function DeletePatientModal({
	patientId,
	patientName,
	open,
	setOpen,
}: DeletePatientModalProps) {
	const handleDelete = useCallback(
		async (
			prevState = deletePatientInitialState,
			formData: FormData,
		) => {
			try {
				const nextState = await deletePatientAction(
					prevState,
					formData,
				);

				if (nextState.status === 'success') {
					toast.success(nextState.message);
					setOpen(false);
				}

				if (nextState.status === 'error') {
					toast.error(nextState.message);
				}

				return nextState;
			} catch (error) {
				console.error('Error deleting patient:', error);
				toast.error(
					'Error de conexión. Verifica tu red e intenta de nuevo.',
				);
				return {
					status: 'error' as const,
					message: 'Error de conexión',
				};
			}
		},
		[setOpen],
	);

	const [state, formAction, isPending] = useActionState(
		handleDelete,
		deletePatientInitialState,
	);

	const derivedError = state.fieldErrors?.id?.[0] ?? null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='sm:max-w-md'>
				<form action={formAction} className='space-y-6'>
					<input type='hidden' name='id' value={patientId ?? ''} />
					<DialogHeader>
						<DialogTitle>Eliminar paciente</DialogTitle>
						<DialogDescription>
							{patientName
								? `Se eliminará toda la información asociada a ${patientName}.`
								: 'Se eliminará este paciente de forma permanente.'}
						</DialogDescription>
					</DialogHeader>
					<p className='text-sm text-muted-foreground'>
						Esta acción no se puede deshacer. Asegúrate de haber
						exportado los datos necesarios antes de continuar.
					</p>
					{derivedError && (
						<p className='text-sm text-destructive'>{derivedError}</p>
					)}
					<DialogFooter className='flex flex-row gap-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancelar
						</Button>
						<Button
							type='submit'
							variant='destructive'
							disabled={isPending || !patientId}
						>
							{isPending ? 'Eliminando…' : 'Eliminar'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
