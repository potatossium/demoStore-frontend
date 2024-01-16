import axios from "axios";
import { useEffect, useState } from "react";

const BASE_URL = "https://demostoreweek720240114231618.azurewebsites.net/api";

const useGetRequest = (url, params={}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchData = async () => {
        const response = await axios.get(url);
        setData(response.data);
    }
    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
    }, [url])

    return [data, loading];
}

const usePostRequest = (url, params) => {
    const [data, setData] = useState([]);
    const fetchData = async () => {
        const response = await axios.post(url, params);
        setData(response.data);
    }
    useEffect(() => {
        fetchData();
    }, [url])
}

export {BASE_URL, useGetRequest, usePostRequest};