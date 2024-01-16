import { Modal, Form, Input, Label, Button } from "semantic-ui-react";
import { useState } from "react";
import axios from "axios";
import {BASE_URL} from "../hooks/useRequest";

function NewProduct({ onCreate }) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    const handleSubmit = async () => {
        if (name.trim() === "" || price === 0) {
            alert("Please enter name and price");
            return;
        }
        const data = {
            name: name,
            price: price,
        };
        try {
            const response = await axios.post(
                BASE_URL+"/product",
                data
            );
            if (response.status === 200) {
                onCreate(response.data);
                setOpen(false);
                // clear the form data
                setName("");
                setPrice(0);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button primary onClick={() => setOpen(true)}>New Product</Button>
            <Modal open={open}>
                <Modal.Header>Create New Product</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={handleSubmit}>
                        <Form.Field>
                            <Label>NAME</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Label>PRICE</Label>
                            <Input
                                value={price}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit">Create</Button>
                        </Form.Field>
                    </Form>
                </Modal.Content>
            </Modal>
        </>
    );
}

export default NewProduct;
