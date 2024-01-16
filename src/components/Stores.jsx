import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Confirm, Pagination } from "semantic-ui-react";
import axios from "axios";
import {BASE_URL, useGetRequest} from "../hooks/useRequest";
import NewStore from "./NewStore";
import EditStore from "./EditStore";
import _ from 'lodash';

function Stores() {
    const [rawData, loading] = useGetRequest(`${BASE_URL}/store`);
    const [column, setColumn] = useState(null);
    const [direction, setDirection] = useState(null);
    const [stores, setStores] = useState("");
    useEffect(() => {
        setStores(rawData);
    }, [rawData]);
    const sortedTableData = useMemo(() => {
        if (column && direction) {
            return _.orderBy(stores, [column], [direction]);
        }
        return stores;
    }, [stores, column, direction]);
    
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

    function handleCreate(store) {
        setStores([...stores, store]);
    }
    function handleEdit(newStore) {
        const newStores = stores.map((c) =>
            c.id === newStore.id ? newStore : c
        );
        setStores(newStores);
    }

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    function handleDelete(id) {
        const newStores = stores.filter((c) => c.id !== id);
        setStores(newStores);
    }
    function handleConfirm() {
        axios.delete(BASE_URL + "/store", { params: { id: deleteId } })
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
            <NewStore onCreate={handleCreate} />
            <Confirm
                open={confirmOpen}
                content="Are you sure you want to delete this store?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
            <Table>
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
                {sortedTableData.slice((activePage - 1) * 10, activePage * 10).map((store) => (
                <Table.Row key={store.id}>
                    <Table.Cell>{store.name}</Table.Cell>
                    <Table.Cell>{store.address}</Table.Cell>
                    <Table.Cell>
                    <EditStore onEdit={handleEdit} store={store}/>
                    </Table.Cell>
                    <Table.Cell>
                    <Button color="red"
                        onClick={() => {
                            setConfirmOpen(true);
                            setDeleteId(store.id);
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
            totalPages={Math.ceil(stores.length / 10)}
            onPageChange={handlePageChange}
        />
        </>
    );
}

export default Stores;
