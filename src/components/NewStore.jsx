import { Modal, Form, Input, Label, Button } from "semantic-ui-react";
import { useState } from "react";
import axios from "axios";
import {BASE_URL} from "../hooks/useRequest";

function NewStore({ onCreate }) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = async () => {
        if (name.trim() === "" || address.trim() === "") {
            alert("Please enter name and address");
            return;
        }
        const data = {
            name: name,
            address: address,
        };
        try {
            const response = await axios.post(
                BASE_URL+"/store",
                data
            );
            if (response.status === 200) {
                onCreate(response.data);
                setOpen(false);
                // clear the form data
                setName("");
                setAddress("");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button primary onClick={() => setOpen(true)}>New Store</Button>
            <Modal open={open}>
                <Modal.Header>Create New Store</Modal.Header>
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
                            <Button type="submit">Create</Button>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                        </Form.Field>
                    </Form>
                </Modal.Content>
            </Modal>
        </>
    );
}

export default NewStore;