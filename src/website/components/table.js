import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export function CountryTable({ data, metric }) {
    var sorted = data.sort((first, second) => metric.calc(second) - metric.calc(first));
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableCell>Country</TableCell>
                    <TableCell width={'32%'}>{metric.name}</TableCell>
                </TableHead>
                <TableBody>
                    {
                        sorted.slice(0, 5).map((row) =>
                            <TableRow>
                                <TableCell>{row.Country}</TableCell>
                                <TableCell align='right'>{metric.calc(row)}</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>

            </Table>
        </TableContainer>
    );
}
