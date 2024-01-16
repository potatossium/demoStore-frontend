import { Modal, Form, Input, Label, Button } from "semantic-ui-react";
import { useState } from "react";
import axios from "axios";
import {BASE_URL} from "../hooks/useRequest";

function EditProduct({ onEdit, product }) {
    // to control the modal open and close
    const [open, setOpen] = useState(false);
    // to store the new value of name and price
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);

    const handleSubmit = async () => {
        if (name.trim() === "" || price === 0) {
            alert("Please enter name and price");
            return;
        }

        const data = {
            id: product.id,
            name: name,
            price: price,
        };
        // axios put request
        const response = await axios.put(
            `${BASE_URL}/product`,
            data
        );
        if (response.status === 200) {
            // pass the new Product data to onEdit - handleEdit in parent component
            onEdit(response.data);
            // close the modal
            setOpen(false);
        }
    };

    return (
        <>
            <Button color="yellow" onClick={() => setOpen(true)}>Edit</Button>
            <Modal open={open}>
                <Modal.Header>Edit Product</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <Label>Name</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Label>Price</Label>
                            <Input
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
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


export default EditProduct;
