import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Confirm, Pagination } from "semantic-ui-react";
import axios from "axios";
import {BASE_URL, useGetRequest} from "../hooks/useRequest";
import NewSale from "./NewSale";
import EditSale from "./EditSale";
import _ from 'lodash';

function Sales() {
    const [rawData, loading] = useGetRequest(`${BASE_URL}/sale`);
    const [column, setColumn] = useState(null);
    const [direction, setDirection] = useState(null);
    const [sales, setSales] = useState([]);
    useEffect(() => {
        setSales(rawData);
    }, [rawData]);
    // useEffect(() => {
    //     constnewData = useGetRequest(`${BASE_URL}/customer`);
    //     setCustomers(newData);
    // }, [customers]);
    const sortedTableData = useMemo(() => {
        if (column && direction) {
            return _.orderBy(sales, [column], [direction]);
        }
        return sales;
    }, [sales, column, direction]);
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
    function handleCreate(sale) {
        setSales([...sales, sale]);
        window.location.reload();
    }
    function handleEdit(newSale) {
        const newSales = sales.map((item) =>
            item.id === newSale.id ? newSale : item
        );
        setSales(newSales);
        window.location.reload();
    }

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    function handleDelete(id) {
        const newSales = sales.filter((c) => c.id !== id);
        setSales(newSales);
        window.location.reload();
    }
    function handleConfirm() {
        axios.delete(BASE_URL + "/sale", { params: { id: deleteId } })
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

    // Extract the unique customers, products, and stores from the rawData
    const customers = rawData.map((sale) => ({key: sale.customerId, value: sale.customerId, text: sale.customerName}));
    const customerOptions = Array.from(new Set(customers.map(JSON.stringify))).map(JSON.parse);
    const products = rawData.map((sale) => ({key: sale.productId, value: sale.productId, text: sale.productName}));
    const productOptions = Array.from(new Set(products.map(JSON.stringify))).map(JSON.parse);
    const stores = rawData.map((sale) => ({key: sale.storeId, value: sale.storeId, text: sale.storeName}));
    const storeOptions = Array.from(new Set(stores.map(JSON.stringify))).map(JSON.parse);
    
    return (
        <>
        {loading ? <p>Loading...</p> : 
            <div>
            <NewSale
                onCreate={handleCreate}
                customerOptions={customerOptions}
                productOptions={productOptions}
                storeOptions={storeOptions}
            />
            <Confirm
                open={confirmOpen}
                content="Are you sure you want to delete this sale entry?"
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
            <Table sortable celled fixed>
            <Table.Header>
                <Table.Row>
                <Table.HeaderCell
                    sorted={column === "customerName" ? direction+"ending" : null}  // display the up or down arrow
                    onClick={() => handleSort('customerName')}
                >
                    Customer
                </Table.HeaderCell>
                <Table.HeaderCell
                    sorted={column === "productName" ? direction+"ending" : null}
                    onClick={() => handleSort('productName')}
                >
                    Product
                </Table.HeaderCell>
                <Table.HeaderCell
                    sorted={column === "storeName" ? direction+"ending" : null}
                    onClick={() => handleSort('storeName')}
                >
                    Store
                </Table.HeaderCell>
                <Table.HeaderCell
                    sorted={column === "dateSold" ? direction+"ending" : null}
                    onClick={() => handleSort('dateSold')}
                >
                    DateSold
                </Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortedTableData.slice((activePage - 1) * 10, activePage * 10).map((sale) => (
                <Table.Row key={sale.id}>
                    <Table.Cell>{sale.customerName}</Table.Cell>
                    <Table.Cell>{sale.productName}</Table.Cell>
                    <Table.Cell>{sale.storeName}</Table.Cell>
                    <Table.Cell>{sale.dateSold}</Table.Cell>
                    <Table.Cell>
                    <EditSale
                        onEdit={handleEdit}
                        customerOptions={customerOptions}
                        productOptions={productOptions}
                        storeOptions={storeOptions}
                        sale={sale}/>
                    </Table.Cell>
                    <Table.Cell>
                    <Button color="red"
                        onClick={() => {
                            setConfirmOpen(true);
                            setDeleteId(sale.id);
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
            totalPages={Math.ceil(sales.length / 10)}
            onPageChange={handlePageChange}
        />
        </>
    );
}

export default Sales;
