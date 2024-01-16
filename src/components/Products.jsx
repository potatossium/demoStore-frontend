import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Confirm, Pagination } from "semantic-ui-react";
import axios from "axios";
import {BASE_URL, useGetRequest} from "../hooks/useRequest";
import NewProduct from "./NewProduct";
import EditProduct from "./EditProduct";
import _ from 'lodash';

function Products() {
    const [rawData, loading] = useGetRequest(`${BASE_URL}/product`);
    const [column, setColumn] = useState(null);
    const [direction, setDirection] = useState(null);
    const [products, setProducts] = useState(rawData);
    useEffect(() => {
        setProducts(rawData);
    }, [rawData]);
    const sortedTableData = useMemo(() => {
        if (column && direction) {
            return _.orderBy(products, [column], [direction]);
        }
        return products;
    }, [products, column, direction]);
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

    function handleCreate(product) {
        setProducts([...products, product]);
        window.location.reload();
    }
    function handleEdit(newProduct) {
        const newProducts = products.map((c) =>
            c.id === newProduct.id ? newProduct : c
        );
        setProducts(newProducts);
        window.location.reload();
    }

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    function handleDelete(id) {
        const newProducts = products.filter((c) => c.id !== id);
        setProducts(newProducts);
        window.location.reload();
    }
    function handleConfirm() {
        axios.delete(BASE_URL + "/product", { params: { id: deleteId } })
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
            <NewProduct onCreate={handleCreate} />
            <Confirm
                open={confirmOpen}
                content="Are you sure you want to delete this product?"
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
                    sorted={column === "price" ? direction : null}
                    onClick={() => handleSort('price')}
                >
                    Price
                </Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {sortedTableData.slice((activePage - 1) * 10, activePage * 10).map((product) => (
                <Table.Row key={product.id}>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.price}</Table.Cell>
                    <Table.Cell>
                    <EditProduct onEdit={handleEdit} product={product}/>
                    </Table.Cell>
                    <Table.Cell>
                    <Button color="red"
                        onClick={() => {
                            setConfirmOpen(true);
                            setDeleteId(product.id);
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
            totalPages={Math.ceil(products.length / 10)} // 
            onPageChange={handlePageChange} // 
        />
        </>
    );
}

export default Products;
