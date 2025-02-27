import React, { useEffect } from 'react'
import axios from '../../../api/axios';
import { useParams } from 'react-router-dom';

const TrackOrder = () => {

    const { id } = useParams();

    const handleTrackOrder = async () => {
        try {
            const res = await axios.get(`/jnt/orders/track/${id}`);
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        handleTrackOrder();
    }, [])
    return (
        <div>TrackOrder</div>
    )
}

export default TrackOrder