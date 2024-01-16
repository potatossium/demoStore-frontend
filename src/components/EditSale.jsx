import { Modal, Form, Input, Label, Button, Dropdown } from "semantic-ui-react";
import { useState } from "react";
import axios from "axios";
import {BASE_URL} from "../hooks/useRequest";

function EditSale({ onEdit, customerOptions, productOptions, storeOptions, sale }) {
    // to control the modal open and close
    const [open, setOpen] = useState(false);
    // to store the new value of name and address
    const [dateSold, setDateSold] = useState(sale.dateSold);
    const [customerId, setCustomerId] = useState(sale.customerId);
    const [productId, setProductId] = useState(sale.productId);
    const [storeId, setStoreId] = useState(sale.storeId);

    const handleSubmit = async () => {
        const data = {
            id: sale.id,
            dateSold: dateSold,
            customerId: customerId,
            productId: productId,
            storeId: storeId,
        };
        // axios put request
        const response = await axios.put(
            `${BASE_URL}/sale`,
            data
        );
        if (response.status === 200) {
            onEdit(response.data);
            setOpen(false);
        }
    };

    return (
        <>
            <Button color="yellow" onClick={() => setOpen(true)}>Edit</Button>
            <Modal open={open}>
                <Modal.Header>Edit Sale</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <Label>DateSold</Label>
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
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Edit</Button>
                        </Form.Field>
                    </Form>
                </Modal.Content>
            </Modal>
        </>
    );
}


export default EditSale;
