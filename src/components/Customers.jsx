import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Confirm, Pagination } from "semantic-ui-react";
import axios from "axios";
import {BASE_URL, useGetRequest, usePostRequest} from "../hooks/useRequest";
import NewCustomer from "./NewCustomer";
import EditCustomer from "./EditCustomer";
import _ from 'lodash';

function Customers() {
    const [rawData, loading] = useGetRequest(`${BASE_URL}/customer`);
    const [column, setColumn] = useState(null);
    const [direction, setDirection] = useState(null);
    const [customers, setCustomers] = useState("");
    useEffect(() => {
        setCustomers(rawData);
    }, [rawData]);
    const sortedTableData = useMemo(() => {
        if (column && direction) {
            return _.orderBy(customers, [column], [direction]);
        }
        return customers;
    }, [customers, column, direction]);
    
    function handleSort(columnName) {
        if (column === columnName) {
            setDirection(direction === 'asc' ? 'desc' : 'asc');
        } else {
            setColumn(columnName);
            setDirection('asc');
        }
    }

    const [activePage, setActivePage] = useState(1);
    function handlePageChange(e, { activePage }) {
        setActivePage(activePage);
    }

    function handleCreate(customer) {
        setCustomers([...customers, customer]);
    }
    function handleEdit(newCustomer) {
        setCustomers(customers.map((c) =>
            c.id === newCustomer.id ? newCustomer : c
        ));
    }

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    function handleDelete(id) {
        setCustomers(customers.filter((c) => c.id !== id));
    }
    function handleConfirm() {
        axios.delete(BASE_URL + "/customer", { params: { id: deleteId } })
        .then((response) => {
            if (response.status === 200) {
                handleDelete(deleteId);
                setConfirmOpen(false);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
    function handleCancel() {
        setConfirmOpen(false);
    }

    return (
        <>
        {loading ? <p>Loading...</p> : 
            <div>
            <NewCustomer onCreate={handleCreate} />
            <Confirm
                open={confirmOpen}
                content="Are you sure you want to delete this customer?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
            <Table sortable celled fixed>
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell
                    sorted={column === "name" ? direction : null}
                    onClick={() => handleSort('name')}
                >
                    Name
                </Table.HeaderCell>
                <Table.HeaderCell
                    sorted={column === "address" ? direction : null}
                    onClick={() => handleSort('address')}
                >
                    Address
                </Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortedTableData.slice((activePage - 1) * 10, activePage * 10).map((customer) => (
                <Table.Row key={customer.id}>
                    <Table.Cell>{customer.name}</Table.Cell>
                    <Table.Cell>{customer.address}</Table.Cell>
                    <Table.Cell>
                    <EditCustomer onEdit={handleEdit} customer={customer}/>
                    </Table.Cell>
                    <Table.Cell>
                    <Button color="red"
                        onClick={() => {
                            setConfirmOpen(true);
                            setDeleteId(customer.id);
                        }}
                    >Delete
                    </Button>
                    </Table.Cell>
                </Table.Row>
                ))}
            </Table.Body>
            </Table>
            </div>
        }
        <Pagination style={{marginTop:"2rem", marginLeft:"35rem"}}
            activePage={activePage}
            totalPages={Math.ceil(customers.length / 10)} // 
            onPageChange={handlePageChange} // 
        />
        </>
    );
}

export default Customers;
