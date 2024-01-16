import { Modal, Form, Input, Label, Button } from "semantic-ui-react";
import { useState } from "react";
import axios from "axios";
import {BASE_URL} from "../hooks/useRequest";

function EditCustomer({ onEdit, customer }) {
    // to control the modal open and close
    const [open, setOpen] = useState(false);
    // to store the new value of name and address
    const [name, setName] = useState(customer.name);
    const [address, setAddress] = useState(customer.address);

    const handleSubmit = async () => {
        // validation of form data, no empty name and address allowed
        if (name.trim() === "" || address.trim() === "") {
            alert("Please enter name and address");
            return;
        }

        const data = {
            id: customer.id,
            name: name,
            address: address,
        };
        // axios put request
        const response = await axios.put(
            `${BASE_URL}/customer`,
            data
        );
        if (response.status === 200) {
            // pass the new Customer data to onEdit - handleEdit in parent component
            onEdit(response.data);
            // close the modal
            setOpen(false);
        }
    };

    return (
        <>
            <Button color="yellow" onClick={() => setOpen(true)}>Edit</Button>
            <Modal open={open}>
                <Modal.Header>Edit Customer</Modal.Header>
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
                            <Label>Address</Label>
                            <Input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
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


export default EditCustomer;
