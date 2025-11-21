'use client';

import { useState } from 'react';

import { EditPatientModal } from '@/components/patients/edit-patient-modal';
import { DeletePatientModal } from '@/components/patients/delete-patient-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	documentTypeOptions,
	formatDate,
	getDocumentType,
	getPatientType,
	LOCALE,
	patientTypeOptions,
} from '@/lib/utils';
import type { PatientRow } from '@/types/patients';
import type { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ListFilter, MoreVertical } from 'lucide-react';

type MultiSelectOption = {
	value: string;
	label: string;
	description?: string;
};

const buildMultiSelectHeader = (
	column: Column<PatientRow, unknown>,
	label: string,
	options: MultiSelectOption[],
) => {
	const selectedValues = (column.getFilterValue() as string[]) ?? [];
	const toggleValue = (value: string, checked: boolean) => {
		column.setFilterValue((prev: unknown) => {
			const current = Array.isArray(prev) ? prev : [];
			const next = new Set(current);
			if (checked) {
				next.add(value);
			} else {
				next.delete(value);
			}
			return next.size ? Array.from(next) : undefined;
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost'>
					{label}
					<ListFilter className='ml-2 h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start' className='w-64'>
				<DropdownMenuLabel>Filtrar</DropdownMenuLabel>
				{/* <DropdownMenuCheckboxItem
					checked={selectedValues.length === 0}
					onCheckedChange={() => column.setFilterValue(undefined)}
				>
					Todos
				</DropdownMenuCheckboxItem> */}
				<DropdownMenuSeparator />
				{options.map((option) => (
					<DropdownMenuCheckboxItem
						key={option.value}
						checked={selectedValues.includes(option.value)}
						onCheckedChange={(checked) =>
							toggleValue(option.value, checked === true)
						}
					>
						<div className='flex flex-col'>
							<span className='text-sm font-medium'>
								{option.label}
							</span>
							{option.description && (
								<span className='text-muted-foreground text-xs'>
									{option.description}
								</span>
							)}
						</div>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

interface PatientRowActionsProps {
	patient: PatientRow;
}

const PatientRowActions = ({ patient }: PatientRowActionsProps) => {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Abrir menú</span>
						<MoreVertical className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Acciones</DropdownMenuLabel>
					<DropdownMenuItem
						onClick={() => navigator.clipboard.writeText(patient.id)}
					>
						Copiar ID del paciente
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setIsEditOpen(true)}>
						Editar paciente
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setIsDeleteOpen(true)}
						className='text-destructive focus:text-destructive'
					>
						Eliminar paciente
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<EditPatientModal
				patient={patient}
				open={isEditOpen}
				setOpen={setIsEditOpen}
			/>
			<DeletePatientModal
				patientId={patient.id}
				patientName={patient.name}
				open={isDeleteOpen}
				setOpen={setIsDeleteOpen}
			/>
		</>
	);
};

export const columns: ColumnDef<PatientRow>[] = [
	// {
	// 	id: 'select',
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && 'indeterminate')
	// 			}
	// 			onCheckedChange={(value) =>
	// 				table.toggleAllPageRowsSelected(!!value)
	// 			}
	// 			aria-label='Seleccionar todo'
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label='Seleccionar fila'
	// 		/>
	// 	),
	// 	enableSorting: false,
	// 	enableColumnFilter: false,
	// },
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Nombre
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: 'documentType',
		header: ({ column }) =>
			buildMultiSelectHeader(
				column,
				'Tipo de documento',
				documentTypeOptions,
			),
		enableColumnFilter: true,
		filterFn: (row, id, filterValue) => {
			const values = Array.isArray(filterValue) ? filterValue : [];
			if (!values.length) return true;
			return values.includes(row.getValue(id));
		},
		cell: ({ row }) => {
			const documentType = row.original.documentType;
			const result = getDocumentType(documentType);
			return (
				<Badge className={result?.className}>
					{result?.description}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'document',
		header: 'Documento',
	},
	{
		accessorKey: 'type',
		header: ({ column }) =>
			buildMultiSelectHeader(
				column,
				'Tipo de consulta',
				patientTypeOptions.map((option) => ({
					value: option.value,
					label: option.title,
					description: option.description,
				})),
			),
		cell: ({ row }) => {
			const type = row.original.type;
			const result = getPatientType(type);
			return (
				<Badge className={result?.className}>{result?.title}</Badge>
			);
		},
		filterFn: (row, id, filterValue) => {
			const values = Array.isArray(filterValue) ? filterValue : [];
			if (!values.length) return true;
			return values.includes(row.getValue(id));
		},
		enableColumnFilter: true,
	},
	{
		accessorKey: 'insurer',
		header: ({ column, table }) => {
			// Extraer opciones únicas de aseguradoras desde los datos
			const insurers = table
				.getPreFilteredRowModel()
				.rows.reduce((acc, row) => {
					const insurer = row.original.insurer;
					if (insurer && !acc.some((i) => i.value === insurer.id)) {
						acc.push({
							value: insurer.id,
							label: insurer.name,
						});
					}
					return acc;
				}, [] as MultiSelectOption[]);

			// Añadir opción para "Sin aseguradora"
			insurers.unshift({
				value: 'none',
				label: 'Sin aseguradora',
			});

			return buildMultiSelectHeader(column, 'Aseguradora', insurers);
		},
		cell: ({ row }) => {
			const insurer = row.original.insurer;
			return insurer ? (
				<Badge className='bg-sky-200 text-sky-800'>
					{insurer.name}
				</Badge>
			) : null;
		},
		filterFn: (row, id, filterValue) => {
			const values = Array.isArray(filterValue) ? filterValue : [];
			if (!values.length) return true;

			const insurer = row.original.insurer;
			// Si seleccionaron "none" y el paciente no tiene aseguradora
			if (values.includes('none') && !insurer) return true;
			// Si el id de la aseguradora está en los valores seleccionados
			if (insurer && values.includes(insurer.id)) return true;

			return false;
		},
		enableColumnFilter: true,
		enableSorting: true,
		sortingFn: (rowA, rowB) => {
			const a = rowA.original.insurer?.name || '';
			const b = rowB.original.insurer?.name || '';
			return a.localeCompare(b, LOCALE);
		},
	},
	{
		accessorKey: 'enteredAt',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === 'asc')
					}
				>
					Fecha de ingreso
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return formatDate(row.original.enteredAt);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => <PatientRowActions patient={row.original} />,
	},
];
