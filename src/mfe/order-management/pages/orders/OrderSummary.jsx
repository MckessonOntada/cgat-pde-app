import React from 'react';
import { useNavigate, useParams } from "react-router-dom"

const OrderSummary = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        if(!id){
            navigate('/orders');
        }
    }, [])

    return (
        <div>
            <p>Order Summary for {id}</p>
        </div>
    )
}

export default OrderSummary;