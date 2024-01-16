import { Modal, Form, Input, Label, Button, Dropdown } from "semantic-ui-react";
import { useState } from "react";
import axios from "axios";
import {BASE_URL} from "../hooks/useRequest";

function NewSale({ onCreate, customerOptions, productOptions, storeOptions }) {
    const [open, setOpen] = useState(false);

    const [dateSold, setDateSold] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [storeId, setStoreId] = useState("");

    const handleSubmit = async () => {
        // Create a CreateSale object
        const data = {
            dateSold: dateSold,
            customerId: customerId,
            productId: productId,
            storeId: storeId,
        };
        try {
            const response = await axios.post(
                BASE_URL+"/sale",
                data
            );
            if (response.status === 200) {
                onCreate(response.data);
                setOpen(false);
                // clear the form data
                setDateSold("");
                setCustomerId("");
                setProductId("");
                setStoreId("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button primary onClick={() => setOpen(true)}>New Sale</Button>
            <Modal open={open}>
                <Modal.Header>Create New Sale</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <Label>Date Sold</Label>
                            <Input
                                type="date"
                                value={dateSold}
                                onChange={(e) => setDateSold(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Label>Customer</Label>
                            <Dropdown
                                placeholder="Select Customer"
                                fluid
                                selection
                                options={customerOptions}
                                value={customerId}
                                onChange={(e, { value }) => setCustomerId(value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Label>Product</Label>
                            <Dropdown
                                placeholder="Select Product"
                                fluid
                                selection
                                options={productOptions}
                                value={productId}
                                onChange={(e, { value }) => setProductId(value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Label>Store</Label>
                            <Dropdown
                                placeholder="Select Store"
                                fluid
                                selection
                                options={storeOptions}
                                value={storeId}
                                onChange={(e, { value }) => setStoreId(value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Button type="submit">Create</Button>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                        </Form.Field>
                    </Form>
                </Modal.Content>
            </Modal>
        </>
    );
}

export default NewSale;