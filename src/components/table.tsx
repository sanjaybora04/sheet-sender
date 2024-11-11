import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedMinMaxValues,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Check, ChevronDown, ChevronsUpDown, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Label } from "./ui/label"
import Range from "./range"
import { DatePickerWithRange } from "./date-range"

import { isAfter, isBefore } from 'date-fns'
import Submit from "./submit"
import Settings from "./settings"
import { headersAtom, rowsAtom } from "@/components/settings/sheets"
import { useAtomValue } from "jotai"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

function dateFilter(row: any, filterValue: any, d: any) {
    const [min, max] = JSON.parse(filterValue)
    return (
        isAfter(row.original[d], min) && isBefore(row.original[d], max)
    )
}

function rangeFilter(row: any, filterValue: any, d: any) {
    const [min, max] = JSON.parse(filterValue)
    return (
        row.original[d] >= min && row.original[d] <= max
    )
}

function matchFilter(row: any, filterValue: any, d: any) {
    return (row.original[d] == filterValue)
}

function searchFilter(row: any, filterValue: any, d: any) {
    return (row.original[d].toLowerCase()?.includes?.(filterValue.toLowerCase()) || false)
}


export function DataTable() {
    const rows = useAtomValue(rowsAtom)
    const headers = useAtomValue(headersAtom)

    const [filters, setFilters] = React.useState<any>()
    const columns: ColumnDef<any>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        ...headers?.map((d: string) => ({
            accessorKey: d,
            header: d,
            cell: ({ row }: any) => <div>{row.original[d]}</div>,
            filterFn: (row: any, _: any, filterValue: any) => {
                switch (filters?.[d]) {
                    case 'date':
                        return dateFilter(row, filterValue, d)
                    case 'range':
                        return rangeFilter(row, filterValue, d)
                    case 'match':
                        return matchFilter(row, filterValue, d)
                    case 'search':
                        return searchFilter(row, filterValue, d)
                    default:
                        return true
                }
            }
        }))]

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data: rows,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full mt-5">
            <div className="flex flex-wrap items-end justify-center mb-10 gap-5">
                {headers.map(h => (
                    <div className="flex flex-col max-w-80">
                        <Label className="mb-1">{h}</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className="justify-between gap-2 mb-1">
                                    Filter
                                    <ChevronsUpDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuCheckboxItem
                                    className="capitalize"
                                    checked={filters?.[h] ? false : true}
                                    onCheckedChange={(value) => {
                                        table.getColumn(h)?.setFilterValue('')
                                        setFilters((prev: any) => ({ ...prev, [h]: '' }))
                                    }}
                                >
                                    None
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    className="capitalize"
                                    checked={filters?.[h] == 'date'}
                                    onCheckedChange={(value) => {
                                        table.getColumn(h)?.setFilterValue('')
                                        setFilters((prev: any) => ({ ...prev, [h]: 'date' }))
                                    }}
                                >
                                    Date
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    className="capitalize"
                                    checked={filters?.[h] == 'range'}
                                    onCheckedChange={(value) => {
                                        table.getColumn(h)?.setFilterValue('')
                                        setFilters((prev: any) => ({ ...prev, [h]: 'range' }))
                                    }}
                                >
                                    Range
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    className="capitalize"
                                    checked={filters?.[h] == 'match'}
                                    onCheckedChange={(value) => {
                                        table.getColumn(h)?.setFilterValue('')
                                        setFilters((prev: any) => ({ ...prev, [h]: 'match' }))
                                    }}
                                >
                                    Label
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                    className="capitalize"
                                    checked={filters?.[h] == 'search'}
                                    onCheckedChange={(value) => {
                                        table.getColumn(h)?.setFilterValue('')
                                        setFilters((prev: any) => ({ ...prev, [h]: 'search' }))
                                    }}
                                >
                                    Search
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {
                            filters?.[h] == 'date' ?
                                <DatePickerWithRange value={table.getColumn(h)?.getFilterValue() as string} onChange={(v) => table.getColumn(h)?.setFilterValue(v)} />
                                : filters?.[h] == 'range' ?
                                    <Range minv={table.getColumn(h)?.getFacetedMinMaxValues()?.[0]} maxv={table.getColumn(h)?.getFacetedMinMaxValues()?.[1]} value={table.getColumn(h)?.getFilterValue() as string} onChange={(v) => table.getColumn(h)?.setFilterValue(v)} />
                                    : filters?.[h] == 'match' ?
                                        <Select value={table.getColumn(h)?.getFilterValue() as string}
                                            onValueChange={(value) => {
                                                table.getColumn(h)?.setFilterValue(value)
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={table.getColumn(h)?.getFilterValue() as string || 'All'} />
                                            </SelectTrigger>
                                            <SelectContent align="end">
                                                <SelectGroup>
                                                    {// @ts-ignore
                                                        Array.from(table.getColumn(h)?.getFacetedUniqueValues().keys())
                                                            .filter(v => v)
                                                            .map((column) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={column}
                                                                        value={column}
                                                                    >
                                                                        {column}
                                                                    </SelectItem>
                                                                )
                                                            })}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        : filters?.[h] == 'search' ?
                                            <Input
                                                placeholder="Search..."
                                                value={(table.getColumn(h)?.getFilterValue() as string) ?? ""}
                                                onChange={(event) =>
                                                    table.getColumn(h)?.setFilterValue(event.target.value)
                                                }
                                                className="max-w-sm"
                                            /> : null
                        }

                    </div>
                ))}
                {/* <div className="text-center">
                    <Label>Source</Label>
                </div> */}

                {/* <div className="text-center">
                    <Label>Date</Label>
                </div> */}



                {/* <div className="text-center">
                    <Label>Budget per Seat</Label>
                </div> */}



            </div>

            {/* <div className="flex items-center py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div> */}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <div className="inline">
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <div>Total Selected: {table.getSelectedRowModel().rows.length}</div>
            <div className="fixed top-2 right-2 flex gap-2">
                <Settings />
                <Submit table={table} />
            </div>
        </div>
    )
}
