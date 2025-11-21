'use client';

import {
	type Dispatch,
	type SetStateAction,
	useActionState,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { updatePatientAction } from '@/lib/actions/patients';
import {
	PatientType as PatientTypeEnum,
	type DocumentType as DocumentTypeValue,
	type PatientType as PatientTypeValue,
} from '@/lib/generated/prisma/enums';
import type {
	PatientRow,
	UpdatePatientActionState,
} from '@/types/patients';

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

const actionInitial: UpdatePatientActionState = {
	status: 'idle',
};

export interface EditPatientModalProps {
	patient: PatientRow | null;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export function EditPatientModal({
	patient,
	open,
	setOpen,
}: EditPatientModalProps) {
	const [documentType, setDocumentType] = useState<
		DocumentTypeValue | ''
	>('');
	const [patientType, setPatientType] = useState<PatientTypeValue>(
		PatientTypeEnum.SESSIONS,
	);
	const [selectedInsurer, setSelectedInsurer] =
		useState<string>('none');
	const formRef = useRef<HTMLFormElement | null>(null);

	const resetForm = useCallback(() => {
		formRef.current?.reset();
		setDocumentType('');
		setPatientType(PatientTypeEnum.SESSIONS);
		setSelectedInsurer('none');
	}, []);

	const [formKey, setFormKey] = useState(0);

	useEffect(() => {
		if (!patient || !open) return;

		let cancelled = false;
		const frame = requestAnimationFrame(() => {
			if (!cancelled) {
				setDocumentType(patient.documentType);
				setPatientType(patient.type);
				setSelectedInsurer(patient.insurerId || 'none');
				setFormKey((prev) => prev + 1);
			}
		});

		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
		};
	}, [patient, open]);

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			setOpen(nextOpen);
			if (!nextOpen) {
				resetForm();
			}
		},
		[setOpen, resetForm],
	);

	const handleUpdatePatient = useCallback(
		async (
			_prevState: UpdatePatientActionState,
			formData: FormData,
		) => {
			try {
				const nextState = await updatePatientAction(
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
				console.error('Error updating patient:', error);
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
		handleUpdatePatient,
		actionInitial,
	);

	const fieldErrors = state.fieldErrors ?? {};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='min-w-4xl'>
				<DialogHeader>
					<DialogTitle>Editar paciente</DialogTitle>
					<DialogDescription>
						Actualiza la información si detectas un cambio o error en
						los datos registrados.
					</DialogDescription>
				</DialogHeader>
				{patient === null ? (
					<div className='text-center text-red-500'>
						No se encontró la información del paciente.
					</div>
				) : (
					<form
						key={formKey}
						ref={formRef}
						action={formAction}
						className='space-y-6'
					>
						<input type='hidden' name='id' value={patient.id} />

						{/* Dos columnas */}
						<div className='grid gap-6 md:grid-cols-2'>
							{/* Columna izquierda */}
							<div className='space-y-6'>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor='edit-name'>
											Nombre completo
										</FieldLabel>
										<FieldContent>
											<Input
												id='edit-name'
												name='name'
												type='text'
												autoComplete='name'
												aria-invalid={Boolean(
													state.fieldErrors?.name?.length,
												)}
												defaultValue={patient.name}
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
										<FieldLabel htmlFor='edit-doc'>
											Número de documento
										</FieldLabel>
										<FieldContent>
											<Input
												id='edit-doc'
												name='document'
												type='text'
												inputMode='numeric'
												autoComplete='off'
												aria-invalid={Boolean(
													state.fieldErrors?.document?.length,
												)}
												defaultValue={patient.document}
												disabled={isPending}
												required
											/>
											<FieldError
												errors={getFieldErrors(
													'document',
													fieldErrors,
												)}
											/>
										</FieldContent>
									</Field>
								</FieldGroup>

								<FieldGroup>
									<Field>
										<FieldLabel htmlFor='edit-entered-at'>
											Fecha de ingreso
										</FieldLabel>
										<FieldDescription>
											Fecha en la que el paciente inició su
											tratamiento.
										</FieldDescription>
										<FieldContent>
											<Input
												id='edit-entered-at'
												name='enteredAt'
												type='date'
												aria-invalid={Boolean(
													state.fieldErrors?.enteredAt?.length,
												)}
												defaultValue={
													patient.enteredAt
														? new Date(patient.enteredAt)
																.toISOString()
																.split('T')[0]
														: ''
												}
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
										<FieldLabel htmlFor='edit-insurer'>
											Aseguradora
										</FieldLabel>
										<FieldDescription>
											Selecciona la aseguradora si el paciente tiene
											una.
										</FieldDescription>
										<FieldContent>
											<InsurerSelect
												id='edit-insurer'
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
														(value as PatientTypeValue) ||
															patientType,
													)
												}
												className='space-y-3'
												aria-invalid={Boolean(
													state.fieldErrors?.type?.length,
												)}
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
								<Button
									type='submit'
									disabled={isPending || !patient}
								>
									{isPending ? 'Actualizando…' : 'Guardar cambios'}
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
				)}
			</DialogContent>
		</Dialog>
	);
}
