'use client';

import {
	useActionState,
	useCallback,
	useRef,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react';

import { createPatientAction } from '@/lib/actions/patients';
import {
	PatientType as PatientTypeEnum,
	type DocumentType as DocumentTypeValue,
	type PatientType as PatientTypeValue,
} from '@/lib/generated/prisma/enums';
import type { CreatePatientActionState } from '@/types/patients';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	RadioGroup,
	RadioGroupItem,
} from '@/components/ui/radio-group';
import { InsurerSelect } from '@/components/patients/insurer-select';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/components/ui/toggle-group';
import {
	documentTypeOptions,
	getFieldErrors,
	patientTypeOptions,
} from '@/lib/utils';
import { toast } from 'sonner';

const initialState: CreatePatientActionState = {
	status: 'idle',
};

export interface AddPatientModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddPatientModal({
	open,
	setOpen,
}: AddPatientModalProps) {
	const formRef = useRef<HTMLFormElement | null>(null);

	const [documentType, setDocumentType] = useState<
		DocumentTypeValue | ''
	>('');
	const [patientType, setPatientType] = useState<PatientTypeValue>(
		PatientTypeEnum.SESSIONS,
	);
	const [selectedInsurer, setSelectedInsurer] =
		useState<string>('none');

	const resetForm = useCallback(() => {
		formRef.current?.reset();
		setDocumentType('');
		setPatientType(PatientTypeEnum.SESSIONS);
		setSelectedInsurer('none');
	}, []);

	// Acción principal
	const handleCreatePatient = useCallback(
		async (_prevState = initialState, formData: FormData) => {
			try {
				const nextState = await createPatientAction(
					_prevState,
					formData,
				);

				if (nextState.status === 'success') {
					toast.success(nextState.message);
					resetForm();
					setOpen(false);
				}

				if (nextState.status === 'error') {
					toast.error(nextState.message);
				}

				return nextState;
			} catch (error) {
				console.error('Error creating patient:', error);
				toast.error(
					'Error de conexión. Verifica tu red e intenta de nuevo.',
				);
				return {
					status: 'error' as const,
					message: 'Error de conexión',
				};
			}
		},
		[setOpen, resetForm],
	);

	const [state, formAction, isPending] = useActionState(
		handleCreatePatient,
		initialState,
	);

	const fieldErrors = state.fieldErrors ?? {};

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			if (!nextOpen) {
				resetForm();
			}
			setOpen(nextOpen);
		},
		[setOpen, resetForm],
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='min-w-4xl'>
				<DialogHeader>
					<DialogTitle>Agregar paciente</DialogTitle>
					<DialogDescription>
						Completa la información básica para registrar un nuevo
						paciente.
					</DialogDescription>
				</DialogHeader>

				<form ref={formRef} action={formAction} className='space-y-6'>
					{/* Nombre completo - span full width */}

					{/* Dos columnas */}
					<div className='grid gap-6 md:grid-cols-2'>
						{/* Columna izquierda */}
						<div className='space-y-6'>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor='patient-name'>
										Nombre completo
									</FieldLabel>
									<FieldContent>
										<Input
											id='patient-name'
											name='name'
											type='text'
											autoComplete='name'
											placeholder='Ej. Paola Gómez'
											aria-invalid={Boolean(
												state.fieldErrors?.name?.length,
											)}
											defaultValue={state.data?.name || ''}
											disabled={isPending}
											required
										/>
										<FieldError
											errors={getFieldErrors('name', fieldErrors)}
										/>
									</FieldContent>
								</Field>
							</FieldGroup>
							<FieldGroup>
								<Field>
									<FieldLabel>Tipo de documento</FieldLabel>
									<FieldContent>
										<ToggleGroup
											type='single'
											variant='outline'
											className='grid w-full grid-cols-4'
											value={documentType}
											onValueChange={(value) =>
												setDocumentType(
													(value as DocumentTypeValue) || '',
												)
											}
											aria-invalid={Boolean(
												state.fieldErrors?.documentType?.length,
											)}
											disabled={isPending}
										>
											{documentTypeOptions.map((option) => (
												<ToggleGroupItem
													key={option.value}
													value={option.value}
													className='flex w-full flex-col gap-1 text-center'
												>
													<span className='text-sm font-medium'>
														{option.label}
													</span>
												</ToggleGroupItem>
											))}
										</ToggleGroup>

										<input
											type='hidden'
											name='documentType'
											value={documentType}
											required
										/>

										<FieldError
											errors={getFieldErrors(
												'documentType',
												fieldErrors,
											)}
										/>
									</FieldContent>
								</Field>

								<Field>
									<FieldLabel htmlFor='patient-document'>
										Número de documento
									</FieldLabel>
									<FieldContent>
										<Input
											id='patient-document'
											name='document'
											type='text'
											inputMode='numeric'
											autoComplete='off'
											placeholder='Ingresa el número sin puntos'
											aria-invalid={Boolean(
												state.fieldErrors?.document?.length,
											)}
											defaultValue={state.data?.document || ''}
											disabled={isPending}
											required
										/>
										<FieldError
											errors={getFieldErrors('document', fieldErrors)}
										/>
									</FieldContent>
								</Field>
							</FieldGroup>

							<FieldGroup>
								<Field>
									<FieldLabel htmlFor='patient-entered-at'>
										Fecha de ingreso
									</FieldLabel>
									<FieldDescription>
										Fecha en la que el paciente inició su tratamiento.
									</FieldDescription>
									<FieldContent>
										<Input
											id='patient-entered-at'
											name='enteredAt'
											type='date'
											aria-invalid={Boolean(
												state.fieldErrors?.enteredAt?.length,
											)}
											defaultValue={state.data?.enteredAt || ''}
											disabled={isPending}
											required
										/>
										<FieldError
											errors={getFieldErrors(
												'enteredAt',
												fieldErrors,
											)}
										/>
									</FieldContent>
								</Field>
							</FieldGroup>
						</div>

						{/* Columna derecha */}
						<div className='space-y-6'>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor='patient-insurer'>
										Aseguradora
									</FieldLabel>
									<FieldDescription>
										Selecciona la aseguradora si el paciente tiene
										una.
									</FieldDescription>
									<FieldContent>
										<InsurerSelect
											id='patient-insurer'
											value={selectedInsurer}
											onChange={setSelectedInsurer}
											disabled={isPending}
										/>
										<input
											type='hidden'
											name='insurerId'
											value={
												selectedInsurer === 'none'
													? ''
													: selectedInsurer
											}
										/>
										<FieldError
											errors={getFieldErrors(
												'insurerId',
												fieldErrors,
											)}
										/>
									</FieldContent>
								</Field>
							</FieldGroup>
							<FieldGroup>
								<Field>
									<FieldLabel>Tipo de paciente</FieldLabel>
									<FieldDescription>
										Selecciona cómo se gestionará el cobro de este
										paciente.
									</FieldDescription>
									<FieldContent>
										<RadioGroup
											value={patientType}
											onValueChange={(value) =>
												setPatientType(
													(value as PatientTypeValue) || patientType,
												)
											}
											className='space-y-3'
											aria-invalid={Boolean(fieldErrors.type?.length)}
											disabled={isPending}
										>
											{patientTypeOptions.map((option) => (
												<Field
													key={option.value}
													className='w-full rounded-md border p-3'
													orientation='responsive'
												>
													<label className='flex w-full items-start gap-4'>
														<div className='flex flex-1 flex-col'>
															<strong className='text-sm font-semibold'>
																{option.title}
															</strong>
															<span className='text-muted-foreground text-xs'>
																{option.description}
															</span>
														</div>
														<RadioGroupItem value={option.value} />
													</label>
												</Field>
											))}
										</RadioGroup>

										<input
											type='hidden'
											name='type'
											value={patientType}
										/>
										<FieldError
											errors={getFieldErrors('type', fieldErrors)}
										/>
									</FieldContent>
								</Field>
							</FieldGroup>
						</div>
					</div>

					{/* Botones */}
					<div className='w-full flex items-center justify-end'>
						<Field orientation='horizontal' className='w-auto'>
							<Button type='submit' disabled={isPending}>
								{isPending ? 'Guardando…' : 'Guardar paciente'}
							</Button>

							<Button
								type='button'
								variant='outline'
								onClick={() => handleOpenChange(false)}
								disabled={isPending}
							>
								Cancelar
							</Button>
						</Field>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
