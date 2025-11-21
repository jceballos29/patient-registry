"use client"

import { columns } from '@/components/patients/columns';
import { PatientRow } from '@/types/patients';
import { DataTable } from '../data-table';
import React from 'react';
import { AddPatientModal } from './add-patient-modal';

export interface PatientsTableProps {
	patients: PatientRow[];
}

export function PatientsTable({ patients }: PatientsTableProps) {

  const [openAddPatientModal, setOpenAddPatientModal] = React.useState(false);

	return (
		<>
			<AddPatientModal
				open={openAddPatientModal}
				setOpen={setOpenAddPatientModal}
			/>
			<DataTable
				columns={columns}
				data={patients}
				searchKey='name'
				searchPlaceholder='Buscar paciente...'
				action={{
					label: 'Agregar paciente',
					onClick: () => setOpenAddPatientModal(true),
				}}
			/>
		</>
	);
}
