import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SERVER_URL: string = "http://127.0.0.1:8000";

const useServer = (path: string, httpMethod: string, data: any, onSuccess: (response: any) =>  void, onError: (error: any) => void) => {
    const [response, setResponse] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const fetchData = async (new_data: any = null) => {
        setIsLoading(true);

        if (new_data) {data = new_data}

        let headers = {}
        
        if(Cookies.get("token")) {
            headers = {
                'Authorization': `Bearer ${Cookies.get("token")}`,
                'Content-Type': 'multipart/form-data'
            }
        }

        try {
            const response = await axios({
                method: httpMethod,
                url: `${SERVER_URL}/${path}`,
                headers: headers,
                data: data
            });

            setResponse(response.data);
            setError(null);
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            setError(error);
            if (onError) {
                onError(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { response, isLoading, error, fetchData };
};

export default useServer;