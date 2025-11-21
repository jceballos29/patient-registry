'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';
import React from 'react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey?: string;
	searchPlaceholder?: string;
	action?: {
		label: string;
		onClick: () => void;
	}
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey = 'name',
	searchPlaceholder = 'Buscar...',
	action,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = React.useState({});

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onRowSelectionChange: setRowSelection,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
	});

	const searchColumn = searchKey ? table.getColumn(searchKey) : null;

	return (
		<div className='grow flex flex-col'>
			<div className='flex items-center justify-between pb-4'>
				{action ? (
					<Button size='sm' onClick={action.onClick}>{action.label}</Button>
				) : null}
				{searchColumn ? (
					<Input
						placeholder={searchPlaceholder}
						value={(searchColumn.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							searchColumn.setFilterValue(event.target.value)
						}
						className='max-w-sm'
					/>
				) : (
					<span />
				)}
			</div>
			<div className='grow flex flex-col justify-between'>
				<div className='overflow-hidden rounded-md border'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												className={cn(
													header.column.id === 'actions' && 'w-8',
													header.column.id === 'select' && 'w-10',
												)}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
													  )}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className='flex items-center justify-between space-x-2 pt-4'>
					<div className='text-muted-foreground flex-1 text-sm'>
						{table.getFilteredSelectedRowModel().rows.length} de{' '}
						{table.getFilteredRowModel().rows.length}{' '}
						{table.getFilteredSelectedRowModel().rows.length == 1
							? 'fila seleccionada'
							: 'filas seleccionadas'}
					</div>
					<div className='flex items-center space-x-6 lg:space-x-8'>
						<div className='flex items-center space-x-2'>
							<p className='text-sm font-medium'>Filas por páginas</p>
							<Select
								value={`${table.getState().pagination.pageSize}`}
								onValueChange={(value) => {
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger className='h-8 w-[70px]'>
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
								</SelectTrigger>
								<SelectContent side='top'>
									{[10, 20, 25, 30, 40, 50].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='flex w-[100px] items-center justify-center text-sm font-medium'>
							Página {table.getState().pagination.pageIndex + 1} de{' '}
							{table.getPageCount()}
						</div>
						<div className='flex items-center space-x-2'>
							<Button
								variant='outline'
								size='icon'
								className='hidden size-8 lg:flex'
								onClick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span className='sr-only'>Go to first page</span>
								<ChevronsLeft />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='size-8'
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className='sr-only'>Go to previous page</span>
								<ChevronLeft />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='size-8'
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className='sr-only'>Go to next page</span>
								<ChevronRight />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='hidden size-8 lg:flex'
								onClick={() =>
									table.setPageIndex(table.getPageCount() - 1)
								}
								disabled={!table.getCanNextPage()}
							>
								<span className='sr-only'>Go to last page</span>
								<ChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
