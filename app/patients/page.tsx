import { PatientsTable } from '@/components/patients/patient-table';
import { DatabaseError } from '@/components/database-error';
import { getPatients } from '@/lib/actions/patients';

export default async function PatientsPage() {
	const data = await getPatients();
	const hasConnectionError = data.length === 0;

	return (
		<div className='h-full flex flex-col not-first-of-type:rounded-md overflow-hidden'>
			<div className='flex flex-col'>
				<h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0'>
					Pacientes
				</h2>
				<p className='text-sm text-muted-foreground'>
					Gestiona la información de tus pacientes. Aquí puedes
					registrar nuevos ingresos, actualizar sus datos personales o
					elliminar expedientes si es necesario.
				</p>
			</div>
			<div className='grow flex flex-col pt-8'>
				{hasConnectionError ? (
					<DatabaseError message='No se pudieron cargar los pacientes' />
				) : (
					<PatientsTable patients={data} />
				)}
			</div>
		</div>
	);
}
